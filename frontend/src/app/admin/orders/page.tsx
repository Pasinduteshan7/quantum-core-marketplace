'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '../../../services/adminService';
import { formatLKR } from '../../../services/cartService';
import { Order } from '../../../types';
import { ClipboardX } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * ADMIN ORDERS PAGE
 *
 * This is the "order fulfillment queue" — the admin sees EVERY order from
 * EVERY customer, sorted newest first, with a live status dropdown per row.
 *
 * This is how real stores like Shopify/Amazon Seller Central work:
 * - New orders come in as "PENDING"
 * - Admin reviews payment → marks as "PROCESSING"
 * - Warehouse ships it → marks as "SHIPPED"
 * - Customer receives it → marks as "DELIVERED"
 * - If something goes wrong → marks as "CANCELLED"
 *
 * DATA FLOW (Loading):
 * 1. adminService.getAllOrders() → GET /api/admin/orders
 * 2. AdminController.getAllOrders() → orderService.getAllOrdersAdmin()
 * 3. SQL: SELECT * FROM orders ORDER BY created_at DESC;
 * 4. Each Order is enriched with customerName/customerEmail via mapToAdminDto()
 *    (Regular customers viewing their own orders don't need this — they already
 *    know who they are. But admins looking at ALL orders need to see who placed each one.)
 *
 * STATUS CHANGE FLOW (when admin selects a new status from dropdown):
 * 1. adminService.updateOrderStatus(id, "SHIPPED") → PUT /api/admin/orders/{id}/status
 * 2. AdminController.updateOrderStatus() → orderService.updateOrderStatus(id, "SHIPPED")
 * 3. Validates against VALID_STATUSES: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]
 *    If invalid → throws IllegalArgumentException → HTTP 400 Bad Request
 * 4. SQL: UPDATE orders SET status = 'SHIPPED' WHERE id = ?;
 * 5. Returns updated OrderDto → local state updates → UI reflects new status color
 */

const STATUS_OPTIONS: Order['status'][] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

// Each status gets a CSS class that controls the dropdown's text color
const STATUS_CLASS: Record<Order['status'], string> = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
      toast.error('Could not load orders. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (order: Order, newStatus: Order['status']) => {
    if (newStatus === order.status) return;
    setUpdatingId(order.id);
    try {
      const updated = await adminService.updateOrderStatus(order.id, newStatus);
      // Update just this one order in local state (no full re-fetch needed)
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: updated.status } : o)));
      toast.success(`Order #${order.id} marked as ${newStatus}`);
    } catch (err: any) {
      console.error('Failed to update order status:', err);
      toast.error(err?.response?.data?.error || 'Could not update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h1 className="admin-page-title">Orders</h1>
      <p className="admin-page-subtitle">{orders.length} order{orders.length === 1 ? '' : 's'} across all customers</p>

      {loading ? (
        <p className="admin-muted">Loading orders…</p>
      ) : orders.length === 0 ? (
        <div className="admin-empty-state">
          <ClipboardX size={32} />
          <p>No orders have been placed yet.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Placed</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="admin-mono">#{order.id}</td>
                  <td>
                    <span className="admin-table-name">{order.customerName || order.shippingAddress?.fullName}</span>
                    <span className="admin-table-brand">{order.customerEmail}</span>
                  </td>
                  <td>{order.items.length} item{order.items.length === 1 ? '' : 's'}</td>
                  <td>{order.paymentMethod}</td>
                  <td>{formatLKR(order.totalAmount)}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select
                      className={`admin-status-select ${STATUS_CLASS[order.status]}`}
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) => handleStatusChange(order, e.target.value as Order['status'])}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
