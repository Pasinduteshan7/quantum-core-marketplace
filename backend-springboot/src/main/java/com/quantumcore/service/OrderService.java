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

    @Transactional
    public OrderDto createOrderFromCart(String userEmail, CreateOrderRequest request) {
        User user = getUserByEmail(userEmail);
        List<CartItem> cartItems = cartItemRepository.findByUserOrderByCreatedAtDesc(user);

        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("Cannot create order with an empty cart");
        }

        double total = cartItems.stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();

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

        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(cartItem.getProduct())
                    .productName(cartItem.getProduct().getName())
                    .itemCode(cartItem.getProduct().getItemCode())
                    .price(cartItem.getProduct().getPrice())
                    .quantity(cartItem.getQuantity())
                    .image(cartItem.getProduct().getImage())
                    .build();
            order.getItems().add(orderItem);
        }

        Order savedOrder = orderRepository.save(order);

        // Clear cart after order is successfully placed
        cartItemRepository.deleteByUser(user);

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
