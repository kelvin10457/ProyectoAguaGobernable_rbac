import type { Role } from '@prisma/client';

export interface SeccionTexto {
  /** Identificador estable opcional, usado por el frontend para anclar contenido dinámico junto a esta sección. */
  id?: string;
  titulo: string;
  parrafos?: string[];
  destacado?: string;
  subtitulo?: string;
  lista?: { fuerte?: string; texto: string }[];
  tabla?: { columnas: string[]; filas: string[][] };
}

export interface ContenidoTexto {
  indice: string[];
  secciones: SeccionTexto[];
}

export interface Capacitacion {
  slug: string;
  titulo: string;
  tipo: 'video' | 'texto';
  /** Roles con acceso; arreglo vacío = pública (visible incluso sin login). */
  rolesAcceso: Role[];
  contenido: string | ContenidoTexto;
}

export const CAPACITACIONES: Capacitacion[] = [
  {
    slug: 'protocolos-operativos',
    titulo: 'Protocolos operativos',
    tipo: 'video',
    rolesAcceso: [],
    contenido: 'https://example.com/placeholder-video-protocolos-operativos',
  },
  {
    slug: 'costos-servicio',
    titulo: 'Determinación de costos del servicio',
    tipo: 'texto',
    rolesAcceso: ['JUNTA', 'ENTIDAD_RECTORA'],
    contenido: {
      indice: [
        'Introducción',
        'Costos Directos',
        'Costos Indirectos',
        'Costos de Inversión',
        'Estructura de costos asociados a la prestación de servicios públicos básicos de agua potable y saneamiento',
        'Bibliografía',
        'Preguntas',
      ],
      secciones: [
        {
          titulo: 'Introducción',
          parrafos: [
            'Mediante la Regulación Nro. DIR-ARCA.RG-006-2017, el Directorio de la Agencia de Regulación y Control del Agua estableció la normativa técnica para el establecimiento de criterios técnicos y actuariales para la determinación de costos sostenibles en la prestación de los servicios de agua potable y saneamiento, y para la fijación de tarifas por los prestadores públicos de estos servicios.',
            'En 2019, el ARCA emitió la Guía para la aplicación de la Regulación Nro. DIR-ARCA.RG-006-2017 con el objetivo de facilitar la aplicación de la norma técnica, de modo que la metodología se adapte a las condiciones y características propias de cada prestador de servicios, y así la tarifa calculada beneficie tanto al prestador como a las personas consumidoras de los servicios de agua potable y saneamiento.',
          ],
          destacado:
            'La Regulación Nro. DIR-ARCA.RG-006-2017 y la Guía para su aplicación del ARCA constituyen el marco normativo para la definición de los costos y fijación de tarifas del servicio de agua potable.',
        },
        {
          titulo: 'Costos Directos',
          parrafos: [
            'Los costos directos del servicio de agua potable son los gastos asociados de forma inmediata a la operación, el mantenimiento y los procesos de producción para la prestación del servicio.',
            'Según la Regulación Nro. DIR-ARCA.RG-006-2017 se consideran costos directos a aquellos asociados directamente a la operación y mantenimiento para la prestación de los servicios públicos.',
          ],
          subtitulo: 'Componentes principales',
          lista: [
            {
              fuerte: 'Mano de obra directa',
              texto:
                'El personal operativo que labora directamente en las plantas de tratamiento, estaciones de bombeo y en el control de redes de distribución.',
            },
            {
              fuerte: 'Materia prima',
              texto:
                'El agua cruda captada de fuentes naturales (ríos, pozos o reservorios) y los insumos químicos necesarios para su potabilización (como cloro, sulfato de aluminio y polímeros).',
            },
            {
              fuerte: 'Energía eléctrica',
              texto:
                'El consumo de electricidad indispensable para el funcionamiento de bombas de captación, impulsión y los procesos de tratamiento.',
            },
            {
              fuerte: 'Mantenimiento y reparaciones',
              texto:
                'Las refacciones, repuestos y labores técnicas aplicadas de manera directa a la maquinaria, filtros, redes de conducción y acometidas.',
            },
          ],
        },
        {
          id: 'estructura-costos',
          titulo:
            'Estructura de costos asociados a la prestación de servicios públicos básicos de agua potable y saneamiento',
          parrafos: [
            'Antes de calcular los costos del servicio, la directiva debe recopilar la siguiente información operativa del sistema:',
          ],
          tabla: {
            columnas: ['Información', 'Unidad'],
            filas: [
              ['Número total de usuarios o conexiones', 'Usuarios'],
              ['Población abastecida', 'habitantes'],
              ['Agua captada', 'm³/mes'],
              ['Agua producida o tratada', 'm³/mes'],
              ['Agua distribuida', 'm³/mes'],
              ['Agua facturada', 'm³/mes'],
              ['Consumo promedio por usuario', 'm³/usuario/mes'],
              ['Horas de funcionamiento del sistema', 'horas/día'],
              ['Número de trabajadores', 'personas'],
              ['Longitud de redes', 'kilómetros'],
              ['Número de medidores instalados', 'unidades'],
              ['Vida útil de equipos e infraestructura', 'años'],
              ['Porcentaje de pérdidas de agua', '%'],
            ],
          },
        },
        {
          titulo: 'Bibliografía',
          lista: [
            { texto: 'Regulación Nro. DIR-ARCA.RG-006-2017' },
            { texto: 'Guía para la aplicación de la Regulación Nro. DIR-ARCA.RG-006-2017' },
          ],
        },
      ],
    },
  },
];

export function puedeAcceder(capacitacion: Capacitacion, role: Role | undefined): boolean {
  return capacitacion.rolesAcceso.length === 0 || (role !== undefined && capacitacion.rolesAcceso.includes(role));
}
