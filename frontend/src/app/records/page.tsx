'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Definimos la 'interfaz' para el objeto de registro.
interface CallRecord {
  id: string;
  createdAt: string;
  contactName: string;
  callerType: { name: string };
  dealership: { name: string } | null;
  urgencyLevel: { name: string };
  createdByUser: { name: string };
  status: string;
}

export default function RecordsPage() {
  const { token, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [records, setRecords] = useState<CallRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      const fetchRecords = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch('http://localhost:3000/call-records', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Falló la carga de registros.');
          }

          const data = await response.json();
          setRecords(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchRecords();
    }
  }, [token]);
  
  const handleRowClick = (recordId: string) => {
    router.push(`/records/${recordId}`);
  };

  if (isAuthLoading) {
    return <div className="text-center p-10">Verificando autenticación...</div>;
  }
  
  if (!token) {
     return <div className="text-center p-10 text-red-500">Acceso denegado. Por favor, inicia sesión.</div>;
  }
  
  if (isLoading) {
    return <div className="text-center p-10">Cargando registros...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-crucianelli-dark">
          Registros de Llamadas
        </h1>
        <a 
          href="/records/new"
          className="px-4 py-2 rounded-md text-sm font-medium text-white bg-crucianelli-red hover:bg-opacity-90 transition-colors shadow-sm inline-block"
        >
          + Nuevo Registro
        </a>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concesionario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgencia</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atendido por</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record) => (
              <tr 
                key={record.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(record.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.contactName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(record.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.dealership?.name || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.urgencyLevel.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.createdByUser.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
