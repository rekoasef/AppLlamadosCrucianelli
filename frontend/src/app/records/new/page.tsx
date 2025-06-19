'use client';

import { useState, useEffect, FormEvent, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { crucianelliFormConfig, leafFormConfig, fertecFormConfig, FormField, FormData, Catalogs, SpecificData } from '@/config/form-config';

// Componente DynamicField (sin cambios)
const DynamicField = ({ field, value, catalogs, handleChange }: { field: FormField, value: any, catalogs: Catalogs, handleChange: (e: any) => void }) => {
  const commonClasses = "mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-crucianelli-red focus:ring-crucianelli-red sm:text-sm text-crucianelli-dark";
  switch (field.type) {
    case 'select':
      return (
        <select name={field.name} value={value || ''} onChange={handleChange} required={field.required} className={commonClasses}>
          <option value="">Seleccionar...</option>
          {field.optionsKey && catalogs[field.optionsKey]?.map((option: any) => <option key={option.id} value={option.id}>{option.name}</option>)}
        </select>
      );
    case 'textarea':
      return <textarea name={field.name} value={value || ''} onChange={handleChange} required={field.required} rows={5} className={commonClasses} />;
    default:
      return <input type="text" name={field.name} value={value || ''} onChange={handleChange} required={field.required} className={commonClasses} />;
  }
};


export default function NewRecordPage() {
  const { token } = useAuth();
  const router = useRouter();

  const [businessUnits, setBusinessUnits] = useState<any[]>([]);
  const [selectedBusinessUnitId, setSelectedBusinessUnitId] = useState<string>('');
  const [catalogs, setCatalogs] = useState<Catalogs>({});
  const [formData, setFormData] = useState<Partial<FormData & SpecificData>>({});
  
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(false); // <--- NUEVO ESTADO
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formConfig = useMemo(() => {
    const selectedUnit = businessUnits.find(bu => bu.id === selectedBusinessUnitId);
    if (selectedUnit?.name === 'Crucianelli') return crucianelliFormConfig;
    if (selectedUnit?.name === 'Leaf') return leafFormConfig;
    if (selectedUnit?.name === 'Fertec') return fertecFormConfig;
    return [];
  }, [selectedBusinessUnitId, businessUnits]);

  // --- PRIMER useEffect: Carga solo las Unidades de Negocio al inicio ---
  useEffect(() => {
    if (!token) return;
    const fetchBusinessUnits = async () => {
      try {
        const response = await fetch(`http://localhost:3000/catalogs/business-units`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (!response.ok) throw new Error('No se pudo cargar las unidades de negocio.');
        const data = await response.json();
        setBusinessUnits(data);
      } catch (err: any) {
        setError("Error al cargar datos iniciales. " + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBusinessUnits();
  }, [token]);

  // --- NUEVO useEffect: Se dispara CADA VEZ que seleccionas una Unidad de Negocio ---
  useEffect(() => {
    // Si no hay token o no has seleccionado una unidad, no hace nada.
    if (!token || !selectedBusinessUnitId) {
      setCatalogs({}); // Limpia los catálogos si deseleccionas la unidad
      return;
    }

    const fetchFilteredCatalogs = async () => {
      setIsLoadingCatalogs(true); // Muestra un indicador de carga para los menús
      setError(null);
      try {
        // Lista de catálogos que necesitamos filtrar
        const catalogEndpoints = ['caller-types', 'machine-types', 'dealerships', 'inquiry-areas', 'response-reasons', 'contact-channels', 'duration-ranges', 'urgency-levels', 'leaf-product-types', 'complaint-locations', 'fertec-machine-types'];
        
        // Hacemos una petición para cada catálogo, pero AÑADIENDO el businessUnitId
        const responses = await Promise.all(
          catalogEndpoints.map(endpoint => 
            fetch(`http://localhost:3000/catalogs/${endpoint}?businessUnitId=${selectedBusinessUnitId}`, { 
              headers: { 'Authorization': `Bearer ${token}` } 
            })
          )
        );

        const jsonData = await Promise.all(responses.map(res => res.json()));
        
        const catalogsData = catalogEndpoints.reduce((acc, endpoint, index) => {
          const key = endpoint.replace(/-(\w)/g, (_, c) => c.toUpperCase());
          acc[key] = jsonData[index];
          return acc;
        }, {} as Catalogs);
        
        setCatalogs(catalogsData);

      } catch (err: any) {
        setError("Error al cargar los catálogos para esta unidad de negocio. " + err.message);
      } finally {
        setIsLoadingCatalogs(false);
      }
    };

    fetchFilteredCatalogs();
  }, [selectedBusinessUnitId, token]); // <--- Se ejecuta cada vez que cambia el ID seleccionado

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedBusinessUnitId) { setError("Por favor, seleccione una unidad de negocio."); return; }
    setIsSubmitting(true);
    setError(null);
    
    const directColumnFields: (keyof FormData)[] = ['contactName', 'machineSerialNumber', 'observations', 'billedClient', 'callerTypeId', 'machineTypeId', 'dealershipId', 'inquiryAreaId', 'responseReasonId', 'contactChannelId', 'durationRangeId', 'urgencyLevelId'];
    const submissionData: { [key: string]: any } = { businessUnitId: selectedBusinessUnitId, specificData: {} };

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        if (directColumnFields.includes(key as any)) {
          submissionData[key] = value;
        } else {
          submissionData.specificData[key] = value;
        }
      }
    });

    try {
      const response = await fetch('http://localhost:3000/call-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = Array.isArray(errorData.message) ? errorData.message.join(', ') : (errorData.message || 'Error desconocido');
        throw new Error(errorMessage);
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
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <label htmlFor="businessUnit" className="block text-lg font-semibold text-crucianelli-dark">Unidad de Negocio</label>
        <p className="text-sm text-crucianelli-gray mb-2">Seleccione la empresa para la cual se está registrando la llamada.</p>
        <select id="businessUnit" value={selectedBusinessUnitId} onChange={(e) => {
            setSelectedBusinessUnitId(e.target.value);
            setFormData({});
          }}
          className="mt-1 block w-full md:w-1/3 border-gray-300 rounded-md shadow-sm text-crucianelli-dark">
          <option value="">Seleccionar empresa...</option>
          {businessUnits.map(bu => <option key={bu.id} value={bu.id}>{bu.name}</option>)}
        </select>
      </div>
      
      {isLoadingCatalogs && <div className="p-8 text-center">Cargando opciones del formulario...</div>}

      {selectedBusinessUnitId && !isLoadingCatalogs && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow"><h2 className="text-lg font-semibold text-crucianelli-dark mb-4">Detalles del Contacto</h2><div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{formConfig.filter(f => f.section === 'contact').map(field => (<div key={field.name}><label htmlFor={field.name} className="block text-sm font-medium text-crucianelli-gray">{field.label}</label><DynamicField field={field} value={formData[field.name as keyof FormData]} catalogs={catalogs} handleChange={handleChange} /></div>))}</div></div>
            <div className="bg-white p-6 rounded-lg shadow"><h2 className="text-lg font-semibold text-crucianelli-dark mb-4">Información del Producto</h2><div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{formConfig.filter(f => f.section === 'machine').map(field => (<div key={field.name}><label htmlFor={field.name} className="block text-sm font-medium text-crucianelli-gray">{field.label}</label><DynamicField field={field} value={formData[field.name as keyof FormData]} catalogs={catalogs} handleChange={handleChange} /></div>))}</div></div>
            <div className="bg-white p-6 rounded-lg shadow"><h2 className="text-lg font-semibold text-crucianelli-dark mb-4">Detalle de la Consulta</h2>{formConfig.filter(f => f.section === 'details').map(field => (<div key={field.name}><label htmlFor={field.name} className="block text-sm font-medium text-crucianelli-gray">{field.label}</label><DynamicField field={field} value={formData[field.name as keyof FormData]} catalogs={catalogs} handleChange={handleChange} /></div>))}</div>
          </div>
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow"><h2 className="text-lg font-semibold text-crucianelli-dark mb-4">Clasificación</h2><div className="space-y-4">{formConfig.filter(f => f.section === 'classification').map(field => (<div key={field.name}><label htmlFor={field.name} className="block text-sm font-medium text-crucianelli-gray">{field.label}</label><DynamicField field={field} value={formData[field.name as keyof FormData]} catalogs={catalogs} handleChange={handleChange} /></div>))}</div></div>
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold text-crucianelli-dark mb-4">Acciones</h2>
                {error && <div className="mb-4 text-red-600 text-sm bg-red-100 p-3 rounded-md">{error}</div>}
                <div className="flex flex-col gap-4">
                 <button type="submit" disabled={isSubmitting} className="w-full px-4 py-2 text-sm font-medium text-white bg-crucianelli-red rounded-md hover:bg-opacity-90 disabled:bg-opacity-50">{isSubmitting ? 'Guardando...' : 'Guardar Registro'}</button>
                 <button type="button" onClick={() => router.push('/records')} className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300">Cancelar</button>
               </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}