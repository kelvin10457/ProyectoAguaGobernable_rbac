import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { EstadoParametro, ParametroRow, Role, TablaBorrador } from '../types';

const CALIDAD_INICIAL: ParametroRow[] = [
  { nombre: 'Color', limite: '≤ 15 Unidades Pt-Co', valor: '8', estado: 'ok' },
  { nombre: 'Turbiedad', limite: '≤ 5 UNT', valor: '2.1', estado: 'ok' },
  { nombre: 'Sabor', limite: 'Aceptable / sin sabor extraño', valor: 'Aceptable', estado: 'ok' },
  { nombre: 'Olor', limite: 'Aceptable / sin olor extraño', valor: 'Aceptable', estado: 'ok' },
  { nombre: 'Coliformes', limite: '0 UFC / 100 ml', valor: '0', estado: 'ok' },
  { nombre: 'Plaguicidas', limite: '≤ 0.03 – 0.1 mg/L', valor: '0.01', estado: 'ok' },
  { nombre: 'Cianotoxinas', limite: '≤ 1.0 µg/L (microcistina-LR)', valor: '', estado: 'pendiente' },
];

const CANTIDAD_INICIAL: ParametroRow[] = [
  { nombre: 'Presión (red / domiciliaria)', limite: '10 – 50 m.c.a. (1.0 – 5.0 bar)', valor: '8', estado: 'alerta' },
];

export interface TablaFila {
  nombre: string;
  limite: string;
  valorTexto: string;
  estadoLabel: string;
  tagClass: string;
  editable: boolean;
  valor: string;
  onChange: (valor: string) => void;
}

interface JaapContextValue {
  role: Role;
  isAdmin: boolean;
  login: () => void;
  logout: () => void;

  calidad: TablaFila[];
  cantidad: TablaFila[];
  cumplenCount: number;
  totalParams: number;
  estadoGeneral: string;

  editando: boolean;
  guardado: boolean;
  iniciarEdicion: () => void;
  cancelarEdicion: () => void;
  publicar: () => void;

  cedula: string;
  medidor: string;
  consumo: string;
  calculado: boolean;
  setCedula: (v: string) => void;
  setMedidor: (v: string) => void;
  setConsumo: (v: string) => void;
  calcular: () => void;
  limpiar: () => void;

  cargoFijo: number;
  cargoVariable: number;
  setCargoFijo: (v: number) => void;
  setCargoVariable: (v: number) => void;

  consumoNum: number;
  variablePart: number;
  total: number;
}

const JaapContext = createContext<JaapContextValue | null>(null);

function etiquetaEstado(estado: EstadoParametro): string {
  if (estado === 'ok') return 'Cumple';
  if (estado === 'alerta') return 'Fuera de rango';
  return 'Sin registro';
}

function claseEtiqueta(estado: EstadoParametro): string {
  if (estado === 'ok') return 'tag-accent';
  if (estado === 'alerta') return 'tag-outline';
  return 'tag-neutral';
}

export function JaapProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('usuario');

  const [calidadPublicada, setCalidadPublicada] = useState<ParametroRow[]>(CALIDAD_INICIAL);
  const [cantidadPublicada, setCantidadPublicada] = useState<ParametroRow[]>(CANTIDAD_INICIAL);
  const [editando, setEditando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [borrador, setBorrador] = useState<TablaBorrador | null>(null);

  const [cedula, setCedula] = useState('');
  const [medidor, setMedidor] = useState('');
  const [consumo, setConsumo] = useState('');
  const [calculado, setCalculado] = useState(false);

  const [cargoFijo, setCargoFijo] = useState(2.5);
  const [cargoVariable, setCargoVariable] = useState(0.35);

  const isAdmin = role === 'admin';

  const login = () => setRole('admin');
  const logout = () => {
    setRole('usuario');
    setEditando(false);
    setBorrador(null);
  };

  function filas(clave: 'calidad' | 'cantidad'): TablaFila[] {
    const editandoAhora = editando && isAdmin;
    const publicadas = clave === 'calidad' ? calidadPublicada : cantidadPublicada;
    const fuente = editandoAhora && borrador ? borrador[clave] : publicadas;

    return fuente.map((fila, indice) => {
      const vacio = fila.valor.trim() === '';
      const estado = vacio ? 'pendiente' : fila.estado;
      return {
        nombre: fila.nombre,
        limite: fila.limite,
        valor: fila.valor,
        valorTexto: vacio ? '—' : fila.valor,
        estadoLabel: etiquetaEstado(estado),
        tagClass: claseEtiqueta(estado),
        editable: editandoAhora,
        onChange: (valor: string) => {
          setBorrador((actual) => {
            if (!actual) return actual;
            const filasClave = actual[clave].slice();
            filasClave[indice] = { ...filasClave[indice], valor };
            return { ...actual, [clave]: filasClave };
          });
        },
      };
    });
  }

  const calidad = filas('calidad');
  const cantidad = filas('cantidad');

  const cumplenCount = useMemo(
    () =>
      calidadPublicada.concat(cantidadPublicada).filter((f) => f.estado === 'ok' && f.valor.trim() !== '').length,
    [calidadPublicada, cantidadPublicada],
  );
  const totalParams = calidadPublicada.length + cantidadPublicada.length;
  const estadoGeneral = cumplenCount === totalParams ? 'Todo en norma' : 'Con observaciones';

  const iniciarEdicion = () => {
    setBorrador({ calidad: calidadPublicada.slice(), cantidad: cantidadPublicada.slice() });
    setEditando(true);
    setGuardado(false);
  };
  const cancelarEdicion = () => {
    setEditando(false);
    setBorrador(null);
  };
  const publicar = () => {
    if (borrador) {
      setCalidadPublicada(borrador.calidad);
      setCantidadPublicada(borrador.cantidad);
    }
    setEditando(false);
    setGuardado(true);
    setBorrador(null);
  };

  const consumoNum = Math.max(0, Number(consumo.replace(',', '.')) || 0);
  const variablePart = consumoNum * cargoVariable;
  const total = cargoFijo + variablePart;

  const calcular = () => setCalculado(true);
  const limpiar = () => {
    setCedula('');
    setMedidor('');
    setConsumo('');
    setCalculado(false);
  };

  const value: JaapContextValue = {
    role,
    isAdmin,
    login,
    logout,
    calidad,
    cantidad,
    cumplenCount,
    totalParams,
    estadoGeneral,
    editando: editando && isAdmin,
    guardado,
    iniciarEdicion,
    cancelarEdicion,
    publicar,
    cedula,
    medidor,
    consumo,
    calculado,
    setCedula,
    setMedidor,
    setConsumo: (v) => {
      setConsumo(v);
      setCalculado(false);
    },
    calcular,
    limpiar,
    cargoFijo,
    cargoVariable,
    setCargoFijo,
    setCargoVariable,
    consumoNum,
    variablePart,
    total,
  };

  return <JaapContext.Provider value={value}>{children}</JaapContext.Provider>;
}

export function useJaap(): JaapContextValue {
  const ctx = useContext(JaapContext);
  if (!ctx) throw new Error('useJaap debe usarse dentro de JaapProvider');
  return ctx;
}
