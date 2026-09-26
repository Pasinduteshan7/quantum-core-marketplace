# Quantum Core E-Commerce — Master Task Tracker

> One project. Three backends. Three databases. One frontend.
> Schedule: Wed/Fri 3hrs (after 12 PM) + Sat/Sun 5hrs (after 8 AM) = 16 hrs/week

---

## 🟢 Block 1: Complete Frontend — Next.js 15 + TypeScript (COMPLETED ✅)

- [x] **Asset Migration**: Copied 72 product & brand images from previous project
- [x] **Gap 1: Authentication**: Implemented `AuthContext`, `/login`, `/register`, JWT storage & auto-session
- [x] **Gap 2: Dynamic Products**: Integrated `productService` with dynamic filtering, categories, brands, & fallback seed
- [x] **Gap 3: Per-User Cart**: Implemented `CartContext` with LKR formatting, quantity controls (+/-), and instant toast feedback
- [x] **Gap 4: Checkout & Orders**: Built `/checkout` with shipping form & payment options + `/orders` tracking page
- [x] **Gap 5: Live Search**: Implemented Header search bar and `/search` page with query sorting
- [x] **Bonus**: Added `BackendSwitcher` toggle widget for Spring Boot (:8080), Node.js (:5000), and Go (:8081)
- [x] **Build Verification**: `npm run build` completed with zero TypeScript/JSX errors

---

## 🔵 Block 2: Backend #1 — Spring Boot + PostgreSQL (Next Up!)

### Week 5: Spring Boot Setup + Docker
- [x] Connect Spring Boot to PostgreSQL (`application.yml` + Docker Compose)
- [x] Create `User` entity, `UserRepository`, and `BCryptPasswordEncoder`
- [x] Build `/api/auth/register` and `/api/auth/login` with JWT tokens
- [x] Build `/api/auth/me` protected endpoint

### Week 6: Product Catalog & Image Upload
- [x] Create `Product` and `Category` entities
- [x] Build `GET /api/products` (pagination, category, brand, search filtering)
- [x] Build `GET /api/products/{id}`
- [x] Build `POST /api/products` (Admin CRUD)
- [x] Seed database with initial Quantum Core products

### Week 7: Shopping Cart & Order Checkout
- [x] Create `CartItem` entity (tied to authenticated `User`)
- [x] Build `GET /api/cart`, `POST /api/cart`, `PUT /api/cart/{id}`, `DELETE /api/cart/{id}`
- [x] Create `Order` and `OrderItem` entities
- [x] Build `POST /api/orders` (atomic transaction: validate cart, deduct stock, create order)
- [x] Build `GET /api/orders` (user order history)

### Week 8: Testing & Docker Compose
- [ ] JUnit 5 unit & integration tests for Auth and Cart/Order flows
- [ ] Swagger / OpenAPI documentation UI (`/swagger-ui.html`)
- [ ] `docker-compose.yml` linking Spring Boot + PostgreSQL + Next.js frontend

---

## 🟡 Block 3: Backend #2 — Node.js/Express + MongoDB (BUILT & ARCHITECTED ✅)

- [x] Setup Express server with Mongoose & Connection Pooling
- [x] Build Auth routes (JWT, BCrypt pre-save hooks) matching Spring Boot API contract
- [x] Build Product catalog with faceted filtering, text search, and SKU lookups
- [x] Build Cart & Order routes with Anti-IDOR user isolation & price snapshotting
- [x] Database seeder for default accounts and catalog synchronization
- [ ] Test frontend switching to `node` backend (:5000) and verify live Mongo persistence

---

## 🟠 Block 4: Backend #3 — Go/Gin + MySQL

- [ ] Setup Go project with Gin framework and GORM
- [ ] Connect Go to MySQL
- [ ] Implement Auth, Product, Cart, and Order endpoints matching API contract
- [ ] Test frontend switching to `npm run dev:go` (:8081)

---

## 🔴 Block 5: Deployment & DevOps

- [ ] GitHub Actions CI/CD pipeline
- [ ] Deploy Spring Boot + PostgreSQL to Railway / Render
- [ ] Deploy Next.js frontend to Vercel
- [ ] Write `ARCHITECTURE.md` and `COMPARISON.md` (Java vs JS vs Go)
