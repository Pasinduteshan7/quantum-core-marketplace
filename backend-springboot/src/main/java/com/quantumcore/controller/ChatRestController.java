package com.quantumcore.controller;

import com.quantumcore.dto.chat.ChatMessageDto;
import com.quantumcore.dto.chat.ConversationSummaryDto;
import com.quantumcore.dto.chat.SendMessageRequest;
import com.quantumcore.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 💬 REST CONTROLLER FOR CHAT & INQUIRIES
 * 
 * Provides HTTP endpoints for:
 * - Sending messages (REST alternative/fallback)
 * - Fetching conversation message history
 * - Listing customer inquiries
 * - Marking messages as read
 */
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatRestController {

    private final ChatService chatService;

    /**
     * Send a message via REST API.
     */
    @PostMapping("/send")
    public ResponseEntity<ChatMessageDto> sendMessage(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SendMessageRequest request
    ) {
        ChatMessageDto message = chatService.sendMessage(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }

    /**
     * Get the authenticated customer's conversation threads.
     */
    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationSummaryDto>> getCustomerConversations(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<ConversationSummaryDto> conversations = chatService.getCustomerConversations(userDetails.getUsername());
        return ResponseEntity.ok(conversations);
    }

    /**
     * Admin view: Get all customer conversations across the marketplace.
     */
    @GetMapping("/admin/conversations")
    public ResponseEntity<List<ConversationSummaryDto>> getAdminConversations(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<ConversationSummaryDto> conversations = chatService.getAllConversationsForAdmin();
        return ResponseEntity.ok(conversations);
    }

    /**
     * Load message history for a specific conversation thread.
     */
    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<List<ChatMessageDto>> getConversationMessages(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long conversationId
    ) {
        List<ChatMessageDto> history = chatService.getConversationHistory(conversationId, userDetails.getUsername());
        return ResponseEntity.ok(history);
    }

    /**
     * Mark incoming messages in a conversation as read.
     */
    @PostMapping("/conversations/{conversationId}/read")
    public ResponseEntity<Map<String, Object>> markAsRead(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long conversationId
    ) {
        chatService.markMessagesAsRead(conversationId, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("success", true, "conversationId", conversationId));
    }
}
