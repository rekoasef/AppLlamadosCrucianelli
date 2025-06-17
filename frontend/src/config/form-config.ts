// Definimos la estructura de un campo de formulario
export interface FormField {
  name: keyof FormData; // El nombre del campo (debe coincidir con nuestro tipo FormData)
  label: string;
  type: 'text' | 'select' | 'textarea';
  required: boolean;
  optionsKey?: keyof Catalogs; // Para los 'select', indica qué catálogo usar
  placeholder?: string;
  gridSpan?: number; // Para el diseño de la cuadrícula
}

// Definimos la estructura de los catálogos
export interface Catalogs {
  callerTypes?: any[];
  machineTypes?: any[];
  dealerships?: any[];
  inquiryAreas?: any[];
  responseReasons?: any[];
  contactChannels?: any[];
  durationRanges?: any[];
  urgencyLevels?: any[];
}

// Definimos la estructura de nuestro estado de formulario
export interface FormData {
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
    businessUnitId: string;
}

// --- EL PLANO PARA CRUCIANELLI ---
// Este es un array de objetos, donde cada objeto es un campo del formulario.
export const crucianelliFormConfig: FormField[] = [
  // --- Campos Comunes (los que probablemente compartirán todos los formularios) ---
  { name: 'callerTypeId', label: 'Quién Llama', type: 'select', required: true, optionsKey: 'callerTypes' },
  { name: 'contactName', label: 'Nombre del Contacto', type: 'text', required: true },
  { name: 'dealershipId', label: 'Concesionario', type: 'select', required: false, optionsKey: 'dealerships' },
  { name: 'billedClient', label: 'Cliente Facturado', type: 'text', required: false },
  { name: 'machineTypeId', label: 'Tipo de Máquina', type: 'select', required: false, optionsKey: 'machineTypes' },
  { name: 'machineSerialNumber', label: 'N° de Serie / OF', type: 'text', required: false },
  { name: 'observations', label: 'Observaciones', type: 'textarea', required: false, gridSpan: 2 },
  { name: 'inquiryAreaId', label: 'Área de Consulta', type: 'select', required: true, optionsKey: 'inquiryAreas' },
  { name: 'responseReasonId', label: 'Motivo', type: 'select', required: false, optionsKey: 'responseReasons' },
  { name: 'urgencyLevelId', label: 'Nivel de Urgencia', type: 'select', required: true, optionsKey: 'urgencyLevels' },
  { name: 'contactChannelId', label: 'Canal de Contacto', type: 'select', required: true, optionsKey: 'contactChannels' },
  { name: 'durationRangeId', label: 'Duración', type: 'select', required: true, optionsKey: 'durationRanges' },
  
  // --- Campos Específicos (por ahora, ninguno para Crucianelli) ---
  // Cuando tengamos el formulario de Fertec, podríamos añadir aquí campos como:
  // { name: 'firmwareVersion', label: 'Versión de Firmware', type: 'text', required: true },
];
