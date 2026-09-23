package com.quantumcore.controller;

import com.quantumcore.dto.payment.CreatePaymentIntentRequest;
import com.quantumcore.dto.payment.PaymentIntentResponse;
import com.quantumcore.service.PaymentService;
import com.stripe.exception.StripeException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * Step 1 of Payment Flow:
     * Customer clicks "Pay with Card". The frontend calls this endpoint with the Order ID.
     * The backend contacts Stripe to initialize a PaymentIntent and returns the clientSecret.
     */
    @PostMapping("/create-intent")
    public ResponseEntity<PaymentIntentResponse> createPaymentIntent(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreatePaymentIntentRequest request
    ) throws StripeException {
        PaymentIntentResponse response = paymentService.createPaymentIntent(request.getOrderId(), userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    /**
     * Step 2 of Payment Flow (Client confirmation):
     * Once the frontend Stripe card form confirms the payment on Stripe's server,
     * it calls this endpoint to trigger an immediate status check and update the order status.
     */
    @PostMapping("/confirm/{paymentIntentId}")
    public ResponseEntity<PaymentIntentResponse> confirmPayment(
            @PathVariable String paymentIntentId
    ) throws StripeException {
        PaymentIntentResponse response = paymentService.confirmPayment(paymentIntentId);
        return ResponseEntity.ok(response);
    }

    /**
     * Webhook Endpoint:
     * Stripe sends background HTTP POST notifications here (e.g. payment_intent.succeeded).
     * This endpoint is public (no JWT) because Stripe calls it directly, but secured with a cryptographic signature.
     */
    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "Stripe-Signature", required = false) String sigHeader
    ) {
        if (sigHeader == null) {
            log.warn("Webhook called without Stripe-Signature header");
            return ResponseEntity.badRequest().body("Missing Stripe-Signature header");
        }
        paymentService.handleWebhook(payload, sigHeader);
        return ResponseEntity.ok("Received");
    }
}
