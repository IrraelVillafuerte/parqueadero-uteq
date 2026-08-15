import { useEffect, useRef } from 'react';
import { iniciarSimulacion } from '../services/simulacion';

/**
 * Arranca el script de simulación (genera los 80 espacios si no existen y
 * programa actualizaciones periódicas de sensores) una única vez mientras
 * la aplicación está montada.
 */
export function useSimulacion(intervaloMs = 8000) {
  const yaIniciada = useRef(false);

  useEffect(() => {
    if (yaIniciada.current) return; // evita doble ejecución (p. ej. StrictMode)
    yaIniciada.current = true;

    let detener;
    iniciarSimulacion(intervaloMs).then((fn) => {
      detener = fn;
    });

    return () => {
      if (detener) detener();
    };
  }, [intervaloMs]);
}
