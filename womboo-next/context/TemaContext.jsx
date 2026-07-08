'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

// Creamos un contexto global para compartir el tema activo.
// Esto permite que el header, el contenido y el panel admin reaccionen
// al mismo cambio sin tener que propagar props manualmente.
const TemaContext = createContext(null);

const STORAGE_KEY = 'womboo-tema';

export function TemaProvider({ children }) {
  // El valor inicial es oscuro para que el sitio quede consistente al cargar
  // en el servidor y en el cliente, evitando diferencias de hidratación.
  const [tema, setTema] = useState('dark');
  const [estaListo, setEstaListo] = useState(false);

  // Al montar el proveedor comprobamos si el usuario ya eligió un tema
  // previamente y lo restauramos desde localStorage.
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const temaGuardado = window.localStorage.getItem(STORAGE_KEY);

      if (temaGuardado === 'light' || temaGuardado === 'dark') {
        // El estado inicial en el server siempre es 'dark' para evitar un
        // mismatch de hidratación. Este setState sincrónico dentro del efecto
        // es intencional: solo se dispara una vez al montar, antes de que el
        // usuario vea contenido interactivo, y restaura la preferencia real
        // guardada en localStorage sin poder leerla durante el render del server.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTema(temaGuardado);
      }
    } catch (error) {
      console.error('No se pudo leer el tema guardado:', error);
    } finally {
      setEstaListo(true);
    }
  }, []);

  // Cada vez que cambia el tema aplicamos la clase al body y persistimos
  // la selección para que se recuerde en futuras visitas.
  useEffect(() => {
    if (!estaListo || typeof window === 'undefined') {
      return;
    }

    document.body.classList.toggle('light', tema === 'light');
    document.body.classList.toggle('dark', tema === 'dark');
    window.localStorage.setItem(STORAGE_KEY, tema);
  }, [tema, estaListo]);

  // Método público para alternar entre los dos modos disponibles.
  const alternarTema = () => {
    setTema((temaActual) => (temaActual === 'dark' ? 'light' : 'dark'));
  };

  const value = useMemo(
    () => ({
      tema,
      alternarTema,
      esLight: tema === 'light',
    }),
    [tema]
  );

  return <TemaContext.Provider value={value}>{children}</TemaContext.Provider>;
}

export function useTema() {
  const contexto = useContext(TemaContext);

  if (!contexto) {
    throw new Error('useTema debe usarse dentro de TemaProvider');
  }

  return contexto;
}
