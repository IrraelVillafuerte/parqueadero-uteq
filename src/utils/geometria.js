// Cálculo geométrico del parqueadero UTEQ
//
// El terreno está delimitado por 4 puntos (P1-P4) tomados del enunciado:
//   P1 (noroeste) -> P4 (noreste)  = borde norte (columna 1 ... columna 4)
//   P2 (suroeste) -> P3 (sureste)  = borde sur
//
// Para que cada uno de los 80 espacios tenga su propia latitud/longitud y su
// propio bounding box (y no todos el mismo punto central), interpolamos
// bilinealmente dentro del cuadrilátero que forman esos 4 puntos.

export const PUNTOS_LIMITE = {
  P1: { lat: -1.0122617572453996, lng: -79.4682858877737 }, // noroeste
  P2: { lat: -1.0125032549290254, lng: -79.4682998912032 }, // suroeste
  P3: { lat: -1.012570971500396, lng: -79.46748620024898 }, // sureste
  P4: { lat: -1.0123403901396444, lng: -79.46746240847104 }, // noreste
};

export const NUM_COLUMNAS = 4;
export const NUM_ESPACIOS_POR_COLUMNA = 20;

// Dimensiones aproximadas calculadas en el enunciado
export const DIMENSIONES_CELDA = {
  anchoM: 6.58,
  largoM: 4.57,
  superficieM2: 30.08,
};

/**
 * Interpola un punto dentro del cuadrilátero P1-P2-P3-P4.
 * u: 0 (oeste, columna 1) -> 1 (este, columna 4)
 * v: 0 (norte, entrada / espacio 1) -> 1 (sur, espacio 20)
 */
function interpolar(u, v) {
  const { P1, P2, P3, P4 } = PUNTOS_LIMITE;

  const topeLat = P1.lat + u * (P4.lat - P1.lat);
  const topeLng = P1.lng + u * (P4.lng - P1.lng);
  const baseLat = P2.lat + u * (P3.lat - P2.lat);
  const baseLng = P2.lng + u * (P3.lng - P2.lng);

  return {
    lat: topeLat * (1 - v) + baseLat * v,
    lng: topeLng * (1 - v) + baseLng * v,
  };
}

/**
 * Calcula la latitud/longitud central y el bounding box individual de un
 * espacio, según su columna (1-4) y número (1-20).
 */
export function calcularUbicacionEspacio(columna, numero) {
  const uCentro = (columna - 0.5) / NUM_COLUMNAS;
  const vCentro = (numero - 0.5) / NUM_ESPACIOS_POR_COLUMNA;
  const centro = interpolar(uCentro, vCentro);

  const uOeste = (columna - 1) / NUM_COLUMNAS;
  const uEste = columna / NUM_COLUMNAS;
  const vNorte = (numero - 1) / NUM_ESPACIOS_POR_COLUMNA;
  const vSur = numero / NUM_ESPACIOS_POR_COLUMNA;

  const esquinas = [
    interpolar(uOeste, vNorte),
    interpolar(uEste, vNorte),
    interpolar(uEste, vSur),
    interpolar(uOeste, vSur),
  ];

  const lats = esquinas.map((p) => p.lat);
  const lngs = esquinas.map((p) => p.lng);

  return {
    latitud: Number(centro.lat.toFixed(8)),
    longitud: Number(centro.lng.toFixed(8)),
    boundingBox: {
      norte: Number(Math.max(...lats).toFixed(8)),
      sur: Number(Math.min(...lats).toFixed(8)),
      oeste: Number(Math.min(...lngs).toFixed(8)),
      este: Number(Math.max(...lngs).toFixed(8)),
    },
  };
}
