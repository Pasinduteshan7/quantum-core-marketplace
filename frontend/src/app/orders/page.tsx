'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { orderService } from '../../services/orderService';
import { Order } from '../../types';
import { formatLKR } from '../../services/cartService';
import { Package, Clock, CheckCircle2, ChevronRight, Truck } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const list = await orderService.getMyOrders();
        setOrders(list);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="cart-page-container" style={{ textAlign: 'center', padding: '60px' }}>
        <h2>Loading your order history...</h2>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="cart-page-container" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div className="cart-card" style={{ padding: '60px 24px' }}>
          <Package size={54} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>No Orders Placed Yet</h2>
          <p style={{ color: '#64748b', margin: '12px auto 24px', maxWidth: '420px' }}>
            When you purchase laptops or components, your tracking details and receipts will appear here.
          </p>
          <Link href="/laptops" className="btn-checkout">
            <span>Browse Products</span>
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <h1 className="page-title">📦 Order History & Tracking</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {orders.map((order) => (
          <div key={order.id} className="form-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order ID</span>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>#{order.id}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Placed on {new Date(order.createdAt).toLocaleDateString()}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 700,
                  background: order.status === 'PENDING' ? '#fef3c7' : '#dcfce7',
                  color: order.status === 'PENDING' ? '#b45309' : '#15803d'
                }}>
                  {order.status === 'PENDING' ? <Clock size={14} /> : <CheckCircle2 size={14} />}
                  <span>{order.status}</span>
                </span>
              </div>
            </div>

            {/* Items in order */}
            <div style={{ marginBottom: '16px' }}>
              {order.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px dashed #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={item.image || '/images/images.jpg'}
                      alt={item.name}
                      style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/images.jpg';
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Qty: {item.quantity} × {formatLKR(item.price)}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>
                    {formatLKR(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer summary */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Truck size={16} />
                <span>Delivering to: {order.shippingAddress.fullName}, {order.shippingAddress.city}</span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px', color: '#64748b', marginRight: '8px' }}>Total Amount:</span>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{formatLKR(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
