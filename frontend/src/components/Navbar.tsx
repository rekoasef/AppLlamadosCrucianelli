// frontend/src/components/Navbar.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Verificamos si el contexto todavía está cargando o si no hay usuario
  // para no mostrar nada y evitar errores.
  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', admin: false },
    { href: '/records', label: 'Registros', admin: false },
    { href: '/admin/users', label: 'Gestión de Usuarios', admin: true },
  ];

  const getLinkClass = (href: string) => {
    return pathname === href
      ? 'bg-crucianelli-dark text-white'
      : 'text-gray-300 hover:bg-gray-700 hover:text-white';
  };

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/dashboard">
                {/* --- CORRECCIÓN DE LA RUTA DEL LOGO --- */}
                <img
                  className="h-10 w-auto"
                  src="/logo-cr-red.png" 
                  alt="Crucianelli Logo"
                  style={{ filter: 'brightness(0) invert(1)' }} // Truco CSS para hacer el logo rojo->blanco
                />
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((link) => (
                  ((link.admin && user.role === 'ADMIN') || !link.admin) ? (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${getLinkClass(link.href)}`}
                    >
                      {link.label}
                    </Link>
                  ) : null
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <span className="text-gray-300 text-sm mr-4">Hola, {user.name}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <span className="sr-only">Abrir menú principal</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              ((link.admin && user.role === 'ADMIN') || !link.admin) ? (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${getLinkClass(link.href)}`}
                >
                  {link.label}
                </Link>
              ) : null
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-white">{user.name}</div>
                <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;