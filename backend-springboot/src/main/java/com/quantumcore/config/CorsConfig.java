package com.quantumcore.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * CORS CONFIGURATION (Cross-Origin Resource Sharing)
 * 
 * THE PROBLEM:
 * Your Next.js frontend runs on http://localhost:3000.
 * Your Spring Boot backend runs on http://localhost:8080.
 * By default, web browsers block websites on port 3000 from talking to servers on port 8080 for security.
 * 
 * THE SOLUTION:
 * This configuration tells Spring Boot to send a special header to the browser saying:
 * "It's okay! I completely trust requests coming from localhost:3000."
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://127.0.0.1:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
