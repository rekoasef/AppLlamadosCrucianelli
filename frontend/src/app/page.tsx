// frontend/src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Definimos las interfaces para los datos que esperamos del backend
interface Stats {
  totalRecords: number;
  openRecords: number;
  closedToday: number;
}
interface StatusDistribution {
  name: string;
  value: number;
}

// Componente para una tarjeta de estadística individual
const StatCard = ({ title, value, icon }: { title: string, value: number, icon: string }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-crucianelli-red bg-opacity-10 text-crucianelli-red">
        {/* Usamos un SVG simple como icono */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-crucianelli-gray">{title}</p>
        <p className="text-2xl font-bold text-crucianelli-dark">{value}</p>
      </div>
    </div>
  </div>
);


export default function DashboardPage() {
  const { token, isLoading: isAuthLoading } = useAuth();
  
  // Estados para nuestros datos del dashboard
  const [stats, setStats] = useState<Stats | null>(null);
  const [statusData, setStatusData] = useState<StatusDistribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && token) {
      const fetchDashboardData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // Hacemos las dos peticiones en paralelo para mayor eficiencia
          const [statsRes, statusRes] = await Promise.all([
            fetch('http://localhost:3000/dashboard/stats', {
              headers: { 'Authorization': `Bearer ${token}` },
            }),
            fetch('http://localhost:3000/dashboard/records-by-status', {
              headers: { 'Authorization': `Bearer ${token}` },
            }),
          ]);

          if (!statsRes.ok || !statusRes.ok) {
            throw new Error('No se pudieron cargar los datos del dashboard.');
          }

          const statsData = await statsRes.json();
          const statusData = await statusRes.json();
          
          setStats(statsData);
          setStatusData(statusData);

        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDashboardData();
    } else if (!isAuthLoading && !token) {
        // Si no hay token, no es un error, simplemente no cargamos nada.
        setIsLoading(false);
    }
  }, [token, isAuthLoading]);

  if (isAuthLoading || isLoading) {
    return <div className="p-8 text-center">Cargando Dashboard...</div>;
  }

  if (!token) {
    // Podríamos redirigir a /login aquí en el futuro
    return <div className="p-8 text-center text-red-500">Por favor, inicie sesión para ver el dashboard.</div>;
  }
  
  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  // Colores para el gráfico de torta
  const COLORS = ['#FF8042', '#00C49F', '#0088FE', '#FFBB28'];

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
       <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-crucianelli-dark">Dashboard</h1>
      
      {/* Sección de Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Registros Totales" value={stats?.totalRecords ?? 0} icon="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
        <StatCard title="Registros Abiertos" value={stats?.openRecords ?? 0} icon="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h16.5a1.5 1.5 0 001.5-1.5v-6a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v6a1.5 1.5 0 001.5 1.5z" />
        <StatCard title="Cerrados Hoy" value={stats?.closedToday ?? 0} icon="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </div>

      {/* Sección de Gráficos */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-crucianelli-dark mb-4">Distribución por Estado</h2>
        {statusData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-crucianelli-gray">No hay datos de registros para mostrar en el gráfico.</p>
        )}
      </div>
    </div>
  );
}
