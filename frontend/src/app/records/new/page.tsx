// frontend/src/app/records/new/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import api from '@/services/api';

// Interfaz para los items de los catálogos
interface CatalogItem {
  id: string;
  name: string;
}

// Interfaz para el formulario, actualizada sin businessUnitId
interface FormData {
  callerTypeId: string;
  contactName: string;
  machineSerialNumber: string;
  machineTypeId: string;
  billedClient: string;
  dealershipId: string;
  inquiryAreaId: string;
  observations: string;
  responseReasonId: string;
  contactChannelId: string;
  durationRangeId: string;
  urgencyLevelId: string;
}

export default function NewRecordPage() {
  // Estado para los catálogos, ahora en un solo objeto para mayor limpieza
  const [catalogs, setCatalogs] = useState<Record<string, CatalogItem[]>>({});

  // Estado para el formulario, con su valor inicial
  const [formData, setFormData] = useState<FormData>({
    callerTypeId: '',
    contactName: '',
    machineSerialNumber: '',
    machineTypeId: '',
    billedClient: '',
    dealershipId: '',
    inquiryAreaId: '',
    observations: '',
    responseReasonId: '',
    contactChannelId: '',
    durationRangeId: '',
    urgencyLevelId: '',
  });

  // useEffect para cargar los catálogos
  useEffect(() => {
    const fetchCatalogs = async () => {
      // Lista de endpoints de catálogo, actualizada sin business-units
      const catalogEndpoints = [
        'caller-types', 'machine-types', 'dealerships', 'inquiry-areas', 
        'response-reasons', 'contact-channels', 'duration-ranges', 'urgency-levels'
      ];
      
      try {
        const responses = await Promise.all(
          catalogEndpoints.map(endpoint => api.get(`/catalogs/${endpoint}`))
        );
        
        const newCatalogs = responses.reduce((acc, res, index) => {
          // Usamos el nombre del endpoint como clave para el catálogo
          const key = catalogEndpoints[index].replace(/-/g, '_');
          acc[key] = res.data;
          return acc;
        }, {} as Record<string, CatalogItem[]>);

        setCatalogs(newCatalogs);
        console.log('Catálogos cargados:', newCatalogs);

      } catch (error) {
        console.error("Error al cargar los catálogos:", error);
      }
    };
    fetchCatalogs();
  }, []);
  
  // Función única para manejar todos los cambios del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    
    // Obtenemos el token (usando prompt por ahora)
    const token = prompt("Por favor, introduce un token de acceso válido:");
    if (!token) {
      alert("El token es necesario para crear un registro.");
      return;
    }
    
    console.log("Enviando datos al backend:", formData);

    try {
      const response = await api.post('/call-records', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('¡Registro creado con éxito!');
      console.log("Respuesta del servidor:", response.data);
      // Podríamos limpiar el formulario aquí si quisiéramos
      
    } catch (error) {
      console.error("Error al crear el registro:", error);
      alert('Hubo un error al crear el registro. Revisa la consola.');
    }
  };

  // El JSX del formulario, ahora actualizado a la especificación del PDF
  return (
    <main className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Registro de Llamadas</h1>
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          
          {/* Columna Izquierda */}
          <div>
            <label htmlFor="callerTypeId" className="block text-sm font-medium text-gray-700">1. ¿Quién llama?</label>
            <select name="callerTypeId" value={formData.callerTypeId} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">Seleccione una opción</option>
              {catalogs.caller_types?.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">2. Nombre y Apellido de quien realiza el llamado</label>
            <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          
          <div>
            <label htmlFor="machineSerialNumber" className="block text-sm font-medium text-gray-700">3. OF de la Máquina (acuñado en chasis)</label>
            <input type="text" name="machineSerialNumber" value={formData.machineSerialNumber} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
          </div>

          <div>
            <label htmlFor="machineTypeId" className="block text-sm font-medium text-gray-700">4. Tipo de Máquina</label>
            <select name="machineTypeId" value={formData.machineTypeId} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">Seleccione una opción</option>
              {catalogs.machine_types?.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="billedClient" className="block text-sm font-medium text-gray-700">5. Cliente (Idéntico a como salió facturada la máquina)</label>
            <input type="text" name="billedClient" value={formData.billedClient} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
          </div>

          <div>
            <label htmlFor="dealershipId" className="block text-sm font-medium text-gray-700">6. Concesionario</label>
            <select name="dealershipId" value={formData.dealershipId} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">Seleccione una opción</option>
              {catalogs.dealerships?.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </div>

          {/* Columna Derecha */}
          <div>
            <label htmlFor="inquiryAreaId" className="block text-sm font-medium text-gray-700">7. Área de la consulta o reclamo</label>
            <select name="inquiryAreaId" value={formData.inquiryAreaId} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">Seleccione una opción</option>
              {catalogs.inquiry_areas?.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="responseReasonId" className="block text-sm font-medium text-gray-700">9. Motivo o Respuesta</label>
            <select name="responseReasonId" value={formData.responseReasonId} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">Seleccione una opción</option>
              {catalogs.response_reasons?.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="contactChannelId" className="block text-sm font-medium text-gray-700">10. Canal de contacto</label>
            <select name="contactChannelId" value={formData.contactChannelId} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">Seleccione una opción</option>
              {catalogs.contact_channels?.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </div>
          
          <div>
            <label htmlFor="durationRangeId" className="block text-sm font-medium text-gray-700">11. Duración del contacto</label>
            <select name="durationRangeId" value={formData.durationRangeId} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">Seleccione una opción</option>
              {catalogs.duration_ranges?.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="urgencyLevelId" className="block text-sm font-medium text-gray-700">12. Urgencia</label>
            <select name="urgencyLevelId" value={formData.urgencyLevelId} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">Seleccione una opción</option>
              {catalogs.urgency_levels?.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </div>
        </div>
        
        {/* Campo de Observaciones */}
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="observations" className="block text-sm font-medium text-gray-700">8. Observación (Descripción del reclamo)</label>
          <textarea name="observations" value={formData.observations} onChange={handleChange} rows={5} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
        </div>

        {/* Botón de Envío */}
        <div className="flex justify-end pt-4">
          <button type="submit" className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
            Guardar Registro
          </button>
        </div>
      </form>
    </main>
  );
}