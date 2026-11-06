/** Convierte un número o texto numérico a un número mayor o igual a 0. Devuelve null si el valor no es válido. */
export function aNumeroNoNegativo(valor: unknown): number | null {
  if (typeof valor !== 'number' && (typeof valor !== 'string' || valor.trim() === '')) return null;
  const numero = Number(valor);
  return Number.isFinite(numero) && numero >= 0 ? numero : null;
}
