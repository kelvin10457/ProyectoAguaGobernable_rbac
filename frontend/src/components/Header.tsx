import { NavLink, useNavigate } from 'react-router-dom';
import { useJaap } from '../state/JaapContext';

const NAV_ITEMS = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/informacion-general', label: 'Información general', end: false },
  { to: '/fortalecimiento', label: 'Fortalecimiento', end: false },
  { to: '/parametros', label: 'Parámetros', end: false },
  { to: '/tarifa', label: 'Tarifa', end: false },
];

export default function Header() {
  const { isAdmin, logout } = useJaap();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center gap-4 border-b border-divider bg-bg px-4 py-3.5">
      <div className="mr-auto leading-tight">
        <div className="font-heading text-lg font-semibold">JAAP El Limón–Havoline</div>
        <div className="text-[11px] uppercase tracking-[0.12em] text-accent-700">525 gotas de esperanza</div>
      </div>

      <nav className="flex flex-wrap items-center gap-0.5">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `border-0 border-b-2 px-2.5 py-1.5 text-sm no-underline hover:bg-accent/10 ${
                isActive ? 'border-accent text-accent-800' : 'border-transparent text-text'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {isAdmin ? (
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            logout();
            navigate('/');
          }}
        >
          Salir
        </button>
      ) : (
        <NavLink to="/ingreso" className="btn btn-secondary">
          Ingreso directiva
        </NavLink>
      )}
    </header>
  );
}
