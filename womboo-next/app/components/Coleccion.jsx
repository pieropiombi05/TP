'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Coleccion.module.css';

export default function Coleccion() {
  // Estado para almacenar los productos obtenidos de la API
  const [productos, setProductos] = useState([]);
  
  // Estado para controlar si se está cargando la API
  const [cargando, setCargando] = useState(true);
  
  // Estado para manejar errores en la carga de la API
  const [error, setError] = useState(null);
  
  // Estado para el filtro de categoría (inicialmente sin filtro)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  
  // Estado para almacenar todas las categorías disponibles
  const [categorias, setCategorias] = useState([]);

  // useEffect que se ejecuta una sola vez al montar el componente
  // Se encarga de obtener los productos de la API
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        // Realizar fetch a la API de productos
        const respuesta = await fetch(`${window.location.origin}/api/productos`);
        
        // Verificar si la respuesta es exitosa
        if (!respuesta.ok) {
          throw new Error('Error al cargar los productos');
        }
        
        // Convertir la respuesta a JSON
        const datos = await respuesta.json();
        
        // Guardar los productos en el estado
        setProductos(datos.data);
        
        // Extraer todas las categorías únicas de los productos
        const categoriasUnicas = [
          'Todas',
          ...new Set(datos.data.map(prod => prod.categoria))
        ];
        setCategorias(categoriasUnicas);
        
        // Limpiar el estado de error si todo fue bien
        setError(null);
      } catch (err) {
        // Si hay un error, guardarlo en el estado
        setError(err.message);
        console.error('Error cargando productos:', err);
      } finally {
        // En cualquier caso, indicar que ya no está cargando
        setCargando(false);
      }
    };

    // Llamar a la función para obtener productos
    obtenerProductos();
  }, []); // El array vacío indica que este efecto solo se ejecuta una vez

  // Filtrar los productos según la categoría seleccionada
  // Si la categoría es "Todas", mostrar todos los productos
  // Si no, filtrar solo los que coincidan con la categoría seleccionada
  const productosFiltrados = 
    categoriaSeleccionada === 'Todas'
      ? productos
      : productos.filter(prod => prod.categoria === categoriaSeleccionada);

  return (
    <section className={styles.products} id="collection">
      <h2 className={styles.productsTitle}>Colección</h2>

      {/* Mostrar mensaje de carga mientras se obtienen los productos */}
      {cargando && (
        <div className={styles.loadingMessage}>
          <p>Cargando productos...</p>
        </div>
      )}

      {/* Mostrar mensaje de error si algo sale mal */}
      {error && (
        <div className={styles.errorMessage}>
          <p>Error: {error}</p>
        </div>
      )}

      {/* Mostrar filtro de categorías solo si los datos están cargados */}
      {!cargando && categorias.length > 0 && (
        <div className={styles.filterContainer}>
          <div className={styles.filterButtonsWrapper}>
            {/* Mostrar un botón para cada categoría disponible */}
            {categorias.map(categoria => (
              <button
                key={categoria}
                className={`${styles.filterButton} ${
                  // Agregar clase activa si el botón corresponde a la categoría seleccionada
                  categoriaSeleccionada === categoria ? styles.active : ''
                }`}
                onClick={() => setCategoriaSeleccionada(categoria)}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid de productos con los productos filtrados */}
      {!cargando && !error && (
        <div className={styles.productsGrid}>
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map((producto) => (
              <div key={producto.id} className={styles.productCard}>
                <div className={styles.productImageContainer}>
                  <Image
                    src={producto.imagen}
                    alt={producto.nombre}
                    fill
                    className={styles.productImage}
                  />
                </div>
                <h3 className={styles.productName}>{producto.nombre}</h3>
                <p className={styles.productPrice}>${producto.precio.toFixed(2)}</p>
              </div>
            ))
          ) : (
            // Mostrar mensaje si no hay productos en la categoría seleccionada
            <p className={styles.noProducts}>
              No hay productos en esta categoría
            </p>
          )}
        </div>
      )}
    </section>
  );
}
