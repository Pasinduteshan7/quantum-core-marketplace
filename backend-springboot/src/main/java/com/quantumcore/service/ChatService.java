package com.quantumcore.service;

import com.quantumcore.dto.chat.ChatMessageDto;
import com.quantumcore.dto.chat.ConversationSummaryDto;
import com.quantumcore.dto.chat.SendMessageRequest;
import com.quantumcore.entity.*;
import com.quantumcore.repository.ChatMessageRepository;
import com.quantumcore.repository.ConversationRepository;
import com.quantumcore.repository.ProductRepository;
import com.quantumcore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 💬 CHAT SERVICE: REAL-TIME E-COMMERCE CUSTOMER ↔ STORE OWNER MESSAGING
 * ════════════════════════════════════════════════════════════════════════════════
 * 
 * 🎓 ARCHITECTURAL MASTERCLASS & HOW THIS ENTIRE SYSTEM WORKS:
 * 
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ❓ Q1: HOW THE BROWSER KEEPS THE CHAT FLOATING WHILE SWITCHING PAGES? │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │ In Next.js (frontend/src/app/layout.tsx), the root layout wraps the entire
 * │
 * │ application and NEVER unmounts or reloads when the customer navigates │
 * │ between pages (e.g. from /computers to /laptops). │
 * │ We mounted <CustomerChatWidget /> inside layout.tsx with CSS: │
 * │ position: fixed; bottom: 24px; right: 24px; z-index: 99999; │
 * │ This glues the chat directly to the viewport glass so the customer's open │
 * │ WebSocket connection and active thread stay alive seamlessly across pages.
 * │
 * └─────────────────────────────────────────────────────────────────────────────┘
 * 
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ❓ Q2: HOW ARE MESSAGES SAVED IN THE POSTGRESQL DATABASE? │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │ When a message arrives here, Spring Data JPA / Hibernate transforms the │
 * │ ChatMessage entity into a raw SQL INSERT statement: │
 * │ INSERT INTO chat_messages (conversation_id, sender_id, product_id, │
 * │ content, is_read, created_at) │
 * │ VALUES (?, ?, ?, ?, ?, ?); │
 * │ Committed permanently to PostgreSQL (Port 5433). If the server reboots, │
 * │ zero messages or product attachments are ever lost. │
 * └─────────────────────────────────────────────────────────────────────────────┘
 * 
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ❓ Q3: HOW THE STORE OWNER'S SCREEN SHOWS NEW MESSAGES INSTANTLY (0.02s)? │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │ The Store Owner's browser tunes into a STOMP radio channel: │
 * │ stomp.subscribe('/topic/admin/chat', callback) │
 * │ When this service calls
 * messagingTemplate.convertAndSend("/topic/admin/chat")│
 * │ Spring Boot's internal broker finds the Store Owner's open TCP tunnel and │
 * │ blasts the JSON packet down the wire in under 20ms without any page reload!
 * │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    // ─────────────────────────────────────────────────────────────────────────────
    // 🛠️ THE 5 TOOLS ON THE WORKBENCH (Injected Dependencies)
    // ─────────────────────────────────────────────────────────────────────────────

    /** 1. Manages the conversation "folders" (threads between customer & store). */
    private final ConversationRepository conversationRepository;

    /** 2. Manages the individual "paper sheets" (message bubbles & timestamps). */
    private final ChatMessageRepository chatMessageRepository;

    /** 3. Security & User Lookup (verifies customer vs admin roles). */
    private final UserRepository userRepository;

    /** 4. Store Catalog (resolves attached product thumbnail, name & price). */
    private final ProductRepository productRepository;

    /** 5. The "Radio Transmitter" (blasts messages over open WebSockets). */
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * ═════════════════════════════════════════════════════════════════════════════
     * 🚀 MAIN OPERATION: SEND MESSAGE (Customer ↔ Store Owner)
     * ═════════════════════════════════════════════════════════════════════════════
     * Executed in 4 clear logical phases:
     * Phase 1: Security & Thread Resolution (Find or auto-create conversation)
     * Phase 2: Product Attachment (Link specific product clicked via [Ask])
     * Phase 3: Database Persistence (Save to PostgreSQL disk storage)
     * Phase 4: Real-Time Network Blast (Push via WebSocket to recipient)
     */
    @Transactional
    public ChatMessageDto sendMessage(String senderEmail, SendMessageRequest request) {

        // ─────────────────────────────────────────────────────────────────────────
        // 🔍 PHASE 1: SENDER & CONVERSATION THREAD RESOLUTION
        // ─────────────────────────────────────────────────────────────────────────
        // 1. Look up the sender in PostgreSQL
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new IllegalArgumentException("Sender not found with email: " + senderEmail));

        Conversation conversation;

        if (request.getConversationId() != null) {
            // Case A: Replying to an existing thread
            conversation = conversationRepository.findById(request.getConversationId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Conversation not found with ID: " + request.getConversationId()));

            // 🛡️ SECURITY CHECK:
            // If the sender is a customer, verify they own this thread! Prevents snooping.
            if (sender.getRole() == Role.ROLE_CUSTOMER && !conversation.getCustomer().getId().equals(sender.getId())) {
                throw new IllegalArgumentException("Unauthorized: Cannot send messages to another customer's thread!");
            }
        } else {
            // Case B: Starting a BRAND NEW conversation thread
            if (sender.getRole() == Role.ROLE_ADMIN) {
                throw new IllegalArgumentException(
                        "Admin cannot start an arbitrary conversation without a conversationId");
            }

            Product product = null;
            if (request.getProductId() != null) {
                product = productRepository.findById(request.getProductId()).orElse(null);

                // 💡 Smart Re-use: If customer already has a chat for this product, re-use it!
                var existing = conversationRepository.findByCustomerIdAndProductId(sender.getId(),
                        request.getProductId());
                if (existing.isPresent()) {
                    conversation = existing.get();
                } else {
                    conversation = Conversation.builder()
                            .customer(sender)
                            .product(product)
                            .status(ConversationStatus.OPEN)
                            .build();
                    conversation = conversationRepository.save(conversation);
                }
            } else {
                // General customer question not attached to any specific product
                conversation = Conversation.builder()
                        .customer(sender)
                        .product(null)
                        .status(ConversationStatus.OPEN)
                        .build();
                conversation = conversationRepository.save(conversation);
            }
        }

        // ─────────────────────────────────────────────────────────────────────────
        // 📦 PHASE 2: ATTACHING THE PRODUCT TO THIS SPECIFIC MESSAGE BUBBLE
        // ─────────────────────────────────────────────────────────────────────────
        // Allows customer to attach a product card (e.g. RTX 4070 Ti) directly
        // to this message bubble so both Customer and Admin see the mini e-commerce
        // card.
        Product attachedProduct = null;
        if (request.getProductId() != null) {
            attachedProduct = productRepository.findById(request.getProductId()).orElse(null);
        }

        // ─────────────────────────────────────────────────────────────────────────
        // 💾 PHASE 3: DATABASE PERSISTENCE (POSTGRESQL WRITE)
        // ─────────────────────────────────────────────────────────────────────────
        // 1. Build the entity
        ChatMessage message = ChatMessage.builder()
                .conversation(conversation)
                .sender(sender)
                .product(attachedProduct) // Embedded Product Card attachment
                .senderRole(sender.getRole()) // ROLE_CUSTOMER or ROLE_ADMIN
                .content(request.getContent().trim())
                .isRead(false) // Unread by default (triggers unread badge)
                .build();

        // 2. Commit to PostgreSQL table 'chat_messages'
        message = chatMessageRepository.save(message);

        // 3. Update thread timestamp so newest conversations float to top of inbox
        conversation.setUpdatedAt(LocalDateTime.now());
        if (conversation.getStatus() == ConversationStatus.RESOLVED && sender.getRole() == Role.ROLE_CUSTOMER) {
            // Automatically re-open thread if customer asks a follow-up question
            conversation.setStatus(ConversationStatus.OPEN);
        }
        conversationRepository.save(conversation);

        // Transform into client-friendly DTO
        ChatMessageDto dto = ChatMessageDto.fromEntity(message);

        // ─────────────────────────────────────────────────────────────────────────
        // ⚡ PHASE 4: REAL-TIME WEBSOCKET NETWORK BLAST (SUB-20ms)
        // ─────────────────────────────────────────────────────────────────────────
        if (sender.getRole() == Role.ROLE_CUSTOMER) {
            // 📢 Customer sent a message:
            // A) Broadcast to Store Owner inbox: /topic/admin/chat
            log.info("Pushing customer message to /topic/admin/chat from {}", senderEmail);
            messagingTemplate.convertAndSend("/topic/admin/chat", dto);

            // B) Echo back to customer's personal device queue:
            messagingTemplate.convertAndSendToUser(senderEmail, "/queue/chat", dto);
        } else {
            // 📢 Store Owner replied:
            // A) Push directly to THAT customer's private phone line:
            String customerEmail = conversation.getCustomer().getEmail();
            log.info("Pushing admin reply to customer user queue {} on /queue/chat", customerEmail);
            messagingTemplate.convertAndSendToUser(customerEmail, "/queue/chat", dto);

            // B) Echo to /topic/admin/chat so all open store tabs synchronize instantly
            messagingTemplate.convertAndSend("/topic/admin/chat", dto);
        }

        return dto;
    }

    /**
     * ═════════════════════════════════════════════════════════════════════════════
     * 📖 GET CONVERSATION HISTORY
     * ═════════════════════════════════════════════════════════════════════════════
     * Fetches all message bubbles in a thread, ordered chronologically from oldest
     * to newest so the conversation reads naturally from top to bottom.
     */
    @Transactional(readOnly = true)
    public List<ChatMessageDto> getConversationHistory(Long conversationId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));

        // 🛡️ Security Check: Customers can only view their own message history
        if (user.getRole() == Role.ROLE_CUSTOMER && !conversation.getCustomer().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized to view this conversation");
        }

        return chatMessageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId)
                .stream()
                .map(ChatMessageDto::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * ═════════════════════════════════════════════════════════════════════════════
     * 👤 GET CUSTOMER CONVERSATIONS (Floating Widget Listing)
     * ═════════════════════════════════════════════════════════════════════════════
     * Returns all past inquiry threads for the logged-in customer.
     */
    @Transactional(readOnly = true)
    public List<ConversationSummaryDto> getCustomerConversations(String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return conversationRepository.findByCustomerOrderByUpdatedAtDesc(customer)
                .stream()
                .map(conv -> toSummaryDto(conv, Role.ROLE_ADMIN))
                .collect(Collectors.toList());
    }

    /**
     * ═════════════════════════════════════════════════════════════════════════════
     * 👑 GET ALL CONVERSATIONS FOR ADMIN (Store Owner Sidebar Inbox)
     * ═════════════════════════════════════════════════════════════════════════════
     * Returns all customer threads sorted newest first, showing unread counters,
     * customer names, and attached product previews.
     */
    @Transactional(readOnly = true)
    public List<ConversationSummaryDto> getAllConversationsForAdmin() {
        return conversationRepository.findAllByOrderByUpdatedAtDesc()
                .stream()
                .map(conv -> toSummaryDto(conv, Role.ROLE_CUSTOMER))
                .collect(Collectors.toList());
    }

    /**
     * ═════════════════════════════════════════════════════════════════════════════
     * 👁️ MARK MESSAGES AS READ (Clears Red Badges)
     * ═════════════════════════════════════════════════════════════════════════════
     * When a user opens a conversation, marks all incoming unread bubbles as read.
     */
    @Transactional
    public void markMessagesAsRead(Long conversationId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // If reader is ADMIN, mark messages from CUSTOMER as read.
        // If reader is CUSTOMER, mark messages from ADMIN as read.
        Role incomingRole = (user.getRole() == Role.ROLE_ADMIN) ? Role.ROLE_CUSTOMER : Role.ROLE_ADMIN;
        chatMessageRepository.markMessagesAsRead(conversationId, incomingRole);
    }

    /**
     * ═════════════════════════════════════════════════════════════════════════════
     * 🛠️ HELPER: MAP CONVERSATION ENTITY TO SIDEBAR SUMMARY DTO
     * ═════════════════════════════════════════════════════════════════════════════
     * Computes the last message snippet, timestamp, and unread bubble count.
     */
    private ConversationSummaryDto toSummaryDto(Conversation conv, Role incomingSenderRole) {
        List<ChatMessage> messages = chatMessageRepository.findByConversationIdOrderByCreatedAtAsc(conv.getId());
        String lastMessage = messages.isEmpty() ? "No messages yet" : messages.get(messages.size() - 1).getContent();
        LocalDateTime lastMessageTime = messages.isEmpty() ? conv.getCreatedAt()
                : messages.get(messages.size() - 1).getCreatedAt();
        long unreadCount = chatMessageRepository.countByConversationIdAndIsReadFalseAndSenderRole(conv.getId(),
                incomingSenderRole);

        Product product = conv.getProduct();

        return ConversationSummaryDto.builder()
                .id(conv.getId())
                .customerId(conv.getCustomer().getId())
                .customerName(conv.getCustomer().getName())
                .customerEmail(conv.getCustomer().getEmail())
                .productId(product != null ? product.getId() : null)
                .productName(product != null ? product.getName() : null)
                .productImageUrl(product != null ? product.getImage() : null)
                .productPrice(product != null ? product.getPrice() : null)
                .status(conv.getStatus().name())
                .lastMessage(lastMessage)
                .lastMessageTime(lastMessageTime)
                .unreadCount(unreadCount)
                .createdAt(conv.getCreatedAt())
                .updatedAt(conv.getUpdatedAt())
                .build();
    }
}
