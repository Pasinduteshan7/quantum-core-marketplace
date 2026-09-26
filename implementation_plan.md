# Admin Panel — Step-by-Step Learning Plan

We're integrating the admin panel from the Claude project into your existing Quantum Core project. Instead of dumping all the code at once, we'll build it **layer by layer** so you understand exactly how each piece connects — just like we did with Cart and Orders.

---

## The Big Picture: What Does an Admin Panel Need?

```text
┌──────────────────────────────────────────────────────────────────────────┐
│                        ADMIN PANEL ARCHITECTURE                         │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  STEP 1: Role System (Backend)                                          │
│  ├─ Role.java enum (ROLE_CUSTOMER, ROLE_ADMIN)         ← Already exists! │
│  ├─ User.java entity (role field)                      ← Already exists! │
│  └─ CustomUserDetailsService (grants Spring Authority)                   │
│                                                                          │
│  STEP 2: Security Gate (Backend)                                        │
│  └─ SecurityConfig.java → Add: /api/admin/** = ADMIN only               │
│                                                                          │
│  STEP 3: Admin Backend APIs (Backend)                                   │
│  ├─ NEW: DashboardStatsDto, UpdateOrderStatusRequest                    │
│  ├─ NEW: OrderItemRepository (detach product on delete)                 │
│  ├─ MODIFY: CartItemRepository (add deleteByProduct)                    │
│  ├─ MODIFY: OrderRepository (add findAllByOrderByCreatedAtDesc)         │
│  ├─ MODIFY: ProductService (add update, delete, getAllAdmin)            │
│  ├─ MODIFY: OrderService (add getAllOrdersAdmin, updateOrderStatus)     │
│  ├─ MODIFY: UserDto (add role + createdAt fields)                       │
│  └─ NEW: AdminController (the central admin REST controller)            │
│                                                                          │
│  STEP 4: Frontend Types & Service (Frontend)                            │
│  ├─ MODIFY: types/index.ts (add DashboardStats, ProductFormInput, etc.) │
│  ├─ MODIFY: AuthContext (add isAdmin flag)                              │
│  ├─ MODIFY: authService (add normalizeUser for ROLE_ prefix)            │
│  └─ NEW: services/adminService.ts                                       │
│                                                                          │
│  STEP 5: Admin UI Pages (Frontend)                                      │
│  ├─ NEW: app/admin/layout.tsx (sidebar + auth gate)                     │
│  ├─ NEW: app/admin/page.tsx (dashboard with stat cards)                 │
│  ├─ NEW: app/admin/products/page.tsx (product table)                    │
│  ├─ NEW: app/admin/products/new/page.tsx                                │
│  ├─ NEW: app/admin/products/[id]/edit/page.tsx                          │
│  ├─ NEW: app/admin/orders/page.tsx (order queue + status dropdown)      │
│  ├─ NEW: components/admin/ProductForm.tsx                               │
│  └─ MODIFY: globals.css (add admin panel styles)                        │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Step 1: Role System — "Who is the Admin?"

> [!NOTE]
> Your project **already has** `Role.java` and the `role` field in `User.java`! This step is mostly about understanding what's already there.

### What we'll learn
- How Java enums (`ROLE_CUSTOMER`, `ROLE_ADMIN`) map to a database column via `@Enumerated(EnumType.STRING)`
- How `CustomUserDetailsService` translates the database Role into a Spring Security "authority" that the Bouncer (SecurityConfig) can check

### Files involved
- [Role.java](file:///d:/PROJECTS/PERSONAL/myself/Full%20stack/backend-springboot/src/main/java/com/quantumcore/entity/Role.java) — Already exists ✅
- [User.java](file:///d:/PROJECTS/PERSONAL/myself/Full%20stack/backend-springboot/src/main/java/com/quantumcore/entity/User.java) — Already has `role` field ✅
- [CustomUserDetailsService.java](file:///d:/PROJECTS/PERSONAL/myself/Full%20stack/backend-springboot/src/main/java/com/quantumcore/security/CustomUserDetailsService.java) — May need to verify it grants the role as an authority

### Changes needed
- **Verify** `CustomUserDetailsService` passes the user's `role` to Spring Security as a `GrantedAuthority`

---

## Step 2: Security Gate — "Block non-admins from /api/admin/**"

### What we'll learn
- How `hasRole("ADMIN")` works vs `authenticated()` vs `permitAll()`
- The 3-tier access model: Public → Logged-in → Admin-only
- Why the frontend gate (Step 5) is NOT enough — real security must live on the server

### Files to modify
#### [MODIFY] [SecurityConfig.java](file:///d:/PROJECTS/PERSONAL/myself/Full%20stack/backend-springboot/src/main/java/com/quantumcore/config/SecurityConfig.java)
- Add `.requestMatchers("/api/admin/**").hasRole("ADMIN")` 
- Add `.requestMatchers(HttpMethod.POST, "/api/products").hasRole("ADMIN")`

---

## Step 3: Admin Backend APIs — "The Back Office Endpoints"

### What we'll learn
- How to write admin-specific Repository methods (e.g., fetching ALL orders across ALL users)
- Why deleting a Product is dangerous (foreign key constraints) and how `@Transactional` with `detachProduct()` solves it
- How `mapToAdminDto` differs from `mapToDto` (admin needs to see customer identity)

### New files
#### [NEW] `dto/admin/DashboardStatsDto.java`
#### [NEW] `dto/admin/UpdateOrderStatusRequest.java`
#### [NEW] `repository/OrderItemRepository.java`
#### [NEW] `controller/AdminController.java`

### Modified files
#### [MODIFY] `dto/auth/UserDto.java` — Add `role` and `createdAt` fields
#### [MODIFY] `repository/CartItemRepository.java` — Add `deleteByProduct(Product)`
#### [MODIFY] `repository/OrderRepository.java` — Add `findAllByOrderByCreatedAtDesc()`
#### [MODIFY] `service/ProductService.java` — Add `getAllProductsAdmin()`, `updateProduct()`, `deleteProduct()`
#### [MODIFY] `service/OrderService.java` — Add `getAllOrdersAdmin()`, `updateOrderStatus()`, `mapToAdminDto()`

---

## Step 4: Frontend Types & Service — "Teaching Next.js About Admin"

### What we'll learn
- How TypeScript interfaces keep the frontend and backend in sync
- How `normalizeUser()` strips the `ROLE_` prefix so the frontend just checks `role === 'ADMIN'`
- How `isAdmin` in `AuthContext` makes it trivially easy to show/hide UI elements

### Files to modify/create
#### [MODIFY] `types/index.ts` — Add `DashboardStats`, `ProductFormInput`, `customerName`/`customerEmail` to `Order`
#### [MODIFY] `context/AuthContext.tsx` — Add `isAdmin` computed property
#### [MODIFY] `services/authService.ts` — Add `normalizeUser()` helper
#### [NEW] `services/adminService.ts` — All admin API calls

---

## Step 5: Admin UI Pages — "The Screens"

### What we'll learn
- How Next.js `layout.tsx` creates a completely different page shell (sidebar navigation) for admin routes
- Client-side route guarding (redirect non-admins away) vs server-side security
- How `<select>` dropdowns can trigger API calls to update order status in real-time
- Reusable form components (`ProductForm`) shared between "New" and "Edit" pages

### New files
#### [NEW] `app/admin/layout.tsx` — Admin sidebar shell + auth gate
#### [NEW] `app/admin/page.tsx` — Dashboard with stat cards
#### [NEW] `app/admin/products/page.tsx` — Product catalog table
#### [NEW] `app/admin/products/new/page.tsx` — Create product form
#### [NEW] `app/admin/products/[id]/edit/page.tsx` — Edit product form
#### [NEW] `app/admin/orders/page.tsx` — Order queue with status management
#### [NEW] `components/admin/ProductForm.tsx` — Reusable product form component
#### [MODIFY] `globals.css` — Add admin panel styles

---

## Proposed Order of Execution

| # | Step | Layer | Est. Time |
|---|------|-------|-----------|
| 1 | Role system verification + teaching comments | Backend | 10 min |
| 2 | SecurityConfig update (3-tier access) | Backend | 15 min |
| 3 | Admin DTOs + Repositories | Backend | 20 min |
| 4 | ProductService + OrderService admin methods | Backend | 25 min |
| 5 | AdminController | Backend | 20 min |
| 6 | Frontend types + AuthContext + authService | Frontend | 15 min |
| 7 | adminService.ts | Frontend | 10 min |
| 8 | Admin layout + Dashboard page | Frontend | 20 min |
| 9 | Admin Products pages (list + create + edit) | Frontend | 25 min |
| 10 | Admin Orders page | Frontend | 15 min |
| 11 | CSS styling for admin panel | Frontend | 15 min |

> [!IMPORTANT]
> We will build one step at a time. After each step, I'll explain exactly what we did and why, with SQL/architecture diagrams in the code comments. You tell me when you're ready for the next step.

## Open Questions

1. **DataSeeder admin user**: Should I add a default admin account to `DataSeeder.java` (e.g., `admin@quantumcore.com` / `admin123`) so you can immediately log in and test the admin panel?
2. **Header admin link**: Should we add an "Admin Panel" link in the main site `Header.tsx` that only appears when the logged-in user is an admin?
