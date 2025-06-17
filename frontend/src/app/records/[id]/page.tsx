'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useRouter } from 'next/navigation'; // Importamos useRouter
import Link from 'next/link';

// Interfaz para el registro detallado (incluye todos los objetos relacionados)
interface DetailedCallRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  contactName: string;
  machineSerialNumber: string | null;
  observations: string | null;
  status: string;
  billedClient: string | null;
  callerType: { id: string; name: string; };
  machineType: { id: string; name: string; } | null;
  dealership: { id: string; name: string; } | null;
  inquiryArea: { id: string; name: string; };
  responseReason: { id: string; name: string; } | null;
  contactChannel: { id: string; name: string; };
  durationRange: { id: string; name: string; };
  urgencyLevel: { id: string; name: string; };
  createdByUser: { name: string; email: string; };
  handledBy: { name: string; email: string; } | null;
}

// Un pequeño componente auxiliar para mostrar los datos de forma limpia
const DetailItem = ({ label, value }: { label: string; value: string | null | undefined }) => (
  <div>
    <dt className="text-sm font-medium text-crucianelli-gray">{label}</dt>
    <dd className="mt-1 text-sm text-crucianelli-dark">{value || 'N/A'}</dd>
  </div>
);

export default function RecordDetailPage() {
  const { token } = useAuth();
  const router = useRouter(); // Inicializamos el router para la redirección
  const params = useParams(); 
  const { id } = params; 

  const [record, setRecord] = useState<DetailedCallRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
  const [isDeleting, setIsDeleting] = useState(false); // Estado para el borrado

  useEffect(() => {
    if (token && id) {
      const fetchRecord = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`http://localhost:3000/call-records/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`No se pudo encontrar el registro con ID ${id}`);
          }

          const data = await response.json();
          setRecord(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchRecord();
    }
  }, [token, id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/call-records/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("No se pudo eliminar el registro.");
      }
      // Si se borra con éxito, redirigimos a la lista
      router.push('/records');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Cargando detalles del registro...</div>;
  }

  if (error && !record) { // Mostramos error solo si no hay registro que mostrar
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  if (!record) {
    return <div className="p-8 text-center">No se encontró el registro.</div>;
  }
  
  return (
    <>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-crucianelli-dark">Detalle del Registro</h1>
            <p className="mt-1 text-sm text-crucianelli-gray">ID del Registro: {record.id}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href={`/records/${id}/edit`}
              className="px-4 py-2 rounded-md text-sm font-medium text-white bg-crucianelli-red hover:bg-opacity-90 transition-colors shadow-sm"
            >
              Editar Registro
            </Link>
            {/* BOTÓN PARA ABRIR EL MODAL DE ELIMINAR */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-md text-sm font-medium text-crucianelli-gray bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              Eliminar
            </button>
            <Link href="/records" className="text-sm font-medium text-crucianelli-red hover:text-opacity-80">
              &larr; Volver a la lista
            </Link>
          </div>
        </div>

        {/* Mostramos errores de eliminación aquí */}
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-6">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-crucianelli-dark border-b pb-3 mb-4">Detalles del Contacto</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <DetailItem label="Quién Llama" value={record.callerType.name} />
                <DetailItem label="Nombre del Contacto" value={record.contactName} />
                <DetailItem label="Concesionario" value={record.dealership?.name} />
                <DetailItem label="Cliente Facturado" value={record.billedClient} />
              </dl>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-crucianelli-dark border-b pb-3 mb-4">Información de la Máquina</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <DetailItem label="Tipo de Máquina" value={record.machineType?.name} />
                <DetailItem label="N° de Serie / OF" value={record.machineSerialNumber} />
              </dl>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-crucianelli-dark border-b pb-3 mb-4">Detalle de la Consulta</h2>
              <div className="text-sm text-crucianelli-dark prose max-w-none">
                <p>{record.observations || 'Sin observaciones.'}</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-crucianelli-dark border-b pb-3 mb-4">Clasificación y Estado</h2>
              <dl className="space-y-4">
                <DetailItem label="Estado Actual" value={record.status} />
                <DetailItem label="Área de Consulta" value={record.inquiryArea.name} />
                <DetailItem label="Motivo" value={record.responseReason?.name} />
                <DetailItem label="Nivel de Urgencia" value={record.urgencyLevel.name} />
                <DetailItem label="Canal de Contacto" value={record.contactChannel.name} />
                <DetailItem label="Duración" value={record.durationRange.name} />
              </dl>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-crucianelli-dark border-b pb-3 mb-4">Auditoría</h2>
              <dl className="space-y-4">
                <DetailItem label="Creado por" value={`${record.createdByUser.name} (${record.createdByUser.email})`} />
                <DetailItem label="Fecha de Creación" value={new Date(record.createdAt).toLocaleString('es-AR')} />
                <DetailItem label="Última Actualización" value={new Date(record.updatedAt).toLocaleString('es-AR')} />
                <DetailItem label="Atendido por" value={record.handledBy ? `${record.handledBy.name} (${record.handledBy.email})` : 'N/A'} />
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL DE CONFIRMACIÓN DE BORRADO --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-bold text-crucianelli-dark">Confirmar Eliminación</h3>
            <p className="mt-2 text-sm text-crucianelli-gray">
              ¿Estás seguro de que quieres eliminar este registro? Esta acción no se puede deshacer.
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
}
