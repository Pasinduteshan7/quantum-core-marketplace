package com.quantumcore.service;

import com.quantumcore.dto.order.CreateOrderRequest;
import com.quantumcore.dto.order.OrderDto;
import com.quantumcore.dto.order.OrderItemDto;
import com.quantumcore.dto.order.ShippingAddressDto;
import com.quantumcore.entity.CartItem;
import com.quantumcore.entity.Order;
import com.quantumcore.entity.OrderItem;
import com.quantumcore.entity.User;
import com.quantumcore.repository.CartItemRepository;
import com.quantumcore.repository.OrderRepository;
import com.quantumcore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
    }

    /**
     * Used for Checkout: Converts a user's active Cart into a final Order.
     * 
     * Why is @Transactional critical here? 
     * Because we are touching MULTIPLE tables. If the server crashes after saving the Order,
     * but BEFORE deleting the Cart, the user would get double-charged or keep their items.
     * @Transactional ensures PostgreSQL treats all these steps as ONE atomic operation:
     * - Step 1: Read CartItems (SELECT)
     * - Step 2: Save Order + OrderItems (INSERT)
     * - Step 3: Clear Cart (DELETE)
     * If ANY step fails, PostgreSQL rolls back the ENTIRE thing. No ghost orders!
     */
    @Transactional
    public OrderDto createOrderFromCart(String userEmail, CreateOrderRequest request) {
        
        // 📦 ORDER FLOW STEP 4: Business Logic. We validate the cart, lock in prices, and clear the cart.
        
        // 1. Identify the User & Fetch their Cart
        // We look up who is making the request, and grab every item currently in their cart from the DB.
        User user = getUserByEmail(userEmail);
        List<CartItem> cartItems = cartItemRepository.findByUserOrderByCreatedAtDesc(user);

        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("Cannot create order with an empty cart");
        }

        // 2. Selective Checkout (Advanced Feature)
        // Sometimes a user has 10 items in their cart, but only selects 2 items to checkout today.
        // If the frontend passed an array of specific IDs (request.getCartItemIds()), 
        // we filter the cart down to ONLY the items they actually want to buy right now.
        if (request.getCartItemIds() != null && !request.getCartItemIds().isEmpty()) {
            cartItems = cartItems.stream()
                    .filter(item -> request.getCartItemIds().contains(item.getId()) ||
                            (item.getProduct() != null && request.getCartItemIds().contains(item.getProduct().getId())))
                    .collect(Collectors.toList());

            if (cartItems.isEmpty()) {
                throw new IllegalArgumentException("None of the selected items were found in your cart");
            }
        }

        // 3. Calculate the Grand Total
        // We use Java Streams to loop over the cart, multiply (Price * Quantity) for each item, 
        // and sum it all into one total double value.
        double total = cartItems.stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();

        // 4. Build the "Order" Object (The Receipt Header)
        // We create the parent Order in memory. Notice the status is strictly set to "PENDING"
        // because we haven't charged their card yet via Stripe.
        ShippingAddressDto ship = request.getShippingAddress();
        Order order = Order.builder()
                .user(user)
                .fullName(ship.getFullName())
                .phone(ship.getPhone())
                .address(ship.getAddress())
                .city(ship.getCity())
                .postalCode(ship.getPostalCode())
                .notes(ship.getNotes())
                .paymentMethod(request.getPaymentMethod())
                .totalAmount(total)
                .status("PENDING") 
                .items(new ArrayList<>())
                .build();

        // 5. Convert Transient "CartItems" into Permanent "OrderItems"
        // CRITICAL ENGINEERING CONCEPT: Why copy the name and price over? 
        // If the store owner changes the Product price from $100 to $150 tomorrow, 
        // this Order MUST still show that the user paid $100. Data freezing!
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(cartItem.getProduct())
                    .productName(cartItem.getProduct().getName()) // FREEZE THE NAME
                    .itemCode(cartItem.getProduct().getItemCode())
                    .price(cartItem.getProduct().getPrice())      // FREEZE THE PRICE
                    .quantity(cartItem.getQuantity())
                    .image(cartItem.getProduct().getImage())
                    .build();
            order.getItems().add(orderItem);
        }

        // 6. Save to Database
        // We tell the OrderRepository to save the parent Order. Because Spring Boot 
        // is smart, it will automatically save all the child OrderItems we added to the list as well!
        Order savedOrder = orderRepository.save(order);

        // 7. Clear the Cart
        // We delete ONLY the items that were just purchased. If they did a "Selective Checkout" (Step 2),
        // the items they didn't select safely remain in their cart table for next time!
        cartItemRepository.deleteAll(cartItems);

        // 8. Return Data to Frontend
        // Convert our database entity into a DTO (Data Transfer Object) to send back as JSON.
        return mapToDto(savedOrder);
    }

    public List<OrderDto> getUserOrders(String userEmail) {
        User user = getUserByEmail(userEmail);
        return orderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public OrderDto getOrderById(String userEmail, Long orderId) {
        User user = getUserByEmail(userEmail);
        Order order = orderRepository.findByIdAndUser(orderId, user)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
        return mapToDto(order);
    }

    // Only these five statuses are allowed. Anything else (typos, arbitrary strings
    // from a hand-crafted request) is rejected before it ever touches the database.
    private static final List<String> VALID_STATUSES =
            List.of("PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED");

    /**
     * ADMIN PANEL: Every order from every customer, newest first — the queue an
     * admin works through to fulfil orders.
     */
    public List<OrderDto> getAllOrdersAdmin() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToAdminDto)
                .collect(Collectors.toList());
    }

    /**
     * ADMIN PANEL: Moves an order forward (or cancels it) — e.g. PENDING -> PROCESSING
     * once payment/stock is confirmed, or PROCESSING -> SHIPPED once it's dispatched.
     */
    public OrderDto updateOrderStatus(Long orderId, String newStatus) {
        String normalized = newStatus == null ? "" : newStatus.trim().toUpperCase();
        if (!VALID_STATUSES.contains(normalized)) {
            throw new IllegalArgumentException(
                    "Invalid status '" + newStatus + "'. Must be one of: " + VALID_STATUSES);
        }
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
        order.setStatus(normalized);
        Order saved = orderRepository.save(order);
        return mapToAdminDto(saved);
    }

    /**
     * Same shape as mapToDto, but additionally includes who placed the order —
     * a regular customer viewing their own order already knows who they are,
     * but an admin looking at the full order queue needs the customer's identity.
     */
    private OrderDto mapToAdminDto(Order order) {
        OrderDto dto = mapToDto(order);
        dto.setCustomerName(order.getUser().getName());
        dto.setCustomerEmail(order.getUser().getEmail());
        return dto;
    }

    private OrderDto mapToDto(Order order) {
        List<OrderItemDto> itemDtos = order.getItems().stream()
                .map(item -> OrderItemDto.builder()
                        .id(item.getId())
                        .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                        .itemCode(item.getItemCode())
                        .name(item.getProductName())
                        .price(item.getPrice())
                        .quantity(item.getQuantity())
                        .image(item.getImage())
                        .build())
                .collect(Collectors.toList());

        ShippingAddressDto addressDto = ShippingAddressDto.builder()
                .fullName(order.getFullName())
                .phone(order.getPhone())
                .address(order.getAddress())
                .city(order.getCity())
                .postalCode(order.getPostalCode())
                .notes(order.getNotes())
                .build();

        return OrderDto.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .items(itemDtos)
                .shippingAddress(addressDto)
                .paymentMethod(order.getPaymentMethod())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .build();
    }
}

/* THE CHECKOUT TRANSACTION FLOW
Browser
   │
   │ POST /api/orders
   ▼
┌─────────────────┐
│ OrderController │
└────────┬────────┘
         │
         │ createOrderFromCart()
         ▼
┌─────────────────┐ 
│  OrderService   │ ──(Opens PostgreSQL Transaction)──┐
└────────┬────────┘                                   │
         │                                            │
         ├─ 1. cartItemRepo.find...() ──────────────► SELECT FROM cart_items
         │                                            │
         ├─ 2. orderRepo.save(order)  ──────────────► INSERT INTO orders, order_items
         │                                            │
         └─ 3. cartItemRepo.delete...() ────────────► DELETE FROM cart_items
                                                      │
    (If success: COMMIT. If error: ROLLBACK) ─────────┘
*/

