'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

// Creamos el contexto de React. Un contexto es como un "canal global"
// por el cual varios componentes pueden compartir información sin pasarla
// manualmente por props en cada nivel.
const CarritoContext = createContext(null);

const STORAGE_KEY = 'womboo-carrito';

export function CarritoProvider({ children }) {
  // items guarda los productos que el usuario agregó al carrito.
  const [items, setItems] = useState([]);

  // este estado evita que el carrito intente guardar en localStorage
  // antes de que la información haya sido cargada desde el navegador.
  const [estaListo, setEstaListo] = useState(false);

  // Al montar el provider, intentamos recuperar el carrito guardado
  // en localStorage para que se mantenga al recargar la página.
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const carritoGuardado = window.localStorage.getItem(STORAGE_KEY);

      if (carritoGuardado) {
        const carritoParseado = JSON.parse(carritoGuardado);

        if (Array.isArray(carritoParseado)) {
          setItems(carritoParseado);
        }
      }
    } catch (error) {
      console.error('No se pudo cargar el carrito desde localStorage:', error);
    } finally {
      setEstaListo(true);
    }
  }, []);

  // Cada vez que cambie el carrito, lo guardamos de nuevo en localStorage.
  useEffect(() => {
    if (!estaListo || typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, estaListo]);

  // Agrega un producto al carrito. Si ya existe, aumenta la cantidad.
  const agregarProducto = (producto) => {
    setItems((itemsActuales) => {
      const productoExistente = itemsActuales.find((item) => item.id === producto.id);

      if (productoExistente) {
        return itemsActuales.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }

      return [
        ...itemsActuales,
        {
          ...producto,
          precio: Number(producto.precio) || 0,
          cantidad: 1,
        },
      ];
    });
  };

  // Elimina un producto completo del carrito según su id.
  const eliminarProducto = (id) => {
    setItems((itemsActuales) => itemsActuales.filter((item) => item.id !== id));
  };

  // Incrementa en 1 la cantidad de un producto.
  const aumentarCantidad = (id) => {
    setItems((itemsActuales) =>
      itemsActuales.map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );
  };

  // Disminuye en 1 la cantidad de un producto.
  // Si llega a cero, se elimina del carrito.
  const disminuirCantidad = (id) => {
    setItems((itemsActuales) =>
      itemsActuales
        .map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  // Limpia por completo el carrito.
  const vaciarCarrito = () => {
    setItems([]);
  };

  // Calcula la cantidad total de artículos en el carrito.
  const cantidadTotal = useMemo(
    () => items.reduce((total, item) => total + item.cantidad, 0),
    [items]
  );

  // Calcula el subtotal total del carrito.
  const total = useMemo(
    () => items.reduce((acumulado, item) => acumulado + item.precio * item.cantidad, 0),
    [items]
  );

  // value contiene toda la lógica y el estado que queremos compartir.
  const value = useMemo(
    () => ({
      items,
      agregarProducto,
      eliminarProducto,
      aumentarCantidad,
      disminuirCantidad,
      vaciarCarrito,
      cantidadTotal,
      total,
    }),
    [items, cantidadTotal, total]
  );

  return <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>;
}

// Hook personalizado para consumir el contexto desde cualquier componente.
export function useCarrito() {
  const contexto = useContext(CarritoContext);

  if (!contexto) {
    throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  }

  return contexto;
}
