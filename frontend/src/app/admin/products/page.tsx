'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminService } from '../../../services/adminService';
import { formatLKR } from '../../../services/cartService';
import { Product } from '../../../types';
import { Plus, Pencil, Trash2, PackageX, Search } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * ADMIN PRODUCTS PAGE
 *
 * This page is the "inventory control center" of the admin panel.
 * It fetches ALL products from PostgreSQL database (Laptops, Desktops, Accessories)
 * and displays them in a table with search, category filtering, Edit and Delete actions.
 */
export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
      toast.error('Could not load products. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(`Delete "${product.name}"? This cannot be undone.`);
    if (!confirmed) return;

    setDeletingId(product.id);
    try {
      await adminService.deleteProduct(product.id);
      // Remove from local state immediately so the UI updates without re-fetching
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      toast.success('Product deleted');
    } catch (err) {
      console.error('Failed to delete product:', err);
      toast.error('Could not delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      categoryFilter === 'All' ||
      p.category.toLowerCase() === categoryFilter.toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.itemCode.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products & Inventory</h1>
          <p className="admin-page-subtitle">
            {filteredProducts.length} of {products.length} product{products.length === 1 ? '' : 's'} displayed from PostgreSQL database
          </p>
        </div>
        <Link href="/admin/products/new" className="admin-btn-primary">
          <Plus size={18} />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search by product name, SKU / item code, brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-input"
            style={{ paddingLeft: '36px', width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['All', 'Laptops', 'Computers', 'Accessories'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 500,
                border: '1px solid ' + (categoryFilter === cat ? '#dc2626' : '#27272a'),
                background: categoryFilter === cat ? 'rgba(220, 38, 38, 0.15)' : '#18181b',
                color: categoryFilter === cat ? '#ff6b6b' : '#94a3b8',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="admin-muted">Loading products from PostgreSQL…</p>
      ) : filteredProducts.length === 0 ? (
        <div className="admin-empty-state">
          <PackageX size={32} />
          <p>No products match your search or filter.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Item Code (SKU)</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img src={product.image} alt={product.name} className="admin-table-thumb" />
                  </td>
                  <td>
                    <span className="admin-table-name">{product.name}</span>
                    <span className="admin-table-brand">{product.brand}</span>
                  </td>
                  <td className="admin-mono">{product.itemCode}</td>
                  <td>{product.category}{product.subCategory ? ` / ${product.subCategory}` : ''}</td>
                  <td>{formatLKR(product.price)}</td>
                  <td>
                    <span className={`admin-stock-pill${(product.stock ?? 0) <= 3 ? ' low' : ''}`}>
                      {product.stock ?? 0}
                    </span>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <Link href={`/admin/products/${product.id}/edit`} className="admin-icon-btn" title="Edit">
                        <Pencil size={16} />
                      </Link>
                      <button
                        className="admin-icon-btn danger"
                        title="Delete"
                        disabled={deletingId === product.id}
                        onClick={() => handleDelete(product)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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
