// Script/función de simulación del parqueadero inteligente UTEQ
//
// Responsabilidades (según el enunciado):
//  1. Generar los 80 espacios en Firebase RTDB (una sola vez, si no existen).
//  2. Actualizar aleatoriamente algunos sensores cada cierto tiempo:
//     - distancia detectada
//     - estado (libre/ocupado)
//     - fecha y hora
//     - registro histórico
//  3. Mantener un balance aproximado entre espacios libres y ocupados.

import { ref, set, update, get } from 'firebase/database';
import { db } from './firebase';
import { calcularUbicacionEspacio } from '../utils/geometria';

const COLUMNAS = ['A', 'B', 'C', 'D'];
const ESPACIOS_POR_COLUMNA = 20;
export const UMBRAL_OCUPADO_CM = 50; // <= 50 cm => ocupado (regla del enunciado)

function idEspacio(letraColumna, numero) {
  return `${letraColumna}${String(numero).padStart(2, '0')}`;
}

function calcularEstado(distanciaCm) {
  return distanciaCm <= UMBRAL_OCUPADO_CM ? 'ocupado' : 'libre';
}

// Genera una distancia aleatoria realista; si forzarOcupado es true, la
// distancia queda por debajo del umbral (ocupado); si es false, por encima.
function distanciaAleatoria(forzarOcupado) {
  if (forzarOcupado) {
    return Number((Math.random() * (UMBRAL_OCUPADO_CM - 5) + 5).toFixed(1)); // 5 - 50 cm
  }
  return Number((Math.random() * (280 - (UMBRAL_OCUPADO_CM + 1)) + (UMBRAL_OCUPADO_CM + 1)).toFixed(1)); // 51 - 280 cm
}

// Mezcla aleatoria (Fisher-Yates) para no dejar siempre el mismo patrón
function mezclar(arreglo) {
  const copia = [...arreglo];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/**
 * Genera los 80 espacios (4 columnas x 20) con distancia, estado, ubicación
 * (lat/lng y bounding box individuales) y fecha/hora, manteniendo
 * aproximadamente la mitad libres y la mitad ocupados.
 */
function generarListaEspacios() {
  const claves = [];
  COLUMNAS.forEach((letra, colIdx) => {
    for (let numero = 1; numero <= ESPACIOS_POR_COLUMNA; numero++) {
      claves.push({ id: idEspacio(letra, numero), columna: colIdx + 1, numero });
    }
  });

  const mitad = Math.floor(claves.length / 2);
  const patronOcupado = mezclar(claves.map((_, i) => i < mitad));

  return claves.map((clave, i) => {
    const distancia = distanciaAleatoria(patronOcupado[i]);
    const fechaHora = Date.now();
    const ubicacion = calcularUbicacionEspacio(clave.columna, clave.numero);

    return {
      id: clave.id,
      columna: clave.columna,
      numero: clave.numero,
      distanciaDetectada: distancia,
      estado: calcularEstado(distancia),
      fechaHora,
      ubicacion: { nombre: 'Parqueadero UTEQ', ...ubicacion },
    };
  });
}

/**
 * Escribe (set) los 80 espacios iniciales y su primer registro histórico
 * en Firebase Realtime Database.
 */
export async function generarEspaciosIniciales() {
  const lista = generarListaEspacios();

  const espaciosPayload = {};
  const historialPayload = {};

  lista.forEach((espacio) => {
    espaciosPayload[espacio.id] = espacio;
    historialPayload[espacio.id] = {
      [espacio.fechaHora]: {
        distanciaDetectada: espacio.distanciaDetectada,
        estado: espacio.estado,
        fechaHora: espacio.fechaHora,
      },
    };
  });

  await set(ref(db, 'espacios'), espaciosPayload);
  await set(ref(db, 'historial'), historialPayload);

  return lista;
}

/**
 * Actualiza aleatoriamente un subconjunto de sensores: cambia su distancia,
 * estado y fecha/hora, y agrega el nuevo valor al historial de cada uno.
 */
async function actualizarSensoresAleatorios() {
  const snapshot = await get(ref(db, 'espacios'));
  const data = snapshot.val();
  if (!data) return;

  const ids = Object.keys(data);
  // Actualiza entre el 10% y el 20% de los sensores en cada ciclo
  const cantidad = Math.max(3, Math.round(ids.length * 0.15));
  const seleccionados = mezclar(ids).slice(0, cantidad);

  const actualizaciones = {};
  seleccionados.forEach((id) => {
    const forzarOcupado = Math.random() < 0.5;
    const distancia = distanciaAleatoria(forzarOcupado);
    const estado = calcularEstado(distancia);
    const fechaHora = Date.now();

    actualizaciones[`espacios/${id}/distanciaDetectada`] = distancia;
    actualizaciones[`espacios/${id}/estado`] = estado;
    actualizaciones[`espacios/${id}/fechaHora`] = fechaHora;
    actualizaciones[`historial/${id}/${fechaHora}`] = {
      distanciaDetectada: distancia,
      estado,
      fechaHora,
    };
  });

  // Escritura multi-ruta: una sola llamada a Firebase para todos los cambios
  await update(ref(db), actualizaciones);
}

/**
 * Punto de entrada de la simulación:
 *  - Si Firebase todavía no tiene los 80 espacios, los genera.
 *  - Luego programa actualizaciones periódicas de sensores aleatorios.
 * Devuelve una función para detener la simulación (limpiar el intervalo).
 */
export async function iniciarSimulacion(intervaloMs = 8000) {
  const snapshot = await get(ref(db, 'espacios'));
  if (!snapshot.exists()) {
    await generarEspaciosIniciales();
  }

  const intervalo = setInterval(() => {
    actualizarSensoresAleatorios().catch((error) => {
      console.error('Error actualizando sensores en la simulación:', error);
    });
  }, intervaloMs);

  return () => clearInterval(intervalo);
}
