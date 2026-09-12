import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { JaapProvider } from './state/JaapContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <JaapProvider>
        <App />
      </JaapProvider>
    </BrowserRouter>
  </StrictMode>,
);
