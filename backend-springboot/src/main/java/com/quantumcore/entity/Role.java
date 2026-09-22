package com.quantumcore.entity;

/**
 * USER ROLES (Authorization Levels)
 *
 * This enum defines what "type" of user someone is.
 * When a new user registers, they get ROLE_CUSTOMER by default (see User.java @Builder.Default).
 *
 * WHY THE "ROLE_" PREFIX?
 * Spring Security has a method called hasRole("ADMIN"). Internally, it automatically
 * prepends "ROLE_" and checks if the user has authority "ROLE_ADMIN".
 * If we named them just "ADMIN" and "CUSTOMER", hasRole("ADMIN") would look for
 * "ROLE_ADMIN" and never find it! So we include the prefix ourselves.
 *
 * Stored in PostgreSQL as a VARCHAR column thanks to @Enumerated(EnumType.STRING) in User.java.
 * The actual database value is the literal string "ROLE_CUSTOMER" or "ROLE_ADMIN".
 */
public enum Role {
    ROLE_CUSTOMER,
    ROLE_ADMIN
}
