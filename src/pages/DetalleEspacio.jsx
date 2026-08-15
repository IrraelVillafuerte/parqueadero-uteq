import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEspacios } from '../hooks/useEspacios';
import HistorialEspacio from '../components/HistorialEspacio';
import { ArrowLeft, MapPin } from 'lucide-react';

export default function DetalleEspacio() {
  const { id } = useParams();
  const { espacios, cargando } = useEspacios();

  const espacio = espacios.find((e) => e.id === id);

  if (cargando) return <p className="p-8 text-center text-sm">Cargando detalle...</p>;
  if (!espacio) return <p className="p-8 text-center text-sm">Espacio no encontrado.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-4xl mx-auto">
      <Link
        to="/estacionamiento"
        className="inline-flex items-center text-xs font-bold text-green-800 mb-6 hover:underline"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Volver al Parqueadero
      </Link>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <span className="text-xs font-bold text-green-700 uppercase">Detalle del Espacio</span>
            <h1 className="text-3xl font-black text-gray-900">{espacio.id}</h1>
          </div>
          <span
            className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${
              espacio.estado === 'libre'
                ? 'bg-green-100 text-green-700'
                : espacio.estado === 'ocupado'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {espacio.estado === 'sin-informacion' ? 'sin información' : espacio.estado}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl text-xs">
          <div>
            <span className="text-gray-400 block font-semibold">Columna</span>
            <span className="font-bold text-gray-800">{espacio.columna}</span>
          </div>
          <div>
            <span className="text-gray-400 block font-semibold">Número</span>
            <span className="font-bold text-gray-800">{espacio.numero}</span>
          </div>
          <div>
            <span className="text-gray-400 block font-semibold">Distancia</span>
            <span className="font-bold text-gray-800">
              {espacio.distanciaDetectada != null ? `${espacio.distanciaDetectada} cm` : '-- cm'}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block font-semibold">Actualizado</span>
            <span className="font-bold text-gray-800">
              {espacio.fechaHora ? new Date(espacio.fechaHora).toLocaleTimeString() : '--:--:--'}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
            <MapPin className="w-4 h-4 mr-1 text-green-700" /> Coordenadas & Bounding Box
          </h3>
          <div className="bg-gray-900 text-green-400 font-mono text-xs p-4 rounded-xl overflow-x-auto">
            <pre>{JSON.stringify(espacio.ubicacion || {}, null, 2)}</pre>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Registro Histórico Completo</h3>
          <HistorialEspacio espacioId={espacio.id} />
        </div>
      </div>
    </div>
  );
}