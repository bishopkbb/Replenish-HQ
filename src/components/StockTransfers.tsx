import React, { useState } from 'react';
import { StockTransfer } from '@/types';
import { MOCK_PRODUCTS } from '@/utils/constants';
import { Plus, ArrowRight } from 'lucide-react';

const MOCK_LOCATIONS = ['Main Store', 'Warehouse A', 'Warehouse B', 'Outlet 1', 'Outlet 2'];

const MOCK_TRANSFERS: StockTransfer[] = [
  {
    id: 'TRF-001',
    date: '2024-01-15',
    fromLocation: 'Main Store',
    toLocation: 'Outlet 1',
    productId: 1,
    productName: 'Laptop',
    sku: 'LAP001',
    quantity: 2,
    status: 'completed',
    notes: 'Restocking outlet',
  },
  {
    id: 'TRF-002',
    date: '2024-01-14',
    fromLocation: 'Warehouse A',
    toLocation: 'Main Store',
    productId: 4,
    productName: 'Monitor',
    sku: 'MON001',
    quantity: 5,
    status: 'in-transit',
    notes: 'Expected delivery tomorrow',
  },
];

export const StockTransfers: React.FC = () => {
  const [transfers, setTransfers] = useState<StockTransfer[]>(MOCK_TRANSFERS);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    fromLocation: '',
    toLocation: '',
    quantity: '',
    notes: '',
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleAddTransfer = () => {
    const newErrors: string[] = [];
    if (!formData.productId) newErrors.push('Product is required');
    if (!formData.fromLocation) newErrors.push('From location is required');
    if (!formData.toLocation) newErrors.push('To location is required');
    if (formData.fromLocation === formData.toLocation) {
      newErrors.push('From and To locations must be different');
    }
    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      newErrors.push('Valid quantity is required');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const product = MOCK_PRODUCTS.find(p => p.id === parseInt(formData.productId));
    if (!product) {
      setErrors(['Product not found']);
      return;
    }

    const newTransfer: StockTransfer = {
      id: `TRF-${String(transfers.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      fromLocation: formData.fromLocation,
      toLocation: formData.toLocation,
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      quantity: parseInt(formData.quantity),
      status: 'pending',
      notes: formData.notes,
    };

    setTransfers([newTransfer, ...transfers]);
    setFormData({ productId: '', fromLocation: '', toLocation: '', quantity: '', notes: '' });
    setShowModal(false);
    setErrors([]);
  };

  const getStatusBadge = (status: StockTransfer['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in-transit':
        return 'bg-yellow-100 text-yellow-700';
      case 'pending':
        return 'bg-blue-100 text-blue-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Stock Transfers</h1>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base flex items-center gap-2 justify-center"
        >
          <Plus size={18} />
          New Transfer
        </button>
      </div>

      {/* Transfers Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle px-4 sm:px-0">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Transfer ID</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Date</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Product</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">From</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">To</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Quantity</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map(transfer => (
                <tr key={transfer.id} className="border-b hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm font-medium">{transfer.id}</td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">{transfer.date}</td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                    <div>{transfer.productName}</div>
                    <div className="text-gray-500 text-xs">{transfer.sku}</div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">{transfer.fromLocation}</td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-1">
                      <ArrowRight size={14} className="text-gray-400" />
                      {transfer.toLocation}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">{transfer.quantity}</td>
                  <td className="px-3 sm:px-6 py-4">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(transfer.status)}`}>
                      {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1).replace('-', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transfer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">New Stock Transfer</h2>
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
              <div>
                <label className="block text-sm font-medium mb-1">Product</label>
                <select
                  value={formData.productId}
                  onChange={(e) => setFormData({...formData, productId: e.target.value})}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Product</option>
                  {MOCK_PRODUCTS.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stock: {p.stock})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">From Location</label>
                <select
                  value={formData.fromLocation}
                  onChange={(e) => setFormData({...formData, fromLocation: e.target.value})}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Location</option>
                  {MOCK_LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">To Location</label>
                <select
                  value={formData.toLocation}
                  onChange={(e) => setFormData({...formData, toLocation: e.target.value})}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Location</option>
                  {MOCK_LOCATIONS.filter(loc => loc !== formData.fromLocation).map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                <textarea
                  placeholder="Add notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={2}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleAddTransfer}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Create Transfer
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setFormData({ productId: '', fromLocation: '', toLocation: '', quantity: '', notes: '' });
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

