'use client';

import React from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

const Cart = () => {
  const { cartItems, loading, removeFromCart, updateQuantity, grandTotal } = useCart();

  if (loading) return <p className="cart-empty-message">Loading cart...</p>;
  if (!cartItems.length) return <p className="cart-empty-message">Your cart is empty.</p>;

  return (
    <div className="cart-page">
      <h1 className="cart-title">My Cart</h1>
      <table className="cart-table">
        <thead>
          <tr className="cart-table-header">
            <th className="cart-table-cell">Item Code</th>
            <th className="cart-table-cell">Product Name</th>
            <th className="cart-table-cell">Quantity</th>
            <th className="cart-table-cell">Price</th>
            <th className="cart-table-cell">Total Price</th>
            <th className="cart-table-cell">Remove</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => {
            const itemId = (item._id || item.id || item.itemCode) as string;
            return (
              <tr key={itemId} className="cart-item-row">
                <td className="cart-item-cell item-code">{item.itemCode}</td>
                <td className="cart-item-cell item-name">
                  {item.image ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <img src={item.image} alt={item.name} style={{ width: 40, height: 40, objectFit: "contain", borderRadius: 6 }} />
                      {item.name}
                    </span>
                  ) : (
                    item.name
                  )}
                </td>
                <td className="cart-item-cell item-quantity">
                  <button
                    onClick={() => updateQuantity(itemId, item.quantity - 1)}
                    className="quantity-btn minus-btn"
                  >
                    −
                  </button>
                  <span style={{ margin: "0 8px", fontWeight: 700 }}>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(itemId, item.quantity + 1)}
                    className="quantity-btn plus-btn"
                  >
                    +
                  </button>
                </td>
                <td className="cart-item-cell item-price">{item.unitPriceFormatted}</td>
                <td className="cart-item-cell item-total-price">{item.totalPriceFormatted}</td>
                <td className="cart-item-cell item-remove">
                  <button onClick={() => removeFromCart(itemId)} className="remove-btn">
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
          <tr>
            <td colSpan={4} className="cart-item-cell" style={{ textAlign: "right", fontWeight: 700 }}>
              Grand Total
            </td>
            <td className="cart-item-cell item-total-price" style={{ fontWeight: 700 }}>
              LKR {grandTotal.toLocaleString()}
            </td>
            <td />
          </tr>
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
        <Link href="/checkout" className="btn-primary" style={{ display: "inline-block", textDecoration: "none" }}>
          Proceed to Checkout →
        </Link>
      </div>
    </div>
  );
};

export default Cart;
