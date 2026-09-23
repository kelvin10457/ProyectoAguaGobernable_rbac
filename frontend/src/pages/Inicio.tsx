import { Link } from 'react-router-dom';
import Blueprint from '../components/Blueprint';
import { useJaap } from '../state/JaapContext';

export default function Inicio() {
  const {
    isStaff,
    role,
    cumplenCount,
    totalParams,
    estadoGeneral,
    mesParametros,
    cargoFijo,
    cargoVariable,
    informacionGeneral,
    editandoInfo,
    guardandoInfo,
    errorInfo,
    borradorInfo,
    iniciarEdicionInfo,
    cancelarEdicionInfo,
    actualizarBorradorInfo,
    publicarInfo,
  } = useJaap();

  const puedeEditar = role === 'junta';
  const datos = editandoInfo && borradorInfo ? borradorInfo : informacionGeneral;

  const familias = datos?.familias;
  const habitantes = datos?.habitantes;
  const msnm = datos?.cota.match(/\d+/)?.[0] ?? datos?.cota;
  const localidades = datos?.localidadesAtendidas ?? 'El Limón y Havoline';

  return (
    <section>
      <div className="relative mb-8 overflow-hidden rounded-[28px] bg-accent-700 px-6 py-10 text-white shadow-lg sm:px-10">
        {puedeEditar && (
          <div className="mb-4 flex flex-wrap justify-end gap-2">
            {editandoInfo ? (
              <>
                <button
                  type="button"
                  className="btn btn-primary py-1.5 text-xs"
                  onClick={publicarInfo}
                  disabled={guardandoInfo}
                >
                  {guardandoInfo ? 'Publicando…' : 'Publicar cambios'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary py-1.5 text-xs"
                  onClick={cancelarEdicionInfo}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn btn-secondary py-1.5 text-xs"
                onClick={iniciarEdicionInfo}
                disabled={!informacionGeneral}
              >
                Editar familias y habitantes
              </button>
            )}
          </div>
        )}
        <div className="flex flex-wrap items-end gap-6">
          <div className="min-w-0 flex-1 basis-80">
            <h1 className="m-0 mb-2 text-[clamp(30px,5vw,46px)] text-white">
              Plataforma para la gestión comunitaria del agua
            </h1>
            <p className="m-0 max-w-[52ch] text-white/85">
              Gobernanza local, calidad y sostenibilidad en la prestación del servicio para las {familias ?? '—'}{' '}
              familias de {localidades}.
            </p>
          </div>
          <div className="grid flex-none grid-cols-3 items-baseline gap-x-[26px] gap-y-1.5 rounded-2xl bg-white/10 px-[22px] py-4">
            {editandoInfo ? (
              <input
                className="input w-16 min-h-0 py-1 text-center font-heading text-[18px]"
                inputMode="numeric"
                value={familias ?? 0}
                onChange={(e) => actualizarBorradorInfo('familias', Number(e.target.value) || 0)}
              />
            ) : (
              <div className="font-heading text-[28px] leading-none text-white">{familias ?? '—'}</div>
            )}
            {editandoInfo ? (
              <input
                className="input w-20 min-h-0 py-1 text-center font-heading text-[18px]"
                inputMode="numeric"
                value={habitantes ?? 0}
                onChange={(e) => actualizarBorradorInfo('habitantes', Number(e.target.value) || 0)}
              />
            ) : (
              <div className="font-heading text-[28px] leading-none text-white">
                {habitantes ? habitantes.toLocaleString('es-EC') : '—'}
              </div>
            )}
            <div className="font-heading text-[28px] leading-none text-white">{msnm ?? '—'}</div>
            <div className="text-[10px] uppercase tracking-[0.1em] text-white/70">Familias</div>
            <div className="text-[10px] uppercase tracking-[0.1em] text-white/70">Habitantes</div>
            <div className="text-[10px] uppercase tracking-[0.1em] text-white/70">m.s.n.m.</div>
          </div>
        </div>
        {errorInfo && <p className="relative m-0 mt-4 text-[13px] text-red-100">{errorInfo}</p>}
      </div>

      <div className="stagger grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-[22px]">
        <Blueprint className="card">
          <div className="card-title">Calidad del semestre {mesParametros ?? '—'}</div>
          <div className="my-1 flex items-baseline gap-2.5">
            <span className="font-heading text-[34px] leading-none">
              {cumplenCount}/{totalParams}
            </span>
            <span className="tag tag-accent">{estadoGeneral}</span>
          </div>
          <p className="card-body">Parámetros dentro del límite permitido según la última toma de muestras.</p>
          <Link to="/parametros" className="btn btn-secondary btn-block">
            Ver parámetros
          </Link>
        </Blueprint>

        <Blueprint className="card">
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
          <div className="card-title">Capacitación del mes</div>
          <p className="card-body">
            Protocolos operativos y controles internos: un video corto de 6 minutos para operadores y directiva.
          </p>
          <Link to="/fortalecimiento" className="btn btn-secondary btn-block">
            Ver capacitación
          </Link>
        </Blueprint>
      </div>

      {isStaff && (
        <div className="mt-8">
          <h4 className="mb-3">Pendientes de la directiva</h4>
          <Blueprint className="divide-y divide-divider overflow-hidden">
            <div className="flex flex-wrap items-center gap-3 px-4 py-3.5">
              <span className="tag tag-outline shrink-0">Por registrar</span>
              <div className="min-w-0 flex-1">
                <div className="font-heading text-[15px]">Retroalimentación semestral de parámetros</div>
                <p className="m-0 text-[13px] opacity-70">
                  Semestre {mesParametros ?? '—'} — pendiente de cargar las mediciones.
                </p>
              </div>
              <Link to="/parametros" className="btn btn-secondary shrink-0">
                Registrar
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-3 px-4 py-3.5">
              <span className="tag tag-neutral shrink-0">Al día</span>
              <div className="min-w-0 flex-1">
                <div className="font-heading text-[15px]">Registro de usuarios</div>
                <p className="m-0 text-[13px] opacity-70">525 conexiones activas, revisadas hace 12 días.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 px-4 py-3.5">
              <span className="tag tag-outline shrink-0">En proceso</span>
              <div className="min-w-0 flex-1">
                <div className="font-heading text-[15px]">Estructura de costos y tarifas</div>
                <p className="m-0 text-[13px] opacity-70">Costeo del servicio en levantamiento — módulo aún no habilitado.</p>
              </div>
            </div>
          </Blueprint>
        </div>
      )}
    </section>
  );
}
