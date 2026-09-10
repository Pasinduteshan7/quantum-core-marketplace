package com.quantumcore.dto.order;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDto {

    private Long id;
    private Long userId;
    private List<OrderItemDto> items;
    private ShippingAddressDto shippingAddress;
    private String paymentMethod;
    private Double totalAmount;
    private String status;
    private LocalDateTime createdAt;
}
