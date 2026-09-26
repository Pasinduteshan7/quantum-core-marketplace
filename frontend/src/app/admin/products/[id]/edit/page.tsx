'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProductForm } from '../../../../../components/admin/ProductForm';
import { adminService } from '../../../../../services/adminService';
import { Product, ProductFormInput } from '../../../../../types';
import toast from 'react-hot-toast';

/**
 * EDIT PRODUCT PAGE
 *
 * When the admin clicks the ✏️ pencil icon on a product row, they land here.
 * The URL is /admin/products/[id]/edit — Next.js extracts the [id] from the URL.
 *
 * DATA FLOW (Loading):
 * 1. useParams() extracts the product ID from the URL (e.g., "5")
 * 2. adminService.getAllProducts() → GET /api/admin/products
 * 3. We find the product with matching ID from the returned list
 * 4. ProductForm is rendered pre-filled with the existing product data
 *    (Item Code field is disabled — it's the permanent SKU identifier)
 *
 * DATA FLOW (Saving):
 * 1. Admin changes a field (e.g., price) and clicks "Save Changes"
 * 2. adminService.updateProduct(id, data) → PUT /api/admin/products/{id}
 * 3. AdminController.updateProduct() → productService.updateProduct(id, updated)
 * 4. SQL: UPDATE products SET name=?, brand=?, price=?, stock=?, ... WHERE id = 5;
 * 5. Returns the updated Product object
 * 6. Router navigates back to /admin/products
 */
export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch the full product list and pick the one matching our URL param.
        // This is fine for a catalog of this size, and it guarantees we're only
        // ever showing data an admin is authorized to see.
        const all = await adminService.getAllProducts();
        const found = all.find((p) => String(p.id) === params.id);
        if (!found) {
          setNotFound(true);
        } else {
          setProduct(found);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
        toast.error('Could not load product');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.id]);

  const handleUpdate = async (data: ProductFormInput) => {
    try {
      await adminService.updateProduct(params.id, data);
      toast.success('Product updated');
      router.push('/admin/products');
    } catch (err: any) {
      console.error('Failed to update product:', err);
      toast.error(err?.response?.data?.error || 'Could not update product');
    }
  };

  if (loading) return <p className="admin-muted">Loading product…</p>;
  if (notFound || !product) return <p className="admin-muted">Product not found.</p>;

  return (
    <div>
      <h1 className="admin-page-title">Edit Product</h1>
      <p className="admin-page-subtitle">{product.name}</p>
      <ProductForm initial={product} onSubmit={handleUpdate} submitLabel="Save Changes" />
    </div>
  );
}
