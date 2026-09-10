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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

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
        User user = getUserByEmail(userEmail);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + request.getProductId()));

        CartItem cartItem = cartItemRepository.findByUserAndProduct(user, product)
                .map(existing -> {
                    existing.setQuantity(existing.getQuantity() + request.getQuantity());
                    return existing;
                })
                .orElseGet(() -> CartItem.builder()
                        .user(user)
                        .product(product)
                        .quantity(request.getQuantity())
                        .build());

        CartItem saved = cartItemRepository.save(cartItem);
        return mapToDto(saved);
    }

    @Transactional
    public CartItemDto updateQuantity(String userEmail, Long cartItemId, UpdateCartItemRequest request) {
        User user = getUserByEmail(userEmail);
        CartItem cartItem = cartItemRepository.findByIdAndUser(cartItemId, user)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found: " + cartItemId));

        if (request.getQuantity() <= 0) {
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
