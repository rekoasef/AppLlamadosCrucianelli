// frontend/src/config/form-config.ts

export interface FormField {
  name: keyof FormData | keyof SpecificData;
  label: string;
  type: 'text' | 'select' | 'textarea';
  required: boolean;
  optionsKey?: keyof Catalogs;
  gridSpan?: number;
  section: 'contact' | 'machine' | 'details' | 'classification';
}

export interface Catalogs {
  callerTypes?: any[]; machineTypes?: any[]; dealerships?: any[]; inquiryAreas?: any[];
  responseReasons?: any[]; contactChannels?: any[]; durationRanges?: any[]; urgencyLevels?: any[];
  leafProductTypes?: any[]; complaintLocations?: any[];
  fertecMachineTypes?: any[]; // Catálogo de Fertec
}

export interface FormData {
    businessUnitId: string;
    contactName: string; machineSerialNumber: string; observations: string; billedClient: string;
    callerTypeId: string; machineTypeId: string; dealershipId: string; inquiryAreaId: string;
    responseReasonId: string; contactChannelId: string; durationRangeId: string; urgencyLevelId: string;
    specificData: SpecificData;
}
export interface SpecificData { [key: string]: any; }


// --- PLANO CRUCIANELLI ---
export const crucianelliFormConfig: FormField[] = [
  { name: 'callerTypeId', label: 'Quién Llama', type: 'select', required: true, optionsKey: 'callerTypes', section: 'contact' },
  { name: 'contactName', label: 'Nombre del Contacto', type: 'text', required: true, section: 'contact' },
  { name: 'dealershipId', label: 'Concesionario', type: 'select', required: false, optionsKey: 'dealerships', section: 'contact' },
  { name: 'billedClient', label: 'Cliente Facturado', type: 'text', required: false, section: 'contact' },
  { name: 'machineTypeId', label: 'Tipo de Máquina', type: 'select', required: false, optionsKey: 'machineTypes', section: 'machine' },
  { name: 'machineSerialNumber', label: 'N° de Serie / OF', type: 'text', required: false, section: 'machine' },
  { name: 'observations', label: 'Observaciones', type: 'textarea', required: false, gridSpan: 2, section: 'details' },
  { name: 'inquiryAreaId', label: 'Área de Consulta', type: 'select', required: true, optionsKey: 'inquiryAreas', section: 'classification' },
  { name: 'responseReasonId', label: 'Motivo', type: 'select', required: false, optionsKey: 'responseReasons', section: 'classification' },
  { name: 'urgencyLevelId', label: 'Nivel de Urgencia', type: 'select', required: true, optionsKey: 'urgencyLevels', section: 'classification' },
  { name: 'contactChannelId', label: 'Canal de Contacto', type: 'select', required: true, optionsKey: 'contactChannels', section: 'classification' },
  { name: 'durationRangeId', label: 'Duración', type: 'select', required: true, optionsKey: 'durationRanges', section: 'classification' },
];

// --- PLANO LEAF ---
export const leafFormConfig: FormField[] = [
  { name: 'callerTypeId', label: 'Quién Llama', type: 'select', required: true, section: 'contact', optionsKey: 'callerTypes' },
  { name: 'contactName', label: 'Nombre y Apellido', type: 'text', required: true, section: 'contact' },
  { name: 'dealershipId', label: 'Concesionario', type: 'select', required: false, optionsKey: 'dealerships', section: 'contact' },
  { name: 'billedClient', label: 'Cliente (Facturado)', type: 'text', required: false, section: 'contact' },
  { name: 'observations', label: 'Observación (Descripción)', type: 'textarea', required: false, gridSpan: 2, section: 'details' },
  { name: 'responseReasonId', label: 'Motivo o Respuesta', type: 'select', required: true, section: 'classification', optionsKey: 'responseReasons' },
  { name: 'urgencyLevelId', label: 'Urgencia del Contacto', type: 'select', required: true, section: 'classification', optionsKey: 'urgencyLevels' },
  { name: 'contactChannelId', label: 'Canal de Contacto', type: 'select', required: true, section: 'classification', optionsKey: 'contactChannels' },
  { name: 'durationRangeId', label: 'Duración del Contacto', type: 'select', required: true, section: 'classification', optionsKey: 'durationRanges' },
  { name: 'inquiryAreaId', label: 'Ubicación/Sistema del Reclamo', type: 'select', required: true, optionsKey: 'inquiryAreas', section: 'classification' },
  { name: 'leafProductTypeId', label: 'Tipo de Producto LEAF', type: 'select', required: true, optionsKey: 'leafProductTypes', section: 'machine' },
  { name: 'leafSerialNumber', label: 'Número de Serie LEAF', type: 'text', required: true, section: 'machine' },
];

// --- ¡NUEVO PLANO PARA FERTEC! ---
export const fertecFormConfig: FormField[] = [
  { name: 'callerTypeId', label: 'Quién Llama', type: 'select', required: true, section: 'contact', optionsKey: 'callerTypes' },
  { name: 'contactName', label: 'Nombre y Apellido', type: 'text', required: true, section: 'contact' },
  { name: 'dealershipId', label: 'Concesionario', type: 'select', required: false, optionsKey: 'dealerships', section: 'contact' },
  { name: 'billedClient', label: 'Cliente (Facturado)', type: 'text', required: false, section: 'contact' },
  { name: 'fertecMachineTypeId', label: 'Tipo de Máquina Fertec', type: 'select', required: true, optionsKey: 'fertecMachineTypes', section: 'machine' },
  { name: 'fertecMachineOF', label: 'OF de la Máquina', type: 'text', required: true, section: 'machine' },
  { name: 'observations', label: 'Observación (Descripción)', type: 'textarea', required: false, gridSpan: 2, section: 'details' },
  { name: 'inquiryAreaId', label: 'Ubicación de la consulta', type: 'select', required: true, optionsKey: 'inquiryAreas', section: 'classification' },
  { name: 'responseReasonId', label: 'Motivo o Respuesta', type: 'select', required: true, section: 'classification', optionsKey: 'responseReasons' },
  { name: 'urgencyLevelId', label: 'Urgencia del Contacto', type: 'select', required: true, section: 'classification', optionsKey: 'urgencyLevels' },
  { name: 'contactChannelId', label: 'Canal de Contacto', type: 'select', required: true, section: 'classification', optionsKey: 'contactChannels' },
  { name: 'durationRangeId', label: 'Duración del Contacto', type: 'select', required: true, section: 'classification', optionsKey: 'durationRanges' },
];
