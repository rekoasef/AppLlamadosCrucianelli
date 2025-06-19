'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useDebounce } from 'use-debounce';

// --- Interfaces ---
interface CallRecord { id: string; createdAt: string; contactName: string; callerType: { name: string }; dealership: { name: string } | null; urgencyLevel: { name: string }; createdByUser: { name: string }; status: string; }
interface PaginationInfo { total: number; page: number; limit: number; totalPages: number; }
interface CatalogItem { id: string; name: string; }

// --- Componente para la Etiqueta de Estado ---
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles: { [key: string]: { text: string, classes: string } } = {
    OPEN: { text: 'Abierto', classes: 'bg-blue-100 text-blue-800' },
    IN_PROGRESS: { text: 'En Progreso', classes: 'bg-yellow-100 text-yellow-800' },
    CLOSED: { text: 'Cerrado', classes: 'bg-green-100 text-green-800' },
    PENDING_CLIENT: { text: 'Pendiente', classes: 'bg-gray-100 text-gray-800' },
  };
  const style = statusStyles[status] || { text: status, classes: 'bg-gray-100 text-gray-800' };
  return <span className={`px-2.5 py-0.5 inline-block text-xs leading-5 font-semibold rounded-full ${style.classes}`}>{style.text}</span>;
};

// --- Componente de Paginación ---
const PaginationControls = ({ pagination, onPageChange }: { pagination: PaginationInfo, onPageChange: (newPage: number) => void }) => {
  const { page, totalPages, total, limit } = pagination;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6 rounded-b-lg shadow">
      <div className="flex-1 flex justify-between sm:hidden">
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Anterior</button>
        <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages || totalPages === 0} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Siguiente</button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div><p className="text-sm text-gray-700">Mostrando <span className="font-medium">{from}</span> a <span className="font-medium">{to}</span> de <span className="font-medium">{total}</span> resultados</p></div>
        <div><nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination"><button onClick={() => onPageChange(page - 1)} disabled={page === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">Anterior</button><span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">Página {page} de {totalPages || 1}</span><button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">Siguiente</button></nav></div>
      </div>
    </div>
  );
};

