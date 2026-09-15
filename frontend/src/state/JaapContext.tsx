import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, ApiError, mapAuthUser } from '../lib/api';
import type {
  AuthUser,
  CosteoComponenteData,
  EstadoParametro,
  InformacionGeneralData,
  ParametroRow,
  Role,
  TablaBorrador,
} from '../types';

const AUTH_STORAGE_KEY = 'aguaGobernable.auth';

export interface TablaFila {
  nombre: string;
  limite: string;
  valorTexto: string;
  estadoLabel: string;
  tagClass: string;
  editable: boolean;
  valor: string;
  opciones?: string[];
  onChange: (valor: string) => void;
}

interface AuthStorage {
  token: string;
  user: AuthUser;
}

function leerAuthGuardada(): AuthStorage | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthStorage) : null;
  } catch {
    return null;
  }
}

type LoginResultado = { ok: true } | { ok: false; error: string };

interface JaapContextValue {
  role: Role;
  isStaff: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<LoginResultado>;
  logout: () => void;

  calidad: TablaFila[];
  cantidad: TablaFila[];
  cumplenCount: number;
  totalParams: number;
  estadoGeneral: string;
  mesParametros: string | null;
  puedeEditarParametros: boolean;

  editando: boolean;
  guardado: boolean;
  guardandoParametros: boolean;
  errorParametros: string | null;
  iniciarEdicion: () => void;
  cancelarEdicion: () => void;
  publicar: () => void;

  informacionGeneral: InformacionGeneralData | null;
  editandoInfo: boolean;
  guardadoInfo: boolean;
  guardandoInfo: boolean;
  errorInfo: string | null;
  borradorInfo: InformacionGeneralData | null;
  iniciarEdicionInfo: () => void;
  cancelarEdicionInfo: () => void;
  actualizarBorradorInfo: (campo: keyof InformacionGeneralData, valor: string | number) => void;
  publicarInfo: () => void;

  edad: string;
  medidor: string;
  consumo: string;
  calculado: boolean;
  setEdad: (v: string) => void;
  setMedidor: (v: string) => void;
  setConsumo: (v: string) => void;
  calcular: () => void;
  limpiar: () => void;

  cargoFijo: number;
  cargoVariable: number;
  umbralConsumo: number;
  descuentoAdultoMayorPct: number;
  setCargoFijo: (v: number) => void;
  setCargoVariable: (v: number) => void;
  setUmbralConsumo: (v: number) => void;
  guardandoTarifa: boolean;
  guardadoTarifa: boolean;
  errorTarifa: string | null;
  publicarTarifa: () => void;

  consumoNum: number;
  excedente: number;
  variablePart: number;
  esAdultoMayor: boolean;
  subtotal: number;
  descuento: number;
  total: number;

  costeo: CosteoComponenteData[];
  puedeEditarCosteo: boolean;
  editandoCosteo: boolean;
  guardandoCosteo: boolean;
  guardadoCosteo: boolean;
  errorCosteo: string | null;
  iniciarEdicionCosteo: () => void;
  cancelarEdicionCosteo: () => void;
  actualizarCosteoFila: (id: string, campo: 'cantidadAnual' | 'precioUnitario', valor: number | null) => void;
  publicarCosteo: () => void;
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
  const [auth, setAuth] = useState<AuthStorage | null>(() => leerAuthGuardada());
  const role: Role = auth?.user.role ?? 'usuario';
  const isStaff = role !== 'usuario';
  const puedeEditarInfoGeneral = role === 'junta';
  const puedeEditarCosteo = role === 'junta';
  const puedeEditarParametros = role === 'junta';
  const token = auth?.token ?? null;

  const [mesParametros, setMesParametros] = useState<string | null>(null);
  const [calidadPublicada, setCalidadPublicada] = useState<ParametroRow[]>([]);
  const [cantidadPublicada, setCantidadPublicada] = useState<ParametroRow[]>([]);
  const [editando, setEditando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [guardandoParametros, setGuardandoParametros] = useState(false);
  const [errorParametros, setErrorParametros] = useState<string | null>(null);
  const [borrador, setBorrador] = useState<TablaBorrador | null>(null);

  const [informacionGeneral, setInformacionGeneral] = useState<InformacionGeneralData | null>(null);
  const [editandoInfo, setEditandoInfo] = useState(false);
  const [guardadoInfo, setGuardadoInfo] = useState(false);
  const [guardandoInfo, setGuardandoInfo] = useState(false);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);
  const [borradorInfo, setBorradorInfo] = useState<InformacionGeneralData | null>(null);

  const [edad, setEdad] = useState('');
  const [medidor, setMedidor] = useState('');
  const [consumo, setConsumo] = useState('');
  const [calculado, setCalculado] = useState(false);

