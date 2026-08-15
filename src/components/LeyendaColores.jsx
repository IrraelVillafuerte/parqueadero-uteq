import React from 'react';

const ITEMS = [
  { color: 'bg-green-600', etiqueta: 'Libre' },
  { color: 'bg-red-600', etiqueta: 'Ocupado' },
  { color: 'bg-gray-400', etiqueta: 'Sin información' },
];

export default function LeyendaColores() {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-4 text-xs">
      {ITEMS.map((item) => (
        <div key={item.etiqueta} className="flex items-center gap-2">
          <span className={`w-3.5 h-3.5 rounded-sm ${item.color}`}></span>
          <span className="text-gray-600 font-medium">{item.etiqueta}</span>
        </div>
      ))}
    </div>
  );
}
