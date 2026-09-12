import Blueprint from '../components/Blueprint';

export default function InformacionGeneral() {
  return (
    <section>
      <div className="mb-1.5 text-[11px] uppercase tracking-[0.12em] text-accent-700">Información general</div>
      <h1 className="m-0 mb-7 text-[clamp(28px,4.4vw,42px)]">Quiénes somos</h1>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-start gap-[30px]">
        <div>
          <p className="max-w-[56ch] text-[17px] leading-relaxed">
            La Junta de Agua Potable de El Limón–Havoline atiende a 525 familias del sector para la provisión de
            agua. Como la mayoría de las comunidades rurales, padecemos escasez e incertidumbre de no tener acceso
            continuo a agua potable y segura.
          </p>
          <p className="max-w-[56ch] text-[17px] leading-relaxed">
            Esta comunidad empoderada garantizará el acceso al agua potable y mejorará la calidad de vida de nuestras
            familias.
          </p>
          <p className="mt-[22px] max-w-[40ch] font-heading text-[23px] leading-tight text-accent-700">
            Una comunidad fortalecida convierte cada gota de agua en salud, tranquilidad y futuro.
          </p>
        </div>
        <Blueprint as="figure" className="relative m-0 overflow-hidden">
          <div className="grid aspect-[4/3] place-items-center bg-[repeating-linear-gradient(135deg,var(--color-neutral-200)_0_9px,var(--color-neutral-300)_9px_18px)]">
            <span className="px-3 text-center font-mono text-[11px] tracking-[0.06em] text-neutral-700">
              foto de la captación
              <br />o de la comunidad
            </span>
          </div>
        </Blueprint>
      </div>

      <div className="mt-[38px] grid grid-cols-[repeat(auto-fit,minmax(min(100%,270px),1fr))] gap-[22px]">
        <Blueprint className="p-[18px]">
          <h6 className="mb-3">Usuarios y localidades</h6>
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            <dt className="opacity-60">Familias</dt>
            <dd className="m-0">525</dd>
            <dt className="opacity-60">Habitantes</dt>
            <dd className="m-0">2 100 aprox.</dd>
            <dt className="opacity-60">Atiende</dt>
            <dd className="m-0">El Limón y Havoline</dd>
            <dt className="opacity-60">Cantón</dt>
            <dd className="m-0">Empalme, El Guayas</dd>
          </dl>
        </Blueprint>
        <Blueprint className="p-[18px]">
          <h6 className="mb-3">Ubicación técnica</h6>
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            <dt className="opacity-60">Zona UTM</dt>
            <dd className="m-0">17M</dd>
            <dt className="opacity-60">Este</dt>
            <dd className="m-0 font-mono">649 475 E</dd>
            <dt className="opacity-60">Sur</dt>
            <dd className="m-0 font-mono">9 884 875 S</dd>
            <dt className="opacity-60">Cota</dt>
            <dd className="m-0">74 m.s.n.m.</dd>
          </dl>
        </Blueprint>
        <Blueprint className="p-[18px]">
          <h6 className="mb-3">Directiva y contacto</h6>
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            <dt className="opacity-60">Presidente</dt>
            <dd className="m-0">Alberto Montoya Zamora</dd>
            <dt className="opacity-60">Teléfono</dt>
            <dd className="m-0">
              <a href="tel:0988960736">098 896 0736</a>
            </dd>
            <dt className="opacity-60">Atención</dt>
            <dd className="m-0">Lun a vie, 08:00–13:00</dd>
          </dl>
        </Blueprint>
      </div>

      <Blueprint as="figure" className="mt-[34px]">
        <div className="grid aspect-[21/8] place-items-center bg-[repeating-linear-gradient(90deg,var(--color-neutral-200)_0_11px,var(--color-neutral-300)_11px_22px)]">
          <span className="text-center font-mono text-[11px] tracking-[0.06em] text-neutral-700">
            mapa del sistema — captación, planta, tanques y redes
          </span>
        </div>
        <figcaption className="mt-1 text-[11px] text-text/55">
          Croquis del sistema. Pendiente de levantamiento cartográfico.
        </figcaption>
      </Blueprint>
    </section>
  );
}
