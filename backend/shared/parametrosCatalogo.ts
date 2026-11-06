export interface CatalogoParametro {
  categoria: 'calidad' | 'cantidad';
  nombre: string;
  limite: string;
  /** Si está definido, el valor medido debe ser exactamente una de estas opciones (variable categórica). */
  opciones?: string[];
  /** Opción que cumple la norma. El frontend la usa para sugerir el estado. */
  opcionCumple?: string;
  /** Rango numérico permitido. El frontend lo usa para sugerir el estado. */
  min?: number;
  max?: number;
}

export const CATALOGO_PARAMETROS: CatalogoParametro[] = [
  { categoria: 'calidad', nombre: 'Color', limite: '≤ 15 Unidades Pt-Co', max: 15 },
  { categoria: 'calidad', nombre: 'Turbiedad', limite: '≤ 5 UNT', max: 5 },
  {
    categoria: 'calidad',
    nombre: 'Sabor',
    limite: 'Aceptable / sin sabor extraño',
    opciones: ['Aceptable', 'No aceptable'],
    opcionCumple: 'Aceptable',
  },
  {
    categoria: 'calidad',
    nombre: 'Olor',
    limite: 'Aceptable / sin olor extraño',
    opciones: ['Aceptable', 'No aceptable'],
    opcionCumple: 'Aceptable',
  },
  { categoria: 'calidad', nombre: 'Coliformes', limite: '0 UFC / 100 ml', max: 0 },
  { categoria: 'calidad', nombre: 'Plaguicidas', limite: '≤ 0.03 – 0.1 mg/L', max: 0.1 },
  { categoria: 'calidad', nombre: 'Cianotoxinas', limite: '≤ 1.0 µg/L (microcistina-LR)', max: 1 },
  { categoria: 'cantidad', nombre: 'Presión (red / domiciliaria)', limite: '10 – 50 m.c.a. (1.0 – 5.0 bar)', min: 10, max: 50 },
];

export function buscarEnCatalogo(nombre: string): CatalogoParametro | undefined {
  return CATALOGO_PARAMETROS.find((item) => item.nombre === nombre);
}
