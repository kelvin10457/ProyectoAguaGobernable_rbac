export interface CatalogoParametro {
  categoria: 'calidad' | 'cantidad';
  nombre: string;
  limite: string;
  /** Si está definido, el valor medido debe ser exactamente una de estas opciones (variable categórica). */
  opciones?: string[];
}

export const CATALOGO_PARAMETROS: CatalogoParametro[] = [
  { categoria: 'calidad', nombre: 'Color', limite: '≤ 15 Unidades Pt-Co' },
  { categoria: 'calidad', nombre: 'Turbiedad', limite: '≤ 5 UNT' },
  {
    categoria: 'calidad',
    nombre: 'Sabor',
    limite: 'Aceptable / sin sabor extraño',
    opciones: ['Aceptable', 'No aceptable'],
  },
  {
    categoria: 'calidad',
    nombre: 'Olor',
    limite: 'Aceptable / sin olor extraño',
    opciones: ['Aceptable', 'No aceptable'],
  },
  { categoria: 'calidad', nombre: 'Coliformes', limite: '0 UFC / 100 ml' },
  { categoria: 'calidad', nombre: 'Plaguicidas', limite: '≤ 0.03 – 0.1 mg/L' },
  { categoria: 'calidad', nombre: 'Cianotoxinas', limite: '≤ 1.0 µg/L (microcistina-LR)' },
  { categoria: 'cantidad', nombre: 'Presión (red / domiciliaria)', limite: '10 – 50 m.c.a. (1.0 – 5.0 bar)' },
];

export function buscarEnCatalogo(nombre: string): CatalogoParametro | undefined {
  return CATALOGO_PARAMETROS.find((item) => item.nombre === nombre);
}
