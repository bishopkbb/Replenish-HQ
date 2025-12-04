import React, { useState, useRef } from 'react';
import { User, Camera, LogOut, Settings, X, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  userProfilePicture: string | null;
  onProfilePictureChange: (picture: string) => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  isOpen,
  onClose,
  userProfilePicture,
  onProfilePictureChange,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);

    // Convert to base64 for storage
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onProfilePictureChange(base64String);
      setIsUploading(false);
      // Also save to localStorage
      localStorage.setItem('replenishhq_profile_picture', base64String);
      // Dispatch custom event to update sidebar
      window.dispatchEvent(new Event('profilePictureUpdated'));
    };
    reader.onerror = () => {
      alert('Error reading file');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePicture = () => {
    onProfilePictureChange('');
    localStorage.removeItem('replenishhq_profile_picture');
    // Dispatch custom event to update sidebar
    window.dispatchEvent(new Event('profilePictureUpdated'));
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <div className="absolute right-0 top-14 sm:top-16 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="relative">
              {userProfilePicture ? (
                <img
                  src={userProfilePicture}
                  alt={user?.name || 'User'}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border-2 border-white">
                  <User size={32} />
                </div>
              )}
              <button
                onClick={handleProfilePictureClick}
                className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors border-2 border-white"
                title="Change profile picture"
              >
                <Camera size={12} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{user?.name || 'User'}</h3>
              <p className="text-sm text-blue-100 truncate">{user?.role || 'Role'}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-2">
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('navigateToPage', { detail: 'profile' }));
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
          >
            <Eye size={20} className="text-gray-600" />
            <span className="text-gray-700">View Profile</span>
          </button>

          <button
            onClick={handleProfilePictureClick}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
          >
            <Camera size={20} className="text-gray-600" />
            <span className="text-gray-700">
              {isUploading ? 'Uploading...' : userProfilePicture ? 'Change Picture' : 'Upload Picture'}
            </span>
          </button>

          {userProfilePicture && (
            <button
              onClick={handleRemovePicture}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-left text-red-600"
            >
              <X size={20} />
              <span>Remove Picture</span>
            </button>
          )}

          <div className="border-t border-gray-200 my-2" />

          <button
            onClick={() => {
              // Navigate to settings by changing page in parent component
              window.dispatchEvent(new CustomEvent('navigateToPage', { detail: 'settings' }));
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
          >
            <Settings size={20} className="text-gray-600" />
            <span className="text-gray-700">Settings</span>
          </button>

          <div className="border-t border-gray-200 my-2" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors text-left text-red-600"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

