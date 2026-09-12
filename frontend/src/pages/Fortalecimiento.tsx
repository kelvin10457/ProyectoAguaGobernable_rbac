import Blueprint from '../components/Blueprint';

const LINEAS = [
  {
    kicker: 'Línea A',
    title: 'Fortalecimiento administrativo y normativo',
    items: [
      'Definición de funciones y responsabilidades',
      'Registro y actualización de usuarios',
      'Estructuración de costos y tarifas',
      'Organización documental y normativa',
    ],
    meta: '4 cápsulas · 22 min',
  },
  {
    kicker: 'Línea B',
    title: 'Protocolos operativos y controles internos',
    items: ['Operación y mantenimiento', 'Estandarización de protocolos', 'Controles y registros', 'Seguimiento de calidad y cantidad'],
    meta: '8 cápsulas · 41 min · en curso',
  },
  {
    kicker: 'Línea C',
    title: 'Gobernanza y corresponsabilidad',
    items: ['Participación comunitaria', 'Roles y responsabilidades', 'Comunicación directiva–usuarios', 'Gestión comunitaria y sostenibilidad'],
    meta: '3 cápsulas · 15 min',
  },
];

export default function Fortalecimiento() {
  return (
    <section>
      <div className="mb-1.5 text-[11px] uppercase tracking-[0.12em] text-accent-700">
        Fortalecimiento de capacidades
      </div>
      <h1 className="m-0 mb-2 text-[clamp(28px,4.4vw,42px)]">
        Fortalezcamos nuestras capacidades y el sistema de agua potable
      </h1>
      <p className="max-w-[60ch] text-text/72">
        Tres líneas de trabajo con la directiva, operadores y usuarios. Cada capacitación queda publicada aquí para
        consultarla cuando haga falta.
      </p>

      <div className="mt-[26px] grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-[26px]">
        <Blueprint as="figure" className="m-0">
          <div className="relative grid aspect-video place-items-center bg-[repeating-linear-gradient(135deg,var(--color-neutral-200)_0_10px,var(--color-neutral-300)_10px_20px)]">
            <div className="grid h-[74px] w-[74px] place-items-center border-[1.5px] border-accent-800 bg-bg/75">
              <div className="ml-1.5 h-0 w-0 border-y-[13px] border-l-[20px] border-y-transparent border-l-accent-800" />
            </div>
            <span className="absolute bottom-3 left-3.5 font-mono text-[11px] text-neutral-700">
              video de capacitación · mp4 / youtube
            </span>
          </div>
          <div className="flex items-center gap-3 pt-2.5">
            <div className="h-[3px] flex-1 bg-neutral-300">
              <div className="h-full w-[18%] bg-accent" />
            </div>
            <span className="font-mono text-[11px] opacity-70">01:07 / 06:12</span>
          </div>
          <figcaption className="mt-1 text-[11px] text-text/55">
            Protocolos operativos y controles internos — cápsula 3 de 8.
          </figcaption>
        </Blueprint>

        <Blueprint className="flex flex-col gap-2.5 p-[18px]">
          <h6 className="m-0">En esta cápsula</h6>
          <ul className="m-0 list-disc pl-[18px] text-sm leading-[1.7]">
            <li>Cómo se registra la cloración diaria</li>
            <li>Lectura y anotación de presión en red</li>
            <li>Qué hacer ante turbiedad alta</li>
            <li>Quién firma el registro y cuándo</li>
          </ul>
          <div className="mt-auto flex flex-col gap-2">
            <button type="button" className="btn btn-primary">
              Descargar guía en PDF
            </button>
            <button type="button" className="btn btn-secondary">
              Descargar formato de registro
            </button>
          </div>
        </Blueprint>
      </div>

      <div className="mt-[34px] grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-[22px]">
        {LINEAS.map((linea) => (
          <Blueprint key={linea.kicker} className="card">
            <div className="card-kicker">{linea.kicker}</div>
            <div className="card-title">{linea.title}</div>
            <ul className="m-0 mt-1 list-disc pl-[18px] text-[13px] leading-[1.65] opacity-85">
              {linea.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="card-meta">{linea.meta}</div>
          </Blueprint>
        ))}
      </div>
    </section>
  );
}
