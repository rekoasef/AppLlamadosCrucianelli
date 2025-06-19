'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { crucianelliFormConfig, leafFormConfig } from '@/config/form-config';

// --- Interfaces y Componentes Auxiliares ---
interface DetailedCallRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  contactName: string;
  machineSerialNumber: string | null;
  observations: string | null;
  status: string;
  billedClient: string | null;
  specificData: { [key: string]: any } | null;
  businessUnit: { name: string; };
  callerType: { name: string; } | null;
  machineType: { name: string; } | null;
  dealership: { name: string; } | null;
  inquiryArea: { name: string; } | null;
  responseReason: { name: string; } | null;
  contactChannel: { name: string; } | null;
  durationRange: { name: string; } | null;
  urgencyLevel: { name: string; } | null;
  createdByUser: { name: string; };
  handledBy: { name:string; } | null;
}

const statusTranslations: { [key: string]: string } = {
  OPEN: 'Abierto', IN_PROGRESS: 'En Progreso', CLOSED: 'Cerrado', PENDING_CLIENT: 'Pendiente del Cliente'
};

const DetailItem = ({ label, value }: { label: string; value: string | null | undefined }) => (
  <div>
    <dt className="text-sm font-medium text-crucianelli-gray">{label}</dt>
    <dd className="mt-1 text-sm text-crucianelli-dark">{value || 'N/A'}</dd>
  </div>
);

export default function RecordDetailPage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [record, setRecord] = useState<DetailedCallRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const detailConfig = useMemo(() => {
    if (!record) return [];
    if (record.businessUnit.name === 'Crucianelli') return crucianelliFormConfig;
    if (record.businessUnit.name === 'Leaf') return leafFormConfig;
    return [];
  }, [record]);
  
  const fetchRecord = useCallback(async () => {
    if (!token || !id) return;
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/call-records/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) throw new Error(`No se pudo encontrar el registro.`);
      const data = await response.json();
      setRecord(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token, id]);

  useEffect(() => {
    fetchRecord();
  }, [fetchRecord]);

  if (isLoading) return <div className="p-8 text-center">Cargando detalles del registro...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  if (!record) return <div className="p-8 text-center">No se encontró el registro.</div>;

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-crucianelli-dark">Detalle del Registro ({record.businessUnit.name})</h1>
          <p className="mt-1 text-sm text-crucianelli-gray">ID: {record.id}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href={`/records/${id}/edit`} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-crucianelli-red hover:bg-opacity-90">Editar</Link>
          <Link href="/records" className="text-sm font-medium text-crucianelli-red hover:text-opacity-80">&larr; Volver</Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow"><h2 className="text-lg font-semibold text-crucianelli-dark border-b pb-3 mb-4">Detalles del Contacto</h2><dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4"><DetailItem label="Quién Llama" value={record.callerType?.name} /><DetailItem label="Nombre del Contacto" value={record.contactName} /><DetailItem label="Concesionario" value={record.dealership?.name} /><DetailItem label="Cliente Facturado" value={record.billedClient} /></dl></div>
            <div className="bg-white p-6 rounded-lg shadow"><h2 className="text-lg font-semibold text-crucianelli-dark border-b pb-3 mb-4">Información del Producto</h2><dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4"><DetailItem label="Tipo de Máquina" value={record.machineType?.name} /><DetailItem label="N° de Serie / OF" value={record.machineSerialNumber} /><DetailItem label="Tipo de Producto LEAF" value={record.specificData?.leafProductTypeId} /><DetailItem label="Número de Serie LEAF" value={record.specificData?.leafSerialNumber} /></dl></div>
            <div className="bg-white p-6 rounded-lg shadow"><h2 className="text-lg font-semibold text-crucianelli-dark border-b pb-3 mb-4">Detalle de la Consulta</h2><p className="text-sm text-crucianelli-dark prose max-w-none">{record.observations || 'Sin observaciones.'}</p></div>
        </div>
        <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow"><h2 className="text-lg font-semibold text-crucianelli-dark border-b pb-3 mb-4">Clasificación y Estado</h2><dl className="space-y-4"><DetailItem label="Estado Actual" value={statusTranslations[record.status]} /><DetailItem label="Área de Consulta / Sistema" value={record.inquiryArea?.name} /><DetailItem label="Motivo" value={record.responseReason?.name} /><DetailItem label="Nivel de Urgencia" value={record.urgencyLevel?.name} /><DetailItem label="Canal de Contacto" value={record.contactChannel?.name} /><DetailItem label="Duración" value={record.durationRange?.name} /></dl></div>
            <div className="bg-white p-6 rounded-lg shadow"><h2 className="text-lg font-semibold text-crucianelli-dark border-b pb-3 mb-4">Auditoría</h2><dl className="space-y-4"><DetailItem label="Creado por" value={record.createdByUser.name} /><DetailItem label="Fecha de Creación" value={new Date(record.createdAt).toLocaleString('es-AR')} /><DetailItem label="Última Actualización" value={new Date(record.updatedAt).toLocaleString('es-AR')} /><DetailItem label="Atendido por" value={record.handledBy?.name} /></dl></div>
        </div>
      </div>
    </div>
  );
}
