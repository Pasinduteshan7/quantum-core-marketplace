package com.quantumcore.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * PAYMENT ENTITY
 * 
 * Represents a payment transaction in our database.
 * When a customer checks out with a card:
 * 1. A Stripe PaymentIntent is created on Stripe's servers.
 * 2. This Payment record is saved in PostgreSQL to track:
 *    - Which Order it belongs to
 *    - The Stripe PaymentIntent ID (pi_...)
 *    - Amount, Currency, and Status (SUCCEEDED, FAILED, PENDING)
 */
@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "stripe_payment_intent_id", unique = true, nullable = false)
    private String stripePaymentIntentId;

    @Column(name = "client_secret")
    private String clientSecret;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false, length = 10)
    @Builder.Default
    private String currency = "usd";

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "PENDING"; // PENDING, SUCCEEDED, FAILED, CANCELED

    @Column(name = "payment_method", length = 50)
    @Builder.Default
    private String paymentMethod = "card";

    @Column(name = "receipt_url", length = 1000)
    private String receiptUrl;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
