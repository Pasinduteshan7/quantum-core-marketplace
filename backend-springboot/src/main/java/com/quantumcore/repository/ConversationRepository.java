package com.quantumcore.repository;

import com.quantumcore.entity.Conversation;
import com.quantumcore.entity.ConversationStatus;
import com.quantumcore.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 💬 CONVERSATION REPOSITORY
 * Spring Data JPA database interface for managing customer-to-store chat threads.
 */
@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    /**
     * Customer view: Find all conversation threads initiated by a specific customer,
     * sorted by the most recent activity first.
     */
    List<Conversation> findByCustomerOrderByUpdatedAtDesc(User customer);

    /**
     * Check if an active conversation already exists between a customer and a specific product.
     */
    Optional<Conversation> findByCustomerIdAndProductId(Long customerId, Long productId);

    /**
     * Store Owner / Admin view: Find all customer inquiries across the entire marketplace,
     * sorted with the newest incoming messages at the top.
     */
    List<Conversation> findAllByOrderByUpdatedAtDesc();

    /**
     * Store Owner / Admin view: Find conversations filtered by status (OPEN or RESOLVED).
     */
    List<Conversation> findByStatusOrderByUpdatedAtDesc(ConversationStatus status);

    /**
     * Count open customer inquiries awaiting store response.
     */
    long countByStatus(ConversationStatus status);
}
