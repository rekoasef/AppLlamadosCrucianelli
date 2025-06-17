'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode'; // Necesitaremos una librería para decodificar el token

// 1. Definimos la forma de los datos que compartiremos
interface AuthContextType {
  token: string | null;
  user: { email: string; role: string } | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

// 2. Creamos el Contexto con un valor inicial
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Creamos el "Proveedor" (el componente que envuelve nuestra app)
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Al cargar la app, revisamos si hay un token en el localStorage (nuestra cartera)
    try {
      const storedToken = localStorage.getItem('access_token');
      if (storedToken) {
        const decodedUser: { email: string; role: string } = jwtDecode(storedToken);
        setToken(storedToken);
        setUser(decodedUser);
      }
    } catch (error) {
      // Si el token es inválido o no existe, nos aseguramos de que todo esté limpio.
      localStorage.removeItem('access_token');
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string) => {
    const decodedUser: { email: string; role: string } = jwtDecode(newToken);
    localStorage.setItem('access_token', newToken);
    setToken(newToken);
    setUser(decodedUser);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Creamos un "Hook" personalizado para usar el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
