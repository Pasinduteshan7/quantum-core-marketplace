package com.quantumcore.controller;

import com.quantumcore.dto.auth.AuthResponse;
import com.quantumcore.dto.auth.LoginRequest;
import com.quantumcore.dto.auth.RegisterRequest;
import com.quantumcore.dto.auth.UserDto;
import com.quantumcore.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // Receives HTTP POST: http://localhost:8080/api/auth/register
    // The Controller is the front door: accepts JSON body, validates fields, and calls AuthService.
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Receives HTTP POST: http://localhost:8080/api/auth/login
    // Accepts credentials, verifies them through AuthService, returns JWT token if valid.
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserDto user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(user);
    }
}
/* 1. CLIENT LAYER          Browser / Next.js / Postman
                                 │
                                 │ HTTP POST /api/auth/register
                                 ▼
 2. CONTROLLER LAYER      AuthController.java        <-- "Front Door" (Spring MVC)
                                 │
                                 │ authService.register(request)
                                 ▼
 3. SERVICE LAYER         AuthService.java           <-- "Brain" (Business Logic)
                                 │
                                 ├──> Uses User.java <-- "Blueprint" (JPA Entity)
                                 │
                                 │ userRepository.save(user)
                                 ▼
 4. REPOSITORY LAYER      UserRepository.java        <-- "Remote Control" (Spring Data JPA)
                                 │
 ────────────────────────────────┼──────────────────────────────────────────────────
 5. JPA SPECIFICATION            │  (Defines the rules: @Entity, @Table, EntityManager)
                                 ▼
 6. HIBERNATE (ORM ENGINE)       │  (Translates Java objects into SQL queries)
                                 ▼
 7. JDBC & DRIVER                │  (Java network pipe connected to port 5432)
                                 │
                                 │ SQL: INSERT INTO users ...
                                 ▼
 8. POSTGRESQL DATABASE   users table on disk
 */