import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Inicio from './pages/Inicio';
import InformacionGeneral from './pages/InformacionGeneral';
import Fortalecimiento from './pages/Fortalecimiento';
import FortalecimientoDetalle from './pages/FortalecimientoDetalle';
import Parametros from './pages/Parametros';
import Costeo from './pages/Costeo';
import Tarifa from './pages/Tarifa';
import Login from './pages/Login';

export default function App() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col font-body text-text">
      <Header />
      <main className="mx-auto w-full max-w-[1120px] flex-1 px-[18px] pb-16 pt-8">
        <div key={location.pathname} className="animate-fade-in-up">
          <Routes location={location}>
            <Route path="/" element={<Inicio />} />
            <Route path="/informacion-general" element={<InformacionGeneral />} />
            <Route path="/fortalecimiento" element={<Fortalecimiento />} />
            <Route path="/fortalecimiento/:slug" element={<FortalecimientoDetalle />} />
            <Route path="/parametros" element={<Parametros />} />
            <Route path="/costeo" element={<Costeo />} />
            <Route path="/tarifa" element={<Tarifa />} />
            <Route path="/ingreso" element={<Login />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
}
