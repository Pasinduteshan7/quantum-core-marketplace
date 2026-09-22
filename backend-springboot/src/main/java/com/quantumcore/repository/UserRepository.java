package com.quantumcore.repository;

import com.quantumcore.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Used for Login: Loads the full user record (including hashed password).
     *
     * How it works with PostgreSQL under the hood:
     * - Spring Data JPA reads "findBy" + "Email"
     * - Generates SQL: SELECT * FROM users WHERE email = ?;
     * - Returns Optional<User> (contains the User if found, or empty if not).
     */
    Optional<User> findByEmail(String email);

    /**
     * Used for Registration: Checks if an email is already taken.
     *
     * How it works with PostgreSQL under the hood:
     * - Spring Data JPA reads "existsBy" + "Email"
     * - Generates SQL: SELECT 1 FROM users WHERE email = ? LIMIT 1;
     * - Returns a boolean (true if exists, false if not).
     * - Much faster and uses less memory because it doesn't load user columns.
     */
    boolean existsByEmail(String email);
}

/* your registration flow now looks like this
Browser
   │
   │ POST /api/auth/register
   ▼
┌─────────────────┐
│ AuthController  │
└────────┬────────┘
         │
         │ register(request)
         ▼
┌─────────────────┐
│   AuthService   │
└────────┬────────┘
         │
         │ existsByEmail()
         ▼
┌─────────────────┐
│ UserRepository  │
└────────┬────────┘
         │
         ▼
  Spring Data JPA
         │
         ▼
     Hibernate
         │
         │ SQL
         ▼
    PostgreSQL

Then back:

PostgreSQL
    ↓
Hibernate
    ↓
Spring Data JPA
    ↓
UserRepository
    ↓
AuthService
    ↓
AuthController
    ↓
HTTP Response
    ↓
Browser */