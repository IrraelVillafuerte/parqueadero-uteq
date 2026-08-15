import React from 'react';
import { CarFront, HelpCircle } from 'lucide-react';

// Colores según la especificación del enunciado:
//   verde = libre, rojo = ocupado, gris = sensor sin información
const ESTILOS_ESTADO = {
  libre: {
    fondo: 'bg-green-600',
    etiqueta: 'Libre',
  },
  ocupado: {
    fondo: 'bg-red-600',
    etiqueta: 'Ocupado',
  },
  'sin-informacion': {
    fondo: 'bg-gray-400',
    etiqueta: 'Sin información',
  },
};

function formatearHora(fechaHora) {
  if (!fechaHora) return '--:--:--';
  return new Date(fechaHora).toLocaleTimeString();
}

export default function EspacioCard({ espacio, seleccionado, onSelect }) {
  const isOcupado = espacio.estado === 'ocupado';
  const isSelected = seleccionado?.id === espacio.id;
  const estilo = ESTILOS_ESTADO[espacio.estado] || ESTILOS_ESTADO['sin-informacion'];

  return (
    <div
      onClick={() => onSelect(espacio)}
      className={`p-3 rounded-lg cursor-pointer transition-all duration-150 flex flex-col justify-between h-28 border-2 ${
        isSelected ? 'border-white scale-105 shadow-xl z-10' : 'border-transparent hover:border-gray-500'
      } ${estilo.fondo}`}
      title={`${espacio.id} · Columna ${espacio.columna} · N.º ${espacio.numero}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <span className="text-white font-bold text-sm block">{espacio.id}</span>
          <span className="text-white/80 text-[10px] block">
            Col. {espacio.columna} · N.º {espacio.numero}
          </span>
        </div>
        {isOcupado ? (
          <CarFront className="text-white w-5 h-5 opacity-90 shrink-0" />
        ) : espacio.estado === 'sin-informacion' ? (
          <HelpCircle className="text-white w-5 h-5 opacity-90 shrink-0" />
        ) : null}
      </div>

      <div className="text-right">
        <span className="text-white text-[10px] font-semibold uppercase tracking-wide block">
          {estilo.etiqueta}
        </span>
        <span className="text-xs font-mono text-white opacity-90 block">
          {espacio.distanciaDetectada != null ? `${espacio.distanciaDetectada} cm` : '-- cm'}
        </span>
        <span className="text-[9px] text-white/70 block">
          {formatearHora(espacio.fechaHora)}
        </span>
      </div>
    </div>
  );
}
