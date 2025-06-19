// frontend/src/components/dashboard/CompanyBarChart.tsx
'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  registros: number;
}

interface CompanyBarChartProps {
  data: {
    name: string;
    count: number;
  }[];
}

const CompanyBarChart: React.FC<CompanyBarChartProps> = ({ data }) => {
  
  // Transformamos los datos al formato que Recharts necesita
  const chartData: ChartData[] = data.map(item => ({
    name: item.name,
    registros: item.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid #ccc',
            borderRadius: '5px'
          }}
        />
        <Legend />
        <Bar dataKey="registros" fill="#c41230" name="Total de Registros" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CompanyBarChart;