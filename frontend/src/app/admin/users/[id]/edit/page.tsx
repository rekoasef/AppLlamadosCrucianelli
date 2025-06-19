'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import AdminRoute from '@/components/AdminRoute';

const EditUserPageContent = () => {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { id } = params; // Obtenemos el ID del usuario desde la URL

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '', // Dejamos la contraseña en blanco por seguridad
    role: 'USER',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carga los datos del usuario a editar
  useEffect(() => {
    if (token && id) {
      const fetchUser = async () => {
        try {
          const response = await fetch(`http://localhost:3000/users/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (!response.ok) throw new Error('No se pudo cargar el usuario.');
          const data = await response.json();
          setFormData({
            name: data.name,
            email: data.email,
            password: '', // La contraseña nunca se pre-rellena
            role: data.role,
          });
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUser();
    }
  }, [token, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Creamos un objeto solo con los campos que se van a actualizar
    const dataToUpdate: { [key: string]: any } = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
    };
    // Solo incluimos la contraseña si el usuario escribió una nueva
    if (formData.password) {
      dataToUpdate.password = formData.password;
    }

    try {
      const response = await fetch(`http://localhost:3000/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataToUpdate),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = Array.isArray(errorData.message) ? errorData.message.join(', ') : errorData.message;
        throw new Error(errorMessage || 'No se pudo actualizar el usuario.');
      }
      router.push('/admin/users');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) return <div className="p-8 text-center">Cargando usuario...</div>;

  return (
    <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-crucianelli-dark">Editar Usuario</h1>
          <p className="mt-1 text-sm text-crucianelli-gray">Modifique los datos del usuario.</p>
        </div>
        <Link href="/admin/users" className="text-sm font-medium text-crucianelli-red hover:text-opacity-80">
          &larr; Volver a la lista
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-crucianelli-gray">Nombre Completo</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-crucianelli-dark" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-crucianelli-gray">Correo Electrónico</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-crucianelli-dark" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-crucianelli-gray">Nueva Contraseña (opcional)</label>
            <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-crucianelli-dark" placeholder="Dejar en blanco para no cambiar" />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-crucianelli-gray">Rol</label>
            <select name="role" id="role" value={formData.role} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-crucianelli-dark">
              <option value="USER">Usuario</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
        </div>

        {error && <div className="text-red-600 text-sm bg-red-100 p-3 rounded-md">{error}</div>}

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => router.push('/admin/users')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancelar</button>
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-crucianelli-red rounded-md hover:bg-opacity-90 disabled:bg-opacity-50">
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};


export default function EditUserPage() {
    return (
        <AdminRoute>
            <EditUserPageContent />
        </AdminRoute>
    );
}
