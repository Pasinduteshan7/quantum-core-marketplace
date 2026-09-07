export interface User {
  id: string | number;
  name: string;
  email: string;
  role?: 'CUSTOMER' | 'ADMIN';
  token?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export interface Product {
  id: number | string;
  itemCode: string;
  name: string;
  brand: string;
  category: string;
  subCategory?: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  specs?: string;
  image: string;
  description?: string;
  stock?: number;
  badge?: string;
  rating?: number;
  reviewCount?: number;
}

export interface CartItem {
  _id?: string;
  id?: string | number;
  productId: string | number;
  itemCode: string;
  name: string;
  unitPrice: number;
  quantity: number;
  image?: string;
  unitPriceFormatted?: string;
  totalPrice?: number;
  totalPriceFormatted?: string;
}

export interface OrderItem {
  productId: string | number;
  itemCode: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  notes?: string;
}

export interface Order {
  id: string | number;
  userId?: string | number;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'COD' | 'CARD' | 'BANK_TRANSFER';
  totalAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
}

export interface FilterParams {
  category?: string;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
  page?: number;
  limit?: number;
}

export type BackendType = 'springboot' | 'node' | 'go';
