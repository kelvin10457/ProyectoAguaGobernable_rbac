import Blueprint from '../components/Blueprint';
import { useJaap } from '../state/JaapContext';

export default function Tarifa() {
  const {
    isStaff,
    edad,
    medidor,
    consumo,
    calculado,
    setEdad,
    setMedidor,
    setConsumo,
    calcular,
    limpiar,
    cargoFijo,
    cargoVariable,
    umbralConsumo,
    descuentoAdultoMayorPct,
    setCargoFijo,
    setCargoVariable,
    setUmbralConsumo,
    guardandoTarifa,
    guardadoTarifa,
    errorTarifa,
    publicarTarifa,
    consumoNum,
    excedente,
    variablePart,
    esAdultoMayor,
    descuento,
    total,
  } = useJaap();

  const totalTexto = consumoNum ? `$${total.toFixed(2)}` : `$${cargoFijo.toFixed(2)}`;
  const resumenConsumo = consumoNum
    ? `Consumo de ${consumoNum} m³ · ${calculado ? 'cálculo confirmado' : 'estimación en vivo'}`
    : 'Ingresa tu consumo del mes para ver el valor completo.';
  const medidorTexto = medidor ? `Medidor ${medidor}` : 'Sin medidor ingresado';

  return (
    <section>
      <div className="mb-1.5 text-[11px] uppercase tracking-[0.12em] text-accent-700">Tarifa de agua</div>
      <h1 className="m-0 mb-2 text-[clamp(28px,4.4vw,42px)]">Calculadora del valor a pagar</h1>
      <p className="max-w-[58ch] text-text/72">
        Ingresa tus datos y el consumo del mes. El cálculo usa los cargos aprobados por la directiva.
      </p>

      <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,290px),1fr))] items-start gap-[26px]">
        <Blueprint className="flex flex-col gap-3.5 p-5">
          <div className="field">
            <label>Edad</label>
            <input
              className="input"
              inputMode="numeric"
              placeholder="65"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Número de medidor</label>
            <input className="input" placeholder="M-0412" value={medidor} onChange={(e) => setMedidor(e.target.value)} />
          </div>
          <div className="field">
            <label>Consumo mensual (m³)</label>
            <input
              className="input"
              inputMode="decimal"
              placeholder="12"
              value={consumo}
              onChange={(e) => setConsumo(e.target.value)}
            />
          </div>
          <button type="button" onClick={calcular} className="btn btn-primary btn-block">
            Calcular valor a pagar
          </button>
          <button type="button" onClick={limpiar} className="btn btn-ghost self-start">
            Limpiar
          </button>
        </Blueprint>

        <Blueprint className="flex flex-col gap-3 border-transparent bg-gradient-to-br from-accent-700 to-accent-900 p-5 text-white shadow-md">
          <div className="text-[10px] uppercase tracking-[0.12em] opacity-70">Valor a pagar</div>
          <div className="font-heading text-[clamp(46px,9vw,68px)] leading-[.95]">{totalTexto}</div>
          <div className="text-[13px] opacity-85">{resumenConsumo}</div>
          <div className="my-1 h-px bg-[#f2f2f340]" />
          <div className="grid grid-cols-[1fr_auto] gap-x-3.5 gap-y-1.5 text-[13px]">
            <span className="opacity-75">Tarifa fija (hasta {umbralConsumo} m³)</span>
            <span className="font-mono">${cargoFijo.toFixed(2)}</span>
            <span className="opacity-75">
              Excedente {excedente ? String(excedente) : '0'} m³ × ${cargoVariable.toFixed(2)}
            </span>
            <span className="font-mono">${variablePart.toFixed(2)}</span>
            {esAdultoMayor && (
              <>
                <span className="opacity-75">Descuento adulto mayor ({descuentoAdultoMayorPct}%)</span>
                <span className="font-mono">-${descuento.toFixed(2)}</span>
              </>
            )}
          </div>
          <div className="mt-1.5 font-mono text-[11px] leading-[1.6] opacity-60">
            Tarifa mensual = tarifa fija + (excedente × cargo variable){esAdultoMayor && ' − 50% adulto mayor'}
          </div>
          <div className="text-xs opacity-70">{medidorTexto}</div>
        </Blueprint>
      </div>

      {isStaff && (
        <Blueprint className="mt-[26px] p-[18px]">
          <h6 className="mb-1">Cargos vigentes · solo directiva</h6>
          <p className="mb-3.5 text-xs opacity-60">
            Se derivan del costeo del servicio. Al publicarlos cambia el valor que calculan los usuarios.
          </p>
          <div className="flex flex-wrap items-end gap-4">
            <div className="field flex-1 basis-[180px]">
              <label>Tarifa fija mensual (USD)</label>
              <input
                className="input"
                value={cargoFijo.toFixed(2)}
                onChange={(e) => setCargoFijo(Number(e.target.value) || 0)}
              />
            </div>
            <div className="field flex-1 basis-[180px]">
              <label>Consumo incluido (m³)</label>
              <input
                className="input"
                value={umbralConsumo}
                onChange={(e) => setUmbralConsumo(Number(e.target.value) || 0)}
              />
            </div>
            <div className="field flex-1 basis-[180px]">
              <label>Cargo por m³ excedente (USD)</label>
              <input
                className="input"
                value={cargoVariable.toFixed(2)}
                onChange={(e) => setCargoVariable(Number(e.target.value) || 0)}
              />
            </div>
            <button type="button" className="btn btn-primary" onClick={publicarTarifa} disabled={guardandoTarifa}>
              {guardandoTarifa ? 'Publicando…' : 'Publicar cargos'}
            </button>
          </div>
          {guardadoTarifa && (
            <p className="mt-2.5 animate-pop-in text-[13px] text-green-700">Cargos publicados correctamente.</p>
          )}
          {errorTarifa && <p className="mt-2.5 animate-pop-in text-[13px] text-red-600">{errorTarifa}</p>}
          <p className="mt-3.5 font-mono text-[11px] leading-[1.7] opacity-60">
            tarifa mensual = tarifa fija (hasta el consumo incluido) + (excedente × cargo por m³)
            <br />
            descuento adulto mayor (edad ≥ 65) = {descuentoAdultoMayorPct}% sobre el total
          </p>
        </Blueprint>
      )}
    </section>
  );
}
