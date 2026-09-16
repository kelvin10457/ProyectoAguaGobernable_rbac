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
  /** Link de YouTube o Vimeo para embeber junto al contenido (opcional). */
  videoUrl?: string;
}

export const CAPACITACIONES: Capacitacion[] = [
  {
    slug: 'protocolos-operativos',
    titulo: 'Protocolos operativos',
    tipo: 'video',
    rolesAcceso: ['JUNTA', 'ENTIDAD_RECTORA'],
    contenido: 'https://example.com/placeholder-video-protocolos-operativos',
  },
  {
    slug: 'participacion-comunitaria',
    titulo: 'Fortalecimiento de la participación comunitaria',
    tipo: 'texto',
    rolesAcceso: [],
    videoUrl: 'https://youtube.com/shorts/0xCchsEPols',
    contenido: {
      indice: [
        '¿Qué es la participación comunitaria?',
        'Organización y liderazgo comunitario',
        'Derechos y responsabilidades de la comunidad',
        'Comunicación y resolución de conflictos',
        'Participación en la toma de decisiones',
        'Transparencia, control social y rendición de cuentas',
        'Planificación y acción comunitaria',
        'Bibliografía',
        'Preguntas',
      ],
      secciones: [
        {
          titulo: '¿Qué es la participación comunitaria?',
          parrafos: [
            'La participación comunitaria es el proceso mediante el cual las personas que forman parte de una comunidad se involucran activamente en los asuntos que afectan su bienestar y calidad de vida.',
            'Participar no significa únicamente asistir a una reunión. Implica opinar, proponer, escuchar, tomar decisiones, asumir responsabilidades, colaborar y realizar acciones para resolver necesidades comunes.',
            'Una comunidad que participa activamente tiene mayores posibilidades de identificar adecuadamente sus problemas, plantear soluciones que respondan a sus necesidades y fortalecer la confianza entre sus miembros y sus organizaciones.',
            'La participación puede entenderse como formar parte de algo y contribuir activamente a su desarrollo.',
          ],
          destacado:
            'Una comunidad se fortalece cuando sus miembros dejan de ser únicamente beneficiarios y se convierten en actores de las decisiones y soluciones.',
          subtitulo: 'En una comunidad, participar significa:',
          lista: [
            { texto: 'Expresar opiniones y necesidades.' },
            { texto: 'Escuchar las opiniones de los demás.' },
            { texto: 'Asistir a reuniones y asambleas.' },
            { texto: 'Proponer soluciones.' },
            { texto: 'Participar en la toma de decisiones.' },
            { texto: 'Cumplir los acuerdos establecidos.' },
            { texto: 'Colaborar en actividades comunitarias.' },
            { texto: 'Vigilar que los recursos sean utilizados adecuadamente.' },
            { texto: 'Apoyar las iniciativas que beneficien a la comunidad.' },
            { texto: 'Asumir responsabilidades.' },
          ],
        },
        {
          titulo: 'Elementos fundamentales de la participación comunitaria',
          parrafos: [
            'La participación comunitaria es un proceso colectivo mediante el cual los habitantes de una comunidad intervienen en la identificación de sus necesidades, la planificación, la toma de decisiones, la ejecución de acciones y la evaluación de los resultados. Tiene como elementos fundamentales:',
          ],
          lista: [
            { fuerte: 'Opinión', texto: 'La comunidad tiene la posibilidad de expresar sus ideas, necesidades y propuestas.' },
            {
              fuerte: 'Colaboración',
              texto: 'Las personas aportan tiempo, conocimientos, capacidades o recursos para alcanzar objetivos comunes.',
            },
            {
              fuerte: 'Toma de decisiones',
              texto: 'Los miembros de la comunidad participan en las decisiones que afectan su bienestar.',
            },
            {
              fuerte: 'Organización',
              texto: 'Las personas trabajan de manera coordinada para alcanzar objetivos colectivos.',
            },
            { fuerte: 'Seguimiento', texto: 'La comunidad verifica que las decisiones y acuerdos se cumplan.' },
          ],
        },
        {
          titulo: 'Bibliografía',
          lista: [{ texto: 'La participación comunitaria en la prestación de los servicios públicos (documento pdf).' }],
        },
      ],
    },
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
