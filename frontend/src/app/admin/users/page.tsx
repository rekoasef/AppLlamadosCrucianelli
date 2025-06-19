'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import AdminRoute from '@/components/AdminRoute';

// Interfaz para el objeto Usuario
interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
}

const UserListPageContent = () => {
  const { token, user: currentUser } = useAuth(); // Obtenemos también el usuario actual
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Estados para el modal de eliminación ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserToDelete, setSelectedUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (token) {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:3000/users', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('No se pudo cargar la lista de usuarios.');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  const openDeleteModal = (user: User) => {
    setSelectedUserToDelete(user);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedUserToDelete) return;

    setIsDeleting(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/users/${selectedUserToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("No se pudo eliminar el usuario.");
      
      // Cerramos el modal y refrescamos la lista de usuarios
      setIsModalOpen(false);
      setSelectedUserToDelete(null);
      fetchUsers();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };


  if (isLoading) {
    return <div className="p-8 text-center">Cargando usuarios...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-crucianelli-dark">
            Gestión de Usuarios
          </h1>
          <Link href="/admin/users/new">
            <button className="px-4 py-2 rounded-md text-sm font-medium text-white bg-crucianelli-red hover:bg-opacity-90 transition-colors shadow-sm">
              + Nuevo Usuario
            </button>
          </Link>
        </div>
        
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Creación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {user.role}
                      </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                    <Link href={`/admin/users/${user.id}/edit`} className="text-crucianelli-red hover:text-opacity-80">
                      Editar
                    </Link>
                    {/* El admin no se puede borrar a sí mismo */}
                    {currentUser?.email !== user.email && (
                       <button onClick={() => openDeleteModal(user)} className="text-gray-500 hover:text-red-600">
                         Eliminar
                       </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL DE CONFIRMACIÓN DE BORRADO --- */}
      {isModalOpen && selectedUserToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-bold text-crucianelli-dark">Confirmar Eliminación</h3>
            <p className="mt-2 text-sm text-crucianelli-gray">
              ¿Estás seguro de que quieres eliminar al usuario <span className="font-bold">{selectedUserToDelete.name}</span>? Esta acción no se puede deshacer.
            </p>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-red-400"
              >
                {isDeleting ? 'Eliminando...' : 'Sí, Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


export default function AdminUsersPage() {
    return (
        <AdminRoute>
            <UserListPageContent />
        </AdminRoute>
    );
}
