package com.quantumcore.dto.admin;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * Request DTO for when an Admin changes an order's status.
 *
 * The admin picks a new status from a dropdown (PENDING → PROCESSING → SHIPPED → DELIVERED).
 * The frontend sends { "status": "SHIPPED" } as JSON, and Spring Boot maps it to this class.
 *
 * @NotBlank ensures the admin can't accidentally send an empty status.
 * The OrderService further validates that the status is one of the 5 allowed values.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderStatusRequest {

    @NotBlank(message = "Status is required")
    private String status; // PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
}
