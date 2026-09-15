import { Link } from 'react-router-dom';
import Blueprint from '../components/Blueprint';
import { useJaap } from '../state/JaapContext';

function formatoUsd(valor: number): string {
  return `$${valor.toFixed(2)}`;
}

export default function Costeo() {
  const {
    puedeEditarCosteo,
    costeo,
    editandoCosteo,
    guardandoCosteo,
    guardadoCosteo,
    errorCosteo,
    iniciarEdicionCosteo,
    cancelarEdicionCosteo,
    actualizarCosteoFila,
    publicarCosteo,
  } = useJaap();

  const total = costeo.reduce((acc, fila) => acc + (fila.cantidadAnual ?? 0) * (fila.precioUnitario ?? 0), 0);

  return (
    <section>
      <div className="mb-[22px] flex flex-wrap items-end gap-4">
        <div className="min-w-0 flex-1 basis-[300px]">
          <div className="mb-1.5 text-[11px] uppercase tracking-[0.12em] text-accent-700">Costeo del servicio</div>
          <h1 className="m-0 mb-1.5 text-[clamp(28px,4.4vw,42px)]">Costeo anual del servicio</h1>
          <p className="m-0 text-[13px] text-text/65">
            {puedeEditarCosteo
              ? 'Editas la cantidad y el precio unitario de cada componente; al publicar se actualiza el costo anual estimado.'
              : 'Estructura de costos publicada por la directiva. Vista de solo lectura.'}
          </p>
        </div>
        {puedeEditarCosteo && (
          <div className="flex items-end gap-2 self-end">
            {editandoCosteo ? (
              <>
                <button type="button" className="btn btn-primary" onClick={publicarCosteo} disabled={guardandoCosteo}>
                  {guardandoCosteo ? 'Publicando…' : 'Publicar cambios'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={cancelarEdicionCosteo}>
                  Cancelar
                </button>
              </>
            ) : (
              <button type="button" className="btn btn-secondary" onClick={iniciarEdicionCosteo}>
                Editar tabla
              </button>
            )}
          </div>
        )}
      </div>

      {guardadoCosteo && (
        <Blueprint className="mb-[18px] flex animate-pop-in items-center gap-2.5 border-green bg-green-100/40 px-3.5 py-2.5">
          <span className="tag tag-green">Publicado</span>
          <span className="text-[13px]">El costeo del servicio fue actualizado.</span>
        </Blueprint>
      )}
      {errorCosteo && (
        <Blueprint className="mb-[18px] flex animate-pop-in items-center gap-2.5 border-red-600 px-3.5 py-2.5">
          <span className="text-[13px] text-red-600">{errorCosteo}</span>
        </Blueprint>
      )}

      <Blueprint className="px-[18px] pb-1.5 pt-[18px]">
        <div className="overflow-x-auto">
          <table className="table min-w-[640px]">
            <thead>
              <tr>
                <th>N.°</th>
                <th>Componente</th>
                <th>Rubro</th>
                <th>Unidad</th>
                <th>Cantidad anual</th>
                <th>Precio unitario USD</th>
                <th>Costo anual USD</th>
              </tr>
            </thead>
            <tbody>
              {costeo.map((fila) => {
                const costoAnual =
                  fila.cantidadAnual !== null && fila.precioUnitario !== null
                    ? fila.cantidadAnual * fila.precioUnitario
                    : null;
                return (
                  <tr key={fila.id}>
                    <td>{fila.orden}</td>
                    <td className="font-heading text-sm">{fila.componente}</td>
                    <td className="text-sm">{fila.rubro}</td>
                    <td className="font-mono text-xs opacity-75">{fila.unidad}</td>
                    <td>
                      {editandoCosteo ? (
                        <input
                          className="input max-w-[100px]"
                          inputMode="decimal"
                          value={fila.cantidadAnual ?? ''}
                          onChange={(e) =>
                            actualizarCosteoFila(
                              fila.id,
                              'cantidadAnual',
                              e.target.value === '' ? null : Number(e.target.value),
                            )
                          }
                        />
                      ) : (
                        <span className="font-mono text-sm">{fila.cantidadAnual ?? '—'}</span>
                      )}
                    </td>
                    <td>
                      {editandoCosteo ? (
                        <input
                          className="input max-w-[110px]"
                          inputMode="decimal"
                          value={fila.precioUnitario ?? ''}
                          onChange={(e) =>
                            actualizarCosteoFila(
                              fila.id,
                              'precioUnitario',
                              e.target.value === '' ? null : Number(e.target.value),
                            )
                          }
                        />
                      ) : (
                        <span className="font-mono text-sm">
                          {fila.precioUnitario !== null ? formatoUsd(fila.precioUnitario) : '—'}
                        </span>
                      )}
                    </td>
                    <td className="font-mono text-sm">{costoAnual !== null ? formatoUsd(costoAnual) : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={6} className="text-right font-heading text-sm">
                  Total anual estimado
                </td>
                <td className="font-mono text-sm font-semibold">{formatoUsd(total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Blueprint>

      <p className="mt-[18px] text-xs opacity-55">
        Metodología según la Regulación Nro. DIR-ARCA.RG-006-2017 del ARCA. Ver la capacitación{' '}
        <Link to="/fortalecimiento/costos-servicio">Determinación de costos del servicio</Link> para el detalle
        conceptual.
      </p>
    </section>
  );
}
