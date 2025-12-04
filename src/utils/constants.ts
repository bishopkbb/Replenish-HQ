import { Product, Supplier, PurchaseOrder, SalesData } from '@/types';

export const MOCK_SALES_DATA: SalesData[] = [
  { day: 'Mon', sales: 4200, revenue: 24000 },
  { day: 'Tue', sales: 3800, revenue: 21500 },
  { day: 'Wed', sales: 5200, revenue: 29400 },
  { day: 'Thu', sales: 4800, revenue: 27200 },
  { day: 'Fri', sales: 6200, revenue: 35000 },
  { day: 'Sat', sales: 7100, revenue: 40200 },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Laptop', sku: 'LAP001', price: 1200, cost: 800, stock: 5, category: 'Electronics', threshold: 3, status: 'ok' },
  { id: 2, name: 'Mouse', sku: 'MOU001', price: 25, cost: 10, stock: 2, category: 'Accessories', threshold: 10, status: 'low' },
  { id: 3, name: 'Keyboard', sku: 'KEY001', price: 75, cost: 30, stock: 0, category: 'Accessories', threshold: 5, status: 'out' },
  { id: 4, name: 'Monitor', sku: 'MON001', price: 300, cost: 150, stock: 8, category: 'Electronics', threshold: 2, status: 'ok' },
  { id: 5, name: 'USB Cable', sku: 'USB001', price: 5, cost: 1, stock: 50, category: 'Accessories', threshold: 20, status: 'ok' },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 1, name: 'Tech Supplies Co', email: 'contact@techsupplies.com', phone: '+234-801-234-5678' },
  { id: 2, name: 'Global Electronics', email: 'sales@globalelec.com', phone: '+234-802-345-6789' },
];

export const MOCK_ORDERS: PurchaseOrder[] = [
  { id: 'PO-001', supplier: 'Tech Supplies Co', date: '2024-01-15', status: 'pending', total: 5000 },
  { id: 'PO-002', supplier: 'Global Electronics', date: '2024-01-14', status: 'received', total: 8500 },
];

export const PRODUCT_CATEGORIES = ['Electronics', 'Accessories', 'Other'] as const;

