export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  cost: number;
  stock: number;
  category: string;
  threshold: number;
  status: 'ok' | 'low' | 'out';
  barcode?: string;
  image?: string;
}

export interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export interface PurchaseOrder {
  id: string;
  supplier: string;
  date: string;
  status: 'pending' | 'received' | 'cancelled';
  total: number;
  items?: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface SalesData {
  day: string;
  sales: number;
  revenue: number;
}

export interface Transaction {
  product: string;
  qty: number;
  amount: number;
  time: string;
}

export interface Sale {
  id: string;
  date: string;
  time: string;
  customerId?: number;
  customerName?: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'mobile' | 'other';
  status: 'completed' | 'refunded' | 'partial';
}

export interface SaleItem {
  productId: number;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  totalPurchases: number;
  lastPurchaseDate?: string;
  loyaltyPoints?: number;
}

export interface StockAdjustment {
  id: string;
  date: string;
  productId: number;
  productName: string;
  sku: string;
  previousStock: number;
  newStock: number;
  adjustment: number;
  reason: string;
  type: 'increase' | 'decrease' | 'correction';
  performedBy: string;
}

export interface StockTransfer {
  id: string;
  date: string;
  fromLocation: string;
  toLocation: string;
  productId: number;
  productName: string;
  sku: string;
  quantity: number;
  status: 'pending' | 'in-transit' | 'completed' | 'cancelled';
  notes?: string;
}

export interface ReturnRefund {
  id: string;
  saleId: string;
  date: string;
  customerId?: number;
  customerName?: string;
  items: ReturnItem[];
  reason: string;
  type: 'return' | 'refund' | 'exchange';
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
}

export interface ReturnItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  reason: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  productCount: number;
  parentId?: number;
}

export interface Notification {
  id: number;
  message: string;
  time: string;
  type: 'warning' | 'critical' | 'success' | 'info';
  read?: boolean;
  actionUrl?: string;
}

export interface User {
  name: string;
  role: 'Admin' | 'Manager' | 'Staff' | 'Viewer';
}

export interface CartItem extends Product {
  qty: number;
}

export interface ReceiptData {
  id: string;
  date: string;
  time: string;
  items: CartItem[];
  total: number;
}

export interface BusinessSettings {
  businessName: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  taxRate: number;
  receiptHeader: string;
  autoBackup: boolean;
  emailNotif: boolean;
  lowStockNotif: boolean;
  orderNotif: boolean;
  dailyNotif: boolean;
}

export interface Report {
  id: string;
  type: 'sales' | 'inventory' | 'profit' | 'custom';
  title: string;
  dateRange: { from: string; to: string };
  generatedAt: string;
  data: any;
}
