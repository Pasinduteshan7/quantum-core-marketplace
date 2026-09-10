# ⚡ Quantum Core — Next-Gen Full Stack E-Commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.3-green?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21%2B-orange?style=for-the-badge&logo=openjdk)](https://openjdk.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Spring Security](https://img.shields.io/badge/Spring_Security-JWT-red?style=for-the-badge&logo=springsecurity)](https://spring.io/projects/spring-security)

---

## 📌 Overview

**Quantum Core** is a production-grade, enterprise-ready full stack e-commerce web platform designed for high-performance computer hardware, gaming laptops, custom workstations, and PC components.

It pairs a high-performance **Next.js 15 App Router** frontend (styled with a sleek, bespoke dark cyberpunk aesthetic) with a robust, type-safe **Spring Boot 3.4.3 + PostgreSQL** REST backend engine.

---

## 🏗️ System Architecture

```
                                  🌐 Next.js 15 Client
                             (http://localhost:3000)
                                        │
                                        │ (HTTP REST / JWT)
                                        ▼
                             ⚙️ Spring Boot 3 Backend
                             (http://localhost:8080)
                                        │
             ┌──────────────────────────┼──────────────────────────┐
             ▼                          ▼                          ▼
      🔒 Spring Security          💼 Service Layer           🗄️ Spring Data JPA
     (JWT + BCrypt Auth)       (Auth / Cart / Orders)          (Hibernate ORM)
                                                                   │
                                                                   ▼
                                                          🐘 PostgreSQL 18
                                                       (quantumcore_db:5433)
```

---

## ✨ Key Features

### 🛍️ Client Experience (Next.js 15 + React 19)
- **Aesthetic Dark Theme**: Tailored deep-black palette with red active accents (`#e40505a6`) and responsive desktop/mobile navigation.
- **Dynamic Hero Carousel**: Auto-sliding visual showcases for flagship gaming laptops.
- **Faceted Product Filtering**: Live filtering by categories (*Gaming Laptops, Workstations, Accessories*) and brands (*MSI, ASUS, Lenovo, HP, Acer*).
- **Persistent Shopping Cart**: Real-time cart calculations with unit prices, quantity modifiers, and subtotal formatted in Sri Lankan Rupees (LKR).
- **Checkout & Multi-Payment Flow**: Cash on Delivery (COD), Card Payment, and Bank Transfer options with address validation.
- **Order Tracking**: Historic order tracking dashboard showing statuses (`PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`).

### 🛡️ Backend Engine (Spring Boot 3 + PostgreSQL)
- **Stateless JWT Security**: HMAC-SHA256 encrypted bearer token authentication with `OncePerRequestFilter`.
- **BCrypt Password Hashing**: Salted one-way password encryption for zero credential leakage.
- **Automated DDL Schema Updates**: Hibernate ORM automatically builds and aligns PostgreSQL tables from Java `@Entity` classes.
- **Historical Price Immutability**: Order snapshots lock exact item names and prices at the moment of checkout, safeguarding past invoices against future catalog price changes.
- **Anti-IDOR Protection**: Repository query methods enforce ownership checks (`findByIdAndUser`) so users can never access or modify other customers' carts or orders.
- **Automated Catalog Seeding**: Built-in `CommandLineRunner` automatically seeds sample laptops and components on initial launch.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | Next.js 15.5.25 (App Router, Server & Client Components) |
| **UI Library** | React 19 + TypeScript |
| **Styling** | Vanilla CSS Design System with responsive grid layouts |
| **Icons & Media** | Lucide React + Next.js Image Optimization |
| **Backend Framework** | Spring Boot 3.4.3 (Java 21 / 23) |
| **Security & Auth** | Spring Security 6 + JJWT 0.12.6 (JSON Web Tokens) |
| **ORM / Data Access** | Spring Data JPA + Hibernate 6 |
| **Database** | PostgreSQL 18 (Listening on port 5433) |
| **Connection Pool** | HikariCP |
| **Build Tools** | Maven Wrapper (`./mvnw`) & npm |

---

## 📂 Project Directory Structure

