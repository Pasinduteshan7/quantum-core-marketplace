'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductFormInput, Product } from '../../types';
import { Save } from 'lucide-react';

interface ProductFormProps {
  initial?: Product;
  onSubmit: (data: ProductFormInput) => Promise<void>;
  submitLabel: string;
}

const EMPTY_FORM: ProductFormInput = {
  itemCode: '',
  name: '',
  brand: '',
  category: 'Laptops',
  subCategory: '',
  price: 0,
  originalPrice: undefined,
  discount: '',
  specs: '',
  image: '',
  description: '',
  stock: 10,
  badge: ''
};

export const ProductForm = ({ initial, onSubmit, submitLabel }: ProductFormProps) => {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormInput>(
    initial
      ? {
          itemCode: initial.itemCode,
          name: initial.name,
          brand: initial.brand,
          category: initial.category,
          subCategory: initial.subCategory || '',
          price: initial.price,
          originalPrice: initial.originalPrice,
          discount: initial.discount || '',
          specs: initial.specs || '',
          image: initial.image,
          description: initial.description || '',
          stock: initial.stock ?? 10,
          badge: initial.badge || ''
        }
      : EMPTY_FORM
  );
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const isNumberField = name === 'price' || name === 'originalPrice' || name === 'stock';
    setForm((prev) => ({
      ...prev,
      [name]: isNumberField ? (value === '' ? undefined : Number(value)) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form-grid">
        <label className="admin-field">
          <span>Item Code *</span>
          <input
            name="itemCode"
            value={form.itemCode}
            onChange={handleChange}
            required
            disabled={!!initial}
            placeholder="e.g. MSI-GE78"
          />
          {initial && <small className="admin-field-hint">Item code can't be changed after creation.</small>}
        </label>

        <label className="admin-field">
          <span>Name *</span>
          <input name="name" value={form.name} onChange={handleChange} required placeholder="Product name" />
        </label>

        <label className="admin-field">
          <span>Brand *</span>
          <input name="brand" value={form.brand} onChange={handleChange} required placeholder="e.g. MSI" />
        </label>

        <label className="admin-field">
          <span>Category *</span>
          <input name="category" value={form.category} onChange={handleChange} required placeholder="e.g. Laptops" />
        </label>

        <label className="admin-field">
          <span>Sub-category</span>
          <input
            name="subCategory"
            value={form.subCategory}
            onChange={handleChange}
            placeholder="e.g. Gaming Laptops"
          />
        </label>

        <label className="admin-field">
          <span>Badge</span>
          <input name="badge" value={form.badge} onChange={handleChange} placeholder="e.g. NEW, SALE, HOT" />
        </label>

        <label className="admin-field">
          <span>Price (LKR) *</span>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            min={0}
            step="0.01"
          />
        </label>

        <label className="admin-field">
          <span>Original Price (LKR)</span>
          <input
            type="number"
            name="originalPrice"
            value={form.originalPrice ?? ''}
            onChange={handleChange}
            min={0}
            step="0.01"
          />
        </label>

        <label className="admin-field">
          <span>Discount label</span>
          <input name="discount" value={form.discount} onChange={handleChange} placeholder="e.g. 11% OFF" />
        </label>

        <label className="admin-field">
          <span>Stock *</span>
          <input type="number" name="stock" value={form.stock ?? 0} onChange={handleChange} required min={0} />
        </label>

        <label className="admin-field admin-field-full">
          <span>Image URL *</span>
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            required
            placeholder="/images/example.jpg"
          />
        </label>

        <label className="admin-field admin-field-full">
          <span>Specs</span>
          <textarea name="specs" value={form.specs} onChange={handleChange} rows={2} placeholder="Key specs, comma separated" />
        </label>

        <label className="admin-field admin-field-full">
          <span>Description</span>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
        </label>
      </div>

      <div className="admin-form-actions">
        <button type="button" className="admin-btn-secondary" onClick={() => router.back()}>
          Cancel
        </button>
        <button type="submit" className="admin-btn-primary" disabled={submitting}>
          <Save size={18} />
          <span>{submitting ? 'Saving…' : submitLabel}</span>
        </button>
      </div>
    </form>
  );
};
