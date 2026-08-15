import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Estacionamiento from './pages/Estacionamiento';
import DetalleEspacio from './pages/DetalleEspacio';
import { useSimulacion } from './hooks/useSimulacion';

export default function App() {
  // Genera los 80 espacios en Firebase (si no existen) y actualiza
  // sensores aleatorios cada 8 segundos mientras la app esté abierta.
  useSimulacion(8000);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/estacionamiento" element={<Estacionamiento />} />
        <Route path="/espacios/:id" element={<DetalleEspacio />} />
      </Routes>
    </BrowserRouter>
  );
}