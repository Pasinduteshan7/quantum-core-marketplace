package com.quantumcore.dto.cart;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemDto {

    private Long id;
    private Long productId;
    private String itemCode;
    private String name;
    private Double unitPrice;
    private Integer quantity;
    private String image;
    private Double totalPrice;
}
