'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

// Interfaces para los datos
interface CatalogItem {
  id: string;
  name: string;
}
type FormData = {
  contactName: string;
  machineSerialNumber: string;
  observations: string;
  billedClient: string;
  callerTypeId: string;
  machineTypeId: string;
  dealershipId: string;
  inquiryAreaId: string;
  responseReasonId: string;
  contactChannelId: string;
  durationRangeId: string;
  urgencyLevelId: string;
};

export default function EditRecordPage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { id } = params; // Obtenemos el ID del registro de la URL

  // Estados
  const [catalogs, setCatalogs] = useState<{ [key: string]: CatalogItem[] }>({});
  const [formData, setFormData] = useState<Partial<FormData>>({}); // Empezamos con el form vacío
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Efecto para cargar TODOS los datos necesarios ---
  useEffect(() => {
    if (!token || !id) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Peticiones en paralelo para los catálogos y el registro específico
        const catalogEndpoints = ['caller-types', 'machine-types', 'dealerships', 'inquiry-areas', 'response-reasons', 'contact-channels', 'duration-ranges', 'urgency-levels'];
        const catalogPromises = catalogEndpoints.map(endpoint => fetch(`http://localhost:3000/catalogs/${endpoint}`, { headers: { 'Authorization': `Bearer ${token}` } }));
        const recordPromise = fetch(`http://localhost:3000/call-records/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
        
        const responses = await Promise.all([...catalogPromises, recordPromise]);

        // Verificamos todas las respuestas
        for (const res of responses) {
          if (!res.ok) throw new Error(`Falló la carga de datos: ${res.statusText}`);
        }

        const jsonData = await Promise.all(responses.map(res => res.json()));

        // Procesamos los catálogos
        const catalogsData = catalogEndpoints.reduce((acc, endpoint, index) => {
          const key = endpoint.replace(/-(\w)/g, (_, c) => c.toUpperCase());
          acc[key] = jsonData[index];
          return acc;
        }, {} as { [key: string]: CatalogItem[] });
        setCatalogs(catalogsData);

        // Procesamos el registro y pre-cargamos el formulario
        const recordData = jsonData[catalogEndpoints.length];
        setFormData({
            contactName: recordData.contactName || '',
            machineSerialNumber: recordData.machineSerialNumber || '',
            observations: recordData.observations || '',
            billedClient: recordData.billedClient || '',
            callerTypeId: recordData.callerType?.id || '',
            machineTypeId: recordData.machineType?.id || '',
            dealershipId: recordData.dealership?.id || '',
            inquiryAreaId: recordData.inquiryArea?.id || '',
            responseReasonId: recordData.responseReason?.id || '',
            contactChannelId: recordData.contactChannel?.id || '',
            durationRangeId: recordData.durationRange?.id || '',
            urgencyLevelId: recordData.urgencyLevel?.id || '',
        });

      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token, id]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/call-records/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message?.[0] || 'Error al actualizar el registro.');
      }
      router.push(`/records/${id}`); // Volvemos a la página de detalle
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center">Cargando datos para edición...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-crucianelli-dark">Editar Registro</h1>
          <p className="mt-1 text-sm text-crucianelli-gray">Modifique los campos necesarios y guarde los cambios.</p>
        </div>
        <Link href={`/records/${id}`} className="text-sm font-medium text-crucianelli-red hover:text-opacity-80">
          &larr; Volver al detalle
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* === INICIO DEL FORMULARIO COMPLETO === */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-crucianelli-dark mb-4">Detalles del Contacto</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="callerTypeId" className="block text-sm font-medium text-crucianelli-gray">Quién Llama</label>
                <select name="callerTypeId" id="callerTypeId" value={formData.callerTypeId || ''} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-crucianelli-red focus:ring-crucianelli-red sm:text-sm text-crucianelli-dark">
                  <option value="">Seleccionar...</option>
                  {catalogs.callerTypes?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
               <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-crucianelli-gray">Nombre del Contacto</label>
                <input type="text" name="contactName" id="contactName" value={formData.contactName || ''} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-crucianelli-red focus:ring-crucianelli-red sm:text-sm text-crucianelli-dark" />
              </div>
              <div>
                <label htmlFor="dealershipId" className="block text-sm font-medium text-crucianelli-gray">Concesionario</label>
                <select name="dealershipId" id="dealershipId" value={formData.dealershipId || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-crucianelli-red focus:ring-crucianelli-red sm:text-sm text-crucianelli-dark">
                  <option value="">Seleccionar...</option>
                  {catalogs.dealerships?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="billedClient" className="block text-sm font-medium text-crucianelli-gray">Cliente Facturado</label>
                <input type="text" name="billedClient" id="billedClient" value={formData.billedClient || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-crucianelli-red focus:ring-crucianelli-red sm:text-sm text-crucianelli-dark" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-crucianelli-dark mb-4">Información de la Máquina</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="machineTypeId" className="block text-sm font-medium text-crucianelli-gray">Tipo de Máquina</label>
                <select name="machineTypeId" id="machineTypeId" value={formData.machineTypeId || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-crucianelli-red focus:ring-crucianelli-red sm:text-sm text-crucianelli-dark">
                  <option value="">Seleccionar...</option>
                  {catalogs.machineTypes?.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="machineSerialNumber" className="block text-sm font-medium text-crucianelli-gray">N° de Serie / OF</label>
                <input type="text" name="machineSerialNumber" id="machineSerialNumber" value={formData.machineSerialNumber || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-crucianelli-red focus:ring-crucianelli-red sm:text-sm text-crucianelli-dark" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
             <h2 className="text-lg font-semibold text-crucianelli-dark mb-4">Detalle de la Consulta</h2>
             <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="observations" className="block text-sm font-medium text-crucianelli-gray">Observaciones</label>
                  <textarea name="observations" id="observations" value={formData.observations || ''} onChange={handleChange} rows={5} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-crucianelli-red focus:ring-crucianelli-red sm:text-sm text-crucianelli-dark"></textarea>
                </div>
             </div>
          </div>
        </div>

        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-crucianelli-dark mb-4">Clasificación</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="inquiryAreaId" className="block text-sm font-medium text-crucianelli-gray">Área de Consulta</label>
                <select name="inquiryAreaId" id="inquiryAreaId" value={formData.inquiryAreaId || ''} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-crucianelli-red focus:ring-crucianelli-red sm:text-sm text-crucianelli-dark">
                  <option value="">Seleccionar...</option>
                  {catalogs.inquiryAreas?.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
              </div>
               <div>
                <label htmlFor="responseReasonId" className="block text-sm font-medium text-crucianelli-gray">Motivo</label>
                <select name="responseReasonId" id="responseReasonId" value={formData.responseReasonId || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-crucianelli-red focus:ring-crucianelli-red sm:text-sm text-crucianelli-dark">
                  <option value="">Seleccionar...</option>
                  {catalogs.responseReasons?.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="urgencyLevelId" className="block text-sm font-medium text-crucianelli-gray">Nivel de Urgencia</label>
                <select name="urgencyLevelId" id="urgencyLevelId" value={formData.urgencyLevelId || ''} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-crucianelli-red focus:ring-crucianelli-red sm:text-sm text-crucianelli-dark">
                  <option value="">Seleccionar...</option>
                  {catalogs.urgencyLevels?.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
               <div>
                <label htmlFor="contactChannelId" className="block text-sm font-medium text-crucianelli-gray">Canal de Contacto</label>
                <select name="contactChannelId" id="contactChannelId" value={formData.contactChannelId || ''} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-crucianelli-red focus:ring-crucianelli-red sm:text-sm text-crucianelli-dark">
                  <option value="">Seleccionar...</option>
                  {catalogs.contactChannels?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
               <div>
                <label htmlFor="durationRangeId" className="block text-sm font-medium text-crucianelli-gray">Duración</label>
                <select name="durationRangeId" id="durationRangeId" value={formData.durationRangeId || ''} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-crucianelli-red focus:ring-crucianelli-red sm:text-sm text-crucianelli-dark">
                  <option value="">Seleccionar...</option>
                  {catalogs.durationRanges?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
             <h2 className="text-lg font-semibold text-crucianelli-dark mb-4">Acciones</h2>
             {error && <div className="mb-4 text-red-600 text-sm bg-red-100 p-3 rounded-md">{error}</div>}
             <div className="flex flex-col gap-4">
              <button type="submit" disabled={isSubmitting || isLoading} className="w-full px-4 py-2 text-sm font-medium text-white bg-crucianelli-red rounded-md hover:bg-opacity-90 disabled:bg-opacity-50 transition-colors">
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button type="button" onClick={() => router.push(`/records/${id}`)} className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
        {/* === FIN DEL FORMULARIO COMPLETO === */}
      </form>
    </div>
  );
}
