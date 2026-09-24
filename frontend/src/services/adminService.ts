import api from './api';
import { DashboardStats, Order, Product, ProductFormInput, User } from '../types';

// Every call in this file hits /api/admin/**, which the backend locks behind
// Spring Security's hasRole("ADMIN") check (see SecurityConfig.java). The JWT
// token is attached automatically by the axios interceptor in api.ts, so a
// non-admin token here simply gets a 403 back from the server.
export const adminService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('/admin/stats');
    return response.data;
  },

  // ---- Products ----
  getAllProducts: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/admin/products');
    return response.data;
  },

  createProduct: async (data: ProductFormInput): Promise<Product> => {
    const response = await api.post<Product>('/admin/products', data);
    return response.data;
  },

  updateProduct: async (id: string | number, data: ProductFormInput): Promise<Product> => {
    const response = await api.put<Product>(`/admin/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string | number): Promise<void> => {
    await api.delete(`/admin/products/${id}`);
  },

  // ---- Orders ----
  getAllOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/admin/orders');
    return response.data;
  },

  updateOrderStatus: async (id: string | number, status: Order['status']): Promise<Order> => {
    const response = await api.put<Order>(`/admin/orders/${id}/status`, { status });
    return response.data;
  },

  // ---- Users ----
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/admin/users');
    return response.data;
  }
};
