package com.quantumcore.dto.chat;

import com.quantumcore.entity.ChatMessage;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Message DTO transmitted over WebSockets and REST responses.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageDto {

    private Long id;
    private Long conversationId;
    private Long senderId;
    private String senderName;
    private String senderRole;
    private String content;
    private boolean isRead;
    private LocalDateTime createdAt;

    // Optional Attached Product for "Product Card Bubbles"
    private Long productId;
    private String productName;
    private String productImageUrl;
    private Double productPrice;

    public static ChatMessageDto fromEntity(ChatMessage msg) {
        var product = msg.getProduct();
        return ChatMessageDto.builder()
                .id(msg.getId())
                .conversationId(msg.getConversation().getId())
                .senderId(msg.getSender().getId())
                .senderName(msg.getSender().getName())
                .senderRole(msg.getSenderRole().name())
                .content(msg.getContent())
                .isRead(msg.isRead())
                .createdAt(msg.getCreatedAt())
                .productId(product != null ? product.getId() : null)
                .productName(product != null ? product.getName() : null)
                .productImageUrl(product != null ? product.getImage() : null)
                .productPrice(product != null ? product.getPrice() : null)
                .build();
    }
}
