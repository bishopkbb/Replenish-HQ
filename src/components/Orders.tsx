import React, { useState, useEffect } from 'react';
import { PurchaseOrder } from '@/types';
import { formatCurrency } from '@/utils/format';
import { dataManager } from '@/utils/dataManager';
import { Plus } from 'lucide-react';

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>(() => dataManager.getOrders());
  const [suppliers] = useState(() => dataManager.getSuppliers());
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    supplier: '',
    total: '',
    items: [{ productId: '', quantity: '', unitPrice: '' }],
  });
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const handleUpdate = () => {
      setOrders(dataManager.getOrders());
    };
    window.addEventListener('ordersUpdated', handleUpdate);
    return () => window.removeEventListener('ordersUpdated', handleUpdate);
  }, []);

  const getStatusBadge = (status: PurchaseOrder['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'received':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAddOrder = () => {
    const newErrors: string[] = [];
    if (!formData.supplier) newErrors.push('Supplier is required');
    if (!formData.total || parseFloat(formData.total) <= 0) {
      newErrors.push('Valid total amount is required');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const newOrder: PurchaseOrder = {
      id: `PO-${String(orders.length + 1).padStart(3, '0')}`,
      supplier: formData.supplier,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      total: parseFloat(formData.total),
    };

    dataManager.addOrder(newOrder);
    setFormData({ supplier: '', total: '', items: [{ productId: '', quantity: '', unitPrice: '' }] });
    setShowModal(false);
    setErrors([]);
  };

  const handleReceiveOrder = (orderId: string) => {
    if (window.confirm('Mark this order as received? This will update inventory.')) {
      const updated = orders.map(o => 
        o.id === orderId ? { ...o, status: 'received' as const } : o
      );
      setOrders(updated);
      dataManager.saveOrders(updated);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Purchase Orders</h1>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base flex items-center gap-2 justify-center"
        >
          <Plus size={18} />
          New Order
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle px-4 sm:px-0">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Order ID</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold hidden sm:table-cell">Supplier</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Date</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Total</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Status</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4 font-medium text-xs sm:text-sm">{order.id}</td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm hidden sm:table-cell">{order.supplier}</td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">{order.date}</td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">{formatCurrency(order.total)}</td>
                  <td className="px-3 sm:px-6 py-4">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleReceiveOrder(order.id)}
                        className="text-green-600 hover:text-green-800 text-xs sm:text-sm"
                      >
                        Mark Received
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Order Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">New Purchase Order</h2>
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
                <label className="block text-sm font-medium mb-1">Supplier</label>
                <select
                  value={formData.supplier}
                  onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Total Amount</label>
                <input
                  type="number"
                  placeholder="Enter total amount"
                  value={formData.total}
                  onChange={(e) => setFormData({...formData, total: e.target.value})}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleAddOrder}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Create Order
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setFormData({ supplier: '', total: '', items: [{ productId: '', quantity: '', unitPrice: '' }] });
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
