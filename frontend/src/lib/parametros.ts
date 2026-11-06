import type { EstadoParametro, ParametroRow } from '../types';

/** Semestre del calendario, ej. "2026-I" (ene-jun) o "2026-II" (jul-dic). */
export function semestreActual(fecha: Date = new Date()): string {
  return `${fecha.getFullYear()}-${fecha.getMonth() < 6 ? 'I' : 'II'}`;
}

/**
 * Sugiere el estado de una medición según su límite.
 * Devuelve null cuando no puede decidirlo (texto como "<1" o "3 bar"), para que lo indique la directiva.
 */
export function sugerirEstado(fila: ParametroRow, valor: string): EstadoParametro | null {
  const texto = valor.trim();
  if (texto === '') return 'pendiente';
  if (fila.opcionCumple) return texto === fila.opcionCumple ? 'ok' : 'alerta';
  if (fila.min === undefined && fila.max === undefined) return null;
  if (!/^\d+([.,]\d+)?$/.test(texto)) return null;

  const numero = Number(texto.replace(',', '.'));
  if (fila.min !== undefined && numero < fila.min) return 'alerta';
  if (fila.max !== undefined && numero > fila.max) return 'alerta';
  return 'ok';
}
