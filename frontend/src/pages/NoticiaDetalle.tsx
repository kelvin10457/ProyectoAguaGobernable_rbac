import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Blueprint from '../components/Blueprint';
import { useJaap } from '../state/JaapContext';
import { api, ApiError } from '../lib/api';
import { obtenerEmbedVideo } from '../lib/video';
import type { NoticiaData } from '../types';

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function NoticiaDetalle() {
  const { id } = useParams<{ id: string }>();
  const { role, token } = useJaap();
  const navigate = useNavigate();
  const puedeEditar = role === 'junta';

  const [noticia, setNoticia] = useState<NoticiaData | null>(null);
  const [noEncontrada, setNoEncontrada] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eliminando, setEliminando] = useState(false);
  const [imagenActiva, setImagenActiva] = useState(0);

  useEffect(() => {
    if (!id) return;
    setNoticia(null);
    setNoEncontrada(false);
    setError(null);
    setImagenActiva(0);

    api
      .getNoticia(id)
      .then(setNoticia)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          setNoEncontrada(true);
        } else {
          setError(err instanceof ApiError ? err.message : 'No se pudo cargar la noticia');
        }
      });
  }, [id]);

  const eliminar = () => {
    if (!id || !token) return;
    if (!window.confirm('¿Eliminar esta noticia? Esta acción no se puede deshacer.')) return;
    setEliminando(true);
    api
      .deleteNoticia(id, token)
      .then(() => navigate('/noticias'))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'No se pudo eliminar la noticia'))
      .finally(() => setEliminando(false));
  };

  if (noEncontrada) {
    return (
      <section>
        <p className="text-sm opacity-70">Esta noticia no existe o fue eliminada.</p>
        <Link to="/noticias" className="btn btn-secondary mt-3">
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

  if (!noticia) {
    return (
      <section>
        <p className="text-sm opacity-60">Cargando noticia…</p>
      </section>
    );
  }

  return (
    <section>
      <Link to="/noticias" className="text-[11px] uppercase tracking-[0.12em] text-accent-700 no-underline">
        ← Noticias
      </Link>
      <div className="mt-1.5 mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="m-0 mb-1.5 text-[clamp(28px,4.4vw,42px)]">{noticia.titulo}</h1>
          <div className="text-[11px] uppercase tracking-[0.12em] text-text/55">{formatearFecha(noticia.createdAt)}</div>
        </div>
        {puedeEditar && (
          <div className="flex gap-2">
            <Link to="/noticias" className="btn btn-secondary">
              Editar en el listado
            </Link>
            <button type="button" className="btn btn-ghost text-red-600" onClick={eliminar} disabled={eliminando}>
              {eliminando ? 'Eliminando…' : 'Eliminar'}
            </button>
          </div>
        )}
      </div>

      {noticia.imagenesUrl.length > 0 && (
        <div className="mb-[26px]">
          <Blueprint as="figure" className="m-0 overflow-hidden">
            <img
              src={noticia.imagenesUrl[imagenActiva] ?? noticia.imagenesUrl[0]}
              alt={noticia.titulo}
              className="aspect-[16/9] w-full object-cover"
            />
          </Blueprint>
          {noticia.imagenesUrl.length > 1 && (
            <div className="mt-2.5 grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-2.5">
              {noticia.imagenesUrl.map((url, i) => (
                <button
                  key={url + i}
                  type="button"
                  onClick={() => setImagenActiva(i)}
                  className={`m-0 cursor-pointer overflow-hidden rounded-[var(--radius-md)] border-2 p-0 transition-colors ${
                    i === imagenActiva ? 'border-accent' : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`${noticia.titulo} ${i + 1}`} className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="max-w-[68ch] whitespace-pre-wrap text-[15px] leading-relaxed text-text/85">{noticia.contenido}</div>

      {noticia.videosUrl.length > 0 && (
        <div className="stagger mt-[30px] grid max-w-[68ch] gap-[22px]">
          {noticia.videosUrl.map((url, i) => (
            <Blueprint key={url + i} as="figure" className="m-0 overflow-hidden">
              <iframe
                src={obtenerEmbedVideo(url)}
                className="aspect-video w-full border-0"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`Video ${i + 1} — ${noticia.titulo}`}
              />
            </Blueprint>
          ))}
        </div>
      )}
    </section>
  );
}
