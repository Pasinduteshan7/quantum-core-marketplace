'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '../../components/ProductCard';
import { productService } from '../../services/productService';
import { Product } from '../../types';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating'>('rating');

  useEffect(() => {
    const doSearch = async () => {
      setLoading(true);
      try {
        const res = await productService.getProducts({
          search: query,
          sort: sortBy
        });
        setProducts(res.products);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };
    doSearch();
  }, [query, sortBy]);

  return (
    <div className="catalog-page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>
          🔍 Search Results for &ldquo;{query}&rdquo;
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="form-control"
            style={{ width: 'auto', padding: '6px 12px' }}
          >
            <option value="rating">Top Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="results-info">
        Found {products.length} matching product{products.length !== 1 ? 's' : ''}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Searching products...</div>
      ) : products.length > 0 ? (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 24px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>No matching products found</h2>
          <p style={{ color: '#64748b', marginTop: '8px' }}>
            Try checking for typos or searching with broader keywords (e.g. &ldquo;MSI&rdquo;, &ldquo;RTX&rdquo;, &ldquo;i9&rdquo;, &ldquo;RAM&rdquo;).
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '40px' }}>Loading search...</div>}>
      <SearchResults />
    </Suspense>
  );
}
