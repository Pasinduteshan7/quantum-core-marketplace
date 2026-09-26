'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { formatLKR } from '../../services/cartService';
import { DashboardStats } from '../../types';
import { Wallet, ShoppingBag, Clock, Package, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminService.getStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
        toast.error('Could not load dashboard stats. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cards = [
    { label: 'Total Revenue', value: stats ? formatLKR(stats.totalRevenue) : '—', icon: Wallet, accent: '#e40505a6' },
    { label: 'Total Orders', value: stats?.totalOrders ?? '—', icon: ShoppingBag, accent: '#3b82f6' },
    { label: 'Pending Orders', value: stats?.pendingOrders ?? '—', icon: Clock, accent: '#f59e0b' },
    { label: 'Products', value: stats?.totalProducts ?? '—', icon: Package, accent: '#10b981' },
    { label: 'Registered Users', value: stats?.totalUsers ?? '—', icon: Users, accent: '#a855f7' }
  ];

  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>
      <p className="admin-page-subtitle">A quick overview of how the store is doing.</p>

      {loading ? (
        <p className="admin-muted">Loading stats from PostgreSQL…</p>
      ) : (
        <>
          <div className="admin-stat-grid">
            {cards.map(({ label, value, icon: Icon, accent }) => (
              <div className="admin-stat-card" key={label}>
                <div className="admin-stat-icon" style={{ background: `${accent}22`, color: accent }}>
                  <Icon size={22} />
                </div>
                <div>
                  <p className="admin-stat-value">{value}</p>
                  <p className="admin-stat-label">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions Bar */}
          <div style={{ marginTop: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '14px', color: '#e2e8f0' }}>
              Quick Management Actions
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <a
                href="/admin/products"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: '#121316',
                  borderRadius: '8px',
                  border: '1px solid #22252a',
                  color: '#fff',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ padding: '8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                  <Package size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>Inventory Management</div>
                  <div style={{ color: '#94a3b8', fontSize: '12px' }}>View, edit & delete products in DB</div>
                </div>
              </a>

              <a
                href="/admin/products/new"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: '#121316',
                  borderRadius: '8px',
                  border: '1px solid #22252a',
                  color: '#fff',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ padding: '8px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                  <Package size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>+ Add New Product</div>
                  <div style={{ color: '#94a3b8', fontSize: '12px' }}>Insert into PostgreSQL catalog</div>
                </div>
              </a>

              <a
                href="/admin/orders"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: '#121316',
                  borderRadius: '8px',
                  border: '1px solid #22252a',
                  color: '#fff',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ padding: '8px', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>Customer Orders</div>
                  <div style={{ color: '#94a3b8', fontSize: '12px' }}>Update shipping & order status</div>
                </div>
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
