import React from 'react';
import EspacioCard from './EspacioCard';

export default function CuadriculaEstacionamiento({ espacios, seleccionado, onSelect }) {
  const columnas = ['A', 'B', 'C', 'D'];

  return (
    <div className="bg-[#1e1e1e] rounded-xl p-6 overflow-x-auto">
      <div className="text-center border-b border-gray-700 pb-2 mb-4">
        <span className="text-gray-400 font-mono text-xs tracking-widest">--- ENTRADA ---</span>
      </div>
      <div className="grid grid-cols-4 gap-4 min-w-[550px]">
        {columnas.map((col) => (
          <div key={col} className="space-y-3">
            <div className="text-center text-xs font-bold text-gray-400 tracking-wider">
              COLUMNA {col}
            </div>
            {espacios
              .filter((e) => e.id.startsWith(col))
              .sort((a, b) => a.numero - b.numero)
              .map((espacio) => (
                <EspacioCard
                  key={espacio.id}
                  espacio={espacio}
                  seleccionado={seleccionado}
                  onSelect={onSelect}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}