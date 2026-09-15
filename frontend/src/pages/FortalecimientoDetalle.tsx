import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Blueprint from '../components/Blueprint';
import { useJaap } from '../state/JaapContext';
import { api, ApiError } from '../lib/api';
import type { CapacitacionDetalle, ContenidoTexto, SeccionTexto } from '../types';

function Seccion({ seccion }: { seccion: SeccionTexto }) {
  return (
    <div className="mb-8 last:mb-0">
      <h3 className="mb-2.5 font-heading text-[22px]">{seccion.titulo}</h3>
      {seccion.parrafos?.map((p, i) => (
        <p key={i} className="mb-3 text-[15px] leading-relaxed text-text/85">
          {p}
        </p>
      ))}
      {seccion.destacado && (
        <Blueprint className="my-4 border-accent bg-accent/5 px-4 py-3.5">
          <p className="m-0 font-heading text-[17px] italic leading-snug text-accent-800">“{seccion.destacado}”</p>
        </Blueprint>
      )}
      {seccion.subtitulo && <h4 className="mb-2 mt-4 text-[15px] font-semibold">{seccion.subtitulo}</h4>}
      {seccion.lista && (
        <ul className="m-0 list-none space-y-2.5 pl-0">
          {seccion.lista.map((item, i) => (
            <li key={i} className="flex gap-2.5 text-[14px] leading-relaxed text-text/85">
              <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
              <span>
                {item.fuerte && <strong className="font-heading">{item.fuerte}: </strong>}
                {item.texto}
              </span>
            </li>
          ))}
        </ul>
      )}
      {seccion.tabla && (
        <div className="my-3 overflow-x-auto">
          <table className="table min-w-[420px]">
            <thead>
              <tr>
                {seccion.tabla.columnas.map((columna) => (
                  <th key={columna}>{columna}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {seccion.tabla.filas.map((fila, i) => (
                <tr key={i}>
                  {fila.map((celda, j) => (
                    <td key={j} className={j === 0 ? 'text-sm' : 'font-mono text-xs opacity-75'}>
                      {celda}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ContenidoTextoView({ contenido }: { contenido: ContenidoTexto }) {
  return (
    <div className="grid grid-cols-[minmax(0,220px)_1fr] items-start gap-[30px] max-[720px]:grid-cols-1">
      <Blueprint className="p-[18px]">
        <h6 className="mb-2.5">Contenido</h6>
        <ol className="m-0 list-decimal space-y-1.5 pl-[18px] text-[13px] leading-snug opacity-80">
          {contenido.indice.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </Blueprint>
      <Blueprint className="p-[24px]">
        {contenido.secciones.map((seccion) => (
          <div key={seccion.titulo}>
            <Seccion seccion={seccion} />
            {seccion.id === 'estructura-costos' && (
              <Link to="/costeo" className="btn btn-secondary">
                Ver / editar el costeo anual del servicio
              </Link>
            )}
          </div>
        ))}
      </Blueprint>
    </div>
  );
}

export default function FortalecimientoDetalle() {
  const { slug } = useParams<{ slug: string }>();
  const { token } = useJaap();
  const [capacitacion, setCapacitacion] = useState<CapacitacionDetalle | null>(null);
  const [noEncontrada, setNoEncontrada] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setCapacitacion(null);
    setNoEncontrada(false);
    setError(null);

    api
      .getCapacitacion(slug, token)
      .then(setCapacitacion)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          setNoEncontrada(true);
        } else {
          setError(err instanceof ApiError ? err.message : 'No se pudo cargar la capacitación');
        }
      });
  }, [slug, token]);

  if (noEncontrada) {
    return (
      <section>
        <p className="text-sm opacity-70">Esta capacitación no existe o no está disponible para tu perfil.</p>
        <Link to="/fortalecimiento" className="btn btn-secondary mt-3">
          Volver al listado
        </Link>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <Blueprint className="flex animate-pop-in items-center gap-2.5 border-red-600 px-3.5 py-2.5">
          <span className="text-[13px] text-red-600">{error}</span>
        </Blueprint>
      </section>
    );
  }

  if (!capacitacion) {
    return (
      <section>
        <p className="text-sm opacity-60">Cargando capacitación…</p>
      </section>
    );
  }

  return (
    <section>
      <Link to="/fortalecimiento" className="text-[11px] uppercase tracking-[0.12em] text-accent-700 no-underline">
        ← Fortalecimiento
      </Link>
      <h1 className="m-0 mt-1.5 mb-5 text-[clamp(28px,4.4vw,42px)]">{capacitacion.titulo}</h1>

      {capacitacion.tipo === 'video' ? (
        <Blueprint as="figure" className="m-0 max-w-[640px] overflow-hidden">
          <div className="relative grid aspect-video place-items-center bg-[repeating-linear-gradient(135deg,var(--color-neutral-200)_0_10px,var(--color-neutral-300)_10px_20px)]">
            <div className="grid h-[74px] w-[74px] place-items-center border-[1.5px] border-accent-800 bg-bg/75">
              <div className="ml-1.5 h-0 w-0 border-y-[13px] border-l-[20px] border-y-transparent border-l-accent-800" />
            </div>
          </div>
          <figcaption className="mt-1 break-all text-[11px] text-text/55">{capacitacion.contenido}</figcaption>
        </Blueprint>
      ) : (
        <ContenidoTextoView contenido={capacitacion.contenido} />
      )}
    </section>
  );
}
