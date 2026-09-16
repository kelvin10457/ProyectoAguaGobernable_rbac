export type Role = 'usuario' | 'junta' | 'entidad_rectora';

export type EstadoParametro = 'ok' | 'alerta' | 'pendiente';

export interface ParametroRow {
  id?: string;
  nombre: string;
  limite: string;
  valor: string;
  estado: EstadoParametro;
  /** Si viene definido, el valor debe ser una de estas opciones (variable categórica). */
  opciones?: string[];
}

export interface TablaBorrador {
  calidad: ParametroRow[];
  cantidad: ParametroRow[];
}

export interface InformacionGeneralData {
  id: string;
  familias: number;
  habitantes: number;
  localidadesAtendidas: string;
  canton: string;
  provincia: string;
  zonaUtm: string;
  coordenadaEste: string;
  coordenadaSur: string;
  cota: string;
  presidente: string;
  telefonoContacto: string;
  horarioAtencion: string;
  fotoUrl: string | null;
  mapaUrl: string | null;
}

export interface TarifaConfigData {
  cargoFijo: number;
  cargoVariable: number;
  umbralConsumo: number;
  descuentoAdultoMayorPct: number;
}

export interface CapacitacionResumen {
  slug: string;
  titulo: string;
  tipo: 'video' | 'texto';
}

export interface SeccionTexto {
  /** Identificador estable opcional, usado para anclar contenido dinámico junto a esta sección. */
  id?: string;
  titulo: string;
  parrafos?: string[];
  destacado?: string;
  subtitulo?: string;
  lista?: { fuerte?: string; texto: string }[];
  tabla?: { columnas: string[]; filas: string[][] };
}

export interface CosteoComponenteData {
  id: string;
  orden: number;
  componente: string;
  rubro: string;
  unidad: string;
  cantidadAnual: number | null;
  precioUnitario: number | null;
}

export interface ContenidoTexto {
  indice: string[];
  secciones: SeccionTexto[];
}

export type CapacitacionDetalle =
  | { slug: string; titulo: string; tipo: 'video'; contenido: string; videoUrl?: string }
  | { slug: string; titulo: string; tipo: 'texto'; contenido: ContenidoTexto; videoUrl?: string };

export interface NoticiaData {
  id: string;
  titulo: string;
  resumen: string | null;
  contenido: string;
  imagenesUrl: string[];
  videosUrl: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  nombre: string | null;
}
