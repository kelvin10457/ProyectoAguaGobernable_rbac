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
  const { isStaff, logout } = useJaap();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 border-b border-divider bg-bg/90 backdrop-blur-sm">
      <div className="h-[3px] w-full bg-accent-600" />
      <div className="mx-auto flex w-full max-w-[1120px] flex-wrap items-center gap-4 px-[18px] py-3">
        <div className="mr-auto flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="Logo JAAP El Limón–Havoline"
            className="h-12 w-12 object-contain transition-transform duration-300 hover:scale-110 hover:rotate-[-4deg]"
          />
          <div className="leading-tight">
            <div className="font-heading text-lg font-semibold text-accent-900">JAAP El Limón–Havoline</div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-green-600">
              525 gotas de esperanza
            </div>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-1.5 text-sm font-medium no-underline transition-colors ${
                  isActive
                    ? 'bg-accent-100 text-accent-800'
                    : 'text-text/65 hover:bg-accent-100/70 hover:text-accent-800'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {isStaff ? (
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
            Ingreso
          </NavLink>
        )}
      </div>
    </header>
  );
}
