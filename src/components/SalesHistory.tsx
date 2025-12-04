import React, { useState } from 'react';
import { Sale } from '@/types';
import { formatCurrency } from '@/utils/format';
import { Search, Download, Eye } from 'lucide-react';

const MOCK_SALES: Sale[] = [
  {
    id: 'SALE-001',
    date: '2024-01-15',
    time: '10:30 AM',
    customerName: 'John Smith',
    items: [
      { productId: 1, productName: 'Laptop', sku: 'LAP001', quantity: 1, unitPrice: 1200, total: 1200 },
      { productId: 2, productName: 'Mouse', sku: 'MOU001', quantity: 2, unitPrice: 25, total: 50 },
    ],
    subtotal: 1250,
    tax: 187.5,
    discount: 0,
    total: 1437.5,
    paymentMethod: 'card',
    status: 'completed',
  },
  {
    id: 'SALE-002',
    date: '2024-01-15',
    time: '11:15 AM',
    customerName: 'Walk-in Customer',
    items: [
      { productId: 5, productName: 'USB Cable', sku: 'USB001', quantity: 5, unitPrice: 5, total: 25 },
    ],
    subtotal: 25,
    tax: 3.75,
    discount: 0,
    total: 28.75,
    paymentMethod: 'cash',
    status: 'completed',
  },
  {
    id: 'SALE-003',
    date: '2024-01-14',
    time: '2:45 PM',
    customerName: 'Jane Doe',
    items: [
      { productId: 4, productName: 'Monitor', sku: 'MON001', quantity: 1, unitPrice: 300, total: 300 },
    ],
    subtotal: 300,
    tax: 45,
    discount: 30,
    total: 315,
    paymentMethod: 'mobile',
    status: 'completed',
  },
];

export const SalesHistory: React.FC = () => {
  // Load sales from localStorage, fallback to mock data
  const [sales, setSales] = useState<Sale[]>(() => {
    try {
      const savedSales = localStorage.getItem('replenishhq_sales');
      if (savedSales) {
        const parsed = JSON.parse(savedSales);
        return parsed.length > 0 ? parsed : MOCK_SALES;
      }
    } catch (error) {
      console.error('Error loading sales:', error);
    }
    return MOCK_SALES;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  // Listen for new sales
  React.useEffect(() => {
    const handleNewSale = () => {
      try {
        const savedSales = localStorage.getItem('replenishhq_sales');
        if (savedSales) {
          const parsed = JSON.parse(savedSales);
          setSales(parsed.length > 0 ? parsed : MOCK_SALES);
        }
      } catch (error) {
        console.error('Error loading sales:', error);
      }
    };

    window.addEventListener('storage', handleNewSale);
    window.addEventListener('newSaleAdded', handleNewSale);
    return () => {
      window.removeEventListener('storage', handleNewSale);
      window.removeEventListener('newSaleAdded', handleNewSale);
    };
  }, []);

  const filteredSales = sales.filter(sale => {
    const matchesSearch = 
      sale.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.customerName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || sale.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalSales = filteredSales.length;

  const handleExport = () => {
    // In production, this would generate and download a CSV/PDF
    alert('Export functionality will generate a report file');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Sales History</h1>
        <button
          onClick={handleExport}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base flex items-center gap-2"
        >
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Sales</p>
          <p className="text-2xl font-bold text-gray-900">{totalSales}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Average Sale</p>
          <p className="text-2xl font-bold text-blue-600">
            {totalSales > 0 ? formatCurrency(totalRevenue / totalSales) : formatCurrency(0)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by sale ID or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="refunded">Refunded</option>
          <option value="partial">Partial</option>
        </select>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle px-4 sm:px-0">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Sale ID</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Date & Time</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold hidden sm:table-cell">Customer</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Items</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Total</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Payment</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map(sale => (
                <tr key={sale.id} className="border-b hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4 font-medium text-xs sm:text-sm">{sale.id}</td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                    <div>{sale.date}</div>
                    <div className="text-gray-500 text-xs">{sale.time}</div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm hidden sm:table-cell">
                    {sale.customerName || 'Walk-in'}
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">{sale.items.length} item(s)</td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm font-semibold">{formatCurrency(sale.total)}</td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm capitalize">{sale.paymentMethod}</td>
                  <td className="px-3 sm:px-6 py-4">
                    <button
                      onClick={() => setSelectedSale(sale)}
                      className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm flex items-center gap-1"
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sale Detail Modal */}
      {selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold">Sale Details - {selectedSale.id}</h2>
              <button
                onClick={() => setSelectedSale(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold">{selectedSale.date} {selectedSale.time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-semibold">{selectedSale.customerName || 'Walk-in Customer'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold capitalize">{selectedSale.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    selectedSale.status === 'completed' ? 'bg-green-100 text-green-700' :
                    selectedSale.status === 'refunded' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedSale.status}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2">Items</p>
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left">Product</th>
                      <th className="px-3 py-2 text-left">Qty</th>
                      <th className="px-3 py-2 text-right">Price</th>
                      <th className="px-3 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSale.items.map((item, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="px-3 py-2">{item.productName}</td>
                        <td className="px-3 py-2">{item.quantity}</td>
                        <td className="px-3 py-2 text-right">{formatCurrency(item.unitPrice)}</td>
                        <td className="px-3 py-2 text-right font-semibold">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(selectedSale.subtotal)}</span>
                </div>
                {selectedSale.discount > 0 && (
                  <div className="flex justify-between mb-2 text-green-600">
                    <span>Discount:</span>
                    <span>-{formatCurrency(selectedSale.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between mb-2">
                  <span>Tax:</span>
                  <span>{formatCurrency(selectedSale.tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(selectedSale.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

