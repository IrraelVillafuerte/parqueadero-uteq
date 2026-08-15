import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../services/firebase';

export function useEspacios() {
  const [espacios, setEspacios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const espaciosRef = ref(db, 'espacios');
    const unsubscribe = onValue(
      espaciosRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const lista = Object.keys(data).map((key) => {
            const item = data[key] || {};
            const columna = item.columna || key.charAt(0);
            const numero = item.numero ?? parseInt(key.slice(1), 10);
            // Si el sensor no ha reportado distancia/estado, se marca como
            // "sin-informacion" en vez de asumir que está libre.
            const tieneDatos =
              item.distanciaDetectada !== undefined &&
              item.distanciaDetectada !== null &&
              (item.estado === 'libre' || item.estado === 'ocupado');
            return {
              id: key,
              columna,
              columnaLetra: columna,
              numero,
              estado: tieneDatos ? item.estado : 'sin-informacion',
              distanciaDetectada: tieneDatos ? item.distanciaDetectada : null,
              fechaHora: item.fechaHora ?? null,
              ubicacion: item.ubicacion,
            };
          });
          lista.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
          setEspacios(lista);
        } else {
          setEspacios([]);
        }
        setCargando(false);
      },
      () => setCargando(false)
    );

    return () => unsubscribe();
  }, []);

  return { espacios, cargando };
}
