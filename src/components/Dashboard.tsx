import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StatCard } from './StatCard';
import { MOCK_SALES_DATA } from '@/utils/constants';
import { formatCurrency } from '@/utils/format';
import { dataManager } from '@/utils/dataManager';

export const Dashboard: React.FC = () => {
  const [products, setProducts] = useState(() => dataManager.getProducts());
  const [todayRevenue, setTodayRevenue] = useState(() => dataManager.getTodayRevenue());
  const [recentTransactions, setRecentTransactions] = useState(() => dataManager.getRecentTransactions(5));

  useEffect(() => {
    const handleProductsUpdate = () => {
      setProducts(dataManager.getProducts());
    };
    const handleSalesUpdate = () => {
      setTodayRevenue(dataManager.getTodayRevenue());
      setRecentTransactions(dataManager.getRecentTransactions(5));
    };

    window.addEventListener('productsUpdated', handleProductsUpdate);
    window.addEventListener('salesUpdated', handleSalesUpdate);
    
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate);
      window.removeEventListener('salesUpdated', handleSalesUpdate);
    };
  }, []);

  const totalProducts = products.length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= p.threshold).length;

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total Products" value={totalProducts} color="blue" />
        <StatCard label="Out of Stock" value={outOfStock} color="red" />
        <StatCard label="Low Stock" value={lowStock} color="yellow" />
        <StatCard label="Today's Revenue" value={formatCurrency(todayRevenue)} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-base sm:text-lg font-semibold mb-4">Sales Trend</h3>
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <LineChart data={MOCK_SALES_DATA}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-base sm:text-lg font-semibold mb-4">Top Selling Products</h3>
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <BarChart data={products.slice(0, 4)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="price" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
        <h3 className="text-base sm:text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle px-4 sm:px-0">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-4 py-2 text-left">Product</th>
                  <th className="px-2 sm:px-4 py-2 text-left">Quantity</th>
                  <th className="px-2 sm:px-4 py-2 text-left">Amount</th>
                  <th className="px-2 sm:px-4 py-2 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-2 sm:px-4 py-4 text-center text-gray-500">
                      No recent transactions
                    </td>
                  </tr>
                ) : (
                  recentTransactions.map((txn, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="px-2 sm:px-4 py-2">{txn.product}</td>
                      <td className="px-2 sm:px-4 py-2">{txn.qty}</td>
                      <td className="px-2 sm:px-4 py-2">{typeof txn.amount === 'number' ? formatCurrency(txn.amount) : txn.amount}</td>
                      <td className="px-2 sm:px-4 py-2">{txn.time}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

