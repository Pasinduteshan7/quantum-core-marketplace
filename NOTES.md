# Quantum Core - Important Notes & Architecture Decisions

This document serves as a permanent record for crucial AI conversations, architectural decisions, and concept explanations. 
**Even if the AI chat is reset, everything important will be saved here.**

---

## Topic 1: Logging in Spring Boot (SLF4J + Logback)

### Why Logging Matters
Instead of using `System.out.println()`, professional Spring Boot applications use SLF4J (Simple Logging Facade for Java) with Logback. 
Logging allows us to:
1. Output messages with different severity levels (`INFO`, `DEBUG`, `WARN`, `ERROR`).
2. Save logs to files that persist across server restarts.
3. Keep track of exactly what happens when a database transaction fails.

### Implementation
In Spring Boot, you can easily add logging to any Service or Controller using the `@Slf4j` annotation provided by Lombok:

```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class CartService {
    
    public void addCartItem(Long userId, Long productId) {
        log.info("Attempting to add product {} to user {}'s cart", productId, userId);
        try {
            // Database operations here
            log.debug("Successfully executed database transaction for cart addition");
        } catch (Exception e) {
            log.error("Failed to add item to cart due to database error: {}", e.getMessage());
            // Re-throw or handle exception
        }
    }
}
```

---

## Topic 2: End-to-End Cart & Selective Checkout Architecture (PostgreSQL + Spring Boot + Next.js)

The Quantum Core shopping cart is a full-stack, enterprise-grade system where the frontend (Next.js React Context), backend (Spring Boot `@Transactional` Services), and database (PostgreSQL) work together seamlessly.

### 0. Beginner's Glossary: What Do All These Words Mean?

Before looking at code, here is what every technical word actually means in plain English:

| Term | Simple Real-World Analogy | What it does in our Project |
| :--- | :--- | :--- |
| **Database (PostgreSQL)** | A giant, super-secure digital filing cabinet on your computer's hard disk. | Keeps all customer accounts, laptops, cart items, and orders permanently saved so they never disappear when you restart the computer. |
| **Table** | A single sheet inside a Microsoft Excel file. | `users` is one table, `products` is another table, and `cart_items` is another table. |
| **Row** | One horizontal line in that Excel sheet. | Each single customer account or each single product is one row. |
| **Column** | The category header at the top of the Excel sheet. | Examples: `email`, `price`, `quantity`, `created_at`. |
| **Primary Key (PK)** | A person's **National Identity Card (NIC) number** or **Passport number**. | A unique ID number (`id`) given to every row. No two users or products can ever have the same Primary Key. |
| **Foreign Key (FK)** | A reference note: *"See Sheet 1, Person #4"*. | Links two tables together. In the `cart_items` table, `user_id = 4` tells PostgreSQL: *"This cart item belongs to customer with ID 4 in the users table"*. |
| **Entity** | A Java blueprint of a database table. | `CartItem.java` is a Java Entity. It tells Spring Boot how to map a Java object to the `cart_items` database table. |
| **SQL** | The language used to give commands to PostgreSQL. | `SELECT` (Find data), `INSERT` (Add new row), `UPDATE` (Change existing row), `DELETE` (Remove row). |
| **Hibernate & JPA** | A translator robot between Java and SQL. | Instead of you manually writing SQL code, Hibernate automatically translates Java code into SQL sentences for PostgreSQL. |
| **Controller** | The **Receptionist** at the front door. | Listens for incoming internet web requests from the browser (e.g., `POST /api/cart`) and routes them to the right place. |
| **Service** | The **Brain** / **Business Logic**. | Decides what to do. (e.g., *"Does this user already have this item in their cart? If yes, make quantity 2. If no, create a new item."*) |
| **Repository** | The **Storekeeper** / **Warehouse Manager**. | Directly talks to the database to fetch, save, or delete rows. |
| **HTTP Request** | An envelope sent from the browser to the backend. | When you click "Add to Cart", the browser sends an HTTP POST request containing `{ productId: 12, quantity: 1 }`. |
| **HTTP Response** | The reply letter sent back to the browser. | The server replies with `200 OK` or `201 Created` along with the updated cart data. |

---

### 1. Database Schema & Entities

Instead of storing transient cart items only in the user's browser, items are persisted in PostgreSQL. This allows users to switch devices, refresh the page, or log in later without losing their cart.

```
┌─────────────────┐             ┌─────────────────────────┐             ┌─────────────────┐
│      users      │             │       cart_items        │             │    products     │
├─────────────────┤             ├─────────────────────────┤             ├─────────────────┤
│ id (PK)         │◄───(1:N)────┤ user_id (FK)            │────(N:1)───►│ id (PK)         │
│ email           │             │ product_id (FK)         │             │ name            │
│ role            │             │ quantity                │             │ price           │
│ ...             │             │ created_at / updated_at │             │ stock           │
└─────────────────┘             └─────────────────────────┘             └─────────────────┘
```

