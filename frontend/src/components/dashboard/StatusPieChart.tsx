'use client';

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

interface StatusPieChartProps {
  data: {
    status: string;
    count: number;
  }[];
}

// Asignamos colores a cada estado para que el gráfico se vea bien
const STATUS_COLORS: { [key: string]: string } = {
  OPEN: '#3498db', // Azul
  IN_PROGRESS: '#f1c40f', // Amarillo
  CLOSED: '#2ecc71', // Verde
  PENDING_CLIENT: '#e67e22', // Naranja
};

const StatusPieChart: React.FC<StatusPieChartProps> = ({ data }) => {
  
  // Transformamos los datos al formato que Recharts necesita
  const chartData: ChartData[] = data.map(item => ({
    name: item.status.replace('_', ' '), // Reemplaza "IN_PROGRESS" por "IN PROGRESS"
    value: item.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name.replace(' ', '_')] || '#8884d8'} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default StatusPieChart;