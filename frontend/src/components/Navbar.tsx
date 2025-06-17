'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // No mostramos la barra en las páginas de login/registro o mientras carga la auth
  if (!user || isLoading) {
    return null;
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo o Nombre de la App */}
          <div className="flex-shrink-0">
            <Link href="/records" className="text-xl font-bold text-crucianelli-red">
              Crucianelli
            </Link>
          </div>

          {/* Menú de Usuario */}
          <div className="flex items-center">
            <span className="text-sm text-crucianelli-gray mr-4">
              Hola, {user.email}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium text-white bg-crucianelli-red hover:bg-opacity-90 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
