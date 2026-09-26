'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { BackendSwitcher } from './BackendSwitcher';
import { Search, MessageSquare } from 'lucide-react';

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (path: string) => pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Isolate Admin pages: Never show customer shopping header (Cart, Banners, Search) inside /admin
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="header">
      {/* Backend Switcher on top right */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 20px' }}>
        <BackendSwitcher />
      </div>

      {/* Center Logo */}
      <div className="center">
        <Link href="/">
          <img
            src="/images/Copilot_20250809_204113.png"
            alt="Quantum Core Logo"
            className="logo"
            style={{ height: '200px', width: 'auto' }}
          />
        </Link>
      </div>

      {/* Top Banner Row */}
      <div className="top-row">
        <div className="left">
          <img
            src="/images/contact-info.png"
            alt="Online Store"
            className="contact-info-img"
          />
        </div>

        {/* Live Search Bar */}
        <div className="header-search-bar">
          <form onSubmit={handleSearch} className="header-search-form">
            <input
              type="text"
              placeholder="Search MSI, ASUS, RTX 4090, RAM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="header-search-input"
            />
            <button type="submit" className="header-search-btn" title="Search">
              <Search size={14} />
            </button>
          </form>
        </div>

        <div className="right">
          <img
            src="/images/follow-us.png"
            alt="Follow Us"
            className="follow-us-img"
          />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="footer-links">
        {isAdmin ? (
          /* Dedicated navigation for Admin: Clean, zero customer shopping clutter */
          <>
            <Link 
              href="/admin" 
              className={pathname.startsWith('/admin') ? 'active-footer' : ''} 
              style={{ color: '#ef4444', fontWeight: 'bold', letterSpacing: '0.05em' }}
            >
              ADMIN PANEL
            </Link>
            <button onClick={logout} style={{ color: '#fc8181', cursor: 'pointer' }}>
              LOGOUT ({user?.name})
            </button>
          </>
        ) : (
          /* Customer Navigation */
          <>
            <Link href="/" className={isActive('/') ? 'active-footer' : ''}>
              HOME
            </Link>
            <Link href="/laptops" className={isActive('/laptops') ? 'active-footer' : ''}>
              LAPTOP & ACCESSORIES
            </Link>
            <Link href="/computers" className={isActive('/computers') ? 'active-footer' : ''}>
              DESKTOP & ACCESSORIES
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/orders" className={isActive('/orders') ? 'active-footer' : ''}>
                  MY ORDERS
                </Link>
                <button onClick={logout} style={{ color: '#fc8181', cursor: 'pointer' }}>
                  LOGOUT ({user?.name})
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className={isActive('/login') || isActive('/register') ? 'active-footer' : ''}
              >
                LOGIN/REGISTER
              </Link>
            )}
            <Link href="/cart" className={isActive('/cart') ? 'active-footer' : ''}>
              MY CART {totalCount > 0 && <span className="cart-badge-pill">({totalCount})</span>}
            </Link>

            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-store-chat', { detail: null }));
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '11px',
                padding: '6px 14px',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.05em',
                boxShadow: '0 2px 10px rgba(6, 182, 212, 0.4)',
                marginLeft: '8px'
              }}
              title="Chat with Store Owner"
            >
              <MessageSquare size={13} />
              <span>ASK SELLER</span>
            </button>
          </>
        )}
      </nav>
    </header>
  );
};
