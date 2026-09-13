import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Blueprint from '../components/Blueprint';
import { useJaap } from '../state/JaapContext';

export default function Login() {
  const { login } = useJaap();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const entrar = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setCargando(true);
    const resultado = await login(email, password);
    setCargando(false);
    if (resultado.ok) {
      navigate('/');
    } else {
      setError(resultado.error);
    }
  };

  return (
    <section className="mx-auto mt-[6vh] max-w-[420px] animate-fade-in-up">
      <Blueprint className="p-[26px]">
        <form className="flex flex-col gap-3.5" onSubmit={entrar}>
          <div className="text-[10px] uppercase tracking-[0.12em] text-accent-700">Acceso directiva</div>
          <h2 className="m-0">Ingreso</h2>
          <p className="m-0 text-[13px] opacity-70">
            Solo la directiva y la entidad rectora ingresan con credenciales. Los usuarios consultan la plataforma
            sin registrarse.
          </p>
          <div className="field">
            <label>Correo</label>
            <input
              className="input"
              type="email"
              autoComplete="email"
              placeholder="directiva@ellimon.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Contraseña</label>
            <input
              className="input"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="m-0 text-sm text-red-600">{error}</p>}
          <button type="submit" className="btn btn-primary btn-block" disabled={cargando}>
            {cargando ? 'Ingresando…' : 'Ingresar'}
          </button>
          <button type="button" className="btn btn-ghost self-center" onClick={() => navigate('/')}>
            Volver a la consulta pública
          </button>
        </form>
      </Blueprint>
    </section>
  );
}
