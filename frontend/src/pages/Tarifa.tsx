import Blueprint from '../components/Blueprint';
import { useJaap } from '../state/JaapContext';

export default function Tarifa() {
  const {
    isAdmin,
    cedula,
    medidor,
    consumo,
    calculado,
    setCedula,
    setMedidor,
    setConsumo,
    calcular,
    limpiar,
    cargoFijo,
    cargoVariable,
    setCargoFijo,
    setCargoVariable,
    consumoNum,
    variablePart,
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
            <label>Cédula</label>
            <input className="input" placeholder="0900000000" value={cedula} onChange={(e) => setCedula(e.target.value)} />
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

        <Blueprint className="flex flex-col gap-3 border-accent-900 bg-accent-900 p-5 text-[#f2f2f3] [&>.corner]:text-[#f2f2f399]">
          <div className="text-[10px] uppercase tracking-[0.12em] opacity-70">Valor a pagar</div>
          <div className="font-heading text-[clamp(46px,9vw,68px)] leading-[.95]">{totalTexto}</div>
          <div className="text-[13px] opacity-85">{resumenConsumo}</div>
          <div className="my-1 h-px bg-[#f2f2f340]" />
          <div className="grid grid-cols-[1fr_auto] gap-x-3.5 gap-y-1.5 text-[13px]">
            <span className="opacity-75">Cargo fijo</span>
            <span className="font-mono">${cargoFijo.toFixed(2)}</span>
            <span className="opacity-75">
              Consumo {consumoNum ? String(consumoNum) : '0'} m³ × ${cargoVariable.toFixed(2)}
            </span>
            <span className="font-mono">${variablePart.toFixed(2)}</span>
          </div>
          <div className="mt-1.5 font-mono text-[11px] leading-[1.6] opacity-60">
            Tarifa mensual = cargo fijo + (consumo × cargo variable)
          </div>
          <div className="text-xs opacity-70">{medidorTexto}</div>
        </Blueprint>
      </div>

      {isAdmin && (
        <Blueprint className="mt-[26px] p-[18px]">
          <h6 className="mb-1">Cargos vigentes · solo administrador</h6>
          <p className="mb-3.5 text-xs opacity-60">
            Se derivan del costeo del servicio. Al publicarlos cambia el valor que calculan los usuarios.
          </p>
          <div className="flex flex-wrap items-end gap-4">
            <div className="field flex-1 basis-[180px]">
              <label>Cargo fijo mensual (USD)</label>
              <input
                className="input"
                value={cargoFijo.toFixed(2)}
                onChange={(e) => setCargoFijo(Number(e.target.value) || 0)}
              />
            </div>
            <div className="field flex-1 basis-[180px]">
              <label>Cargo variable (USD por m³)</label>
              <input
                className="input"
                value={cargoVariable.toFixed(2)}
                onChange={(e) => setCargoVariable(Number(e.target.value) || 0)}
              />
            </div>
            <button type="button" className="btn btn-primary">
              Publicar cargos
            </button>
          </div>
          <p className="mt-3.5 font-mono text-[11px] leading-[1.7] opacity-60">
            cargo fijo = costos fijos anuales / (n.º conexiones × 12)
            <br />
            cargo variable = costos variables anuales / volumen anual facturable
          </p>
        </Blueprint>
      )}
    </section>
  );
}
