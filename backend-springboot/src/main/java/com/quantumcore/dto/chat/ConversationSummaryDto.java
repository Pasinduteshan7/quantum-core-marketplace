package com.quantumcore.dto.chat;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Summary DTO representing a conversation thread in the inbox listing.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationSummaryDto {

    private Long id;

    // Customer details
    private Long customerId;
    private String customerName;
    private String customerEmail;

    // Attached Product details (if inquiry originated from a product page)
    private Long productId;
    private String productName;
    private String productImageUrl;
    private Double productPrice;

    // Thread status and activity
    private String status;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private long unreadCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
