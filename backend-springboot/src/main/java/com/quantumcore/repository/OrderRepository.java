package com.quantumcore.repository;

import com.quantumcore.entity.Order;
import com.quantumcore.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 📦 ORDER FLOW STEP 5: Database Save. Spring and Hibernate dynamically write the INSERT SQL to PostgreSQL!
 * 
 * 🎓 TEACHING NOTE: How does an empty interface connect to PostgreSQL?
 * 
 * 1. Dynamic Proxy: When Spring Boot starts, it creates a "ghost" class in memory 
 *    that implements this interface automatically.
 * 2. Hibernate (ORM): Inside that generated class, Hibernate looks at your @Entity 
 *    annotations, grabs your DB credentials from application.properties, and opens a JDBC connection.
 * 3. Translation: When you call .save(order), Hibernate translates your Java object 
 *    into raw SQL (INSERT INTO orders...) and executes it on the database.
 * 
 * You write the interface; Spring and Hibernate write the SQL!
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    /**
     * Used for Order History Page: Fetches all past orders for a specific user.
     *
     * How it works with PostgreSQL under the hood:
     * - "findBy" + "User" + "OrderByCreatedAtDesc"
     * - Generates SQL: SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC;
     * - Returns List<Order> sorted with the most recent orders at the top.
     */
    List<Order> findByUserOrderByCreatedAtDesc(User user);

    /**
     * Used for Viewing a Specific Order:
     * Ensures user A cannot view user B's order by guessing the order ID.
     *
     * Generates SQL: SELECT * FROM orders WHERE id = ? AND user_id = ?;
     */
    Optional<Order> findByIdAndUser(Long id, User user);

    /**
     * Used for the Admin Panel: Fetches EVERY order across ALL users (no user filter),
     * newest first, so admins can see and manage the full order queue.
     *
     * Generates SQL: SELECT * FROM orders ORDER BY created_at DESC;
     */
    List<Order> findAllByOrderByCreatedAtDesc();
}
