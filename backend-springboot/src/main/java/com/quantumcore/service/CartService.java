package com.quantumcore.service;

import com.quantumcore.dto.cart.AddToCartRequest;
import com.quantumcore.dto.cart.CartItemDto;
import com.quantumcore.dto.cart.UpdateCartItemRequest;
import com.quantumcore.entity.CartItem;
import com.quantumcore.entity.Product;
import com.quantumcore.entity.User;
import com.quantumcore.repository.CartItemRepository;
import com.quantumcore.repository.ProductRepository;
import com.quantumcore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
    }

    public List<CartItemDto> getCart(String userEmail) {
        User user = getUserByEmail(userEmail);
        return cartItemRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CartItemDto addToCart(String userEmail, AddToCartRequest request) {
        log.info("Attempting to add product {} to user {}'s cart (quantity: {})", 
                request.getProductId(), userEmail, request.getQuantity());
        
        User user = getUserByEmail(userEmail);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> {
                    log.error("Failed to add to cart: Product {} not found", request.getProductId());
                    return new IllegalArgumentException("Product not found: " + request.getProductId());
                });

        // 🛒 CART FLOW STEP 4: Business Logic. We check the DB to see if they already have this item.
        // Check if item is already in cart:
        // Generates SQL: SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?;
        CartItem cartItem = cartItemRepository.findByUserAndProduct(user, product)
                .map(existing -> {
                    // Scenario A: Already in cart -> Just increase quantity (e.g. 1 -> 2)
                    existing.setQuantity(existing.getQuantity() + request.getQuantity());
                    return existing;
                })
                .orElseGet(() -> CartItem.builder()
                        // Scenario B: Not in cart -> Create a new CartItem linking User & Product
                        .user(user)
                        .product(product)
                        .quantity(request.getQuantity())
                        .build());

        // If Scenario A: Hibernate executes SQL: UPDATE cart_items SET quantity = ... WHERE id = ...;
        // If Scenario B: Hibernate executes SQL: INSERT INTO cart_items (user_id, product_id, quantity) VALUES (...);
        CartItem saved = cartItemRepository.save(cartItem);
        log.debug("Successfully saved cart item transaction to database. New Quantity: {}", saved.getQuantity());
        
        return mapToDto(saved);
    }

    @Transactional
    public CartItemDto updateQuantity(String userEmail, Long cartItemId, UpdateCartItemRequest request) {
        User user = getUserByEmail(userEmail);
        CartItem cartItem = cartItemRepository.findByIdAndUser(cartItemId, user)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found: " + cartItemId));

        if (request.getQuantity() <= 0) {
            log.info("Quantity is <= 0. Deleting cart item {} for user {}", cartItemId, userEmail);
            cartItemRepository.delete(cartItem);
            return null;
        }

        cartItem.setQuantity(request.getQuantity());
        CartItem saved = cartItemRepository.save(cartItem);
        return mapToDto(saved);
    }

    @Transactional
    public void removeFromCart(String userEmail, Long cartItemId) {
        User user = getUserByEmail(userEmail);
        CartItem cartItem = cartItemRepository.findByIdAndUser(cartItemId, user)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found: " + cartItemId));
        cartItemRepository.delete(cartItem);
    }

    @Transactional
    public void clearCart(String userEmail) {
        User user = getUserByEmail(userEmail);
        cartItemRepository.deleteByUser(user);
    }

    private CartItemDto mapToDto(CartItem item) {
        Product p = item.getProduct();
        double totalPrice = p.getPrice() * item.getQuantity();
        return CartItemDto.builder()
                .id(item.getId())
                .productId(p.getId())
                .itemCode(p.getItemCode())
                .name(p.getName())
                .unitPrice(p.getPrice())
                .quantity(item.getQuantity())
                .image(p.getImage())
                .totalPrice(totalPrice)
                .build();
    }
}