```
.
├── 📁 frontend/                         # Next.js 15 Client Application
│   ├── 📁 public/images/                # High-res hardware asset images
│   ├── 📁 src/
│   │   ├── 📁 app/                      # Next.js App Router pages
│   │   │   ├── 📁 cart/                 # Cart view & quantity manager
│   │   │   ├── 📁 checkout/             # Address & payment forms
│   │   │   ├── 📁 computers/            # Pre-built PCs & custom desktops
│   │   │   ├── 📁 laptops/              # Laptops catalog with brand pills
│   │   │   ├── 📁 login/ & 📁 register/ # Authentication pages
│   │   │   ├── 📁 orders/               # Historic user orders
│   │   │   └── 📁 search/               # Real-time search page
│   │   ├── 📁 components/               # Navbar, Hero Slider, ProductCard, Footer
│   │   ├── 📁 context/                  # AuthContext & CartContext providers
│   │   ├── 📁 lib/                      # API client service & mock data fallback
│   │   └── 📁 types/                    # Shared TypeScript interfaces
│   └── package.json
│
├── 📁 backend-springboot/               # Spring Boot 3 REST Backend
│   ├── 📁 src/main/java/com/quantumcore/
│   │   ├── 📁 config/                   # SecurityConfig, CorsConfig, DataSeeder
│   │   ├── 📁 controller/               # Auth, Product, Cart, Order REST APIs
│   │   ├── 📁 dto/                      # Request / Response transfer objects
│   │   ├── 📁 entity/                   # User, Role, Product, CartItem, Order, OrderItem
│   │   ├── 📁 repository/               # Spring Data JPA Repository interfaces
│   │   ├── 📁 security/                 # JwtUtils, JwtAuthenticationFilter, UserDetailsService
│   │   ├── 📁 service/                  # Business Logic services
│   │   └── QuantumCoreApplication.java  # Main Application Entrypoint
│   ├── 📁 src/main/resources/
│   │   └── application.yml              # Database, Hibernate, Tomcat, & JWT configuration
│   └── pom.xml
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18.18.0 or higher)
- **Java Development Kit (JDK)** (Java 21 or higher)
- **PostgreSQL 18** installed and running on port `5433` (or `5432`)

---

### 2. Database Configuration
1. Open pgAdmin or `psql` and create the database:
   ```sql
   CREATE DATABASE quantumcore_db;
   ```
2. Verify [`backend-springboot/src/main/resources/application.yml`](file:///d:/PROJECTS/PERSONAL/myself/Full%20stack/backend-springboot/src/main/resources/application.yml) matches your local credentials:
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5433/quantumcore_db
       username: postgres
       password: ${DB_PASSWORD:postgres}
   ```

---

### 3. Running the Backend (Spring Boot)
Open a terminal in the project directory:
```bash
cd backend-springboot
.\mvnw.cmd spring-boot:run
```
* Backend API will start on: **`http://localhost:8080`**
* Tables will be automatically created and populated with seed products.

---

### 4. Running the Frontend (Next.js)
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
* Frontend UI will start on: **`http://localhost:3000`**

---

## 📡 REST API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new customer account | No |
| `POST` | `/api/auth/login` | Authenticate and receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated profile details | Yes (Bearer) |

### 💻 Products Catalog (`/api/products`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | List all products (with category/brand filters) | No |
| `GET` | `/api/products/{id}` | Get product details by ID | No |
| `GET` | `/api/products/code/{code}` | Get product by SKU item code | No |
| `POST` | `/api/products` | Create a new product | Yes (Admin) |

### 🛒 Shopping Cart (`/api/cart`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cart` | Get current user's persistent cart | Yes (Bearer) |
| `POST` | `/api/cart` | Add a product to cart | Yes (Bearer) |
| `PUT` | `/api/cart/{id}` | Update quantity of cart item | Yes (Bearer) |
| `DELETE` | `/api/cart/{id}` | Remove specific item from cart | Yes (Bearer) |
| `DELETE` | `/api/cart` | Clear entire shopping cart | Yes (Bearer) |

### 📦 Orders & Checkout (`/api/orders`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Place order from cart & freeze item prices | Yes (Bearer) |
| `GET` | `/api/orders` | List current user's past order history | Yes (Bearer) |
| `GET` | `/api/orders/{id}` | Get detailed order invoice by ID | Yes (Bearer) |

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
