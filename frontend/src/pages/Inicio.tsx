import { Link } from 'react-router-dom';
import Blueprint from '../components/Blueprint';
import { useJaap } from '../state/JaapContext';

export default function Inicio() {
  const { isAdmin, cumplenCount, totalParams, estadoGeneral, cargoFijo, cargoVariable } = useJaap();

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end gap-5">
        <div className="min-w-0 flex-1 basis-80">
          <div className="mb-1.5 text-[11px] uppercase tracking-[0.12em] text-accent-700">
            Sistema de agua potable
          </div>
          <h1 className="m-0 mb-2 text-[clamp(30px,5vw,46px)]">
            Plataforma para la gestión comunitaria del agua
          </h1>
          <p className="m-0 max-w-[52ch] text-text/72">
            Gobernanza local, calidad y sostenibilidad en la prestación del servicio. Información abierta para las
            525 familias de El Limón y Havoline.
          </p>
        </div>
        <Blueprint className="grid flex-none grid-cols-3 items-baseline gap-x-[26px] gap-y-1.5 px-[18px] py-3.5">
          <div className="font-heading text-[28px] leading-none">525</div>
          <div className="font-heading text-[28px] leading-none">2 100</div>
          <div className="font-heading text-[28px] leading-none">74</div>
          <div className="text-[10px] uppercase tracking-[0.1em] opacity-60">Familias</div>
          <div className="text-[10px] uppercase tracking-[0.1em] opacity-60">Habitantes</div>
          <div className="text-[10px] uppercase tracking-[0.1em] opacity-60">m.s.n.m.</div>
        </Blueprint>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-[22px]">
        <Blueprint className="card">
          <div className="card-kicker">El agua que consumimos</div>
          <div className="card-title">Calidad del mes agosto 2026</div>
          <div className="my-1 flex items-baseline gap-2.5">
            <span className="font-heading text-[34px] leading-none">
              {cumplenCount}/{totalParams}
            </span>
            <span className="tag tag-accent">{estadoGeneral}</span>
          </div>
          <p className="card-body">Parámetros dentro del límite permitido según la última toma de muestras.</p>
          <div className="card-meta">Actualizado el 28 de agosto de 2026</div>
          <Link to="/parametros" className="btn btn-secondary btn-block">
            Ver parámetros
          </Link>
        </Blueprint>

        <Blueprint className="card">
          <div className="card-kicker">Tarifa</div>
          <div className="card-title">Calcula tu valor a pagar</div>
          <p className="card-body">
            Ingresa tu cédula, número de medidor y consumo del mes para conocer el valor de tu planilla.
          </p>
          <div className="flex gap-3.5 text-xs text-text/65">
            <span>
              Cargo fijo <strong className="font-heading text-[15px]">${cargoFijo.toFixed(2)}</strong>
            </span>
            <span>
              Cargo variable <strong className="font-heading text-[15px]">${cargoVariable.toFixed(2)}</strong>/m³
            </span>
          </div>
          <Link to="/tarifa" className="btn btn-primary btn-block">
            Abrir calculadora
          </Link>
        </Blueprint>

        <Blueprint className="card">
          <div className="card-kicker">Fortalecimiento</div>
          <div className="card-title">Capacitación del mes</div>
          <p className="card-body">
            Protocolos operativos y controles internos: un video corto de 6 minutos para operadores y directiva.
          </p>
          <div className="card-meta">Video · 6 min · con material descargable</div>
          <Link to="/fortalecimiento" className="btn btn-secondary btn-block">
            Ver capacitación
          </Link>
        </Blueprint>
      </div>

      {isAdmin && (
        <div className="mt-8">
          <h4 className="mb-3">Pendientes de la directiva</h4>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-3.5">
            <Blueprint className="flex flex-col gap-1.5 px-4 py-3.5">
              <span className="tag tag-outline self-start">Por registrar</span>
              <div className="font-heading text-[17px]">Retroalimentación mensual de parámetros</div>
              <p className="m-0 text-[13px] opacity-75">Mes septiembre 2026 — pendiente de cargar las mediciones.</p>
              <Link to="/parametros" className="btn btn-secondary self-start">
                Registrar
              </Link>
            </Blueprint>
            <Blueprint className="flex flex-col gap-1.5 px-4 py-3.5">
              <span className="tag tag-neutral self-start">Al día</span>
              <div className="font-heading text-[17px]">Registro de usuarios</div>
              <p className="m-0 text-[13px] opacity-75">525 conexiones activas · última revisión hace 12 días.</p>
            </Blueprint>
            <Blueprint className="flex flex-col gap-1.5 px-4 py-3.5">
              <span className="tag tag-outline self-start">En proceso</span>
              <div className="font-heading text-[17px]">Estructura de costos y tarifas</div>
              <p className="m-0 text-[13px] opacity-75">Costeo del servicio en levantamiento — módulo aún no habilitado.</p>
            </Blueprint>
          </div>
        </div>
      )}
    </section>
  );
}
