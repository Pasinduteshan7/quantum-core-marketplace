package com.quantumcore.repository;

import com.quantumcore.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    /**
     * Used when an Admin deletes a Product: past orders must keep working, so instead
     * of blocking the delete (foreign key error) or deleting the OrderItem rows
     * (which would silently erase someone's order history), we just detach the
     * live `product` link. The OrderItem already stores its own frozen copy of
     * productName / price / image / itemCode at the moment of purchase — so the
     * customer's receipt is completely unaffected.
     *
     * WHY WE NEED THIS:
     * Without this, PostgreSQL would throw a foreign key constraint violation error
     * when trying to DELETE a product that appears in someone's past order.
     *
     * The @Modifying annotation tells Spring Data JPA: "This is NOT a SELECT query.
     * This is an UPDATE query that modifies data." Without it, Spring would try to
     * parse the result as entities and crash.
     *
     * Generates SQL: UPDATE order_items SET product_id = NULL WHERE product_id = ?;
     */
    @Modifying
    @Transactional
    @Query("UPDATE OrderItem oi SET oi.product = NULL WHERE oi.product.id = :productId")
    void detachProduct(@Param("productId") Long productId);
}
