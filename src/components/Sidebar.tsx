import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, Home, Package, ShoppingCart, Truck, BarChart3, Settings, User, Users, History, RefreshCw, ArrowLeftRight, FileText, Tags } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isMobile: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'pos', label: 'Point of Sale', icon: ShoppingCart },
  { id: 'sales', label: 'Sales History', icon: History },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'suppliers', label: 'Suppliers', icon: Truck },
  { id: 'orders', label: 'Purchase Orders', icon: Package },
  { id: 'adjustments', label: 'Stock Adjustments', icon: RefreshCw },
  { id: 'transfers', label: 'Stock Transfers', icon: ArrowLeftRight },
  { id: 'returns', label: 'Returns & Refunds', icon: ArrowLeftRight },
  { id: 'categories', label: 'Categories', icon: Tags },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  currentPage,
  setCurrentPage,
  isMobile,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  // Load profile picture from localStorage
  useEffect(() => {
    const savedPicture = localStorage.getItem('replenishhq_profile_picture');
    if (savedPicture) {
      setProfilePicture(savedPicture);
    }

    // Listen for storage changes (when profile picture is updated in Header)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'replenishhq_profile_picture') {
        setProfilePicture(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Also listen for custom event for same-window updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      const savedPicture = localStorage.getItem('replenishhq_profile_picture');
      setProfilePicture(savedPicture);
    };

    window.addEventListener('profilePictureUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profilePictureUpdated', handleProfileUpdate);
  }, []);

  // On desktop: expand on hover, collapse when not hovered
  // On mobile: use toggle button
  useEffect(() => {
    if (!isMobile) {
      setIsExpanded(isHovered);
    } else {
      setIsExpanded(sidebarOpen);
    }
  }, [isHovered, sidebarOpen, isMobile]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Modern glassmorphism design with gradient and backdrop blur
  const sidebarStyle = !isMobile && isExpanded ? {
    background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  } : !isMobile ? {
    background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.98) 0%, rgba(31, 41, 55, 0.98) 100%)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  } : {};

  const sidebarClasses = `
    ${isMobile 
      ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full')
      : (isExpanded ? 'w-64 scale-100' : 'w-20 scale-100')
    }
    ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'}
    text-white transition-all duration-500 ease-out flex flex-col
    ${isMobile ? 'shadow-2xl' : ''}
    ${!isMobile ? 'rounded-r-2xl m-2' : ''}
    ${!isMobile && isExpanded ? 'shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]' : ''}
    overflow-hidden
  `;

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={sidebarClasses.trim()}
        style={sidebarStyle}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        onTouchStart={() => !isMobile && setIsHovered(true)}
        onTouchEnd={() => !isMobile && setTimeout(() => setIsHovered(false), 2000)}
      >
        <div className="p-4 flex items-center justify-between min-h-[64px] border-b border-white/10">
          {isExpanded && (
            <h1 className="text-xl font-bold whitespace-nowrap bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ReplenishHQ
            </h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-white/10 p-2 rounded-xl transition-all duration-300 ml-auto backdrop-blur-sm"
            aria-label="Toggle sidebar"
          >
            {isExpanded ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  if (isMobile) {
                    setSidebarOpen(false);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  currentPage === item.id 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/50' 
                    : 'hover:bg-white/10 hover:backdrop-blur-sm'
                } ${!isExpanded ? 'justify-center' : ''} group`}
                title={!isExpanded ? item.label : undefined}
              >
                <Icon 
                  size={20} 
                  className={`flex-shrink-0 transition-transform duration-300 ${
                    currentPage === item.id ? 'scale-110' : 'group-hover:scale-110'
                  }`} 
                />
                {isExpanded && (
                  <span className={`whitespace-nowrap transition-all duration-300 ${
                    currentPage === item.id ? 'font-semibold' : ''
                  }`}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          {isExpanded && user && (
            <div className="text-sm mb-4 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-white/20">
                    <User size={20} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate text-white">{user.name}</p>
                  <p className="text-gray-300 truncate text-xs mt-0.5">{user.role}</p>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
              !isExpanded 
                ? 'justify-center bg-white/10 hover:bg-white/20' 
                : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 shadow-lg shadow-red-500/30 hover:shadow-red-500/50'
            }`}
            title={!isExpanded ? 'Logout' : undefined}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {isExpanded && <span className="whitespace-nowrap font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};
