export type Role = 'usuario' | 'admin';

export type EstadoParametro = 'ok' | 'alerta' | 'pendiente';

export interface ParametroRow {
  nombre: string;
  limite: string;
  valor: string;
  estado: EstadoParametro;
}

export interface TablaBorrador {
  calidad: ParametroRow[];
  cantidad: ParametroRow[];
}
