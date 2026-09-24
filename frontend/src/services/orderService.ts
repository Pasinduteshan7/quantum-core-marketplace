import api from './api';
import { Order, OrderItem, ShippingAddress } from '../types';

export const orderService = {
  createOrder: async (data: {
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: 'COD' | 'CARD' | 'BANK_TRANSFER';
    totalAmount: number;
    cartItemIds?: (number | string)[];
  }): Promise<Order> => {
    try {
      const payload: any = {
        items: data.items,
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod,
        totalAmount: data.totalAmount
      };
      if (data.cartItemIds && data.cartItemIds.length > 0) {
        payload.cartItemIds = data.cartItemIds.map(Number).filter((n) => !isNaN(n));
      }
      
      // 📦 ORDER FLOW STEP 2: Axios fires the HTTP POST request over the network to port 8080.
      const response = await api.post<Order>('/orders', payload);
      return response.data;
    } catch {
      // Local fallback for offline/demo ordering
      const newOrder: Order = {
        id: 'QC-ORD-' + Math.floor(100000 + Math.random() * 900000),
        items: data.items,
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod,
        totalAmount: data.totalAmount,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      };

      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('quantum_orders');
        const list: Order[] = stored ? JSON.parse(stored) : [];
        list.unshift(newOrder);
        localStorage.setItem('quantum_orders', JSON.stringify(list));
      }
      return newOrder;
    }
  },

  getMyOrders: async (): Promise<Order[]> => {
    try {
      const response = await api.get<Order[]>('/orders');
      return response.data;
    } catch {
      if (typeof window === 'undefined') return [];
      const stored = localStorage.getItem('quantum_orders');
      return stored ? JSON.parse(stored) : [];
    }
  },

  getOrderById: async (id: string | number): Promise<Order | null> => {
    try {
      const response = await api.get<Order>(`/orders/${id}`);
      return response.data;
    } catch {
      if (typeof window === 'undefined') return null;
      const stored = localStorage.getItem('quantum_orders');
      const list: Order[] = stored ? JSON.parse(stored) : [];
      return list.find((o) => String(o.id) === String(id)) || null;
    }
  }
};
