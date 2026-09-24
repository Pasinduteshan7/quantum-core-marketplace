import api from './api';
import { CartItem } from '../types';

export const formatLKR = (amount: number): string => {
  return 'LKR ' + Number(amount || 0).toLocaleString();
};

export const cartService = {
  getCart: async (): Promise<CartItem[]> => {
    // Only fetch cart if the user has an authentication token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('quantum_token');
      // Clean up legacy guest cart storage
      localStorage.removeItem('quantum_cart');
      if (!token) {
        return [];
      }
    }

    try {
      const response = await api.get<CartItem[]>('/cart');
      return response.data.map((it) => ({
        ...it,
        totalPrice: it.totalPrice || it.unitPrice * it.quantity,
        unitPriceFormatted: it.unitPriceFormatted || formatLKR(it.unitPrice),
        totalPriceFormatted: it.totalPriceFormatted || formatLKR(it.totalPrice || it.unitPrice * it.quantity)
      }));
    } catch (error) {
      console.warn('Could not fetch cart from server:', error);
      return [];
    }
  },

  addToCart: async (product: {
    id?: string | number;
    productId?: string | number;
    itemCode: string;
    name: string;
    price: number | string;
    image?: string;
  }): Promise<CartItem[]> => {
    // Check if user is authenticated
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('quantum_token');
      if (!token) {
        throw new Error('AUTH_REQUIRED');
      }
    }

    const rawPrice =
      typeof product.price === 'number'
        ? product.price
        : Number(String(product.price).replace(/[^0-9]/g, '') || 0);

    const payload = {
      productId: product.productId || product.id,
      itemCode: product.itemCode,
      name: product.name,
      price: rawPrice,
      unitPrice: rawPrice,
      quantity: 1,
      image: product.image
    };

    // 🛒 CART FLOW STEP 2: Axios intercepts this and routes it over the network to http://localhost:8080/api/cart
    // Send directly to Spring Boot backend - no offline/guest fallback
    await api.post('/cart', payload);
    return await cartService.getCart();
  },

  updateQuantity: async (itemId: string, newQty: number): Promise<CartItem[]> => {
    if (newQty < 1) {
      return cartService.removeFromCart(itemId);
    }
    await api.put(`/cart/${itemId}`, { quantity: newQty });
    return await cartService.getCart();
  },

  removeFromCart: async (itemId: string): Promise<CartItem[]> => {
    await api.delete(`/cart/${itemId}`);
    return await cartService.getCart();
  },

  clearCart: async (): Promise<void> => {
    try {
      await api.delete('/cart');
    } catch {
      // Ignored if cart is already empty
    }
  }
};