  const [cargoFijo, setCargoFijo] = useState(0);
  const [cargoVariable, setCargoVariable] = useState(0);
  const [umbralConsumo, setUmbralConsumo] = useState(0);
  const [descuentoAdultoMayorPct, setDescuentoAdultoMayorPct] = useState(50);
  const [guardandoTarifa, setGuardandoTarifa] = useState(false);
  const [guardadoTarifa, setGuardadoTarifa] = useState(false);
  const [errorTarifa, setErrorTarifa] = useState<string | null>(null);

  const [costeoPublicado, setCosteoPublicado] = useState<CosteoComponenteData[]>([]);
  const [editandoCosteo, setEditandoCosteo] = useState(false);
  const [borradorCosteo, setBorradorCosteo] = useState<CosteoComponenteData[] | null>(null);
  const [guardandoCosteo, setGuardandoCosteo] = useState(false);
  const [guardadoCosteo, setGuardadoCosteo] = useState(false);
  const [errorCosteo, setErrorCosteo] = useState<string | null>(null);

  useEffect(() => {
    api
      .getParametrosMesActual()
      .then(({ mes, calidad: c, cantidad: q }) => {
        setMesParametros(mes);
        setCalidadPublicada(c);
        setCantidadPublicada(q);
      })
      .catch(() => setErrorParametros('No se pudieron cargar los parámetros'));

    api
      .getInformacionGeneral()
      .then(setInformacionGeneral)
      .catch(() => setErrorInfo('No se pudo cargar la información general'));

    api
      .getTarifaConfig()
      .then((config) => {
        setCargoFijo(config.cargoFijo);
        setCargoVariable(config.cargoVariable);
        setUmbralConsumo(config.umbralConsumo);
        setDescuentoAdultoMayorPct(config.descuentoAdultoMayorPct);
      })
      .catch(() => setErrorTarifa('No se pudo cargar la configuración de tarifa'));

    api
      .getCosteo()
      .then(setCosteoPublicado)
      .catch(() => setErrorCosteo('No se pudo cargar el costeo del servicio'));
  }, []);

