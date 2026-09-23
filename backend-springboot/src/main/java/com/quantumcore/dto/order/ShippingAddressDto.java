package com.quantumcore.dto.order;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * DTO (Data Transfer Object)
 * 
 * WHY DO WE USE THIS?
 * We do NOT want to send raw Database Entities (like User or Order) directly to the Next.js frontend.
 * Entities might contain sensitive data (passwords) or infinite loops (User -> Order -> User).
 * 
 * Instead, we use DTOs like this one as "dumb" network transport objects.
 * When a user checks out in Next.js, they send a JSON payload. Spring Boot automatically 
 * reads that JSON and converts it into this exact ShippingAddressDto object.
 * 
 * The @NotBlank annotations ensure the server instantly rejects the request if a required field is missing!
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingAddressDto {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    private String postalCode;
    private String notes;
}
