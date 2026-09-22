package com.quantumcore.repository;

import com.quantumcore.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * Used when adding an item to the cart or viewing a single product page.
     * Generates SQL: SELECT * FROM products WHERE item_code = ?;
     */
    Optional<Product> findByItemCode(String itemCode);

    boolean existsByItemCode(String itemCode);

    /**
     * Used for filtering the shop by Category.
     * "IgnoreCase" ensures that searching for "Laptops" or "laptops" works identically.
     * Generates SQL: SELECT * FROM products WHERE LOWER(category) = LOWER(?);
     */
    List<Product> findByCategoryIgnoreCase(String category);

    /**
     * Used for filtering the shop by Brand.
     * Generates SQL: SELECT * FROM products WHERE LOWER(brand) = LOWER(?);
     */
    List<Product> findByBrandIgnoreCase(String brand);

    /**
     * Used for filtering the shop by BOTH Category and Brand simultaneously.
     * Generates SQL: SELECT * FROM products WHERE LOWER(category) = LOWER(?) AND LOWER(brand) = LOWER(?);
     */
    List<Product> findByCategoryIgnoreCaseAndBrandIgnoreCase(String category, String brand);

    /**
     * Used for the main Search Bar in the Header.
     * We use a custom @Query because we want to search across multiple columns (name, brand, category, description).
     * 
     * How it works:
     * - The :query parameter is injected dynamically.
     * - CONCAT('%', :query, '%') adds wildcards so it matches any part of the string (like SQL LIKE).
     * - LOWER() is used on both sides to make the search case-insensitive.
     */
    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.brand) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.category) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> searchProducts(@Param("query") String query);
}
