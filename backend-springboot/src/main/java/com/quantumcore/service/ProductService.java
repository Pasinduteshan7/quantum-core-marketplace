package com.quantumcore.service;

import com.quantumcore.entity.Product;
import com.quantumcore.repository.CartItemRepository;
import com.quantumcore.repository.OrderItemRepository;
import com.quantumcore.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderItemRepository orderItemRepository;

    /**
     * 🎓 TEACHING NOTE: Dynamic Filtering
     * This method powers the main storefront (e.g., clicking "Laptops" or searching "Dell").
     * Instead of fetching all 10,000 products and filtering them in Java (which would be very slow),
     * we use Spring Data JPA to generate highly specific SQL queries so the database does the heavy lifting.
     */
    public List<Product> getAllProducts(String category, String brand, String search) {
        // SCENARIO 1: The user typed something in the search bar.
        // Generates SQL: SELECT * FROM products WHERE LOWER(name) LIKE '%dell%' OR LOWER(specs) LIKE '%dell%';
        if (search != null && !search.trim().isEmpty()) {
            return productRepository.searchProducts(search.trim());
        }
        
        // SCENARIO 2: The user clicked "Laptops" AND filtered by brand "Apple".
        // Generates SQL: SELECT * FROM products WHERE LOWER(category) = 'laptops' AND LOWER(brand) = 'apple';
        if (category != null && brand != null) {
            return productRepository.findByCategoryIgnoreCaseAndBrandIgnoreCase(category, brand);
        }
        
        // SCENARIO 3: The user just clicked "Laptops".
        // Generates SQL: SELECT * FROM products WHERE LOWER(category) = 'laptops';
        if (category != null) {
            return productRepository.findByCategoryIgnoreCase(category);
        }
        
        // SCENARIO 4: The user clicked a specific brand on the homepage.
        // Generates SQL: SELECT * FROM products WHERE LOWER(brand) = 'asus';
        if (brand != null) {
            return productRepository.findByBrandIgnoreCase(brand);
        }
        
        // FALLBACK: Just show everything. (Generates SQL: SELECT * FROM products;)
        return productRepository.findAll();
    }

    /**
     * 🎓 TEACHING NOTE: Optional<T>
     * findById returns an 'Optional' wrapper because the ID might not exist!
     * .orElseThrow() guarantees we either get the Product or crash cleanly with an HTTP 400 error,
     * preventing dreaded NullPointerExceptions.
     */
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));
    }

    public Product getProductByItemCode(String itemCode) {
        return productRepository.findByItemCode(itemCode)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with itemCode: " + itemCode));
    }

    /**
     * 🎓 TEACHING NOTE: Save
     * When an admin adds a new product, .save() translates to:
     * INSERT INTO products (name, brand, price...) VALUES (...);
     */
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    /**
     * ADMIN PANEL: Returns every product regardless of category/brand/search,
     * so the admin can see and manage the full catalog including out-of-stock items.
     */
    public List<Product> getAllProductsAdmin() {
        return productRepository.findAll();
    }

    /**
     * 🎓 TEACHING NOTE: Hibernate "Dirty Checking"
     * Notice how we fetch the `existing` product from the database first,
     * and then manually copy over the fields from the `updated` JSON payload?
     * 
     * Why?
     * 1. Security: If we just saved the `updated` object directly, a malicious admin 
     *    could accidentally wipe out hidden fields (like internal IDs or creation dates).
     * 2. Data Integrity: We intentionally DO NOT update `itemCode`. It's the permanent SKU.
     *    If you change the SKU, past orders might break!
     *
     * Once we call .save(existing), Hibernate compares the original to the new version,
     * and generates an UPDATE SQL query ONLY for the fields that actually changed!
     */
    public Product updateProduct(Long id, Product updated) {
        // 1. Fetch the exact row from PostgreSQL
        Product existing = getProductById(id);
        
        // 2. Overwrite only the safe, editable fields
        existing.setName(updated.getName());
        existing.setBrand(updated.getBrand());
        existing.setCategory(updated.getCategory());
        existing.setSubCategory(updated.getSubCategory());
        existing.setPrice(updated.getPrice());
        existing.setOriginalPrice(updated.getOriginalPrice());
        existing.setDiscount(updated.getDiscount());
        existing.setSpecs(updated.getSpecs());
        existing.setImage(updated.getImage());
        existing.setDescription(updated.getDescription());
        existing.setStock(updated.getStock());
        existing.setBadge(updated.getBadge());
        
        // 3. Save it back to PostgreSQL
        return productRepository.save(existing);
    }

    /**
     * ADMIN PANEL: Removes a product entirely.
     *
     * Two other tables point at products via a foreign key (product_id), so we
     * must clean those up first or PostgreSQL will reject the DELETE:
     * 1. cart_items  — if a customer currently has this product in their cart,
     *    that cart row is deleted (it's just an active session, nothing to preserve).
     * 2. order_items — past orders keep their frozen name/price/image snapshot,
     *    so we only null out the live product_id link rather than touching the
     *    order history itself.
     *
     * This is why @Transactional is critical here — all 3 operations must succeed
     * together, or all must roll back.
     */
    @Transactional
    public void deleteProduct(Long id) {
        Product existing = getProductById(id);
        cartItemRepository.deleteByProduct(existing);
        orderItemRepository.detachProduct(id);
        productRepository.delete(existing);
    }
}
