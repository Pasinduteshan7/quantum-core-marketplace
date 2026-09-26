'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  ClipboardList, 
  MessageSquare,
  ArrowLeft, 
  ExternalLink, 
  ShieldCheck, 
  LogOut 
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products & Inventory', icon: Package, exact: true },
  { href: '/admin/products/new', label: 'Add New Product', icon: PlusCircle, exact: true },
  { href: '/admin/orders', label: 'Customer Orders', icon: ClipboardList, exact: false },
  { href: '/admin/inquiries', label: 'Customer Inquiries (Live)', icon: MessageSquare, exact: false }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isAdmin, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Client-side gate: this alone does NOT make the admin API endpoints secure —
  // that protection lives in Spring Security (SecurityConfig.java, hasRole("ADMIN")).
  // This just keeps a non-admin from seeing the admin screens or getting confusing
  // 403 errors flashed at them.
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace('/login?redirect=/admin');
      return;
    }
    if (!isAdmin) {
      router.replace('/');
    }
  }, [loading, isAuthenticated, isAdmin, router]);

  if (loading || !isAuthenticated || !isAdmin) {
    return (
      <div className="admin-gate">
        <p>Checking admin authorization…</p>
      </div>
    );
  }

  return (
    <div className="admin-root">
      {/* Dedicated Admin Topbar - Zero customer shopping clutter */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <Link href="/admin" className="admin-brand">
            <span className="admin-brand-title">QUANTUM CORE</span>
            <span className="admin-brand-badge">ADMIN CONSOLE</span>
          </Link>
          <div className="admin-status-indicator">
            <span className="admin-status-dot"></span>
            <span>Spring Boot API Connected</span>
          </div>
        </div>

        <div className="admin-topbar-right">
          <Link href="/" target="_blank" className="admin-topbar-link" title="Open customer store in new tab">
            <ExternalLink size={14} />
            <span>Storefront ↗</span>
          </Link>

          <div className="admin-user-pill">
            <ShieldCheck size={15} color="#ef4444" />
            <span className="admin-user-name">{user?.name || 'Admin'}</span>
            <span className="admin-role-tag">ADMIN</span>
          </div>

          <button onClick={logout} className="admin-logout-btn" title="Sign out of admin console">
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Admin Shell: Sidebar + Content */}
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-section-title">MANAGEMENT</div>

          <nav className="admin-nav">
            {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href);
              return (
                <Link key={href} href={href} className={`admin-nav-link${active ? ' active' : ''}`}>
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="admin-sidebar-footer">
            <Link href="/" className="admin-back-link">
              <ArrowLeft size={16} />
              <span>Back to Customer Store</span>
            </Link>
          </div>
        </aside>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
