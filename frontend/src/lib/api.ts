import type {
  AuthUser,
  CapacitacionDetalle,
  CapacitacionResumen,
  CosteoComponenteData,
  InformacionGeneralData,
  NoticiaData,
  ParametroRow,
  ReporteDanoData,
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
  opcionCumple?: string;
  min?: number;
  max?: number;
}

export interface ParametrosSemestre {
  calidad: ParametroRow[];
  cantidad: ParametroRow[];
}

let manejadorSesionExpirada: (() => void) | null = null;

/** Registra qué hacer cuando el servidor rechaza el token de la sesión. */
export function setManejadorSesionExpirada(manejador: () => void) {
  manejadorSesionExpirada = manejador;
}

/** Fecha de expiración del JWT en milisegundos, o null si no se puede leer. */
export function expiracionToken(token: string): number | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const { exp } = JSON.parse(atob(base64)) as { exp?: number };
    return typeof exp === 'number' ? exp * 1000 : null;
  } catch {
    return null;
  }
}

async function request<T>(path: string, options: RequestInit = {}, token?: string | null): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers: { ...headers, ...(options.headers as Record<string, string> | undefined) } });

  const body = res.status === 204 ? null : await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401 && token) manejadorSesionExpirada?.();
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
    opcionCumple: p.opcionCumple,
    min: p.min,
    max: p.max,
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

  /** Devuelve los semestres del más reciente al más antiguo, con sus filas agrupadas. */
  async getParametrosPorSemestre(): Promise<{ semestres: string[]; porSemestre: Record<string, ParametrosSemestre> }> {
    const filas = await request<BackendParametro[]>('/parametros');
    const semestres = [...new Set(filas.map((f) => f.mes))];
    const porSemestre: Record<string, ParametrosSemestre> = {};
    for (const mes of semestres) {
      const delMes = filas.filter((f) => f.mes === mes);
      porSemestre[mes] = {
        calidad: delMes.filter((f) => f.categoria === 'calidad').map(mapParametro),
        cantidad: delMes.filter((f) => f.categoria === 'cantidad').map(mapParametro),
      };
    }
    return { semestres, porSemestre };
  },

  crearSemestre: (mes: string, token: string) =>
    request<BackendParametro[]>('/parametros', { method: 'POST', body: JSON.stringify({ mes }) }, token),

  updateParametros: (filas: { id: string; valor: string; estado: string }[], token: string) =>
    request<BackendParametro[]>('/parametros', { method: 'PUT', body: JSON.stringify({ filas }) }, token),

  getTarifaConfig: () => request<TarifaConfigData>('/tarifa/config'),

  updateTarifaConfig: (data: Partial<TarifaConfigData>, token: string) =>
    request<TarifaConfigData>('/tarifa/config', { method: 'PUT', body: JSON.stringify(data) }, token),

  getFortalecimiento: (token?: string | null) => request<CapacitacionResumen[]>('/fortalecimiento', {}, token),

  getCapacitacion: (slug: string, token?: string | null) =>
    request<CapacitacionDetalle>(`/fortalecimiento/${slug}`, {}, token),

  getCosteo: () => request<CosteoComponenteData[]>('/costeo'),

  updateCosteo: (
    filas: { id: string; cantidadAnual: number | null; precioUnitario: number | null }[],
    token: string,
  ) => request<CosteoComponenteData[]>('/costeo', { method: 'PUT', body: JSON.stringify({ filas }) }, token),

  getNoticias: () => request<NoticiaData[]>('/noticias'),

  getNoticia: (id: string) => request<NoticiaData>(`/noticias/${id}`),

  createNoticia: (
    data: { titulo: string; resumen: string; contenido: string; imagenesUrl: string[]; videosUrl: string[] },
    token: string,
  ) => request<NoticiaData>('/noticias', { method: 'POST', body: JSON.stringify(data) }, token),

  updateNoticia: (
    id: string,
    data: { titulo: string; resumen: string; contenido: string; imagenesUrl: string[]; videosUrl: string[] },
    token: string,
  ) => request<NoticiaData>(`/noticias/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token),

  deleteNoticia: (id: string, token: string) =>
    request<void>(`/noticias/${id}`, { method: 'DELETE' }, token),

  getReportesDanos: (token?: string | null) => request<ReporteDanoData[]>('/reportes-danos', {}, token),

  createReporteDano: (
    data: { nombre: string; cedula: string; medidor: string; telefono: string; descripcion: string; imagenUrl: string },
    token?: string | null,
  ) => request<ReporteDanoData>('/reportes-danos', { method: 'POST', body: JSON.stringify(data) }, token),

  deleteReporteDano: (id: string, token: string) =>
    request<void>(`/reportes-danos/${id}`, { method: 'DELETE' }, token),
};
