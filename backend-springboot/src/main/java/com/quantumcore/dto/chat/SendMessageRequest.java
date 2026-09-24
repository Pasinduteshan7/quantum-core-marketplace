package com.quantumcore.dto.chat;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * Payload sent when a customer or admin sends a chat message.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SendMessageRequest {

    /**
     * Optional: existing conversation ID. If null, a new conversation will be started.
     */
    private Long conversationId;

    /**
     * Optional: product ID the customer is asking about (used when starting a new thread).
     */
    private Long productId;

    /**
     * The actual text message.
     */
    @NotBlank(message = "Message content cannot be blank")
    private String content;
}
