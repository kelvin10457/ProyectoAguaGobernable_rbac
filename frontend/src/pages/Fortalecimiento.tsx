import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Blueprint from '../components/Blueprint';
import { useJaap } from '../state/JaapContext';
import { api, ApiError } from '../lib/api';
import type { CapacitacionResumen } from '../types';

const ETIQUETA_TIPO: Record<CapacitacionResumen['tipo'], string> = {
  video: 'Video',
  texto: 'Documento',
};

export default function Fortalecimiento() {
  const { token } = useJaap();
  const [capacitaciones, setCapacitaciones] = useState<CapacitacionResumen[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getFortalecimiento(token)
      .then(setCapacitaciones)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'No se pudo cargar el listado'));
  }, [token]);

  return (
    <section>
      <div className="mb-1.5 text-[11px] uppercase tracking-[0.12em] text-accent-700">
        Fortalecimiento de capacidades
      </div>
      <h1 className="m-0 mb-2 text-[clamp(28px,4.4vw,42px)]">
        Fortalezcamos nuestras capacidades y el sistema de agua potable
      </h1>
      <p className="max-w-[60ch] text-text/72">
        Capacitaciones para la directiva, operadores y usuarios de la JAAP El Limón–Havoline.
      </p>

      {error && (
        <Blueprint className="mt-[22px] flex animate-pop-in items-center gap-2.5 border-red-600 px-3.5 py-2.5">
          <span className="text-[13px] text-red-600">{error}</span>
        </Blueprint>
      )}

      {!error && !capacitaciones && <p className="mt-[22px] text-sm opacity-60">Cargando capacitaciones…</p>}

      {capacitaciones && capacitaciones.length === 0 && (
        <p className="mt-[22px] text-sm opacity-60">No hay capacitaciones disponibles todavía.</p>
      )}

      {capacitaciones && capacitaciones.length > 0 && (
        <div className="stagger mt-[26px] grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-[22px]">
          {capacitaciones.map((c) => (
            <Blueprint key={c.slug} className="card">
              <div className="card-kicker">{ETIQUETA_TIPO[c.tipo]}</div>
              <div className="card-title">{c.titulo}</div>
              <Link to={`/fortalecimiento/${c.slug}`} className="btn btn-secondary btn-block mt-2">
                Ver capacitación
              </Link>
            </Blueprint>
          ))}
        </div>
      )}
    </section>
  );
}