- **`CartItem` Entity (`cart_items` table)**:
  - `user_id`: Foreign key pointing to `users(id)`.
  - `product_id`: Foreign key pointing to `products(id)` with `FetchType.EAGER` so product specs and images are loaded instantly.
  - `quantity`: Integer representing the count.
  - `createdAt` and `updatedAt`: Auto-managed timestamps.

---

### 2. The 7 Core Cart Operations

#### Operation 1: Authentication Guard
- Only logged-in customers can modify a cart.
- Unauthenticated visitors can freely browse `/laptops` and `/computers`.
- Clicking "Add to Cart" or navigating to `/cart` prompts them to sign in (`/login?redirect=/cart`).

#### Operation 2: Add to Cart (`POST /api/cart`)
When a user clicks "Add to Cart":
1. **Frontend**: Calls `cartService.addToCart(productId, quantity)`.
2. **Controller**: `CartController` extracts the logged-in user via `@AuthenticationPrincipal UserDetails userDetails`.
3. **Service (`CartService.addToCart`)**:
   - Executes: `SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?;`
   - **Scenario A (Item already exists in cart)**:
     - Increments quantity: `existing.setQuantity(existing.getQuantity() + request.getQuantity());`
     - Hibernate fires SQL: `UPDATE cart_items SET quantity = ?, updated_at = ? WHERE id = ?;`
   - **Scenario B (New item)**:
     - Creates a new `CartItem` linked to `User` and `Product`.
     - Hibernate fires SQL: `INSERT INTO cart_items (user_id, product_id, quantity, created_at, updated_at) VALUES (?, ?, ?, ?, ?);`

#### Operation 3: Fetching the Cart (`GET /api/cart`)
- Retrieves all items for the authenticated user ordered by `createdAt DESC`.
- Computes `totalPrice = product.price * quantity` dynamically in `CartItemDto`.

#### Operation 4: Quantity Stepper (`PUT /api/cart/{id}`)
- Users can click `+` or `-` in the cart UI.
- If quantity > 0: Updates the database record (`UPDATE cart_items SET quantity = ?`).
- If quantity <= 0: Deletes the record (`DELETE FROM cart_items WHERE id = ?`).

#### Operation 5: Multi-Item Selection & Session Persistence
- Modern shoppers do not always want to check out everything in their cart.
- `CartContext.tsx` maintains a `selectedIds` state array.
- Selection is persisted in the browser's `sessionStorage` (`quantum_selected_cart_keys`).
- Even if the user navigates between `/laptops`, `/cart`, and `/checkout`, their selected items remain preserved.

#### Operation 6: Single & Bulk Deletions
- **Single item**: Clicking the trash icon triggers `DELETE /api/cart/{id}`.
- **Bulk deletion**: Selecting multiple items and clicking "Delete Selected (N)" issues parallel deletions for the selected IDs and syncs the UI instantly.

#### Operation 7: Selective Checkout & Order Creation (`POST /api/orders`)
- Only the **selected** items are sent to checkout (`cartItemIds: [1, 3]`).
- Unselected items remain safely in the user's cart in the database!

---

### 3. The Checkout Transaction Flow & ACID Guarantees

The entire checkout is protected by Spring Boot's `@Transactional` annotation. If any step fails (e.g. payment gateway drops or database network blip), PostgreSQL executes a **`ROLLBACK`**, guaranteeing zero ghost orders and zero double charges.

```
Browser (Next.js Frontend)
   │
   │ 1. POST /api/orders (cartItemIds: [1, 5], shippingAddress, paymentMethod)
   ▼
┌──────────────────┐
│ OrderController  │
└────────┬─────────┘
         │
         │ createOrderFromCart()
         ▼
┌──────────────────┐
│   OrderService   │ ──(Opens PostgreSQL @Transactional Unit of Work)──────┐
└────────┬─────────┘                                                       │
         │                                                                 │
         ├─ Step 1: Filter cart items by cartItemIds ────────► SELECT      │
         │          (Calculates grand total for only chosen items)         │
         │                                                                 │
         ├─ Step 2: Persist Order + OrderItems ──────────────► INSERT      │
         │          (Copies frozen product prices & details)               │
         │                                                                 │
         └─ Step 3: Delete ONLY the ordered items ───────────► DELETE      │
                    cartItemRepository.deleteAll(selectedItems)            │
                    (Unselected items stay in cart!)                       │
                                                                           │
     ┌── If ALL steps succeed ───────────────────────────────► COMMIT  ────┤
     └── If ANY error occurs (e.g. Card decline) ────────────► ROLLBACK ───┘
```

---

### 4. White Background Light Theme Design Decision
- Global `body` background is `#000` (dark mode for showcase landing pages).
- Checkout, Cart, and Orders pages are wrapped in dedicated light-root containers (`.cart-page-white-root`, `.orders-page-white-root`, `.checkout-page-root`).
- Background: `#f8fafc` (subtle off-white for visual depth).
- Cards: `#ffffff` pure white with `1px solid #e2e8f0` borders and soft drop shadows.
- Typography: `#0f172a` (high-contrast dark slate) with `#0284c7` primary accents.
- Benefits: Enhanced readability, high conversion rate, and familiarity resembling world-class e-commerce platforms like Amazon and Apple.
