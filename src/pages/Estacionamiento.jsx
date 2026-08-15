import React, { useState } from 'react';
import { useEspacios } from '../hooks/useEspacios';
import ResumenEstacionamiento from '../components/ResumenEstacionamiento';
import FiltrosEspacios from '../components/FiltrosEspacios';
import CuadriculaEstacionamiento from '../components/CuadriculaEstacionamiento';
import HistorialEspacio from '../components/HistorialEspacio';
import MapaEstacionamiento from '../components/MapaEstacionamiento';
import LeyendaColores from '../components/LeyendaColores';
import { Download, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Estacionamiento() {
  const { espacios, cargando } = useEspacios();
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroColumna, setFiltroColumna] = useState('Todas');
  const [seleccionado, setSeleccionado] = useState(null);

  // Seleccionar automáticamente el primero al cargar
  const espacioActual = seleccionado || espacios[0];

  const espaciosFiltrados = espacios.filter((e) => {
    const cumpleEstado =
      filtroEstado === 'Todos' ||
      (filtroEstado === 'Libres' && e.estado === 'libre') ||
      (filtroEstado === 'Ocupados' && e.estado === 'ocupado') ||
      (filtroEstado === 'Sin información' && e.estado === 'sin-informacion');
    const cumpleColumna =
      filtroColumna === 'Todas' || e.columnaLetra === filtroColumna || e.id.startsWith(filtroColumna);
    return cumpleEstado && cumpleColumna;
  });

  const handleDescargarJSON = () => {
    const payload = espacios.reduce((acc, e) => {
      acc[e.id] = {
        estado: e.estado,
        distanciaDetectada: e.distanciaDetectada,
        fechaHora: e.fechaHora,
        columna: e.columna,
        numero: e.numero,
      };
      return acc;
    }, {});
    const blob = new Blob(
      [JSON.stringify({ espacios: payload }, null, 2)],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'parqueadero-uteq-rtdb.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6 max-w-7xl mx-auto">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center mb-8 border-b pb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-green-800 text-white font-black rounded-lg w-8 h-8 flex items-center justify-center">
            U
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900">UTEQ Smart Parking</h1>
            <p className="text-xs text-gray-400">Monitoreo telemático del parqueadero</p>
          </div>
        </div>
        <div className="flex items-center space-x-6 text-xs font-semibold text-gray-600">
          <Link to="/" className="hover:text-green-800">Inicio</Link>
          <span className="text-green-800 font-bold border-b-2 border-green-800 pb-1">Parqueadero</span>
          <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
            ● RTDB en vivo
          </span>
        </div>
      </nav>

      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-xs font-bold text-green-700 uppercase tracking-widest">
            CAMPUS UTEQ - QUEVEDO
          </span>
          <h2 className="text-3xl font-black text-gray-900 mt-1">Parqueadero inteligente</h2>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            Simulación de 80 sensores ultrasónicos organizados en cuatro columnas. Cada cuadro
            representa una plaza y se actualiza desde Firebase Realtime Database.
          </p>
        </div>
        <div className="flex flex-col items-end">
          <button
            onClick={handleDescargarJSON}
            disabled={espacios.length === 0}
            className="bg-green-800 hover:bg-green-900 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center shadow transition"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar JSON para RTDB
          </button>
          <span className="text-[10px] text-gray-400 mt-2">
            Umbral: ocupado si la distancia detectada es ≤ 50 cm
          </span>
        </div>
      </div>

      {/* METRICAS */}
      <ResumenEstacionamiento espacios={espacios} />

      {/* CONTENIDO PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* VISTA OPERATIVA (IZQUIERDA) */}
        <div className="lg:col-span-2 border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-bold text-green-700 uppercase tracking-widest mb-1">
            VISTA OPERATIVA
          </h3>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Disponibilidad por espacio</h2>

          <LeyendaColores />

          <FiltrosEspacios
            filtroEstado={filtroEstado}
            setFiltroEstado={setFiltroEstado}
            filtroColumna={filtroColumna}
            setFiltroColumna={setFiltroColumna}
          />

          {cargando ? (
            <p className="text-center text-sm text-gray-400 py-12">Cargando parqueadero...</p>
          ) : (
            <CuadriculaEstacionamiento
              espacios={espaciosFiltrados}
              seleccionado={espacioActual}
              onSelect={setSeleccionado}
            />
          )}
        </div>

        {/* DETALLE LATERAL (DERECHA) */}
        {espacioActual && (
          <div className="border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-green-700 uppercase tracking-widest">
                  SENSOR SELECCIONADO
                </span>
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    espacioActual.estado === 'libre'
                      ? 'bg-green-100 text-green-700'
                      : espacioActual.estado === 'ocupado'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {espacioActual.estado === 'sin-informacion' ? 'sin información' : espacioActual.estado}
                </span>
              </div>

              <h2 className="text-4xl font-black text-gray-900 mb-6">{espacioActual.id}</h2>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <span className="text-xs text-gray-400">Distancia detectada</span>
                <p className="text-3xl font-black text-gray-900 mt-1">
                  {espacioActual.distanciaDetectada != null ? espacioActual.distanciaDetectada : '--'}{' '}
                  <span className="text-sm font-medium">cm</span>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div
                    className={`h-2 rounded-full ${
                      espacioActual.estado === 'libre'
                        ? 'bg-green-500'
                        : espacioActual.estado === 'ocupado'
                        ? 'bg-red-500'
                        : 'bg-gray-400'
                    }`}
                    style={{
                      width: `${Math.min(((espacioActual.distanciaDetectada ?? 0) / 200) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">Umbral del sensor: ≤ 50 cm</span>
              </div>

              <div className="space-y-3 text-xs mb-6">
                <div>
                  <span className="text-gray-400 uppercase font-bold">ID RTDB</span>
                  <p className="font-mono text-gray-800">{espacioActual.id}</p>
                </div>
                <div className="grid grid-cols-2">
                  <div>
                    <span className="text-gray-400 uppercase font-bold">COLUMNA / NÚMERO</span>
                    <p className="text-gray-800">{espacioActual.columna} / {espacioActual.numero}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase font-bold">ÚLTIMA ACTUALIZACIÓN</span>
                    <p className="text-gray-800">
                      {espacioActual.fechaHora ? new Date(espacioActual.fechaHora).toLocaleTimeString() : '--:--:--'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-xs font-bold text-gray-800 mb-3">Historial reciente</h4>
                <HistorialEspacio espacioId={espacioActual.id} />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t flex flex-col space-y-2">
              <Link
                to={`/espacios/${espacioActual.id}`}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-lg flex items-center justify-center transition"
              >
                Ver detalle completo <ExternalLink className="w-3 h-3 ml-2" />
              </Link>
            </div>
          </div>
        )}
      </div>

      <MapaEstacionamiento />
    </div>
  );
}