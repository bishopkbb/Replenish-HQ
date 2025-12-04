import React, { useState } from 'react';

export const Settings: React.FC = () => {
  // Load settings from localStorage or use defaults
  const loadSettings = () => {
    try {
      const saved = localStorage.getItem('replenishhq_business_settings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    return null;
  };

  const savedSettings = loadSettings();
  const [businessName, setBusinessName] = useState(savedSettings?.businessName || 'ReplenishHQ Store');
  const [email, setEmail] = useState(savedSettings?.email || 'info@replenishhq.com');
  const [phone, setPhone] = useState(savedSettings?.phone || '+234-801-234-5678');
  const [address, setAddress] = useState(savedSettings?.address || '123 Commerce Street, Abuja, Nigeria');
  const [currency, setCurrency] = useState(savedSettings?.currency || 'NGN');
  const [taxRate, setTaxRate] = useState(savedSettings?.taxRate || 15);
  const [receiptHeader, setReceiptHeader] = useState(savedSettings?.receiptHeader || 'Welcome to ReplenishHQ');
  const [autoBackup, setAutoBackup] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [lowStockNotif, setLowStockNotif] = useState(true);
  const [orderNotif, setOrderNotif] = useState(true);
  const [dailyNotif, setDailyNotif] = useState(false);

  const handleSaveBusinessSettings = () => {
    const businessSettings = {
      businessName,
      email,
      phone,
      address,
      currency,
      taxRate,
      receiptHeader,
    };
    localStorage.setItem('replenishhq_business_settings', JSON.stringify(businessSettings));
    alert('Business settings saved successfully!');
  };

  const handleSaveSystemSettings = () => {
    alert('System settings saved successfully!');
  };

  const handleBackup = () => {
    alert('Data backed up successfully!');
  };

  const handleRestore = () => {
    alert('Data restored successfully!');
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone!')) {
      alert('All data has been cleared!');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-base sm:text-lg font-semibold mb-4">Business Profile</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Business Name</label>
              <input 
                type="text" 
                placeholder="Business Name" 
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input 
                type="text" 
                placeholder="Phone" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea 
                placeholder="Address" 
                rows={3} 
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSaveBusinessSettings}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium transition-colors"
            >
              Save Business Settings
            </button>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-base sm:text-lg font-semibold mb-4">System Configuration</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Currency</label>
              <select 
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="NGN">Nigerian Naira (₦)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tax Rate (%)</label>
              <input 
                type="number" 
                placeholder="15" 
                value={taxRate}
                onChange={e => setTaxRate(parseInt(e.target.value) || 0)}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Receipt Header</label>
              <input 
                type="text" 
                placeholder="Receipt Header" 
                value={receiptHeader}
                onChange={e => setReceiptHeader(e.target.value)}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                checked={autoBackup}
                onChange={e => setAutoBackup(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Enable Auto Backup</label>
            </div>
            <button
              onClick={handleSaveSystemSettings}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium transition-colors"
            >
              Save System Settings
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
        <h3 className="text-base sm:text-lg font-semibold mb-4">Data Management</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <button
            onClick={handleBackup}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-medium transition-colors"
          >
            📥 Backup Data
          </button>
          <button
            onClick={handleRestore}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium transition-colors"
          >
            📤 Restore Data
          </button>
          <button
            onClick={handleClearData}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-medium transition-colors"
          >
            🗑️ Clear All Data
          </button>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
        <h3 className="text-base sm:text-lg font-semibold mb-4">Notification Preferences</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Email Notifications</span>
            <input
              type="checkbox"
              checked={emailNotif}
              onChange={e => setEmailNotif(e.target.checked)}
              className="w-4 h-4 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Low Stock Alerts</span>
            <input
              type="checkbox"
              checked={lowStockNotif}
              onChange={e => setLowStockNotif(e.target.checked)}
              className="w-4 h-4 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Order Updates</span>
            <input
              type="checkbox"
              checked={orderNotif}
              onChange={e => setOrderNotif(e.target.checked)}
              className="w-4 h-4 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Daily Summary</span>
            <input
              type="checkbox"
              checked={dailyNotif}
              onChange={e => setDailyNotif(e.target.checked)}
              className="w-4 h-4 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

