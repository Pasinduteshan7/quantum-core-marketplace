package com.quantumcore.controller;

import com.quantumcore.dto.cart.AddToCartRequest;
import com.quantumcore.dto.cart.CartItemDto;
import com.quantumcore.dto.cart.UpdateCartItemRequest;
import com.quantumcore.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItemDto>> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        List<CartItemDto> cart = cartService.getCart(userDetails.getUsername());
        return ResponseEntity.ok(cart);
    }

    @PostMapping
    public ResponseEntity<CartItemDto> addToCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AddToCartRequest request
    ) {
        CartItemDto item = cartService.addToCart(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(item);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartItemDto> updateQuantity(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody UpdateCartItemRequest request
    ) {
        CartItemDto item = cartService.updateQuantity(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(item);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> removeFromCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        cartService.removeFromCart(userDetails.getUsername(), id);
        return ResponseEntity.ok(Map.of("message", "Item removed from cart"));
    }

    @DeleteMapping
    public ResponseEntity<Map<String, String>> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        cartService.clearCart(userDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "Cart cleared"));
    }
}
