'use client';

import { useState, useEffect, FormEvent, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { crucianelliFormConfig, FormField, FormData, Catalogs } from '@/config/form-config';

// Un componente genérico para renderizar cualquier campo del formulario
const DynamicField = ({ field, value, catalogs, handleChange }: { field: FormField, value: any, catalogs: Catalogs, handleChange: (e: any) => void }) => {
  const commonClasses = "mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-crucianelli-red focus:ring-crucianelli-red sm:text-sm text-crucianelli-dark";

  switch (field.type) {
    case 'select':
      return (
        <select name={field.name} value={value || ''} onChange={handleChange} required={field.required} className={commonClasses}>
          <option value="">Seleccionar...</option>
          {field.optionsKey && catalogs[field.optionsKey]?.map((option: any) => (
            <option key={option.id} value={option.id}>{option.name}</option>
          ))}
        </select>
      );
    case 'textarea':
      return <textarea name={field.name} value={value || ''} onChange={handleChange} required={field.required} rows={5} className={commonClasses} />;
    case 'text':
    default:
      return <input type="text" name={field.name} value={value || ''} onChange={handleChange} required={field.required} className={commonClasses} />;
  }
};


export default function NewRecordPage() {
  const { token } = useAuth();
  const router = useRouter();

  // Estados
  const [businessUnits, setBusinessUnits] = useState<any[]>([]);
  const [selectedBusinessUnitId, setSelectedBusinessUnitId] = useState<string>('');
  const [catalogs, setCatalogs] = useState<Catalogs>({});
  const [formData, setFormData] = useState<Partial<FormData>>({});
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determina qué "plano" de formulario usar basado en la selección
  const formConfig = useMemo(() => {
    const selectedUnit = businessUnits.find(bu => bu.id === selectedBusinessUnitId);
    if (selectedUnit?.name === 'Crucianelli') {
      return crucianelliFormConfig;
    }
    return []; // Por defecto, ningún campo
  }, [selectedBusinessUnitId, businessUnits]);

  // Cargar catálogos y unidades de negocio
  useEffect(() => {
    if (!token) return;

    const fetchInitialData = async () => {
      try {
        const catalogEndpoints = ['business-units', 'caller-types', 'machine-types', 'dealerships', 'inquiry-areas', 'response-reasons', 'contact-channels', 'duration-ranges', 'urgency-levels'];
        const responses = await Promise.all(
          catalogEndpoints.map(endpoint => fetch(`http://localhost:3000/catalogs/${endpoint}`, { headers: { 'Authorization': `Bearer ${token}` } }))
        );
        const jsonData = await Promise.all(responses.map(res => res.json()));
        
        const businessUnitsData = jsonData[0];
        setBusinessUnits(businessUnitsData);

        const catalogsData = catalogEndpoints.slice(1).reduce((acc, endpoint, index) => {
          const key = endpoint.replace(/-(\w)/g, (_, c) => c.toUpperCase());
          acc[key] = jsonData[index + 1];
          return acc;
        }, {} as Catalogs);
        setCatalogs(catalogsData);

      } catch (err: any) {
        setError("Error al cargar datos iniciales. " + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedBusinessUnitId) {
      setError("Por favor, seleccione una unidad de negocio.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    
    const submissionData = {
      ...formData,
      businessUnitId: selectedBusinessUnitId,
    };

    try {
      const response = await fetch('http://localhost:3000/call-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message?.[0] || 'Error al crear el registro.');
      }
      
      router.push('/records');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-crucianelli-dark">Nuevo Registro de Llamada</h1>
          <Link href="/records" className="text-sm font-medium text-crucianelli-red hover:text-opacity-80">&larr; Volver a la lista</Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <label htmlFor="businessUnit" className="block text-lg font-semibold text-crucianelli-dark">Unidad de Negocio</label>
        <p className="text-sm text-crucianelli-gray mb-2">Seleccione la empresa para la cual se está registrando la llamada.</p>
        <select
          id="businessUnit"
          value={selectedBusinessUnitId}
          onChange={(e) => setSelectedBusinessUnitId(e.target.value)}
          className="mt-1 block w-full md:w-1/3 border-gray-300 rounded-md shadow-sm focus:border-crucianelli-red focus:ring-crucianelli-red sm:text-sm text-crucianelli-dark"
        >
          <option value="">Seleccionar empresa...</option>
          {businessUnits.map(bu => <option key={bu.id} value={bu.id}>{bu.name}</option>)}
        </select>
      </div>
      
      {selectedBusinessUnitId && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {/* Tarjeta de Detalles del Contacto */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-crucianelli-dark mb-4">Detalles del Contacto</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {formConfig.filter(f => ['callerTypeId', 'contactName', 'dealershipId', 'billedClient'].includes(f.name)).map(field => (
                  <div key={field.name}>
                    <label htmlFor={field.name} className="block text-sm font-medium text-crucianelli-gray">{field.label}</label>
                    <DynamicField field={field} value={formData[field.name as keyof FormData]} catalogs={catalogs} handleChange={handleChange} />
                  </div>
                ))}
              </div>
            </div>

            {/* Tarjeta de Información de la Máquina */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-crucianelli-dark mb-4">Información de la Máquina</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {formConfig.filter(f => ['machineTypeId', 'machineSerialNumber'].includes(f.name)).map(field => (
                  <div key={field.name}>
                    <label htmlFor={field.name} className="block text-sm font-medium text-crucianelli-gray">{field.label}</label>
                    <DynamicField field={field} value={formData[field.name as keyof FormData]} catalogs={catalogs} handleChange={handleChange} />
                  </div>
                ))}
              </div>
            </div>

            {/* Tarjeta de Observaciones */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-crucianelli-dark mb-4">Detalle de la Consulta</h2>
              {formConfig.filter(f => f.name === 'observations').map(field => (
                <div key={field.name}>
                  <label htmlFor={field.name} className="block text-sm font-medium text-crucianelli-gray">{field.label}</label>
                  <DynamicField field={field} value={formData[field.name as keyof FormData]} catalogs={catalogs} handleChange={handleChange} />
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-1 space-y-6">
            {/* Tarjeta de Clasificación */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-crucianelli-dark mb-4">Clasificación</h2>
              <div className="space-y-4">
                {formConfig.filter(f => ['inquiryAreaId', 'responseReasonId', 'urgencyLevelId', 'contactChannelId', 'durationRangeId'].includes(f.name)).map(field => (
                  <div key={field.name}>
                    <label htmlFor={field.name} className="block text-sm font-medium text-crucianelli-gray">{field.label}</label>
                    <DynamicField field={field} value={formData[field.name as keyof FormData]} catalogs={catalogs} handleChange={handleChange} />
                  </div>
                ))}
              </div>
            </div>

            {/* Tarjeta de Acciones */}
            <div className="bg-white p-6 rounded-lg shadow">
               <h2 className="text-lg font-semibold text-crucianelli-dark mb-4">Acciones</h2>
               {error && <div className="mb-4 text-red-600 text-sm bg-red-100 p-3 rounded-md">{error}</div>}
               <div className="flex flex-col gap-4">
                <button type="submit" disabled={isSubmitting} className="w-full px-4 py-2 text-sm font-medium text-white bg-crucianelli-red rounded-md hover:bg-opacity-90 disabled:bg-opacity-50 transition-colors">
                  {isSubmitting ? 'Guardando...' : 'Guardar Registro'}
                </button>
                <button type="button" onClick={() => router.push('/records')} className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
