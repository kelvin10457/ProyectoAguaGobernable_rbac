export interface CatalogoCosteo {
  orden: number;
  componente: string;
  rubro: string;
  unidad: string;
  cantidadAnualDefault?: number;
}

export const CATALOGO_COSTEO: CatalogoCosteo[] = [
  { orden: 1, componente: 'Mano de obra', rubro: 'Operador', unidad: 'mes', cantidadAnualDefault: 12 },
  { orden: 2, componente: 'Energía', rubro: 'Electricidad de bombas', unidad: 'kWh' },
  { orden: 3, componente: 'Tratamiento', rubro: 'Hipoclorito de calcio', unidad: 'kg' },
  { orden: 4, componente: 'Materiales', rubro: 'Tuberías y accesorios', unidad: 'lote' },
  { orden: 5, componente: 'Mantenimiento', rubro: 'Reparación de bombas', unidad: 'servicio' },
  { orden: 6, componente: 'Calidad', rubro: 'Análisis de laboratorio', unidad: 'muestra' },
  {
    orden: 7,
    componente: 'Administración',
    rubro: 'Facturación y papelería',
    unidad: 'mes',
    cantidadAnualDefault: 12,
  },
  { orden: 8, componente: 'Ambiente', rubro: 'Protección de la fuente', unidad: 'año', cantidadAnualDefault: 1 },
  { orden: 9, componente: 'Reposición', rubro: 'Depreciación de equipos', unidad: 'año', cantidadAnualDefault: 1 },
  { orden: 10, componente: 'Contingencias', rubro: 'Fondo de emergencia', unidad: '%' },
];
