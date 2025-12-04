import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StatCard } from './StatCard';
import { MOCK_PRODUCTS, MOCK_SALES_DATA } from '@/utils/constants';
import { formatCurrency } from '@/utils/format';

export const Dashboard: React.FC = () => {
  const totalProducts = MOCK_PRODUCTS.length;
  const outOfStock = MOCK_PRODUCTS.filter(p => p.stock === 0).length;
  const lowStock = MOCK_PRODUCTS.filter(p => p.stock > 0 && p.stock <= p.threshold).length;
  const todayRevenue = 12500;

  const recentTransactions = [
    { product: 'Laptop', qty: 1, amount: formatCurrency(1200), time: '10:30 AM' },
    { product: 'Mouse', qty: 3, amount: formatCurrency(75), time: '11:15 AM' },
    { product: 'USB Cable', qty: 5, amount: formatCurrency(25), time: '2:45 PM' },
  ];

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
            <BarChart data={MOCK_PRODUCTS.slice(0, 4)}>
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
                {recentTransactions.map((txn, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="px-2 sm:px-4 py-2">{txn.product}</td>
                    <td className="px-2 sm:px-4 py-2">{txn.qty}</td>
                    <td className="px-2 sm:px-4 py-2">{txn.amount}</td>
                    <td className="px-2 sm:px-4 py-2">{txn.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

