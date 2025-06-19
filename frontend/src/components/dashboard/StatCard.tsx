// frontend/src/components/dashboard/StatCard.tsx
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
      {icon && (
        <div className="bg-crucianelli-red/10 text-crucianelli-red p-3 rounded-full">
          {icon}
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
        <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
        {description && (
          <p className="text-sm text-gray-500 mt-2">{description}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;