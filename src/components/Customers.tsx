import React, { useState } from 'react';
import { Customer } from '@/types';
import { formatCurrency } from '@/utils/format';
import { Plus, Search, Mail, Phone, MapPin } from 'lucide-react';

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+234-801-234-5678',
    address: '123 Main Street, Lagos',
    totalPurchases: 5437.5,
    lastPurchaseDate: '2024-01-15',
    loyaltyPoints: 543,
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'jane.doe@email.com',
    phone: '+234-802-345-6789',
    address: '456 Oak Avenue, Abuja',
    totalPurchases: 2315.0,
    lastPurchaseDate: '2024-01-14',
    loyaltyPoints: 231,
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.j@email.com',
    phone: '+234-803-456-7890',
    totalPurchases: 1250.0,
    lastPurchaseDate: '2024-01-10',
    loyaltyPoints: 125,
  },
];

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState<string[]>([]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  const handleAddCustomer = () => {
    const newErrors: string[] = [];
    if (!formData.name.trim()) newErrors.push('Name is required');
    if (!formData.email.trim()) newErrors.push('Email is required');
    if (!formData.phone.trim()) newErrors.push('Phone is required');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const newCustomer: Customer = {
      id: Math.max(...customers.map(c => c.id), 0) + 1,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      totalPurchases: 0,
      loyaltyPoints: 0,
    };

    setCustomers([...customers, newCustomer]);
    setFormData({ name: '', email: '', phone: '', address: '' });
    setShowModal(false);
    setErrors([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Customers</h1>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base flex items-center gap-2 justify-center"
        >
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map(customer => (
          <div key={customer.id} className="bg-white p-4 sm:p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <Mail size={14} />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                  <Phone size={14} />
                  <span>{customer.phone}</span>
                </div>
                {customer.address && (
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                    <MapPin size={14} />
                    <span className="truncate">{customer.address}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Purchases</span>
                <span className="font-semibold text-green-600">{formatCurrency(customer.totalPurchases)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Loyalty Points</span>
                <span className="font-semibold text-blue-600">{customer.loyaltyPoints}</span>
              </div>
              {customer.lastPurchaseDate && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Purchase</span>
                  <span className="text-sm text-gray-700">{customer.lastPurchaseDate}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Add New Customer</h2>
            {errors.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                <ul className="list-disc list-inside">
                  {errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Address (Optional)"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                rows={3}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleAddCustomer}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Add Customer
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setFormData({ name: '', email: '', phone: '', address: '' });
                  setErrors([]);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

