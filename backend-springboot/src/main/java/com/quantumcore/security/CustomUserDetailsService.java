package com.quantumcore.security;

import com.quantumcore.entity.User;
import com.quantumcore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * CUSTOM USER DETAILS SERVICE (The Bridge Between Your Database and Spring Security)
 *
 * THE PROBLEM:
 * Spring Security doesn't know about your User entity or your PostgreSQL database.
 * It has its own internal representation of a "user" called UserDetails.
 *
 * THE SOLUTION:
 * This class is the bridge. Every time a JWT token arrives and the JwtAuthenticationFilter
 * extracts the email from it, Spring Security calls loadUserByUsername(email) here.
 *
 * What happens inside:
 * 1. We look up the User in PostgreSQL by email.
 * 2. We convert our User into Spring Security's UserDetails format.
 * 3. We give the user their ROLE as a "GrantedAuthority".
 *    - If user.getRole() is ROLE_ADMIN → Spring Security grants authority "ROLE_ADMIN"
 *    - If user.getRole() is ROLE_CUSTOMER → Spring Security grants authority "ROLE_CUSTOMER"
 *
 * Now when SecurityConfig says hasRole("ADMIN"), Spring Security checks:
 * "Does this user's GrantedAuthority list contain ROLE_ADMIN?" → Yes or No.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // This is the KEY line that makes Admin access control work!
        // user.getRole().name() returns the String "ROLE_ADMIN" or "ROLE_CUSTOMER"
        // SimpleGrantedAuthority wraps it into the format Spring Security understands.
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name()))
        );
    }
}
