'use client';

import React from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { formatLKR } from '../services/cartService';
import { ShoppingCart, Star, MessageSquare } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="product-card-root">
      {product.discount && <span className="badge-discount">{product.discount}</span>}
      {product.badge && <span className="badge-flag">{product.badge}</span>}

      <div className="product-image-container">
        <img
          src={product.image || '/images/images.jpg'}
          alt={product.name}
          className="product-card-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/images.jpg';
          }}
        />
      </div>

      <div className="product-card-body">
        <div className="product-brand-row">
          <span className="brand-tag">{product.brand}</span>
          {product.rating && (
            <span className="rating-tag">
              <Star size={13} fill="#fbbf24" stroke="#fbbf24" />
              <span>{product.rating}</span>
            </span>
          )}
        </div>

        <h3 className="product-card-name" title={product.name}>
          {product.name}
        </h3>

        {product.specs && <p className="product-card-specs">{product.specs}</p>}

        <div className="product-card-pricing">
          {product.originalPrice && (
            <span className="price-original">{formatLKR(product.originalPrice)}</span>
          )}
          <span className="price-current">{formatLKR(product.price)}</span>
        </div>

        <div className="product-item-code">Item Code: {product.itemCode}</div>
      </div>

      <div className="product-card-footer" style={{ display: 'flex', gap: '0.5rem' }}>
        {/* 🛒 CART FLOW STEP 1: User clicks Add to Cart. We call the CartContext which calls cartService.ts */}
        <button
          onClick={() => addToCart(product)}
          className="add-to-cart-btn"
          style={{ flex: 1 }}
        >
          <ShoppingCart size={16} />
          <span>Add to Cart</span>
        </button>

        {/* 💬 INQUIRY FLOW: Opens the live chat with this specific product attached */}
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('open-store-chat', { detail: product }));
            }
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '10px 14px',
            borderRadius: '6px',
            border: '1px solid #334155',
            background: '#1e293b',
            color: '#38bdf8',
            fontWeight: 600,
            fontSize: '12px',
            cursor: 'pointer'
          }}
          title="Ask store owner about this product"
          aria-label="Ask about product"
        >
          <MessageSquare size={15} />
          <span>Ask</span>
        </button>
      </div>
    </div>
  );
};
