import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  color: 'blue' | 'red' | 'yellow' | 'green';
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    red: 'bg-red-50 text-red-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    green: 'bg-green-50 text-green-700',
  };

  return (
    <div className={`p-3 sm:p-4 rounded-lg ${colors[color]}`}>
      <p className="text-xs sm:text-sm font-medium">{label}</p>
      <p className="text-xl sm:text-2xl font-bold mt-1 sm:mt-2">{value}</p>
    </div>
  );
};

