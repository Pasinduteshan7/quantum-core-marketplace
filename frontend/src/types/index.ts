export interface User {
  id: string | number;
  name: string;
  email: string;
  role?: 'CUSTOMER' | 'ADMIN' | 'ROLE_CUSTOMER' | 'ROLE_ADMIN' | string;
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
  customerName?: string;
  customerEmail?: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'COD' | 'CARD' | 'BANK_TRANSFER';
  totalAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalUsers: number;
}

// Payload shape for creating/editing a product from the admin panel.
// Matches the backend's Product entity fields (minus generated ones like id/timestamps).
export interface ProductFormInput {
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

export interface ChatMessage {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  senderRole: 'ROLE_CUSTOMER' | 'ROLE_ADMIN' | 'CUSTOMER' | 'ADMIN';
  content: string;
  isRead: boolean;
  createdAt: string;
  // Attached product for Product Card Bubbles
  productId?: number | null;
  productName?: string | null;
  productImageUrl?: string | null;
  productPrice?: number | null;
}

export interface ConversationSummary {
  id: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  productId?: number | null;
  productName?: string | null;
  productImageUrl?: string | null;
  productPrice?: number | null;
  status: 'OPEN' | 'RESOLVED';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessagePayload {
  conversationId?: number | null;
  productId?: number | null;
  content: string;
}
