package com.quantumcore.repository;

import com.quantumcore.entity.ChatMessage;
import com.quantumcore.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 📩 CHAT MESSAGE REPOSITORY
 * Spring Data JPA database interface for reading and writing individual chat messages.
 */
@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    /**
     * Loads the full message history for a conversation thread,
     * sorted chronologically (oldest to newest) for rendering chat bubbles.
     */
    List<ChatMessage> findByConversationIdOrderByCreatedAtAsc(Long conversationId);

    /**
     * Count unread messages in a conversation sent by the other party.
     * E.g., if the reader is the Admin, senderRole would be ROLE_CUSTOMER.
     */
    long countByConversationIdAndIsReadFalseAndSenderRole(Long conversationId, Role senderRole);

    /**
     * Total unread customer messages across the entire store (for the Admin notification badge).
     */
    long countByIsReadFalseAndSenderRole(Role senderRole);

    /**
     * Mark all incoming messages in a conversation as read.
     * For example, when Admin opens conversation 5, mark all ROLE_CUSTOMER messages as read = true.
     */
    @Modifying
    @Query("UPDATE ChatMessage m SET m.isRead = true WHERE m.conversation.id = :conversationId AND m.senderRole = :senderRole")
    void markMessagesAsRead(@Param("conversationId") Long conversationId, @Param("senderRole") Role senderRole);
}
