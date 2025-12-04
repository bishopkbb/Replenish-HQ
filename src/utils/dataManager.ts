import { Product, PurchaseOrder, Sale, Supplier } from '@/types';
import { MOCK_PRODUCTS, MOCK_ORDERS, MOCK_SUPPLIERS } from '@/utils/constants';

// Data Manager - Centralized data management with localStorage
class DataManager {
  private static instance: DataManager;

  private constructor() {
    this.initializeData();
  }

  public static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  private initializeData() {
    // Initialize products if not exists
    if (!localStorage.getItem('replenishhq_products')) {
      localStorage.setItem('replenishhq_products', JSON.stringify(MOCK_PRODUCTS));
    }

    // Initialize orders if not exists
    if (!localStorage.getItem('replenishhq_orders')) {
      localStorage.setItem('replenishhq_orders', JSON.stringify(MOCK_ORDERS));
    }

    // Initialize suppliers if not exists
    if (!localStorage.getItem('replenishhq_suppliers')) {
      localStorage.setItem('replenishhq_suppliers', JSON.stringify(MOCK_SUPPLIERS));
    }
  }

  // Products
  getProducts(): Product[] {
    try {
      const products = localStorage.getItem('replenishhq_products');
      return products ? JSON.parse(products) : MOCK_PRODUCTS;
    } catch {
      return MOCK_PRODUCTS;
    }
  }

  saveProducts(products: Product[]): void {
    localStorage.setItem('replenishhq_products', JSON.stringify(products));
    window.dispatchEvent(new Event('productsUpdated'));
  }

  updateProductStock(productId: number, quantityChange: number): void {
    const products = this.getProducts();
    const updated: Product[] = products.map(p => {
      if (p.id === productId) {
        const newStock = Math.max(0, p.stock + quantityChange);
        return {
          ...p,
          stock: newStock,
          status: (newStock === 0 ? 'out' : newStock <= p.threshold ? 'low' : 'ok') as 'ok' | 'low' | 'out',
        };
      }
      return p;
    });
    this.saveProducts(updated);
  }

  // Orders
  getOrders(): PurchaseOrder[] {
    try {
      const orders = localStorage.getItem('replenishhq_orders');
      return orders ? JSON.parse(orders) : MOCK_ORDERS;
    } catch {
      return MOCK_ORDERS;
    }
  }

  saveOrders(orders: PurchaseOrder[]): void {
    localStorage.setItem('replenishhq_orders', JSON.stringify(orders));
    window.dispatchEvent(new Event('ordersUpdated'));
  }

  addOrder(order: PurchaseOrder): void {
    const orders = this.getOrders();
    this.saveOrders([...orders, order]);
  }

  // Sales
  getSales(): Sale[] {
    try {
      const sales = localStorage.getItem('replenishhq_sales');
      return sales ? JSON.parse(sales) : [];
    } catch {
      return [];
    }
  }

  addSale(sale: Sale): void {
    const sales = this.getSales();
    const updated = [sale, ...sales].slice(0, 100); // Keep last 100
    localStorage.setItem('replenishhq_sales', JSON.stringify(updated));
    
    // Update customer purchase history if customer exists
    if (sale.customerId) {
      try {
        const customers = JSON.parse(localStorage.getItem('replenishhq_customers') || '[]');
        const updatedCustomers = customers.map((c: any) => {
          if (c.id === sale.customerId) {
            return {
              ...c,
              totalPurchases: (c.totalPurchases || 0) + sale.total,
              lastPurchaseDate: sale.date,
              loyaltyPoints: (c.loyaltyPoints || 0) + Math.floor(sale.total / 10), // 1 point per $10
            };
          }
          return c;
        });
        localStorage.setItem('replenishhq_customers', JSON.stringify(updatedCustomers));
      } catch (error) {
        console.error('Error updating customer:', error);
      }
    }
    
    window.dispatchEvent(new Event('salesUpdated'));
  }

  // Get today's revenue
  getTodayRevenue(): number {
    const sales = this.getSales();
    const today = new Date().toLocaleDateString();
    return sales
      .filter(sale => sale.date === today)
      .reduce((sum, sale) => sum + sale.total, 0);
  }

  // Get recent transactions
  getRecentTransactions(count: number = 5) {
    const sales = this.getSales();
    return sales.slice(0, count).map(sale => ({
      product: sale.items[0]?.productName || 'Multiple items',
      qty: sale.items.reduce((sum, item) => sum + item.quantity, 0),
      amount: sale.total,
      time: sale.time,
    }));
  }

  // Suppliers
  getSuppliers(): Supplier[] {
    try {
      const suppliers = localStorage.getItem('replenishhq_suppliers');
      return suppliers ? JSON.parse(suppliers) : MOCK_SUPPLIERS;
    } catch {
      return MOCK_SUPPLIERS;
    }
  }

  saveSuppliers(suppliers: Supplier[]): void {
    localStorage.setItem('replenishhq_suppliers', JSON.stringify(suppliers));
    window.dispatchEvent(new Event('suppliersUpdated'));
  }
}

export const dataManager = DataManager.getInstance();

