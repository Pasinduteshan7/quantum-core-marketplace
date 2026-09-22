package com.quantumcore.repository;

import com.quantumcore.entity.CartItem;
import com.quantumcore.entity.Product;
import com.quantumcore.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    /**
     * Used for Cart Page: Fetches all items currently in this user's cart.
     *
     * How it works with PostgreSQL under the hood:
     * - "findBy" + "User" + "OrderByCreatedAtDesc"
     * - Generates SQL: SELECT * FROM cart_items WHERE user_id = ? ORDER BY created_at DESC;
     * - Returns List<CartItem> sorted with newest items at the top.
     */
    List<CartItem> findByUserOrderByCreatedAtDesc(User user);

    /**
     * Used for Add-to-Cart check:
     * Checks if this exact user already has this exact product in their cart.
     *
     * How it works with PostgreSQL under the hood:
     * - "findBy" + "User" + "And" + "Product"
     * - Generates SQL: SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?;
     * - If found: CartService increments quantity (e.g. 1 -> 2).
     * - If not found: CartService creates a new CartItem row.
     *
     * 🛒 CART FLOW STEP 5: This interface is converted to SQL by Hibernate to perform the actual lookup.
     */
    Optional<CartItem> findByUserAndProduct(User user, Product product);

    /**
     * Used for updating or deleting a specific cart item:
     * Ensures user A cannot modify or delete user B's cart item by guessing the ID.
     *
     * Generates SQL: SELECT * FROM cart_items WHERE id = ? AND user_id = ?;
     */
    Optional<CartItem> findByIdAndUser(Long id, User user);

    /**
     * Used at Checkout: Empties the customer's cart after the order is placed.
     *
     * Generates SQL: DELETE FROM cart_items WHERE user_id = ?;
     */
    void deleteByUser(User user);

    /**
     * Used when an Admin deletes a Product: any customer who currently has this
     * product sitting in their cart needs it removed too, otherwise cart_items
     * would point at a product_id that no longer exists (a broken foreign key).
     *
     * Generates SQL: DELETE FROM cart_items WHERE product_id = ?;
     */
    void deleteByProduct(Product product);
}

/* YOUR FULL CART OPERATION FLOW LOOKS LIKE THIS:

Browser (Customer clicks "Add to Cart" on website)
   │
   │ 1. HTTP POST /api/cart  (with productId: 12, quantity: 1)
   ▼
┌──────────────────┐
│  CartController  │  (The Receptionist: receives the web request from the browser)
└────────┬─────────┘
         │
         │ 2. addToCart("customer@quantumcore.com", request)
         ▼
┌──────────────────┐
│   CartService    │  (The Brain: checks rules - is it already in cart?)
└────────┬─────────┘
         │
         │ 3. findByUserAndProduct(user, product)
         ▼
┌────────────────────┐
│ CartItemRepository │  (The Storage Manager: Java interface for the database)
└────────┬───────────┘
         │
         ▼
  Spring Data JPA       (The Robot Helper: writes database code for you)
         │
         ▼
     Hibernate          (The Translator: converts Java into SQL commands)
         │
         │ 4. SQL: SELECT * FROM cart_items WHERE user_id = 4 AND product_id = 12;
         ▼
    PostgreSQL          (The Database: actual hard disk storage on port 5433)

─────────────────────────────────────────────────────────────────────────────
Then PostgreSQL answers back all the way to your screen:

    PostgreSQL          (Finds 0 rows, or returns the existing row)
        ↓
    Hibernate           (Converts database table row into a Java CartItem entity)
        ↓
  Spring Data JPA       (Passes it up)
        ↓
 CartItemRepository     (Returns Optional<CartItem>)
        ↓
   CartService          (Decides: If exists, increment qty. If new, insert new row. Calls save())
        ↓
  CartController        (Packages the result into HTTP 201 Created response)
        ↓
     Browser            (React CartContext updates screen and shows green toast alert!)
*/
