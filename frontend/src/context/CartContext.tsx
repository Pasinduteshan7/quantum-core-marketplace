'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CartItem, Product } from '../types';
import { cartService, formatLKR } from '../services/cartService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

export const getItemKey = (it: CartItem): string => String(it.id ?? it._id ?? it.itemCode);

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  totalCount: number;
  grandTotal: number;
  formattedGrandTotal: string;
  // Selection
  selectedIds: string[];
  toggleSelect: (itemId: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  isItemSelected: (itemId: string) => boolean;
  selectedItems: CartItem[];
  selectedTotalCount: number;
  selectedGrandTotal: number;
  formattedSelectedGrandTotal: string;
  // Operations
  addToCart: (product: Product | any) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  deleteSelected: () => Promise<void>;
  removePurchasedItems: (purchasedKeys: string[]) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('quantum_selected_cart_keys');
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return [];
  });
  const [loading, setLoading] = useState<boolean>(true);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const updateSelection = (ids: string[]) => {
    setSelectedIds(ids);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('quantum_selected_cart_keys', JSON.stringify(ids));
    }
  };

  const syncSelection = (items: CartItem[]) => {
    const itemKeys = items.map(getItemKey);
    let current: string[] = selectedIds;
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('quantum_selected_cart_keys');
        if (stored !== null) {
          current = JSON.parse(stored);
        } else {
          current = itemKeys; // Initial load: default select all
          sessionStorage.setItem('quantum_selected_cart_keys', JSON.stringify(itemKeys));
        }
      } catch {}
    }
    const valid = current.filter((k) => itemKeys.includes(k));
    setSelectedIds(valid);
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const items = await cartService.getCart();
      setCartItems(items);
      syncSelection(items);
    } catch (e) {
      console.error('Error fetching cart:', e);
      setCartItems([]);
      setSelectedIds([]);
    } finally {
      setLoading(false);
    }
  };

  // Synchronize cart with authentication status
  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated) {
        fetchCart();
      } else {
        setCartItems([]);
        setSelectedIds([]);
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('quantum_selected_cart_keys');
        }
        setLoading(false);
      }
    }
  }, [isAuthenticated, authLoading]);

  // Selection handlers
  const toggleSelect = (key: string) => {
    const next = selectedIds.includes(key)
      ? selectedIds.filter((id) => id !== key)
      : [...selectedIds, key];
    updateSelection(next);
  };

  const selectAll = () => {
    const allKeys = cartItems.map(getItemKey);
    updateSelection(allKeys);
  };

  const deselectAll = () => {
    updateSelection([]);
  };

  const isItemSelected = (key: string) => selectedIds.includes(key);

  const selectedItems = useMemo(() => {
    return cartItems.filter((it) => selectedIds.includes(getItemKey(it)));
  }, [cartItems, selectedIds]);

  const selectedTotalCount = useMemo(() => {
    return selectedItems.reduce((sum, it) => sum + (it.quantity || 0), 0);
  }, [selectedItems]);

  const selectedGrandTotal = useMemo(() => {
    return selectedItems.reduce(
      (sum, it) => sum + (it.totalPrice || it.unitPrice * it.quantity || 0),
      0
    );
  }, [selectedItems]);

  const addToCart = async (product: Product | any) => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to your cart!', {
        icon: '🔒',
        duration: 3500
      });
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname + window.location.search;
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      }
      return;
    }

    try {
      const items = await cartService.addToCart(product);
      setCartItems(items);
      syncSelection(items);
      toast.success(`Added ${product.name} to cart!`);
    } catch (err: any) {
      if (err.message === 'AUTH_REQUIRED' || err?.response?.status === 401 || err?.response?.status === 403) {
        toast.error('Please log in to add items to your cart!', { icon: '🔒' });
        router.push('/login');
      } else {
        toast.error('Failed to add item to cart');
      }
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!isAuthenticated) return;
    try {
      const items = await cartService.updateQuantity(itemId, quantity);
      setCartItems(items);
    } catch {
      toast.error('Failed to update quantity');
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!isAuthenticated) return;
    try {
      const items = await cartService.removeFromCart(itemId);
      setCartItems(items);
      setSelectedIds((prev) => prev.filter((id) => id !== itemId));
      toast.success('Item removed from cart');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  // Bulk Delete Selected Items
  const deleteSelected = async () => {
    if (!isAuthenticated || selectedIds.length === 0) return;

    const count = selectedIds.length;
    try {
      // Delete each selected item concurrently
      await Promise.all(
        selectedIds.map(async (key) => {
          try {
            await cartService.removeFromCart(key);
          } catch (e) {
            console.warn(`Failed to delete item ${key}`, e);
          }
        })
      );
      const items = await cartService.getCart();
      setCartItems(items);
      setSelectedIds([]);
      toast.success(`Removed ${count} item${count > 1 ? 's' : ''} from cart`);
    } catch {
      toast.error('Failed to remove selected items');
    }
  };

  // Removes only purchased items upon checkout completion
  const removePurchasedItems = async (purchasedKeys: string[]) => {
    if (!purchasedKeys.length) return;
    await Promise.all(
      purchasedKeys.map(async (key) => {
        try {
          await cartService.removeFromCart(key);
        } catch (e) {
          console.warn(`Failed to remove purchased item ${key}`, e);
        }
      })
    );
    const items = await cartService.getCart();
    setCartItems(items);
    setSelectedIds((prev) => prev.filter((k) => !purchasedKeys.includes(k)));
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;
    await cartService.clearCart();
    setCartItems([]);
    setSelectedIds([]);
  };

  const totalCount = cartItems.reduce((sum, it) => sum + (it.quantity || 0), 0);
  const grandTotal = cartItems.reduce(
    (sum, it) => sum + (it.totalPrice || it.unitPrice * it.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        totalCount,
        grandTotal,
        formattedGrandTotal: formatLKR(grandTotal),
        selectedIds,
        toggleSelect,
        selectAll,
        deselectAll,
        isItemSelected,
        selectedItems,
        selectedTotalCount,
        selectedGrandTotal,
        formattedSelectedGrandTotal: formatLKR(selectedGrandTotal),
        addToCart,
        updateQuantity,
        removeFromCart,
        deleteSelected,
        removePurchasedItems,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
