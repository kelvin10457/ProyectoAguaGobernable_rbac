import type {
  AuthUser,
  CapacitacionDetalle,
  CapacitacionResumen,
  CosteoComponenteData,
  InformacionGeneralData,
  ParametroRow,
  TarifaConfigData,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface BackendUser {
  id: string;
  email: string;
  role: 'JUNTA' | 'ENTIDAD_RECTORA';
  nombre: string | null;
}

interface BackendParametro {
  id: string;
  mes: string;
  categoria: 'calidad' | 'cantidad';
  nombre: string;
  limite: string;
  valor: string;
  estado: string;
  opciones?: string[];
}

async function request<T>(path: string, options: RequestInit = {}, token?: string | null): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers: { ...headers, ...(options.headers as Record<string, string> | undefined) } });

  const body = res.status === 204 ? null : await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(res.status, (body && body.error) || 'Error de red');
  }

  return body as T;
}

function mapRole(role: BackendUser['role']): 'junta' | 'entidad_rectora' {
  return role === 'JUNTA' ? 'junta' : 'entidad_rectora';
}

export function mapAuthUser(user: BackendUser): AuthUser {
  return { id: user.id, email: user.email, role: mapRole(user.role), nombre: user.nombre };
}

function mapParametro(p: BackendParametro): ParametroRow {
  return {
    id: p.id,
    nombre: p.nombre,
    limite: p.limite,
    valor: p.valor,
    estado: p.estado as ParametroRow['estado'],
    opciones: p.opciones,
  };
}

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; user: BackendUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getInformacionGeneral: () => request<InformacionGeneralData>('/informacion-general'),

  updateInformacionGeneral: (data: Partial<InformacionGeneralData>, token: string) =>
    request<InformacionGeneralData>('/informacion-general', { method: 'PUT', body: JSON.stringify(data) }, token),

  async getParametrosMesActual(): Promise<{ mes: string | null; calidad: ParametroRow[]; cantidad: ParametroRow[] }> {
    const filas = await request<BackendParametro[]>('/parametros');
    if (filas.length === 0) return { mes: null, calidad: [], cantidad: [] };
    const mesActual = filas[0].mes;
    const delMes = filas.filter((f) => f.mes === mesActual);
    return {
      mes: mesActual,
      calidad: delMes.filter((f) => f.categoria === 'calidad').map(mapParametro),
      cantidad: delMes.filter((f) => f.categoria === 'cantidad').map(mapParametro),
    };
  },

  updateParametro: (id: string, data: { valor: string; estado: string }, token: string) =>
    request<BackendParametro>(`/parametros/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token),

  getTarifaConfig: () => request<TarifaConfigData>('/tarifa/config'),

  updateTarifaConfig: (data: Partial<TarifaConfigData>, token: string) =>
    request<TarifaConfigData>('/tarifa/config', { method: 'PUT', body: JSON.stringify(data) }, token),

  getFortalecimiento: (token?: string | null) => request<CapacitacionResumen[]>('/fortalecimiento', {}, token),

  getCapacitacion: (slug: string, token?: string | null) =>
    request<CapacitacionDetalle>(`/fortalecimiento/${slug}`, {}, token),

  getCosteo: () => request<CosteoComponenteData[]>('/costeo'),

  updateCosteoComponente: (id: string, data: { cantidadAnual: number | null; precioUnitario: number | null }, token: string) =>
    request<CosteoComponenteData>(`/costeo/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token),
};
