package com.quantumcore.dto.auth;

import com.quantumcore.entity.Role;
import lombok.*;

import java.time.LocalDateTime;

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
