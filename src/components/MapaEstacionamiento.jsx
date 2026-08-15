import React, { useMemo } from 'react';
import { PUNTOS_LIMITE } from '../utils/geometria';

// Convierte lat/lng a metros locales (aproximación equirectangular, válida
// para un área tan pequeña como este parqueadero) tomando P1 como origen.
function proyectarAMetros(punto, origen) {
  const METROS_POR_GRADO_LAT = 110540;
  const metrosPorGradoLng = 111320 * Math.cos((origen.lat * Math.PI) / 180);
  return {
    x: (punto.lng - origen.lng) * metrosPorGradoLng,
    y: (punto.lat - origen.lat) * METROS_POR_GRADO_LAT, // + = norte
  };
}

export default function MapaEstacionamiento() {
  const { P1, P2, P3, P4 } = PUNTOS_LIMITE;

  // Coordenadas centrales aproximadas (promedio de los 4 puntos) para el mapa embebido
  const lat = (P1.lat + P2.lat + P3.lat + P4.lat) / 4;
  const lng = (P1.lng + P2.lng + P3.lng + P4.lng) / 4;

  const { puntosSvg, columnasSvg, viewBox } = useMemo(() => {
    const origen = P1;
    const p1m = proyectarAMetros(P1, origen);
    const p2m = proyectarAMetros(P2, origen);
    const p3m = proyectarAMetros(P3, origen);
    const p4m = proyectarAMetros(P4, origen);

    const PADDING = 20;
    const xs = [p1m.x, p2m.x, p3m.x, p4m.x];
    const ys = [p1m.y, p2m.y, p3m.y, p4m.y];
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const anchoM = maxX - minX;
    const altoM = maxY - minY;

    // El terreno es angosto (26m) y largo (91m): lo dibujamos horizontal
    // (largo en X) rotando el sistema, ya que ancho/largo así lo sugiere.
    const ESCALA = 260 / altoM; // altoM ~ 91m (norte-sur) -> eje X del SVG
    const anchoSvg = altoM * ESCALA + PADDING * 2;
    const altoSvg = anchoM * ESCALA + PADDING * 2;

    // (x,y) metros -> SVG: eje X del SVG = norte-sur (y en metros),
    // eje Y del SVG = oeste-este (x en metros), para que el rectángulo
    // largo y angosto se vea horizontal.
    const aSvg = (m) => ({
      x: PADDING + (m.y - minY) * ESCALA,
      y: PADDING + (m.x - minX) * ESCALA,
    });

    const p1s = aSvg(p1m);
    const p2s = aSvg(p2m);
    const p3s = aSvg(p3m);
    const p4s = aSvg(p4m);

    const puntos = `${p1s.x},${p1s.y} ${p4s.x},${p4s.y} ${p3s.x},${p3s.y} ${p2s.x},${p2s.y}`;

    // Líneas divisorias de las 4 columnas (interpolando entre borde P1-P2 y P4-P3)
    const columnas = [1, 2, 3].map((i) => {
      const t = i / 4;
      const topeM = {
        x: p1m.x + t * (p4m.x - p1m.x),
        y: p1m.y + t * (p4m.y - p1m.y),
      };
      const baseM = {
        x: p2m.x + t * (p3m.x - p2m.x),
        y: p2m.y + t * (p3m.y - p2m.y),
      };
      return { a: aSvg(topeM), b: aSvg(baseM) };
    });

    return {
      puntosSvg: { p1: p1s, p2: p2s, p3: p3s, p4: p4s, poligono: puntos },
      columnasSvg: columnas,
      viewBox: `0 0 ${anchoSvg} ${altoSvg}`,
    };
  }, [P1, P2, P3, P4]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-green-600 text-xl">📍</span>
        <h3 className="text-lg font-bold text-gray-800">Ubicación UTEQ - Campus Quevedo</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Plano del terreno: polígono real formado por P1-P2-P3-P4 */}
        <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">
            Plano del terreno (P1 - P4)
          </p>
          <svg viewBox={viewBox} className="w-full h-[220px]">
            <polygon
              points={puntosSvg.poligono}
              fill="#16a34a22"
              stroke="#166534"
              strokeWidth="2"
            />
            {columnasSvg.map((linea, i) => (
              <line
                key={i}
                x1={linea.a.x}
                y1={linea.a.y}
                x2={linea.b.x}
                y2={linea.b.y}
                stroke="#166534"
                strokeDasharray="4 3"
                strokeWidth="1"
                opacity="0.6"
              />
            ))}
            {[
              ['P1', puntosSvg.p1],
              ['P2', puntosSvg.p2],
              ['P3', puntosSvg.p3],
              ['P4', puntosSvg.p4],
            ].map(([label, p]) => (
              <g key={label}>
                <circle cx={p.x} cy={p.y} r="3.5" fill="#166534" />
                <text x={p.x + 6} y={p.y - 6} fontSize="10" fill="#166534" fontWeight="bold">
                  {label}
                </text>
              </g>
            ))}
          </svg>
          <p className="text-[10px] text-gray-400 mt-1">
            Líneas punteadas: división aproximada de las 4 columnas de espacios.
          </p>
        </div>

        {/* Mapa real embebido, centrado en el promedio de P1-P4 */}
        <div className="relative w-full h-[220px] md:h-auto rounded-xl overflow-hidden border border-gray-200 shadow-inner">
          <iframe
            title="Ubicación UTEQ - Parqueadero Inteligente"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: 220 }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${lat},${lng}&z=18&output=embed`}
          ></iframe>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 flex flex-wrap justify-between gap-2 border-t pt-3">
        <span>
          <strong>P1:</strong> {P1.lat.toFixed(6)}, {P1.lng.toFixed(6)} &nbsp;
          <strong>P2:</strong> {P2.lat.toFixed(6)}, {P2.lng.toFixed(6)}
        </span>
        <span>
          <strong>P3:</strong> {P3.lat.toFixed(6)}, {P3.lng.toFixed(6)} &nbsp;
          <strong>P4:</strong> {P4.lat.toFixed(6)}, {P4.lng.toFixed(6)}
        </span>
        <span>
          <strong>Superficie total:</strong> ~2405.74 m² (91.37 m × 26.34 m)
        </span>
      </div>
    </div>
  );
}
