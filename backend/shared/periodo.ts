/** Identificador de semestre para el reporte de parámetros, ej. "2026-I" (ene-jun) o "2026-II" (jul-dic). */
export function semestreActual(fecha: Date = new Date()): string {
  const anio = fecha.getFullYear();
  const semestre = fecha.getMonth() < 6 ? 'I' : 'II';
  return `${anio}-${semestre}`;
}
