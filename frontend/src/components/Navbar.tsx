'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (isAuthLoading || !user) {
    return null;
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-crucianelli-red">
              Crucianelli
            </Link>
            <div className="hidden md:flex items-center gap-6">
               <Link href="/" className="text-sm font-medium text-crucianelli-gray hover:text-crucianelli-dark transition-colors">
                 Dashboard
               </Link>
               <Link href="/records" className="text-sm font-medium text-crucianelli-gray hover:text-crucianelli-dark transition-colors">
                 Registros
               </Link>
               {/* --- ENLACE CONDICIONAL PARA ADMINS --- */}
               {user.role === 'ADMIN' && (
                  <Link href="/admin/users" className="text-sm font-medium text-crucianelli-gray hover:text-crucianelli-dark transition-colors">
                    Administración
                  </Link>
               )}
            </div>
          </div>

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
