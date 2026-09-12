import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Blueprint from '../components/Blueprint';
import { useJaap } from '../state/JaapContext';

export default function Login() {
  const { login } = useJaap();
  const navigate = useNavigate();

  const entrar = (e: FormEvent) => {
    e.preventDefault();
    login();
    navigate('/');
  };

  return (
    <section className="mx-auto mt-[6vh] max-w-[420px]">
      <Blueprint className="p-[26px]">
        <form className="flex flex-col gap-3.5" onSubmit={entrar}>
          <div className="text-[10px] uppercase tracking-[0.12em] text-accent-700">Acceso directiva</div>
          <h2 className="m-0">Ingreso</h2>
          <p className="m-0 text-[13px] opacity-70">
            Solo la directiva y el operador ingresan con credenciales. Los usuarios consultan la plataforma sin
            registrarse.
          </p>
          <div className="field">
            <label>Correo o celular</label>
            <input className="input" placeholder="directiva@ellimon.org / 0988960736" />
          </div>
          <div className="field">
            <label>Contraseña</label>
            <input className="input" type="password" placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Ingresar
          </button>
          <button type="button" className="btn btn-ghost self-center" onClick={() => navigate('/')}>
            Volver a la consulta pública
          </button>
        </form>
      </Blueprint>
    </section>
  );
}
