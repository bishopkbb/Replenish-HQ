import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Dashboard } from './Dashboard';
import { Products } from './Products';
import { POS } from './POS';
import { SalesHistory } from './SalesHistory';
import { Customers } from './Customers';
import { Suppliers } from './Suppliers';
import { Orders } from './Orders';
import { StockAdjustments } from './StockAdjustments';
import { StockTransfers } from './StockTransfers';
import { ReturnsRefunds } from './ReturnsRefunds';
import { Categories } from './Categories';
import { Analytics } from './Analytics';
import { Reports } from './Reports';
import { Settings } from './Settings';
import { Profile } from './Profile';
import { Notification } from '@/types';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'products', label: 'Products' },
  { id: 'pos', label: 'Point of Sale' },
  { id: 'sales', label: 'Sales History' },
  { id: 'customers', label: 'Customers' },
  { id: 'suppliers', label: 'Suppliers' },
  { id: 'orders', label: 'Purchase Orders' },
  { id: 'adjustments', label: 'Stock Adjustments' },
  { id: 'transfers', label: 'Stock Transfers' },
  { id: 'returns', label: 'Returns & Refunds' },
  { id: 'categories', label: 'Categories' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'reports', label: 'Reports' },
  { id: 'settings', label: 'Settings' },
  { id: 'profile', label: 'Profile' },
];

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(false);
  
  // Load notifications from localStorage or use defaults
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem('replenishhq_notifications');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
    return [
      { id: 1, message: 'Mouse stock is low (2 units)', time: '10 min ago', type: 'warning', read: false, actionUrl: '/dashboard?page=products' },
      { id: 2, message: 'Keyboard is out of stock', time: '2 hours ago', type: 'critical', read: false, actionUrl: '/dashboard?page=products' },
      { id: 3, message: 'PO-001 has been received', time: '5 hours ago', type: 'success', read: false, actionUrl: '/dashboard?page=orders' },
    ];
  });

  // Generate dynamic notifications based on product stock
  useEffect(() => {
    const checkLowStock = () => {
      try {
        const products = JSON.parse(localStorage.getItem('replenishhq_products') || '[]');
        const existingNotifIds = notifications.map(n => n.id);
        let maxId = Math.max(...existingNotifIds, 0);
        const newNotifications: Notification[] = [];

        products.forEach((product: any) => {
          if (product.stock <= product.threshold && product.stock > 0) {
            const notifId = `low-stock-${product.id}`;
            if (!existingNotifIds.includes(notifId as any)) {
              maxId++;
              newNotifications.push({
                id: maxId,
                message: `${product.name} stock is low (${product.stock} units)`,
                time: 'Just now',
                type: 'warning',
                read: false,
                actionUrl: '/dashboard?page=products',
              });
            }
          } else if (product.stock === 0) {
            const notifId = `out-of-stock-${product.id}`;
            if (!existingNotifIds.includes(notifId as any)) {
              maxId++;
              newNotifications.push({
                id: maxId,
                message: `${product.name} is out of stock`,
                time: 'Just now',
                type: 'critical',
                read: false,
                actionUrl: '/dashboard?page=products',
              });
            }
          }
        });

        if (newNotifications.length > 0) {
          setNotifications(prev => [...newNotifications, ...prev]);
        }
      } catch (error) {
        console.error('Error checking stock:', error);
      }
    };

    checkLowStock();
    const interval = setInterval(checkLowStock, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Detect mobile/tablet
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true); // Auto-open on desktop
      } else {
        setSidebarOpen(false); // Auto-close on mobile
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Listen for navigation events from ProfileMenu
  useEffect(() => {
    const handleNavigate = (e: CustomEvent) => {
      if (e.detail === 'settings' || e.detail === 'profile') {
        setCurrentPage(e.detail);
      }
    };

    window.addEventListener('navigateToPage', handleNavigate as EventListener);
    return () => window.removeEventListener('navigateToPage', handleNavigate as EventListener);
  }, []);

  const pages: Record<string, React.ComponentType> = {
    dashboard: Dashboard,
    products: Products,
    pos: POS,
    sales: SalesHistory,
    customers: Customers,
    suppliers: Suppliers,
    orders: Orders,
    adjustments: StockAdjustments,
    transfers: StockTransfers,
    returns: ReturnsRefunds,
    categories: Categories,
    analytics: Analytics,
    reports: Reports,
    settings: Settings,
    profile: Profile,
  };

  const CurrentPage = pages[currentPage] || Dashboard;
  const currentPageLabel = menuItems.find(m => m.id === currentPage)?.label || 'Dashboard';

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 overflow-hidden">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isMobile={isMobile}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          currentPageLabel={currentPageLabel} 
          notifications={notifications}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          isMobile={isMobile}
          onNotificationUpdate={(updated) => {
            setNotifications(updated);
            localStorage.setItem('replenishhq_notifications', JSON.stringify(updated));
          }}
        />
        
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <CurrentPage />
        </div>
      </div>
    </div>
  );
};
