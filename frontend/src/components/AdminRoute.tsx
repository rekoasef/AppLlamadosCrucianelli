'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ReactNode } from 'react';

// Este componente envuelve a otros y solo los muestra si el usuario es ADMIN.
const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="p-8 text-center">Verificando permisos...</div>;
  }

  if (user?.role !== 'ADMIN') {
    return (
      <div className="p-8 text-center text-red-500">
        <h1>Acceso Denegado</h1>
        <p>No tienes los permisos necesarios para ver esta página.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
