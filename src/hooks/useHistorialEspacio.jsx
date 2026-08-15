import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../services/firebase';

export function useHistorialEspacio(espacioId) {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!espacioId) return;

    const historialRef = ref(db, `historial/${espacioId}`);
    const unsubscribe = onValue(historialRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lista = Object.keys(data)
          .map((key) => ({
            id: key,
            ...data[key],
          }))
          .sort((a, b) => b.fechaHora - a.fechaHora); // Más reciente primero
        setHistorial(lista);
      } else {
        setHistorial([]);
      }
      setCargando(false);
    });

    return () => unsubscribe();
  }, [espacioId]);

  return { historial, cargando };
}