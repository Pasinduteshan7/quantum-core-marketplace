package com.quantumcore.dto.order;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDto {

    private Long id;
    private Long productId;
    private String itemCode;
    private String name;
    private Double price;
    private Integer quantity;
    private String image;
}
