import React from 'react';

export default function FiltrosEspacios({
  filtroEstado,
  setFiltroEstado,
  filtroColumna,
  setFiltroColumna,
}) {
  return (
    <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
      <div className="flex bg-gray-100 p-1 rounded-lg">
        {['Todos', 'Libres', 'Ocupados', 'Sin información'].map((f) => (
          <button
            key={f}
            onClick={() => setFiltroEstado(f)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition ${
              filtroEstado === f
                ? 'bg-white shadow text-gray-900'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex bg-gray-100 p-1 rounded-lg">
        {['Todas', 'A', 'B', 'C', 'D'].map((f) => (
          <button
            key={f}
            onClick={() => setFiltroColumna(f)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              filtroColumna === f
                ? 'bg-white shadow text-gray-900'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}