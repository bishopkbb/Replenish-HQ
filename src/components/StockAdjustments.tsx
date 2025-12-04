import React, { useState } from 'react';
import { StockAdjustment } from '@/types';
import { MOCK_PRODUCTS } from '@/utils/constants';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const MOCK_ADJUSTMENTS: StockAdjustment[] = [
  {
    id: 'ADJ-001',
    date: '2024-01-15',
    productId: 2,
    productName: 'Mouse',
    sku: 'MOU001',
    previousStock: 5,
    newStock: 2,
    adjustment: -3,
    reason: 'Damaged items',
    type: 'decrease',
    performedBy: 'John Doe',
  },
  {
    id: 'ADJ-002',
    date: '2024-01-14',
    productId: 3,
    productName: 'Keyboard',
    sku: 'KEY001',
    previousStock: 0,
    newStock: 10,
    adjustment: 10,
    reason: 'Stock correction',
    type: 'increase',
    performedBy: 'Jane Smith',
  },
];

export const StockAdjustments: React.FC = () => {
  const { user } = useAuth();
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>(MOCK_ADJUSTMENTS);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    reason: '',
    adjustment: '',
    type: 'increase' as 'increase' | 'decrease' | 'correction',
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleAddAdjustment = () => {
    const newErrors: string[] = [];
    if (!formData.productId) newErrors.push('Product is required');
    if (!formData.reason.trim()) newErrors.push('Reason is required');
    if (!formData.adjustment || parseFloat(formData.adjustment) === 0) {
      newErrors.push('Adjustment quantity is required');
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

    const adjustmentQty = parseInt(formData.adjustment);
    const newStock = formData.type === 'correction' 
      ? adjustmentQty 
      : formData.type === 'increase' 
        ? product.stock + adjustmentQty 
        : product.stock - adjustmentQty;

    const newAdjustment: StockAdjustment = {
      id: `ADJ-${String(adjustments.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      previousStock: product.stock,
      newStock: newStock,
      adjustment: formData.type === 'increase' ? adjustmentQty : -adjustmentQty,
      reason: formData.reason,
      type: formData.type,
      performedBy: user?.name || 'System',
    };

    setAdjustments([newAdjustment, ...adjustments]);
    setFormData({ productId: '', reason: '', adjustment: '', type: 'increase' });
    setShowModal(false);
    setErrors([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Stock Adjustments</h1>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base flex items-center gap-2 justify-center"
        >
          <Plus size={18} />
          New Adjustment
        </button>
      </div>

      {/* Adjustments Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle px-4 sm:px-0">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">ID</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Date</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Product</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Previous</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Adjustment</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">New Stock</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Reason</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">By</th>
              </tr>
            </thead>
            <tbody>
              {adjustments.map(adj => (
                <tr key={adj.id} className="border-b hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm font-medium">{adj.id}</td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">{adj.date}</td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                    <div>{adj.productName}</div>
                    <div className="text-gray-500 text-xs">{adj.sku}</div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">{adj.previousStock}</td>
                  <td className="px-3 sm:px-6 py-4">
                    <div className={`flex items-center gap-1 text-xs sm:text-sm font-semibold ${
                      adj.adjustment > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {adj.adjustment > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {adj.adjustment > 0 ? '+' : ''}{adj.adjustment}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm font-semibold">{adj.newStock}</td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">{adj.reason}</td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">{adj.performedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Adjustment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">New Stock Adjustment</h2>
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
                <label className="block text-sm font-medium mb-1">Adjustment Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="increase">Increase Stock</option>
                  <option value="decrease">Decrease Stock</option>
                  <option value="correction">Stock Correction</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {formData.type === 'correction' ? 'New Stock Quantity' : 'Adjustment Quantity'}
                </label>
                <input
                  type="number"
                  placeholder={formData.type === 'correction' ? 'Enter new stock' : 'Enter quantity'}
                  value={formData.adjustment}
                  onChange={(e) => setFormData({...formData, adjustment: e.target.value})}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason</label>
                <textarea
                  placeholder="Enter reason for adjustment..."
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  rows={3}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleAddAdjustment}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Apply Adjustment
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setFormData({ productId: '', reason: '', adjustment: '', type: 'increase' });
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

