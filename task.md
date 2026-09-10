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
- [ ] Connect Spring Boot to PostgreSQL (`application.yml` + Docker Compose)
- [ ] Create `User` entity, `UserRepository`, and `BCryptPasswordEncoder`
- [ ] Build `/api/auth/register` and `/api/auth/login` with JWT tokens
- [ ] Build `/api/auth/me` protected endpoint

### Week 6: Product Catalog & Image Upload
- [ ] Create `Product` and `Category` entities
- [ ] Build `GET /api/products` (pagination, category, brand, search filtering)
- [ ] Build `GET /api/products/{id}`
- [ ] Build `POST /api/products` (Admin CRUD)
- [ ] Seed database with initial Quantum Core products

### Week 7: Shopping Cart & Order Checkout
- [ ] Create `CartItem` entity (tied to authenticated `User`)
- [ ] Build `GET /api/cart`, `POST /api/cart`, `PUT /api/cart/{id}`, `DELETE /api/cart/{id}`
- [ ] Create `Order` and `OrderItem` entities
- [ ] Build `POST /api/orders` (atomic transaction: validate cart, deduct stock, create order)
- [ ] Build `GET /api/orders` (user order history)

### Week 8: Testing & Docker Compose
- [ ] JUnit 5 unit & integration tests for Auth and Cart/Order flows
- [ ] Swagger / OpenAPI documentation UI (`/swagger-ui.html`)
- [ ] `docker-compose.yml` linking Spring Boot + PostgreSQL + Next.js frontend

---

## 🟡 Block 3: Backend #2 — Node.js/Express + MongoDB

- [ ] Setup Express server with TypeScript & Mongoose
- [ ] Build Auth routes (JWT, bcrypt) matching API contract
- [ ] Build Product & Category routes
- [ ] Build Cart & Order routes with user isolation
- [ ] Test frontend switching to `npm run dev:node` (:5000)

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
