'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StatCard from '@/components/dashboard/StatCard';
// Renombramos la importación del icono para evitar conflictos de nombres
import { BarChart as IconBarChart, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import CompanyBarChart from '@/components/dashboard/CompanyBarChart';

// Definimos la estructura de los datos que esperamos del backend
interface DashboardData {
  totalRecords: number;
  openRecords: number;
  topDealerships: { name: string; count: number }[];
  recordsByStatus: { status: string; count: number }[];
  recordsByCompany: { name: string; count: number }[];
  closedRecords: {
    today: number;
    week: number;
    month: number;
    year: number;
  };
}

export default function DashboardPage() {
  const { token } = useAuth();
  // --- ASEGÚRATE DE QUE ESTAS LÍNEAS ESTÉN PRESENTES ---
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // ----------------------------------------------------

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const response = await fetch('http://localhost:3000/dashboard/general', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) {
            throw new Error(`No se pudieron cargar los datos del dashboard (Error: ${response.status})`);
          }
          const result = await response.json();
          setData(result);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [token]);

  // --- AHORA ESTAS CONDICIONES FUNCIONARÁN ---
  if (isLoading) {
    return <div className="p-8 text-center">Cargando dashboard...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  if (!data) {
    return <div className="p-8 text-center">No hay datos disponibles.</div>;
  }
  // ---------------------------------------------

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard General</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Registros Totales" 
          value={data.totalRecords} 
          icon={<IconBarChart size={24} />} 
        />
        <StatCard 
          title="Registros Abiertos" 
          value={data.openRecords}
          icon={<AlertTriangle size={24} />}
        />
        <StatCard 
          title="Cerrados Hoy" 
          value={data.closedRecords.today}
          description={`Esta semana: ${data.closedRecords.week}`}
          icon={<CheckCircle size={24} />}
        />
        <StatCard 
          title="Top Concesionario" 
          value={data.topDealerships[0]?.name || 'N/A'}
          description={`con ${data.topDealerships[0]?.count || 0} llamadas`}
          icon={<Users size={24} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Registros por Empresa</h2>
          {data.recordsByCompany && data.recordsByCompany.length > 0 ? (
            <CompanyBarChart data={data.recordsByCompany} />
          ) : (
            <p className="text-gray-500">No hay datos de registros por empresa.</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Registros por Estado</h2>
          <p className="text-gray-500">Próximamente: Gráfico de torta</p>
        </div>
      </div>
    </div>
  );
}