import React, { useState } from 'react';
import { ReturnRefund } from '@/types';
import { formatCurrency } from '@/utils/format';
import { Plus, X } from 'lucide-react';

const MOCK_RETURNS: ReturnRefund[] = [
  {
    id: 'RET-001',
    saleId: 'SALE-001',
    date: '2024-01-15',
    customerName: 'John Smith',
    items: [
      {
        productId: 2,
        productName: 'Mouse',
        quantity: 1,
        unitPrice: 25,
        reason: 'Defective product',
      },
    ],
    reason: 'Product defect',
    type: 'refund',
    amount: 25,
    status: 'completed',
  },
  {
    id: 'RET-002',
    saleId: 'SALE-003',
    date: '2024-01-14',
    customerName: 'Jane Doe',
    items: [
      {
        productId: 4,
        productName: 'Monitor',
        quantity: 1,
        unitPrice: 300,
        reason: 'Wrong item received',
      },
    ],
    reason: 'Wrong item',
    type: 'exchange',
    amount: 300,
    status: 'pending',
  },
];

export const ReturnsRefunds: React.FC = () => {
  const [returns] = useState<ReturnRefund[]>(MOCK_RETURNS);
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredReturns = returns.filter(ret => {
    const matchesType = filterType === 'all' || ret.type === filterType;
    const matchesStatus = filterStatus === 'all' || ret.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const totalRefundAmount = filteredReturns
    .filter(r => r.status === 'completed' || r.status === 'approved')
    .reduce((sum, r) => sum + r.amount, 0);

  const getStatusBadge = (status: ReturnRefund['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'approved':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeBadge = (type: ReturnRefund['type']) => {
    switch (type) {
      case 'refund':
        return 'bg-red-100 text-red-700';
      case 'return':
        return 'bg-orange-100 text-orange-700';
      case 'exchange':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Returns & Refunds</h1>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base flex items-center gap-2 justify-center"
        >
          <Plus size={18} />
          New Return
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Returns</p>
          <p className="text-2xl font-bold text-gray-900">{filteredReturns.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {filteredReturns.filter(r => r.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Refunded</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalRefundAmount)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row gap-3">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="return">Return</option>
          <option value="refund">Refund</option>
          <option value="exchange">Exchange</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Returns Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle px-4 sm:px-0">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Return ID</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Sale ID</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Date</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold hidden sm:table-cell">Customer</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Type</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Amount</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredReturns.map(ret => (
                <tr key={ret.id} className="border-b hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm font-medium">{ret.id}</td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">{ret.saleId}</td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">{ret.date}</td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm hidden sm:table-cell">
                    {ret.customerName || 'Walk-in'}
                  </td>
                  <td className="px-3 sm:px-6 py-4">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getTypeBadge(ret.type)}`}>
                      {ret.type.charAt(0).toUpperCase() + ret.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm font-semibold">{formatCurrency(ret.amount)}</td>
                  <td className="px-3 sm:px-6 py-4">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(ret.status)}`}>
                      {ret.status.charAt(0).toUpperCase() + ret.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Return Modal - Simplified for now */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold">New Return/Refund</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Return/Refund functionality requires selecting a sale. This feature will be fully implemented with sale selection.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

