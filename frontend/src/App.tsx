import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Blueprint from './components/Blueprint';
import Header from './components/Header';
import Footer from './components/Footer';
import { useJaap } from './state/JaapContext';
import Inicio from './pages/Inicio';
import Noticias from './pages/Noticias';
import NoticiaDetalle from './pages/NoticiaDetalle';
import InformacionGeneral from './pages/InformacionGeneral';
import Fortalecimiento from './pages/Fortalecimiento';
import FortalecimientoDetalle from './pages/FortalecimientoDetalle';
import Parametros from './pages/Parametros';
import Costeo from './pages/Costeo';
import Tarifa from './pages/Tarifa';
import ReportesDanos from './pages/ReportesDanos';
import Login from './pages/Login';

export default function App() {
  const location = useLocation();
  const { sesionExpirada } = useJaap();

  return (
    <div className="flex min-h-screen flex-col font-body text-text">
      <Header />
      <main className="mx-auto w-full max-w-[1120px] flex-1 px-[18px] pb-16 pt-8">
        {sesionExpirada && location.pathname !== '/ingreso' && (
          <Blueprint className="mb-[18px] flex flex-wrap animate-pop-in items-center gap-2.5 border-red-600 px-3.5 py-2.5">
            <span className="text-[13px] text-red-600">Tu sesión expiró. Los cambios sin publicar no se guardaron.</span>
            <Link to="/ingreso" className="btn btn-secondary">
              Ingresar de nuevo
            </Link>
          </Blueprint>
        )}
        <div key={location.pathname} className="animate-fade-in-up">
          <Routes location={location}>
            <Route path="/" element={<Inicio />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/noticias/:id" element={<NoticiaDetalle />} />
            <Route path="/informacion-general" element={<InformacionGeneral />} />
            <Route path="/fortalecimiento" element={<Fortalecimiento />} />
            <Route path="/fortalecimiento/:slug" element={<FortalecimientoDetalle />} />
            <Route path="/parametros" element={<Parametros />} />
            <Route path="/costeo" element={<Costeo />} />
            <Route path="/tarifa" element={<Tarifa />} />
            <Route path="/reportes-danos" element={<ReportesDanos />} />
            <Route path="/ingreso" element={<Login />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
}
