'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { formatLKR } from '../../services/cartService';
import toast from 'react-hot-toast';
import { ShieldCheck, Truck, CreditCard, Building2, Banknote } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, grandTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: '',
    email: user?.email || '',
    address: '',
    city: 'Colombo',
    postalCode: '',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'CARD' | 'BANK_TRANSFER'>('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cartItems.length) {
      toast.error('Your cart is empty');
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.address) {
      toast.error('Please fill in all required shipping fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = cartItems.map((it) => ({
        productId: it.productId || it.id || 1,
        itemCode: it.itemCode,
        name: it.name,
        price: it.unitPrice,
        quantity: it.quantity,
        image: it.image
      }));

      const order = await orderService.createOrder({
        items: orderItems,
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          notes: formData.notes
        },
        paymentMethod: paymentMethod,
        totalAmount: grandTotal
      });

      await clearCart();
      toast.success(`Order #${order.id} placed successfully!`);
      router.push(`/orders`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cart-page-container">
      <h1 className="page-title">💳 Secure Checkout</h1>

      <form onSubmit={handleSubmit} className="checkout-grid">
        {/* Left Column: Shipping & Payment */}
        <div>
          <div className="form-card" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={20} color="#ff6b35" />
              <span>1. Delivery Information</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Kasun Perera"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="077 123 4567"
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="kasun@gmail.com"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Street Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="No 12, Galle Road"
                className="form-control"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>City / District *</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="Colombo">Colombo</option>
                  <option value="Gampaha">Gampaha</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Galle">Galle</option>
                  <option value="Kurunegala">Kurunegala</option>
                  <option value="Other">Other District</option>
                </select>
              </div>

              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="00400"
                  className="form-control"
                />
              </div>
            </div>
          </div>

          <div className="form-card">
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={20} color="#ff6b35" />
              <span>2. Payment Method</span>
            </h3>

            <div className="payment-options-grid">
              <div
                className={`payment-option-card ${paymentMethod === 'COD' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('COD')}
              >
                <Banknote size={24} style={{ margin: '0 auto 6px' }} />
                <div>Cash on Delivery</div>
              </div>

              <div
                className={`payment-option-card ${paymentMethod === 'BANK_TRANSFER' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('BANK_TRANSFER')}
              >
                <Building2 size={24} style={{ margin: '0 auto 6px' }} />
                <div>Bank Transfer</div>
              </div>

              <div
                className={`payment-option-card ${paymentMethod === 'CARD' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('CARD')}
              >
                <CreditCard size={24} style={{ margin: '0 auto 6px' }} />
                <div>Credit Card</div>
              </div>
            </div>

            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '12px' }}>
              {paymentMethod === 'COD' && '✓ Pay in cash to courier rider upon parcel delivery.'}
              {paymentMethod === 'BANK_TRANSFER' && '✓ Deposit to Commercial Bank / HNB with Order ID as reference.'}
              {paymentMethod === 'CARD' && '✓ Visa / Mastercard 128-bit encrypted gateway simulation.'}
            </p>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div>
          <div className="form-card" style={{ position: 'sticky', top: '120px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Order Summary</h3>

            <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              {cartItems.map((item) => (
                <div key={item.itemCode} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '13px' }}>
                  <div style={{ maxWidth: '65%' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.name}</div>
                    <div style={{ color: '#64748b', fontSize: '11px' }}>Qty: {item.quantity} × {item.unitPriceFormatted}</div>
                  </div>
                  <div style={{ fontWeight: 700 }}>{item.totalPriceFormatted}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
              <span style={{ color: '#64748b' }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>{formatLKR(grandTotal)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px' }}>
              <span style={{ color: '#64748b' }}>Island-wide Courier</span>
              <span style={{ fontWeight: 600, color: '#16a34a' }}>FREE (Promo)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', paddingTop: '12px', borderTop: '2px solid #e2e8f0' }}>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>Total Amount</span>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{formatLKR(grandTotal)}</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !cartItems.length}
              className="btn-primary-block"
              style={{ padding: '14px', fontSize: '16px' }}
            >
              {isSubmitting ? 'Processing Order...' : 'Confirm & Place Order'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px', color: '#64748b', fontSize: '12px' }}>
              <ShieldCheck size={16} color="#16a34a" />
              <span>100% Genuine Official Warranty Guaranteed</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
