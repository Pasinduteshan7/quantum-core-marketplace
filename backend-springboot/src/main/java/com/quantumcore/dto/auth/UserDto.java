package com.quantumcore.dto.auth;

import com.quantumcore.entity.Role;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Data Transfer Object (DTO) for User
 *
 * What is a DTO and why not just send User.java?
 * 1. User.java is a database Entity containing sensitive data (e.g. hashed password).
 * 2. UserDto represents ONLY the data the frontend/browser is allowed to see.
 * 3. Notice: There is NO 'password' field here! Even hashed passwords should never
 *    leave the backend over HTTP.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {

    private Long id;
    private String name;
    private String email;
    private Role role;
    private LocalDateTime createdAt;
}
