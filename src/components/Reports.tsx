import React, { useState } from 'react';
import { Download, FileText, BarChart3, TrendingUp, Package, Calendar } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { MOCK_PRODUCTS, MOCK_SALES_DATA } from '@/utils/constants';
import { LucideIcon } from 'lucide-react';

interface Report {
  id: string;
  title: string;
  type: 'sales' | 'inventory' | 'profit' | 'custom';
  description: string;
  icon: LucideIcon;
}

const reportTypes: Report[] = [
  {
    id: 'sales',
    title: 'Sales Report',
    type: 'sales',
    description: 'Generate comprehensive sales reports with revenue, transactions, and trends',
    icon: BarChart3,
  },
  {
    id: 'inventory',
    title: 'Inventory Report',
    type: 'inventory',
    description: 'View stock levels, low stock items, and inventory valuation',
    icon: Package,
  },
  {
    id: 'profit',
    title: 'Profit & Loss',
    type: 'profit',
    description: 'Analyze profit margins, costs, and revenue breakdown',
    icon: TrendingUp,
  },
  {
    id: 'custom',
    title: 'Custom Report',
    type: 'custom',
    description: 'Create custom reports with selected data and date ranges',
    icon: FileText,
  },
];

export const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const handleGenerateReport = (reportId: string) => {
    setSelectedReport(reportId);
    // In production, this would generate the actual report
    alert(`Generating ${reportTypes.find(r => r.id === reportId)?.title}...`);
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    // In production, this would export the report
    alert(`Exporting report as ${format.toUpperCase()}...`);
  };

  const totalInventoryValue = MOCK_PRODUCTS.reduce((sum, p) => sum + (p.stock * p.cost), 0);
  const totalRevenue = MOCK_SALES_DATA.reduce((sum, d) => sum + d.revenue, 0);
  const totalCost = MOCK_PRODUCTS.reduce((sum, p) => sum + (p.stock * p.cost), 0);
  const profit = totalRevenue - totalCost;

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reports</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Inventory Value</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalInventoryValue)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Cost</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalCost)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Profit</p>
          <p className="text-2xl font-bold text-purple-600">{formatCurrency(profit)}</p>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={20} className="text-gray-600" />
          <h3 className="font-semibold">Date Range</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">From</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">To</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportTypes.map(report => {
          const Icon = report.icon;
          return (
            <div key={report.id} className="bg-white p-4 sm:p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{report.title}</h3>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleGenerateReport(report.id)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Generate
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  title="Export as PDF"
                >
                  <Download size={18} />
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                  title="Export as Excel"
                >
                  <FileText size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Preview Section */}
      {selectedReport && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            {reportTypes.find(r => r.id === selectedReport)?.title} Preview
          </h3>
          <div className="text-center py-8 text-gray-500">
            <p>Report preview will be displayed here</p>
            <p className="text-sm mt-2">In production, this would show the actual report data</p>
          </div>
        </div>
      )}
    </div>
  );
};

