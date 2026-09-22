package com.quantumcore.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quantumcore.entity.Product;
import com.quantumcore.entity.Role;
import com.quantumcore.entity.User;
import com.quantumcore.repository.ProductRepository;
import com.quantumcore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;

/**
 * DATABASE SEEDER
 * 
 * Automatically populates PostgreSQL on startup with:
 * 1. Default Admin & Customer user accounts
 * 2. Full catalog of 100+ Laptops, Desktops, Workstations, and Accessories from products.json
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    @Override
    public void run(String... args) {
        // 1. Seed default Admin & Customer accounts
        if (!userRepository.existsByEmail("admin@quantumcore.com")) {
            userRepository.save(User.builder()
                    .name("Admin User")
                    .email("admin@quantumcore.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ROLE_ADMIN)
                    .build());
            log.info("Seeded default admin user: admin@quantumcore.com");
        }

        if (!userRepository.existsByEmail("pasindu@gmail.com")) {
            userRepository.save(User.builder()
                    .name("Pasindu")
                    .email("pasindu@gmail.com")
                    .password(passwordEncoder.encode("password123"))
                    .role(Role.ROLE_ADMIN)
                    .build());
            log.info("Seeded admin user: pasindu@gmail.com");
        }

        if (!userRepository.existsByEmail("customer@quantumcore.com")) {
            userRepository.save(User.builder()
                    .name("Demo Customer")
                    .email("customer@quantumcore.com")
                    .password(passwordEncoder.encode("customer123"))
                    .role(Role.ROLE_CUSTOMER)
                    .build());
            log.info("Seeded default customer user: customer@quantumcore.com");
        }

        // 2. Seed products from products.json
        try {
            InputStream inputStream = getClass().getResourceAsStream("/products.json");
            if (inputStream != null) {
                List<Product> products = objectMapper.readValue(inputStream, new TypeReference<List<Product>>() {});
                int addedCount = 0;
                for (Product p : products) {
                    if (!productRepository.existsByItemCode(p.getItemCode())) {
                        productRepository.save(p);
                        addedCount++;
                    }
                }
                if (addedCount > 0) {
                    log.info("Successfully seeded {} new products into PostgreSQL! Total inventory: {}", 
                            addedCount, productRepository.count());
                } else {
                    log.info("PostgreSQL inventory is already up to date with {} products.", productRepository.count());
                }
            } else {
                log.warn("products.json resource file not found on classpath.");
            }
        } catch (Exception e) {
            log.error("Failed to seed products from JSON: {}", e.getMessage(), e);
        }
    }
}
