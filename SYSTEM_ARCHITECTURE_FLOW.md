# Multi-Backend Architecture & Network Flow

This document maps out exactly how data flows from your Next.js frontend across the local network to your Spring Boot backend (and eventually Node.js / Go).

## 🛒 Flow 1: Adding an Item to the Cart

Follow the `🛒 CART FLOW STEP` breadcrumbs in your codebase to trace this path:

1. **[UI] `frontend/src/components/ProductCard.tsx`**
   - User clicks "Add to Cart" on a product.
2. **[Network] `frontend/src/services/cartService.ts`**
   - Axios receives the payload and fires a `POST http://localhost:8080/api/cart` request over the network.
3. **[API Entry] `backend-springboot/src/main/java/com/quantumcore/controller/CartController.java`**
   - Spring Boot receives the network request and unwraps the JSON.
4. **[Business Logic] `backend-springboot/src/main/java/com/quantumcore/service/CartService.java`**
   - Checks if the item already exists to increment quantity or create a new row.
5. **[Database] `backend-springboot/src/main/java/com/quantumcore/repository/CartItemRepository.java`**
   - Hibernate translates the Java code into `INSERT INTO` or `UPDATE` SQL and executes it on PostgreSQL.

---

## 📦 Flow 2: Placing an Order

Follow the `📦 ORDER FLOW STEP` breadcrumbs in your codebase to trace this path:

1. **[UI] `frontend/src/app/checkout/page.tsx`**
   - User clicks "Confirm Order".
2. **[Network] `frontend/src/services/orderService.ts`**
   - Axios fires a `POST http://localhost:8080/api/orders` request.
3. **[API Entry] `backend-springboot/src/main/java/com/quantumcore/controller/OrderController.java`**
   - Spring Boot receives the network request.
4. **[Business Logic] `backend-springboot/src/main/java/com/quantumcore/service/OrderService.java`**
   - The `@Transactional` method creates the Order, freezes the prices, and clears the cart items.
5. **[Database] `backend-springboot/src/main/java/com/quantumcore/repository/OrderRepository.java`**
   - Hibernate translates the Java objects into a massive atomic SQL transaction.