  const login = async (email: string, password: string): Promise<LoginResultado> => {
    try {
      const { token: nuevoToken, user } = await api.login(email, password);
      const nuevaAuth: AuthStorage = { token: nuevoToken, user: mapAuthUser(user) };
      setAuth(nuevaAuth);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nuevaAuth));
      return { ok: true };
    } catch (err) {
      const mensaje = err instanceof ApiError ? err.message : 'No se pudo conectar con el servidor';
      return { ok: false, error: mensaje };
    }
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setEditando(false);
    setBorrador(null);
    setEditandoInfo(false);
    setBorradorInfo(null);
    setEditandoCosteo(false);
    setBorradorCosteo(null);
  };

  function filas(clave: 'calidad' | 'cantidad'): TablaFila[] {
    const editandoAhora = editando && puedeEditarParametros;
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
        opciones: fila.opciones,
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
  const estadoGeneral = totalParams > 0 && cumplenCount === totalParams ? 'Todo en norma' : 'Con observaciones';

  const iniciarEdicion = () => {
    if (!puedeEditarParametros) return;
    setBorrador({ calidad: calidadPublicada.slice(), cantidad: cantidadPublicada.slice() });
    setEditando(true);
    setGuardado(false);
    setErrorParametros(null);
  };
  const cancelarEdicion = () => {
    setEditando(false);
    setBorrador(null);
  };
  const publicar = () => {
    if (!borrador || !token) return;
    setGuardandoParametros(true);
    setErrorParametros(null);

    const filasAEnviar = borrador.calidad.concat(borrador.cantidad).filter((fila) => fila.id);

    Promise.all(
      filasAEnviar.map((fila) => {
        const estado = fila.valor.trim() === '' ? 'pendiente' : fila.estado;
        return api.updateParametro(fila.id as string, { valor: fila.valor, estado }, token);
      }),
    )
      .then(() => {
        setCalidadPublicada(borrador.calidad);
        setCantidadPublicada(borrador.cantidad);
        setEditando(false);
        setGuardado(true);
        setBorrador(null);
      })
      .catch((err) => {
        setErrorParametros(err instanceof ApiError ? err.message : 'No se pudieron publicar los cambios');
      })
      .finally(() => setGuardandoParametros(false));
  };

  const iniciarEdicionInfo = () => {
    if (!informacionGeneral || !puedeEditarInfoGeneral) return;
    setBorradorInfo({ ...informacionGeneral });
    setEditandoInfo(true);
    setGuardadoInfo(false);
    setErrorInfo(null);
  };
  const cancelarEdicionInfo = () => {
    setEditandoInfo(false);
    setBorradorInfo(null);
  };
  const actualizarBorradorInfo = (campo: keyof InformacionGeneralData, valor: string | number) => {
    setBorradorInfo((actual) => (actual ? { ...actual, [campo]: valor } : actual));
  };
  const publicarInfo = () => {
    if (!borradorInfo || !token || !puedeEditarInfoGeneral) return;
    setGuardandoInfo(true);
    setErrorInfo(null);

    const { id: _id, ...data } = borradorInfo;

    api
      .updateInformacionGeneral(data, token)
      .then((actualizado) => {
        setInformacionGeneral(actualizado);
        setEditandoInfo(false);
        setGuardadoInfo(true);
        setBorradorInfo(null);
      })
      .catch((err) => {
        setErrorInfo(err instanceof ApiError ? err.message : 'No se pudo publicar la información general');
      })
      .finally(() => setGuardandoInfo(false));
  };

  const consumoNum = Math.max(0, Number(consumo.replace(',', '.')) || 0);
  const excedente = Math.max(0, consumoNum - umbralConsumo);
  const variablePart = excedente * cargoVariable;
  const subtotal = cargoFijo + variablePart;
  const esAdultoMayor = (Number(edad) || 0) >= 65;
  const descuento = esAdultoMayor ? subtotal * (descuentoAdultoMayorPct / 100) : 0;
  const total = subtotal - descuento;

  const calcular = () => setCalculado(true);
  const limpiar = () => {
    setEdad('');
    setMedidor('');
    setConsumo('');
    setCalculado(false);
  };

  const publicarTarifa = () => {
    if (!token) return;
    setGuardandoTarifa(true);
    setErrorTarifa(null);
    setGuardadoTarifa(false);

    api
      .updateTarifaConfig({ cargoFijo, cargoVariable, umbralConsumo }, token)
      .then((config) => {
        setCargoFijo(config.cargoFijo);
        setCargoVariable(config.cargoVariable);
        setUmbralConsumo(config.umbralConsumo);
        setDescuentoAdultoMayorPct(config.descuentoAdultoMayorPct);
        setGuardadoTarifa(true);
      })
      .catch((err) => {
        setErrorTarifa(err instanceof ApiError ? err.message : 'No se pudo publicar la tarifa');
      })
      .finally(() => setGuardandoTarifa(false));
  };

  const costeo = editandoCosteo && borradorCosteo ? borradorCosteo : costeoPublicado;

  const iniciarEdicionCosteo = () => {
    if (!puedeEditarCosteo) return;
    setBorradorCosteo(costeoPublicado.map((fila) => ({ ...fila })));
    setEditandoCosteo(true);
    setGuardadoCosteo(false);
    setErrorCosteo(null);
  };
  const cancelarEdicionCosteo = () => {
    setEditandoCosteo(false);
    setBorradorCosteo(null);
  };
  const actualizarCosteoFila = (id: string, campo: 'cantidadAnual' | 'precioUnitario', valor: number | null) => {
    setBorradorCosteo((actual) => actual?.map((fila) => (fila.id === id ? { ...fila, [campo]: valor } : fila)) ?? actual);
  };
  const publicarCosteo = () => {
    if (!borradorCosteo || !token || !puedeEditarCosteo) return;
    setGuardandoCosteo(true);
    setErrorCosteo(null);

    Promise.all(
      borradorCosteo.map((fila) =>
        api.updateCosteoComponente(fila.id, { cantidadAnual: fila.cantidadAnual, precioUnitario: fila.precioUnitario }, token),
      ),
    )
      .then(() => {
        setCosteoPublicado(borradorCosteo);
        setEditandoCosteo(false);
        setGuardadoCosteo(true);
        setBorradorCosteo(null);
      })
      .catch((err) => {
        setErrorCosteo(err instanceof ApiError ? err.message : 'No se pudo publicar el costeo del servicio');
      })
      .finally(() => setGuardandoCosteo(false));
  };

  const value: JaapContextValue = {
    role,
    isStaff,
    token,
    login,
    logout,
    calidad,
    cantidad,
    cumplenCount,
    totalParams,
    estadoGeneral,
    mesParametros,
    puedeEditarParametros,
    editando: editando && puedeEditarParametros,
    guardado,
    guardandoParametros,
    errorParametros,
    iniciarEdicion,
    cancelarEdicion,
    publicar,
    informacionGeneral,
    editandoInfo: editandoInfo && puedeEditarInfoGeneral,
    guardadoInfo,
    guardandoInfo,
    errorInfo,
    borradorInfo,
    iniciarEdicionInfo,
    cancelarEdicionInfo,
    actualizarBorradorInfo,
    publicarInfo,
    edad,
    medidor,
    consumo,
    calculado,
    setEdad,
    setMedidor,
    setConsumo: (v) => {
      setConsumo(v);
      setCalculado(false);
    },
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
    subtotal,
    descuento,
    total,
    costeo,
    puedeEditarCosteo,
    editandoCosteo: editandoCosteo && puedeEditarCosteo,
    guardandoCosteo,
    guardadoCosteo,
    errorCosteo,
    iniciarEdicionCosteo,
    cancelarEdicionCosteo,
    actualizarCosteoFila,
    publicarCosteo,
  };

  return <JaapContext.Provider value={value}>{children}</JaapContext.Provider>;
}

export function useJaap(): JaapContextValue {
  const ctx = useContext(JaapContext);
  if (!ctx) throw new Error('useJaap debe usarse dentro de JaapProvider');
  return ctx;
}
