package com.quantumcore.controller;

import com.quantumcore.dto.admin.DashboardStatsDto;
import com.quantumcore.dto.admin.UpdateOrderStatusRequest;
import com.quantumcore.dto.auth.UserDto;
import com.quantumcore.dto.order.OrderDto;
import com.quantumcore.entity.Order;
import com.quantumcore.entity.Product;
import com.quantumcore.repository.OrderRepository;
import com.quantumcore.repository.ProductRepository;
import com.quantumcore.repository.UserRepository;
import com.quantumcore.service.OrderService;
import com.quantumcore.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * ADMIN CONTROLLER (The "Back Office")
 *
 * Every single endpoint in this class is locked down in SecurityConfig with:
 *      .requestMatchers("/api/admin/**").hasRole("ADMIN")
 *
 * That check happens in the Spring Security filter chain BEFORE the request
 * ever reaches this class. A logged-in customer (ROLE_CUSTOMER) hitting any
 * URL here gets an HTTP 403 Forbidden automatically — nothing in this file
 * needs to re-check "is this user an admin?" itself.
 *
 * THE ADMIN CAN:
 * 1. View dashboard stats (total revenue, orders, products, users)
 * 2. CRUD products (Create, Read, Update, Delete)
 * 3. View all orders from all customers
 * 4. Update order status (PENDING → PROCESSING → SHIPPED → DELIVERED)
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ProductService productService;
    private final OrderService orderService;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    // ============== DASHBOARD ==============

    /**
     * GET /api/admin/stats
     *
     * Computes store-wide statistics on the fly from existing tables.
     * No new database table needed — we just query orders, products, and users.
     */
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getStats() {
        List<Order> allOrders = orderRepository.findAll();

        double totalRevenue = allOrders.stream()
                .filter(o -> !"CANCELLED".equals(o.getStatus()))
                .mapToDouble(Order::getTotalAmount)
                .sum();

        long pendingOrders = allOrders.stream()
                .filter(o -> "PENDING".equals(o.getStatus()))
                .count();

        DashboardStatsDto stats = DashboardStatsDto.builder()
                .totalRevenue(totalRevenue)
                .totalOrders(allOrders.size())
                .pendingOrders(pendingOrders)
                .totalProducts(productRepository.count())
                .totalUsers(userRepository.count())
                .build();

        return ResponseEntity.ok(stats);
    }

    // ============== PRODUCTS ==============

    /**
     * GET /api/admin/products
     * Returns ALL products (no category/brand filtering — admin sees everything).
     */
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProductsAdmin());
    }

    /**
     * POST /api/admin/products
     * Creates a brand new product in the catalog.
     */
    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.createProduct(product));
    }

    /**
     * PUT /api/admin/products/{id}
     * Updates an existing product's details (name, price, stock, etc.).
     */
    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    /**
     * DELETE /api/admin/products/{id}
     * Removes a product. Handles foreign key cleanup via ProductService.deleteProduct().
     */
    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // ============== ORDERS ==============

    /**
     * GET /api/admin/orders
     * Returns ALL orders from ALL customers, newest first.
     */
    @GetMapping("/orders")
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrdersAdmin());
    }

    /**
     * PUT /api/admin/orders/{id}/status
     * Updates an order's status (e.g., PENDING → SHIPPED).
     */
    @PutMapping("/orders/{id}/status")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request.getStatus()));
    }

    // ============== USERS ==============

    /**
     * GET /api/admin/users
     * Returns all registered users (without passwords — we use UserDto, not User entity).
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userRepository.findAll().stream()
                .map(u -> UserDto.builder()
                        .id(u.getId())
                        .name(u.getName())
                        .email(u.getEmail())
                        .role(u.getRole())
                        .createdAt(u.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }
}

/* ADMIN PANEL REQUEST FLOW

Browser (Admin user)
   │
   │ GET /api/admin/stats (JWT token in Authorization header)
   ▼
┌─────────────────────┐
│ JwtAuthFilter       │ ← Extracts email from JWT, loads UserDetails
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ SecurityConfig      │ ← Checks: Does this user have ROLE_ADMIN?
│ hasRole("ADMIN")    │   If NO → 403 Forbidden (request STOPS here)
└────────┬────────────┘   If YES → request continues ↓
         │
         ▼
┌─────────────────────┐
│ AdminController     │ ← Handles the request, calls Services/Repos
└────────┬────────────┘
         │
         ▼
     PostgreSQL
*/
