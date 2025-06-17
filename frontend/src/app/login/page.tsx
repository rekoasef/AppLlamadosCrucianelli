'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext'; // 1. Importamos nuestro hook personalizado

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth(); // 2. Obtenemos la función 'login' de nuestro contexto

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      // 3. ¡Login exitoso! Usamos la función del contexto para gestionar el token.
      // Esto se encargará de guardarlo en localStorage Y de actualizar el estado global.
      login(data.access_token);

      router.push('/records');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-crucianelli-light">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <svg className="mx-auto h-12 w-auto text-crucianelli-red" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
          </svg>
          <h2 className="mt-6 text-2xl font-bold text-crucianelli-dark">
            Sistema de Registro
          </h2>
          <p className="mt-2 text-sm text-crucianelli-gray">
            Ingresa tus credenciales para acceder.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm text-center text-red-800 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="text-sm font-medium text-crucianelli-dark">
                Correo Electrónico
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-crucianelli-dark rounded-md focus:outline-none focus:ring-crucianelli-red focus:border-crucianelli-red sm:text-sm"
                placeholder="usuario@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-crucianelli-dark">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-crucianelli-dark rounded-md focus:outline-none focus:ring-crucianelli-red focus:border-crucianelli-red sm:text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-crucianelli-red hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-crucianelli-red transition-colors disabled:bg-opacity-50"
            >
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
