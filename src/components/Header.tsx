import React, { useState, useEffect, useRef } from 'react';
import { Bell, User, Menu, X, Check, CheckCheck } from 'lucide-react';
import { Notification } from '@/types';
import { ProfileMenu } from './ProfileMenu';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  currentPageLabel: string;
  notifications: Notification[];
  onMenuClick?: () => void;
  isMobile?: boolean;
  onNotificationUpdate?: (notifications: Notification[]) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentPageLabel, 
  notifications,
  onMenuClick,
  isMobile = false,
  onNotificationUpdate,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [localNotifications, setLocalNotifications] = useState<Notification[]>(notifications);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Update local notifications when prop changes
  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const unreadCount = localNotifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: number) => {
    const updated = localNotifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setLocalNotifications(updated);
    onNotificationUpdate?.(updated);
    // Save to localStorage
    localStorage.setItem('replenishhq_notifications', JSON.stringify(updated));
  };

  const handleMarkAllAsRead = () => {
    const updated = localNotifications.map(n => ({ ...n, read: true }));
    setLocalNotifications(updated);
    onNotificationUpdate?.(updated);
    localStorage.setItem('replenishhq_notifications', JSON.stringify(updated));
  };

  const handleDelete = (id: number) => {
    const updated = localNotifications.filter(n => n.id !== id);
    setLocalNotifications(updated);
    onNotificationUpdate?.(updated);
    localStorage.setItem('replenishhq_notifications', JSON.stringify(updated));
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      setShowNotifications(false);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'critical':
        return '🔴';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'critical':
        return 'border-l-red-500 bg-red-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'success':
        return 'border-l-green-500 bg-green-50';
      case 'info':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  // Load profile picture from localStorage on mount
  useEffect(() => {
    const savedPicture = localStorage.getItem('replenishhq_profile_picture');
    if (savedPicture) {
      setProfilePicture(savedPicture);
    }
  }, []);

  return (
    <div className="bg-white shadow px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3 sm:gap-4">
        {isMobile && onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
        )}
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 truncate">
          {currentPageLabel}
        </h2>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4 relative">
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 top-12 sm:top-14 w-80 sm:w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      title="Mark all as read"
                    >
                      <CheckCheck size={14} />
                      Mark all read
                    </button>
                  )}
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {localNotifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    <Bell size={32} className="mx-auto mb-2 text-gray-400" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  localNotifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`p-4 border-l-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notif.read ? getNotificationColor(notif.type) : 'bg-white'
                      }`}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-base">{getNotificationIcon(notif.type)}</span>
                            {!notif.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                          <p className={`text-xs sm:text-sm ${!notif.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {!notif.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notif.id);
                              }}
                              className="p-1 hover:bg-gray-200 rounded transition-colors"
                              title="Mark as read"
                            >
                              <Check size={14} className="text-gray-600" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notif.id);
                            }}
                            className="p-1 hover:bg-red-100 rounded transition-colors"
                            title="Delete"
                          >
                            <X size={14} className="text-gray-600 hover:text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full transition-transform hover:scale-105"
            aria-label="Profile menu"
          >
            {profilePicture ? (
              <img
                src={profilePicture}
                alt={user?.name || 'User'}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-blue-500 cursor-pointer"
              />
            ) : (
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg hover:shadow-xl transition-shadow">
                <User size={16} className="sm:w-[18px] sm:h-[18px]" />
              </div>
            )}
          </button>
          
          <ProfileMenu
            isOpen={showProfileMenu}
            onClose={() => setShowProfileMenu(false)}
            userProfilePicture={profilePicture}
            onProfilePictureChange={(picture) => setProfilePicture(picture)}
          />
        </div>
      </div>
    </div>
  );
};
