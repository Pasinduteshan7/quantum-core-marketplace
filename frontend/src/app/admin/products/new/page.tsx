'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ProductForm } from '../../../../components/admin/ProductForm';
import { adminService } from '../../../../services/adminService';
import { ProductFormInput } from '../../../../types';
import toast from 'react-hot-toast';

/**
 * ADD NEW PRODUCT PAGE
 *
 * When the admin clicks "Add Product" on the Products table, they land here.
 * This page renders the reusable ProductForm component with empty fields.
 *
 * DATA FLOW:
 * 1. Admin fills out the form fields (itemCode, name, brand, price, etc.)
 * 2. Clicks "Create Product" → handleCreate fires
 * 3. adminService.createProduct(data) → POST /api/admin/products (JSON body)
 * 4. AdminController.createProduct() → productService.createProduct()
 *    → productRepository.save(product)
 * 5. SQL: INSERT INTO products (item_code, name, brand, category, ...) VALUES (?, ?, ?, ...);
 * 6. Returns HTTP 201 Created with the new Product object
 * 7. Router navigates back to /admin/products (the table now shows the new entry)
 */
export default function NewProductPage() {
  const router = useRouter();

  const handleCreate = async (data: ProductFormInput) => {
    try {
      await adminService.createProduct(data);
      toast.success('Product created');
      router.push('/admin/products');
    } catch (err: any) {
      console.error('Failed to create product:', err);
      toast.error(err?.response?.data?.error || 'Could not create product');
    }
  };

  return (
    <div>
      <h1 className="admin-page-title">Add Product</h1>
      <p className="admin-page-subtitle">Add a new item to the catalog.</p>
      <ProductForm onSubmit={handleCreate} submitLabel="Create Product" />
    </div>
  );
}
