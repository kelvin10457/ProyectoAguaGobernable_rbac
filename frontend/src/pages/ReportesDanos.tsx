import { useEffect, useState } from 'react';
import Blueprint from '../components/Blueprint';
import { useJaap } from '../state/JaapContext';
import { api, ApiError } from '../lib/api';
import type { ReporteDanoData } from '../types';

const FORM_VACIO = { nombre: '', cedula: '', medidor: '', telefono: '', descripcion: '', imagenUrl: '' };
type FormReporte = typeof FORM_VACIO;

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ReportesDanos() {
  const { role, token } = useJaap();
  const esJunta = role === 'junta';

  const [reportes, setReportes] = useState<ReporteDanoData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormReporte>(FORM_VACIO);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    api
      .getReportesDanos()
      .then(setReportes)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'No se pudo cargar el listado de reportes'));
  }, []);

  const enviarReporte = () => {
    if (!form.nombre.trim() || !form.descripcion.trim()) return;
    setEnviando(true);
    setError(null);
    api
      .createReporteDano(form)
      .then((creado) => {
        setReportes((actual) => [creado, ...(actual ?? [])]);
        setForm(FORM_VACIO);
        setEnviado(true);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'No se pudo enviar el reporte'))
      .finally(() => setEnviando(false));
  };

  const eliminarReporte = (id: string) => {
    if (!token) return;
    if (!window.confirm('¿Eliminar este reporte? Esta acción no se puede deshacer.')) return;
    api
      .deleteReporteDano(id, token)
      .then(() => setReportes((actual) => actual?.filter((r) => r.id !== id) ?? actual))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'No se pudo eliminar el reporte'));
  };

  return (
    <section>
      <div className="mb-1.5 text-[11px] uppercase tracking-[0.12em] text-accent-700">Reportes de daños</div>
      <h1 className="m-0 mb-2 text-[clamp(28px,4.4vw,42px)]">¿Viste algo dañado?</h1>
      <p className="max-w-[60ch] text-text/72">
        Cuéntanos qué pasó: fuga, tubería rota, medidor dañado u otro incidente. La directiva revisa los reportes y
        los da de baja cuando quedan resueltos.
      </p>

      {error && (
        <Blueprint className="mt-[22px] flex animate-pop-in items-center gap-2.5 border-red-600 px-3.5 py-2.5">
          <span className="text-[13px] text-red-600">{error}</span>
        </Blueprint>
      )}

      <Blueprint className="mt-[22px] p-[18px]">
        <h6 className="mb-3">Reportar un daño</h6>
        {enviado && (
          <p className="mb-3 animate-pop-in text-[13px] text-green-700">
            Reporte enviado. Gracias por avisar a la directiva.
          </p>
        )}
        <div className="grid gap-2.5">
          <input
            className="input"
            placeholder="Tu nombre"
            value={form.nombre}
            onChange={(e) => {
              setForm({ ...form, nombre: e.target.value });
              setEnviado(false);
            }}
          />
          <input
            className="input"
            placeholder="Cédula (opcional)"
            value={form.cedula}
            onChange={(e) => setForm({ ...form, cedula: e.target.value })}
          />
          <input
            className="input"
            placeholder="Número de medidor (opcional)"
            value={form.medidor}
            onChange={(e) => setForm({ ...form, medidor: e.target.value })}
          />
          <input
            className="input"
            placeholder="Teléfono (opcional)"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          />
          <textarea
            className="input"
            rows={4}
            placeholder="Describe el daño: qué pasó, dónde y desde cuándo"
            value={form.descripcion}
            onChange={(e) => {
              setForm({ ...form, descripcion: e.target.value });
              setEnviado(false);
            }}
          />
          <input
            className="input"
            placeholder="URL de una foto (opcional)"
            value={form.imagenUrl}
            onChange={(e) => setForm({ ...form, imagenUrl: e.target.value })}
          />
          <button
            type="button"
            className="btn btn-primary self-start"
            onClick={enviarReporte}
            disabled={enviando || !form.nombre.trim() || !form.descripcion.trim()}
          >
            {enviando ? 'Enviando…' : 'Enviar reporte'}
          </button>
        </div>
      </Blueprint>

      {!error && !reportes && <p className="mt-[22px] text-sm opacity-60">Cargando reportes…</p>}

      {reportes && reportes.length === 0 && (
        <p className="mt-[22px] text-sm opacity-60">No hay reportes de daños registrados.</p>
      )}

      {reportes && reportes.length > 0 && (
        <div className="stagger mt-[26px] grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] items-start gap-[22px]">
          {reportes.map((r) => (
            <Blueprint key={r.id} className="card overflow-hidden p-0">
              {r.imagenUrl && <img src={r.imagenUrl} alt={`Daño reportado por ${r.nombre}`} className="aspect-[16/9] w-full object-cover" />}
              <div className="flex flex-1 flex-col gap-[7px] p-[18px]">
                <div className="card-kicker">{formatearFecha(r.createdAt)}</div>
                <div className="card-title">{r.nombre}</div>
                <p className="card-body">{r.descripcion}</p>
                {(r.cedula || r.medidor || r.telefono) && (
                  <p className="m-0 text-[12px] opacity-60">
                    {[r.cedula && `Cédula: ${r.cedula}`, r.medidor && `Medidor: ${r.medidor}`, r.telefono && `Tel: ${r.telefono}`]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                )}
                {esJunta && (
                  <button
                    type="button"
                    className="btn btn-ghost mt-1.5 self-start text-red-600"
                    onClick={() => eliminarReporte(r.id)}
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </Blueprint>
          ))}
        </div>
      )}
    </section>
  );
}
