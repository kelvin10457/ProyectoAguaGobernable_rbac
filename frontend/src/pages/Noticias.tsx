import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Blueprint from '../components/Blueprint';
import { useJaap } from '../state/JaapContext';
import { api, ApiError } from '../lib/api';
import type { NoticiaData } from '../types';

const FORM_VACIO = { titulo: '', resumen: '', contenido: '', imagenesUrl: [] as string[], videosUrl: [] as string[] };
type FormNoticia = typeof FORM_VACIO;
type CampoLista = 'imagenesUrl' | 'videosUrl';

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' });
}

function EditorListaUrls({
  form,
  onChange,
  campo,
  etiqueta,
  placeholder,
  textoAgregar,
}: {
  form: FormNoticia;
  onChange: (form: FormNoticia) => void;
  campo: CampoLista;
  etiqueta: string;
  placeholder: string;
  textoAgregar: string;
}) {
  const urls = form[campo];

  const actualizarUrl = (indice: number, valor: string) => {
    const siguiente = urls.slice();
    siguiente[indice] = valor;
    onChange({ ...form, [campo]: siguiente });
  };

  const quitarUrl = (indice: number) => {
    onChange({ ...form, [campo]: urls.filter((_, i) => i !== indice) });
  };

  const agregarUrl = () => onChange({ ...form, [campo]: [...urls, ''] });

  return (
    <div className="grid gap-1.5">
      <label className="text-[12px] text-text/70">{etiqueta}</label>
      {urls.map((url, indice) => (
        <div key={indice} className="flex gap-1.5">
          <input className="input" placeholder={placeholder} value={url} onChange={(e) => actualizarUrl(indice, e.target.value)} />
          <button type="button" className="btn btn-ghost text-red-600" onClick={() => quitarUrl(indice)}>
            Quitar
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-secondary" onClick={agregarUrl}>
        {textoAgregar}
      </button>
    </div>
  );
}

export default function Noticias() {
  const { role, token } = useJaap();
  const puedeEditar = role === 'junta';

  const [noticias, setNoticias] = useState<NoticiaData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [creando, setCreando] = useState(false);
  const [formNueva, setFormNueva] = useState<FormNoticia>(FORM_VACIO);
  const [guardandoNueva, setGuardandoNueva] = useState(false);

  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [formEdicion, setFormEdicion] = useState<FormNoticia>(FORM_VACIO);
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);

  const cargar = () =>
    api
      .getNoticias()
      .then(setNoticias)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'No se pudo cargar el listado de noticias'));

  useEffect(() => {
    cargar();
  }, []);

  const crearNoticia = () => {
    if (!token || !formNueva.titulo.trim() || !formNueva.contenido.trim()) return;
    setGuardandoNueva(true);
    api
      .createNoticia(formNueva, token)
      .then((creada) => {
        setNoticias((actual) => [creada, ...(actual ?? [])]);
        setFormNueva(FORM_VACIO);
        setCreando(false);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'No se pudo publicar la noticia'))
      .finally(() => setGuardandoNueva(false));
  };

  const iniciarEdicion = (noticia: NoticiaData) => {
    setEditandoId(noticia.id);
    setFormEdicion({
      titulo: noticia.titulo,
      resumen: noticia.resumen ?? '',
      contenido: noticia.contenido,
      imagenesUrl: noticia.imagenesUrl.slice(),
      videosUrl: noticia.videosUrl.slice(),
    });
  };

  const guardarEdicion = (id: string) => {
    if (!token || !formEdicion.titulo.trim() || !formEdicion.contenido.trim()) return;
    setGuardandoEdicion(true);
    api
      .updateNoticia(id, formEdicion, token)
      .then((actualizada) => {
        setNoticias((actual) => actual?.map((n) => (n.id === id ? actualizada : n)) ?? actual);
        setEditandoId(null);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'No se pudo guardar la noticia'))
      .finally(() => setGuardandoEdicion(false));
  };

  const eliminarNoticia = (id: string) => {
    if (!token) return;
    if (!window.confirm('¿Eliminar esta noticia? Esta acción no se puede deshacer.')) return;
    api
      .deleteNoticia(id, token)
      .then(() => setNoticias((actual) => actual?.filter((n) => n.id !== id) ?? actual))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'No se pudo eliminar la noticia'));
  };

  return (
    <section>
      <div className="mb-1.5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="mb-1.5 text-[11px] uppercase tracking-[0.12em] text-accent-700">Noticias</div>
          <h1 className="m-0 text-[clamp(28px,4.4vw,42px)]">Novedades de la JAAP</h1>
        </div>
        {puedeEditar && !creando && (
          <button type="button" className="btn btn-primary" onClick={() => setCreando(true)}>
            Nueva noticia
          </button>
        )}
      </div>
      <p className="max-w-[60ch] text-text/72">Avisos, actividades y novedades para toda la comunidad.</p>

      {error && (
        <Blueprint className="mt-[22px] flex animate-pop-in items-center gap-2.5 border-red-600 px-3.5 py-2.5">
          <span className="text-[13px] text-red-600">{error}</span>
        </Blueprint>
      )}

      {creando && (
        <Blueprint className="mt-[22px] animate-pop-in p-[18px]">
          <h6 className="mb-3">Nueva noticia</h6>
          <div className="grid gap-2.5">
            <input
              className="input"
              placeholder="Título"
              value={formNueva.titulo}
              onChange={(e) => setFormNueva({ ...formNueva, titulo: e.target.value })}
            />
            <input
              className="input"
              placeholder="Resumen breve (opcional)"
              value={formNueva.resumen}
              onChange={(e) => setFormNueva({ ...formNueva, resumen: e.target.value })}
            />
            <textarea
              className="input"
              rows={5}
              placeholder="Contenido de la noticia"
              value={formNueva.contenido}
              onChange={(e) => setFormNueva({ ...formNueva, contenido: e.target.value })}
            />
            <EditorListaUrls
              form={formNueva}
              onChange={setFormNueva}
              campo="imagenesUrl"
              etiqueta="Imágenes (opcional, la primera se usa como portada)"
              placeholder="URL de la imagen"
              textoAgregar="+ Agregar imagen"
            />
            <EditorListaUrls
              form={formNueva}
              onChange={setFormNueva}
              campo="videosUrl"
              etiqueta="Videos (opcional, link de YouTube o Vimeo)"
              placeholder="https://www.youtube.com/watch?v=..."
              textoAgregar="+ Agregar video"
            />
            <div className="flex gap-2">
              <button type="button" className="btn btn-primary" onClick={crearNoticia} disabled={guardandoNueva}>
                {guardandoNueva ? 'Publicando…' : 'Publicar noticia'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setCreando(false);
                  setFormNueva(FORM_VACIO);
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </Blueprint>
      )}

      {!error && !noticias && <p className="mt-[22px] text-sm opacity-60">Cargando noticias…</p>}

      {noticias && noticias.length === 0 && !creando && (
        <p className="mt-[22px] text-sm opacity-60">No hay noticias publicadas todavía.</p>
      )}

      {noticias && noticias.length > 0 && (
        <div className="stagger mt-[26px] grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] items-start gap-[22px]">
          {noticias.map((n) =>
            editandoId === n.id ? (
              <Blueprint key={n.id} className="p-[18px]">
                <div className="grid gap-2.5">
                  <input
                    className="input"
                    placeholder="Título"
                    value={formEdicion.titulo}
                    onChange={(e) => setFormEdicion({ ...formEdicion, titulo: e.target.value })}
                  />
                  <input
                    className="input"
                    placeholder="Resumen breve (opcional)"
                    value={formEdicion.resumen}
                    onChange={(e) => setFormEdicion({ ...formEdicion, resumen: e.target.value })}
                  />
                  <textarea
                    className="input"
                    rows={5}
                    placeholder="Contenido de la noticia"
                    value={formEdicion.contenido}
                    onChange={(e) => setFormEdicion({ ...formEdicion, contenido: e.target.value })}
                  />
                  <EditorListaUrls
                    form={formEdicion}
                    onChange={setFormEdicion}
                    campo="imagenesUrl"
                    etiqueta="Imágenes (opcional, la primera se usa como portada)"
                    placeholder="URL de la imagen"
                    textoAgregar="+ Agregar imagen"
                  />
                  <EditorListaUrls
                    form={formEdicion}
                    onChange={setFormEdicion}
                    campo="videosUrl"
                    etiqueta="Videos (opcional, link de YouTube o Vimeo)"
                    placeholder="https://www.youtube.com/watch?v=..."
                    textoAgregar="+ Agregar video"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => guardarEdicion(n.id)}
                      disabled={guardandoEdicion}
                    >
                      {guardandoEdicion ? 'Guardando…' : 'Guardar cambios'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => setEditandoId(null)}>
                      Cancelar
                    </button>
                  </div>
                </div>
              </Blueprint>
            ) : (
              <Blueprint key={n.id} className="card overflow-hidden p-0">
                {n.imagenesUrl[0] && (
                  <img
                    src={n.imagenesUrl[0]}
                    alt={n.titulo}
                    className="aspect-[16/9] w-full object-cover"
                  />
                )}
                <div className="flex flex-1 flex-col gap-[7px] p-[18px]">
                  <div className="card-kicker">{formatearFecha(n.createdAt)}</div>
                  <div className="card-title">{n.titulo}</div>
                  {n.resumen && <p className="card-body">{n.resumen}</p>}
                  <Link to={`/noticias/${n.id}`} className="btn btn-secondary btn-block mt-2">
                    Leer más
                  </Link>
                  {puedeEditar && (
                    <div className="mt-1.5 flex gap-2">
                      <button type="button" className="btn btn-ghost" onClick={() => iniciarEdicion(n)}>
                        Editar
                      </button>
                      <button type="button" className="btn btn-ghost text-red-600" onClick={() => eliminarNoticia(n.id)}>
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </Blueprint>
            ),
          )}
        </div>
      )}
    </section>
  );
}