// --- Componente para el Menú Desplegable de Exportación ---
const ExportDropdown = ({ onExport, isExporting }: { onExport: (format: 'excel' | 'pdf') => void, isExporting: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div><button type="button" onClick={() => setIsOpen(!isOpen)} disabled={isExporting} className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-crucianelli-red disabled:bg-gray-200">{isExporting ? 'Exportando...' : 'Exportar'}<svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg></button></div>
      {isOpen && (<div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"><div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu"><button onClick={() => { onExport('excel'); setIsOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-green-700 hover:bg-green-50 hover:text-green-900" role="menuitem"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.59L7.3 9.24a.75.75 0 00-1.1 1.02l3.25 3.5a.75.75 0 001.1 0l3.25-3.5a.75.75 0 10-1.1-1.02l-1.95 2.1V6.75z" fillRule="evenodd" /></svg>Exportar a Excel</button><button onClick={() => { onExport('pdf'); setIsOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-700 hover:bg-red-50 hover:text-red-900" role="menuitem"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.59L7.3 9.24a.75.75 0 00-1.1 1.02l3.25 3.5a.75.75 0 001.1 0l3.25-3.5a.75.75 0 10-1.1-1.02l-1.95 2.1V6.75z" fillRule="evenodd" /></svg>Exportar a PDF</button></div></div>)}
    </div>
  );
};

export default function RecordsPage() {
  const { token, isLoading: isAuthLoading } = useAuth();
  const [records, setRecords] = useState<CallRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [filters, setFilters] = useState({ status: '', urgencyLevelId: '', dealershipId: '' });
  const [urgencyLevels, setUrgencyLevels] = useState<CatalogItem[]>([]);
  const [dealerships, setDealerships] = useState<CatalogItem[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!token) {
        setIsLoading(false);
        return;
    }

    const fetchFilterCatalogs = async () => {
        try {
            const [urgencyRes, dealershipRes] = await Promise.all([
                fetch('http://localhost:3000/catalogs/urgency-levels', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:3000/catalogs/dealerships', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            if (!urgencyRes.ok || !dealershipRes.ok) throw new Error('No se pudieron cargar los catálogos para los filtros.');
            setUrgencyLevels(await urgencyRes.json());
            setDealerships(await dealershipRes.json());
        } catch (error: any) {
            setError(error.message);
        }
    };

    fetchFilterCatalogs();
  }, [token, isAuthLoading]);
  
  useEffect(() => {
    if (isAuthLoading) return;
    if (!token) {
        setIsLoading(false);
        return;
    }
    
    const fetchRecords = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.append('page', String(currentPage));
        params.append('limit', '10');
        if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
        if (filters.status) params.append('status', filters.status);
        if (filters.urgencyLevelId) params.append('urgencyLevelId', filters.urgencyLevelId);
        if (filters.dealershipId) params.append('dealershipId', filters.dealershipId);

        const response = await fetch(`http://localhost:3000/call-records?${params.toString()}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Falló la carga de registros.');

        const paginatedData = await response.json();
        setRecords(paginatedData.data);
        setPagination({ total: paginatedData.total, page: paginatedData.page, limit: paginatedData.limit, totalPages: paginatedData.totalPages });

      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();

  }, [token, isAuthLoading, currentPage, debouncedSearchTerm, filters]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentPage(1);
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const clearFilters = () => {
    setCurrentPage(1);
    setSearchTerm('');
    setFilters({ status: '', urgencyLevelId: '', dealershipId: '' });
  };
  
  const handleExport = async (format: 'excel' | 'pdf') => {
    setIsExporting(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
      if (filters.status) params.append('status', filters.status);
      if (filters.urgencyLevelId) params.append('urgencyLevelId', filters.urgencyLevelId);
      if (filters.dealershipId) params.append('dealershipId', filters.dealershipId);

      const response = await fetch(`http://localhost:3000/export/${format}?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`Error al generar el archivo ${format.toUpperCase()}.`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const today = new Date().toISOString().slice(0, 10);
      a.download = `registros-llamadas-${today}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    if (debouncedSearchTerm) setCurrentPage(1);
  }, [debouncedSearchTerm]);

  if (isAuthLoading) return <div className="p-8 text-center">Verificando autenticación...</div>;
  if (!token) return <div className="p-8 text-center text-red-500">Acceso denegado. Por favor, inicie sesión para ver los registros.</div>;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-crucianelli-dark">Registros de Llamadas</h1>
        <div className="flex items-center gap-2">
            <a href="/records/new" className="px-4 py-2 rounded-md text-sm font-medium text-white bg-crucianelli-red hover:bg-opacity-90 shadow-sm inline-block">+ Nuevo Registro</a>
            <ExportDropdown onExport={handleExport} isExporting={isExporting} />
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por contacto o N° de serie..."
            className="w-full border-gray-300 rounded-md shadow-sm text-crucianelli-dark"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full border-gray-300 rounded-md shadow-sm text-crucianelli-dark">
              <option value="">Filtrar por Estado</option>
              <option value="OPEN">Abierto</option>
              <option value="IN_PROGRESS">En Progreso</option>
              <option value="CLOSED">Cerrado</option>
              <option value="PENDING_CLIENT">Pendiente</option>
            </select>
            <select name="urgencyLevelId" value={filters.urgencyLevelId} onChange={handleFilterChange} className="w-full border-gray-300 rounded-md shadow-sm text-crucianelli-dark">
              <option value="">Filtrar por Urgencia</option>
              {urgencyLevels.map(level => <option key={level.id} value={level.id}>{level.name}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-6">
            <button onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} className="text-sm font-medium text-crucianelli-red hover:text-opacity-80">
              {showAdvancedFilters ? 'Ocultar Filtros Avanzados' : 'Filtros Avanzados'}
            </button>
            <button onClick={clearFilters} className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-crucianelli-gray bg-gray-100 hover:bg-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              Limpiar filtros
            </button>
        </div>
        {showAdvancedFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
             <select name="dealershipId" value={filters.dealershipId} onChange={handleFilterChange} className="w-full border-gray-300 rounded-md shadow-sm text-crucianelli-dark">
              <option value="">Filtrar por Concesionario</option>
              {dealerships.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concesionario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgencia</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atendido por</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan={6} className="text-center p-10">Cargando registros...</td></tr>
            ) : records.length > 0 ? (
              records.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"><Link href={`/records/${record.id}`} className="text-crucianelli-red hover:underline">{record.contactName}</Link></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(record.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.dealership?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.urgencyLevel.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><StatusBadge status={record.status} /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.createdByUser.name}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="text-center p-10 text-gray-500">No se encontraron registros que coincidan con los filtros.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      
      {pagination && pagination.totalPages > 0 && (
        <PaginationControls pagination={pagination} onPageChange={handlePageChange} />
      )}
    </div>
  );
}
