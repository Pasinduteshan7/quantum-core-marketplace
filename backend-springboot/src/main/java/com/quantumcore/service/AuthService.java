package com.quantumcore.service;

import com.quantumcore.dto.auth.AuthResponse;
import com.quantumcore.dto.auth.LoginRequest;
import com.quantumcore.dto.auth.RegisterRequest;
import com.quantumcore.dto.auth.UserDto;
import com.quantumcore.entity.Role;
import com.quantumcore.entity.User;
import com.quantumcore.repository.UserRepository;
import com.quantumcore.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // STEP 1: Duplicate Email Check (PostgreSQL existence query)
        // Checks PostgreSQL: "SELECT 1 FROM users WHERE email = ? LIMIT 1;"
        // Returns boolean: true if already taken, false if available.
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered: " + request.getEmail());
        }

        // STEP 2: Hash Password & Build User Entity
        // passwordEncoder.encode() uses BCrypt (one-way hashing).
        // It permanently turns "mySecret123" into a 60-character scrambled string.
        // It can NEVER be reversed/decrypted back. If database is breached, passwords stay safe.
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_CUSTOMER)
                .build();

        // STEP 3: Save to Database
        // Spring Data JPA translates this into: "INSERT INTO users (name, email, password, role) VALUES (...);"
        User savedUser = userRepository.save(user);

        // STEP 4: Generate JWT Token (Identity Badge)
        // Instead of sending the password on every HTTP request (e.g. Add to Cart, View Orders),
        // we give the frontend this signed token. The frontend sends this token in HTTP headers
        // as proof of identity for all future requests.
        String token = jwtUtils.generateToken(savedUser.getEmail());

        return AuthResponse.builder()
                .token(token)
                .user(mapToDto(savedUser))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        // STEP 1: Look up user in PostgreSQL by email
        // Spring Data JPA executes: "SELECT * FROM users WHERE email = ?;"
        // Throws BadCredentialsException if no matching row is found.
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        // STEP 2: Verify Password against the BCrypt hash
        // Because hashing is one-way, we cannot unhash user.getPassword().
        // Instead, passwordEncoder hashes the typed password and compares the two hashes.
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        // STEP 3: Generate JWT Token (Identity Badge) for subsequent authenticated requests
        String token = jwtUtils.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .user(mapToDto(user))
                .build();
    }

    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
        return mapToDto(user);
    }

    public UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
