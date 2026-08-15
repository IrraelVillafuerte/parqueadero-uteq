import React from 'react';

export default function ResumenEstacionamiento({ espacios }) {
  const total = espacios.length;
  const ocupados = espacios.filter((e) => e.estado === 'ocupado').length;
  const disponibles = espacios.filter((e) => e.estado === 'libre').length;
  const sinInformacion = espacios.filter((e) => e.estado === 'sin-informacion').length;
  const pctDisponibles = total > 0 ? Math.round((disponibles / total) * 100) : 0;
  const pctOcupados = total > 0 ? Math.round((ocupados / total) * 100) : 0;

  const metricas = [
    {
      label: 'TOTAL',
      valor: total,
      sub: 'espacios monitoreados',
      color: 'text-gray-900',
    },
    {
      label: 'DISPONIBLES',
      valor: disponibles,
      sub: `${pctDisponibles}% del parqueadero`,
      color: 'text-green-600',
    },
    {
      label: 'OCUPADOS',
      valor: ocupados,
      sub: `${pctOcupados}% del parqueadero`,
      color: 'text-red-500',
    },
    {
      label: 'SIN INFORMACIÓN',
      valor: sinInformacion,
      sub: 'sensores sin datos',
      color: 'text-gray-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {metricas.map((m) => (
        <div
          key={m.label}
          className="border border-gray-100 rounded-2xl p-5 shadow-sm text-left"
        >
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {m.label}
          </span>
          <p className={`text-3xl font-black mt-1 ${m.color}`}>{m.valor}</p>
          <span className="text-[11px] text-gray-400">{m.sub}</span>
        </div>
      ))}
    </div>
  );
}
