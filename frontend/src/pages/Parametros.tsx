import Blueprint from '../components/Blueprint';
import { useJaap } from '../state/JaapContext';
import type { TablaFila } from '../state/JaapContext';

function TablaParametros({ filas, titulo, nota, columnaLimite }: { filas: TablaFila[]; titulo: string; nota: string; columnaLimite: string }) {
  return (
    <Blueprint className="mb-[26px] px-[18px] pb-1.5 pt-[18px]">
      <h4 className="mb-1">{titulo}</h4>
      <p className="mb-3 text-xs opacity-60">{nota}</p>
      <div className="overflow-x-auto">
        <table className="table min-w-[560px]">
          <thead>
            <tr>
              <th className="w-[26%]">Parámetro</th>
              <th className="w-[32%]">{columnaLimite}</th>
              <th className="w-[22%]">Valor medido</th>
              <th className="w-[20%]">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((fila) => (
              <tr key={fila.nombre}>
                <td className="font-heading text-base">{fila.nombre}</td>
                <td className="font-mono text-xs opacity-75">{fila.limite}</td>
                <td>
                  {fila.editable ? (
                    <input
                      className="input max-w-[130px]"
                      value={fila.valor}
                      onChange={(e) => fila.onChange(e.target.value)}
                    />
                  ) : (
                    <span className="font-mono text-sm">{fila.valorTexto}</span>
                  )}
                </td>
                <td>
                  <span className={`tag ${fila.tagClass}`}>{fila.estadoLabel}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Blueprint>
  );
}

export default function Parametros() {
  const { isAdmin, editando, guardado, calidad, cantidad, iniciarEdicion, cancelarEdicion, publicar } = useJaap();

  return (
    <section>
      <div className="mb-[22px] flex flex-wrap items-end gap-4">
        <div className="min-w-0 flex-1 basis-[300px]">
          <div className="mb-1.5 text-[11px] uppercase tracking-[0.12em] text-accent-700">
            Parámetros · retroalimentación mensual
          </div>
          <h1 className="m-0 mb-1.5 text-[clamp(28px,4.4vw,42px)]">El agua que consumimos</h1>
          <p className="m-0 text-[13px] text-text/65">
            {isAdmin
              ? 'Editas los valores del mes; al publicarlos se actualizan para las 525 familias.'
              : 'Valores publicados por la directiva. Vista de solo lectura.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="field">
            <label>Mes</label>
            <select className="input min-w-[150px]">
              <option>Mes 1 · agosto 2026</option>
              <option>Mes 2 · julio 2026</option>
              <option>Mes 3 · junio 2026</option>
            </select>
          </div>
          {isAdmin && (
            <div className="flex items-end gap-2 self-end">
              {editando ? (
                <>
                  <button type="button" className="btn btn-primary" onClick={publicar}>
                    Publicar cambios
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={cancelarEdicion}>
                    Cancelar
                  </button>
                </>
              ) : (
                <button type="button" className="btn btn-secondary" onClick={iniciarEdicion}>
                  Editar tabla
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {guardado && (
        <Blueprint className="mb-[18px] flex items-center gap-2.5 border-accent px-3.5 py-2.5">
          <span className="tag tag-accent">Publicado</span>
          <span className="text-[13px]">Los usuarios ya ven los valores actualizados del mes.</span>
        </Blueprint>
      )}

      <TablaParametros
        filas={calidad}
        titulo="Parámetros de calidad"
        nota="Color, turbiedad, sabor, olor, coliformes, plaguicidas y cianotoxinas."
        columnaLimite="Límite máximo permitido"
      />
      <TablaParametros
        filas={cantidad}
        titulo="Parámetros de cantidad"
        nota="Presión en red y conexión domiciliaria."
        columnaLimite="Rango permitido"
      />

      <p className="mt-[18px] text-xs opacity-55">
        Fuente de los límites: normativa nacional de agua para consumo humano. Registro a cargo de la directiva y el
        operador.
      </p>
    </section>
  );
}
