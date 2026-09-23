import Blueprint from '../components/Blueprint';
import { useJaap } from '../state/JaapContext';

/** Permite pegar el <iframe> completo que da "Compartir → Insertar un mapa" de Google Maps, o solo la URL. */
function extraerSrcMapa(valor: string): string {
  const match = valor.match(/src="([^"]+)"/);
  return match ? match[1] : valor.trim();
}

export default function InformacionGeneral() {
  const {
    role,
    informacionGeneral,
    editandoInfo,
    guardadoInfo,
    guardandoInfo,
    errorInfo,
    borradorInfo,
    iniciarEdicionInfo,
    cancelarEdicionInfo,
    actualizarBorradorInfo,
    publicarInfo,
  } = useJaap();

  const datos = editandoInfo && borradorInfo ? borradorInfo : informacionGeneral;
  const puedeEditar = role === 'junta';

  return (
    <section>
      <div className="mb-1.5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="mb-1.5 text-[11px] uppercase tracking-[0.12em] text-accent-700">Información general</div>
          <h1 className="m-0 text-[clamp(28px,4.4vw,42px)]">Quiénes somos</h1>
        </div>
        {puedeEditar && (
          <div className="flex items-end gap-2">
            {editandoInfo ? (
              <>
                <button type="button" className="btn btn-primary" onClick={publicarInfo} disabled={guardandoInfo}>
                  {guardandoInfo ? 'Publicando…' : 'Publicar cambios'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={cancelarEdicionInfo}>
                  Cancelar
                </button>
              </>
            ) : (
              <button type="button" className="btn btn-secondary" onClick={iniciarEdicionInfo} disabled={!informacionGeneral}>
                Editar
              </button>
            )}
          </div>
        )}
      </div>

      {guardadoInfo && (
        <Blueprint className="mb-[18px] flex animate-pop-in items-center gap-2.5 border-green bg-green-100/40 px-3.5 py-2.5">
          <span className="tag tag-green">Publicado</span>
          <span className="text-[13px]">La información general fue actualizada.</span>
        </Blueprint>
      )}
      {errorInfo && (
        <Blueprint className="mb-[18px] flex animate-pop-in items-center gap-2.5 border-red-600 px-3.5 py-2.5">
          <span className="text-[13px] text-red-600">{errorInfo}</span>
        </Blueprint>
      )}

      <div className="mb-7 mt-4 grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-start gap-[30px]">
        <div>
          <p className="max-w-[56ch] text-[17px] leading-relaxed">
            La Junta de Agua Potable de El Limón–Havoline atiende a {datos?.familias ?? '—'} familias del sector para
            la provisión de agua. Como la mayoría de las comunidades rurales, padecemos escasez e incertidumbre de no
            tener acceso continuo a agua potable y segura.
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
          {editandoInfo ? (
            <div className="grid aspect-[4/3] place-items-center gap-2.5 bg-[repeating-linear-gradient(135deg,var(--color-neutral-200)_0_9px,var(--color-neutral-300)_9px_18px)] p-4">
              <span className="px-3 text-center font-mono text-[11px] tracking-[0.06em] text-neutral-700">
                foto de la captación
                <br />o de la comunidad
              </span>
              <input
                className="input w-full max-w-[280px]"
                placeholder="URL de la foto"
                value={datos?.fotoUrl ?? ''}
                onChange={(e) => actualizarBorradorInfo('fotoUrl', e.target.value)}
              />
            </div>
          ) : datos?.fotoUrl ? (
            <img src={datos.fotoUrl} alt="Captación o comunidad" className="aspect-[4/3] w-full object-cover" />
          ) : (
            <div className="grid aspect-[4/3] place-items-center bg-[repeating-linear-gradient(135deg,var(--color-neutral-200)_0_9px,var(--color-neutral-300)_9px_18px)]">
              <span className="px-3 text-center font-mono text-[11px] tracking-[0.06em] text-neutral-700">
                foto de la captación
                <br />o de la comunidad
              </span>
            </div>
          )}
        </Blueprint>
      </div>

      {!datos ? (
        <p className="text-sm opacity-60">Cargando información general…</p>
      ) : (
        <div className="stagger mt-[38px] grid grid-cols-[repeat(auto-fit,minmax(min(100%,270px),1fr))] gap-[22px]">
          <Blueprint className="p-[18px]">
            <h6 className="mb-3">Usuarios y localidades</h6>
            <dl className="m-0 grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1.5 text-sm">
              <dt className="opacity-60">Familias</dt>
              <dd className="m-0">
                {editandoInfo ? (
                  <input
                    className="input"
                    inputMode="numeric"
                    value={datos.familias}
                    onChange={(e) => actualizarBorradorInfo('familias', Number(e.target.value) || 0)}
                  />
                ) : (
                  datos.familias
                )}
              </dd>
              <dt className="opacity-60">Habitantes</dt>
              <dd className="m-0">
                {editandoInfo ? (
                  <input
                    className="input"
                    inputMode="numeric"
                    value={datos.habitantes}
                    onChange={(e) => actualizarBorradorInfo('habitantes', Number(e.target.value) || 0)}
                  />
                ) : (
                  datos.habitantes
                )}
              </dd>
              <dt className="opacity-60">Atiende</dt>
              <dd className="m-0">
                {editandoInfo ? (
                  <input
                    className="input"
                    value={datos.localidadesAtendidas}
                    onChange={(e) => actualizarBorradorInfo('localidadesAtendidas', e.target.value)}
                  />
                ) : (
                  datos.localidadesAtendidas
                )}
              </dd>
              <dt className="opacity-60">Cantón</dt>
              <dd className="m-0">
                {editandoInfo ? (
                  <input className="input" value={datos.canton} onChange={(e) => actualizarBorradorInfo('canton', e.target.value)} />
                ) : (
                  `${datos.canton}, ${datos.provincia}`
                )}
              </dd>
              {editandoInfo && (
                <>
                  <dt className="opacity-60">Provincia</dt>
                  <dd className="m-0">
                    <input
                      className="input"
                      value={datos.provincia}
                      onChange={(e) => actualizarBorradorInfo('provincia', e.target.value)}
                    />
                  </dd>
                </>
              )}
            </dl>
          </Blueprint>
          <Blueprint className="p-[18px]">
            <h6 className="mb-3">Ubicación técnica</h6>
            <dl className="m-0 grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1.5 text-sm">
              <dt className="opacity-60">Zona UTM</dt>
              <dd className="m-0">
                {editandoInfo ? (
                  <input className="input" value={datos.zonaUtm} onChange={(e) => actualizarBorradorInfo('zonaUtm', e.target.value)} />
                ) : (
                  datos.zonaUtm
                )}
              </dd>
              <dt className="opacity-60">Este</dt>
              <dd className="m-0 font-mono">
                {editandoInfo ? (
                  <input
                    className="input font-mono"
                    value={datos.coordenadaEste}
                    onChange={(e) => actualizarBorradorInfo('coordenadaEste', e.target.value)}
                  />
                ) : (
                  datos.coordenadaEste
                )}
              </dd>
              <dt className="opacity-60">Sur</dt>
              <dd className="m-0 font-mono">
                {editandoInfo ? (
                  <input
                    className="input font-mono"
                    value={datos.coordenadaSur}
                    onChange={(e) => actualizarBorradorInfo('coordenadaSur', e.target.value)}
                  />
                ) : (
                  datos.coordenadaSur
                )}
              </dd>
              <dt className="opacity-60">Cota</dt>
              <dd className="m-0">
                {editandoInfo ? (
                  <input className="input" value={datos.cota} onChange={(e) => actualizarBorradorInfo('cota', e.target.value)} />
                ) : (
                  datos.cota
                )}
              </dd>
            </dl>
          </Blueprint>
          <Blueprint className="p-[18px]">
            <h6 className="mb-3">Directiva y contacto</h6>
            <dl className="m-0 grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1.5 text-sm">
              <dt className="opacity-60">Presidente</dt>
              <dd className="m-0">
                {editandoInfo ? (
                  <input
                    className="input"
                    value={datos.presidente}
                    onChange={(e) => actualizarBorradorInfo('presidente', e.target.value)}
                  />
                ) : (
                  datos.presidente
                )}
              </dd>
              <dt className="opacity-60">Teléfono</dt>
              <dd className="m-0">
                {editandoInfo ? (
                  <input
                    className="input"
                    value={datos.telefonoContacto}
                    onChange={(e) => actualizarBorradorInfo('telefonoContacto', e.target.value)}
                  />
                ) : (
                  <a href={`tel:${datos.telefonoContacto.replace(/\s/g, '')}`}>{datos.telefonoContacto}</a>
                )}
              </dd>
              <dt className="opacity-60">Teléfono de la junta</dt>
              <dd className="m-0">
                {editandoInfo ? (
                  <input
                    className="input"
                    value={datos.telefonoJunta}
                    onChange={(e) => actualizarBorradorInfo('telefonoJunta', e.target.value)}
                  />
                ) : datos.telefonoJunta ? (
                  <a href={`tel:${datos.telefonoJunta.replace(/\s/g, '')}`}>{datos.telefonoJunta}</a>
                ) : (
                  '—'
                )}
              </dd>
              <dt className="opacity-60">Atención</dt>
              <dd className="m-0">
                {editandoInfo ? (
                  <input
                    className="input"
                    value={datos.horarioAtencion}
                    onChange={(e) => actualizarBorradorInfo('horarioAtencion', e.target.value)}
                  />
                ) : (
                  datos.horarioAtencion
                )}
              </dd>
            </dl>
          </Blueprint>
        </div>
      )}

      <Blueprint as="figure" className="mt-[34px] overflow-hidden">
        {editandoInfo ? (
          <div className="grid aspect-[21/8] place-items-center gap-2.5 bg-[repeating-linear-gradient(90deg,var(--color-neutral-200)_0_11px,var(--color-neutral-300)_11px_22px)] p-4">
            <span className="text-center font-mono text-[11px] tracking-[0.06em] text-neutral-700">
              mapa del sistema — captación, planta, tanques y redes
            </span>
            <input
              className="input w-full max-w-[460px]"
              placeholder="Pega el link o el <iframe> de Google Maps (Compartir → Insertar un mapa)"
              value={datos?.mapaUrl ?? ''}
              onChange={(e) => actualizarBorradorInfo('mapaUrl', extraerSrcMapa(e.target.value))}
            />
          </div>
        ) : datos?.mapaUrl ? (
          <iframe
            src={datos.mapaUrl}
            className="aspect-[21/8] w-full border-0"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            title="Mapa del sistema"
          />
        ) : (
          <div className="grid aspect-[21/8] place-items-center bg-[repeating-linear-gradient(90deg,var(--color-neutral-200)_0_11px,var(--color-neutral-300)_11px_22px)]">
            <span className="text-center font-mono text-[11px] tracking-[0.06em] text-neutral-700">
              mapa del sistema — captación, planta, tanques y redes
            </span>
          </div>
        )}
        <figcaption className="mt-1 text-[11px] text-text/55">
          Croquis del sistema. Pendiente de levantamiento cartográfico.
        </figcaption>
      </Blueprint>
    </section>
  );
}
