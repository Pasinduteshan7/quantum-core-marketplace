package com.quantumcore.service;

import com.quantumcore.dto.payment.PaymentIntentResponse;
import com.quantumcore.entity.Order;
import com.quantumcore.entity.Payment;
import com.quantumcore.entity.User;
import com.quantumcore.repository.OrderRepository;
import com.quantumcore.repository.PaymentRepository;
import com.quantumcore.repository.UserRepository;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.PaymentIntent;
import com.stripe.model.StripeObject;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    @Value("${stripe.api-key}")
    private String stripeApiKey;

    @Value("${stripe.webhook-secret:whsec_placeholder}")
    private String webhookSecret;

    @PostConstruct
    public void init() {
        // Initialize Stripe SDK globally with our secret key
        Stripe.apiKey = stripeApiKey;
        log.info("Stripe SDK initialized with configured API key.");
    }

    /**
     * Creates a Stripe PaymentIntent for the given Order.
     *
     * How it works:
     * 1. Verifies order ownership and existence.
     * 2. Converts total amount to the smallest currency unit (cents for USD: $10.50 -> 1050).
     * 3. Calls Stripe's API to reserve a PaymentIntent.
     * 4. Stripe returns a `client_secret` which the browser needs to securely collect card details.
     * 5. Saves a Payment audit record in PostgreSQL.
     */
    @Transactional
    public PaymentIntentResponse createPaymentIntent(Long orderId, String userEmail) throws StripeException {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        // Ensure user owns this order
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to pay for this order");
        }

        // Stripe requires amount in CENTS (integer). Example: $299.99 = 29999 cents.
        long amountInCents = Math.round(order.getTotalAmount() * 100);

        // Build Stripe request
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency("usd")
                .setDescription("Payment for Quantum Core Order #" + order.getId())
                .putMetadata("orderId", String.valueOf(order.getId()))
                .putMetadata("customerEmail", userEmail)
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                )
                .build();

        // Call Stripe API
        PaymentIntent paymentIntent = PaymentIntent.create(params);
        log.info("Created Stripe PaymentIntent: {} for Order #{}", paymentIntent.getId(), order.getId());

        // Upsert Payment entity in PostgreSQL
        Payment payment = paymentRepository.findByOrderId(order.getId())
                .orElse(Payment.builder().order(order).build());

        payment.setStripePaymentIntentId(paymentIntent.getId());
        payment.setClientSecret(paymentIntent.getClientSecret());
        payment.setAmount(order.getTotalAmount());
        payment.setCurrency("usd");
        payment.setStatus(paymentIntent.getStatus().toUpperCase());
        paymentRepository.save(payment);

        return PaymentIntentResponse.builder()
                .clientSecret(paymentIntent.getClientSecret())
                .paymentIntentId(paymentIntent.getId())
                .amount(order.getTotalAmount())
                .currency("usd")
                .status(paymentIntent.getStatus())
                .build();
    }

    /**
     * Confirms the payment status directly from Stripe and updates order.
     * Useful for instant client-side confirmation when webhooks cannot reach localhost.
     */
    @Transactional
    public PaymentIntentResponse confirmPayment(String paymentIntentId) throws StripeException {
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
        log.info("Checking status for PaymentIntent {}: {}", paymentIntentId, paymentIntent.getStatus());

        Payment payment = paymentRepository.findByStripePaymentIntentId(paymentIntentId)
                .orElseThrow(() -> new RuntimeException("Payment record not found for intent: " + paymentIntentId));

        payment.setStatus(paymentIntent.getStatus().toUpperCase());

        if ("succeeded".equalsIgnoreCase(paymentIntent.getStatus())) {
            Order order = payment.getOrder();
            order.setStatus("PROCESSING"); // Order moves from PENDING to PROCESSING once paid
            orderRepository.save(order);
            log.info("Order #{} marked as PROCESSING after successful Stripe payment", order.getId());
        }

        paymentRepository.save(payment);

        return PaymentIntentResponse.builder()
                .clientSecret(payment.getClientSecret())
                .paymentIntentId(payment.getStripePaymentIntentId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .status(payment.getStatus())
                .build();
    }

    /**
     * Handles asynchronous Webhook events sent by Stripe.
     *
     * In production, Stripe calls this endpoint whenever an event occurs (e.g. payment_intent.succeeded).
     * We verify the cryptographic signature to ensure the message was truly sent by Stripe.
     */
    @Transactional
    public void handleWebhook(String payload, String sigHeader) {
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            log.error("Invalid Stripe webhook signature: {}", e.getMessage());
            throw new RuntimeException("Invalid webhook signature", e);
        }

        log.info("Stripe Webhook received event: {}", event.getType());

        EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
        StripeObject stripeObject = dataObjectDeserializer.getObject().orElse(null);

        if (stripeObject instanceof PaymentIntent paymentIntent) {
            switch (event.getType()) {
                case "payment_intent.succeeded" -> {
                    log.info("Webhook: Payment succeeded for Intent: {}", paymentIntent.getId());
                    paymentRepository.findByStripePaymentIntentId(paymentIntent.getId())
                            .ifPresent(payment -> {
                                payment.setStatus("SUCCEEDED");
                                Order order = payment.getOrder();
                                order.setStatus("PROCESSING");
                                orderRepository.save(order);
                                paymentRepository.save(payment);
                            });
                }
                case "payment_intent.payment_failed" -> {
                    log.warn("Webhook: Payment failed for Intent: {}", paymentIntent.getId());
                    paymentRepository.findByStripePaymentIntentId(paymentIntent.getId())
                            .ifPresent(payment -> {
                                payment.setStatus("FAILED");
                                paymentRepository.save(payment);
                            });
                }
                default -> log.debug("Unhandled event type: {}", event.getType());
            }
        }
    }
}
