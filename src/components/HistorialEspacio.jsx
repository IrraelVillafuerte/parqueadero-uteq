import React from 'react';
import { useHistorialEspacio } from '../hooks/useHistorialEspacio';

export default function HistorialEspacio({ espacioId }) {
  const { historial, cargando } = useHistorialEspacio(espacioId);

  if (cargando) return <p className="text-xs text-gray-400">Cargando historial...</p>;

  return (
    <div className="space-y-3">
      {historial.length === 0 ? (
        <p className="text-xs text-gray-400">Sin registros recientes</p>
      ) : (
        historial.slice(0, 5).map((item) => (
          <div key={item.id} className="flex justify-between items-center text-xs">
            <div className="flex items-center space-x-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  item.estado === 'libre'
                    ? 'bg-green-500'
                    : item.estado === 'ocupado'
                    ? 'bg-red-500'
                    : 'bg-gray-400'
                }`}
              ></span>
              <span className="font-semibold text-gray-800 capitalize">{item.estado}</span>
              <span className="text-gray-400">
                {new Date(item.fechaHora).toLocaleTimeString()}
              </span>
            </div>
            <span className="font-mono text-gray-600">{item.distanciaDetectada} cm</span>
          </div>
        ))
      )}
    </div>
  );
}