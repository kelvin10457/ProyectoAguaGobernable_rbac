import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Inicio from './pages/Inicio';
import InformacionGeneral from './pages/InformacionGeneral';
import Fortalecimiento from './pages/Fortalecimiento';
import Parametros from './pages/Parametros';
import Tarifa from './pages/Tarifa';
import Login from './pages/Login';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col font-body text-text">
      <Header />
      <main className="mx-auto w-full max-w-[1120px] flex-1 px-[18px] pb-16 pt-8">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/informacion-general" element={<InformacionGeneral />} />
          <Route path="/fortalecimiento" element={<Fortalecimiento />} />
          <Route path="/parametros" element={<Parametros />} />
          <Route path="/tarifa" element={<Tarifa />} />
          <Route path="/ingreso" element={<Login />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
