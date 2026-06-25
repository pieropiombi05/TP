'use client';

import { useEffect, useState } from 'react';

// Estado inicial del formulario para crear o editar un producto.
const estadoInicial = {
  nombre: '',
  precio: '',
  imagen: '',
  categoria: ''
};

export default function AdminPage() {
  // Lista de productos que se muestran en la tabla.
  const [productos, setProductos] = useState([]);

  // Indica si la carga inicial está en progreso.
  const [cargando, setCargando] = useState(true);

  // Guarda mensajes de error para mostrarlos en la interfaz.
  const [error, setError] = useState('');

  // Cambia entre crear un producto nuevo o modificar uno existente.
  const [editandoId, setEditandoId] = useState(null);

  // Datos del formulario que se envían a la API.
  const [formulario, setFormulario] = useState(estadoInicial);

  // useEffect para cargar los productos al abrir la página.
  useEffect(() => {
    cargarProductos();
  }, []);

  // Obtiene los productos desde la API de administración.
  const cargarProductos = async () => {
    try {
      setCargando(true);
      const respuesta = await fetch('/api/admin/productos');

      if (!respuesta.ok) {
        throw new Error('No se pudieron cargar los productos.');
      }

      const datos = await respuesta.json();
      setProductos(datos.data || []);
      setError('');
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar productos:', err);
    } finally {
      setCargando(false);
    }
  };

  // Actualiza los campos del formulario en cada cambio del input.
  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setFormulario((anterior) => ({
      ...anterior,
      [name]: value
    }));
  };

  // Envía el formulario para crear o actualizar un producto.
  const manejarSubmit = async (evento) => {
    evento.preventDefault();

    try {
      const payload = {
        ...formulario,
        precio: Number(formulario.precio) || 0
      };

      const metodo = editandoId ? 'PUT' : 'POST';
      const respuesta = await fetch('/api/admin/productos', {
        method: metodo,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          editandoId ? { id: editandoId, ...payload } : payload
        )
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudo guardar el producto.');
      }

      // Después de guardar, volvemos a pedir la lista actualizada.
      await cargarProductos();
      limpiarFormulario();
    } catch (err) {
      setError(err.message);
      console.error('Error al guardar producto:', err);
    }
  };

  // Llena el formulario con los datos del producto que se quiere editar.
  const editarProducto = (producto) => {
    setEditandoId(producto.id);
    setFormulario({
      nombre: producto.nombre || '',
      precio: producto.precio || '',
      imagen: producto.imagen || '',
      categoria: producto.categoria || ''
    });
  };

  // Elimina un producto por id usando la API.
  const eliminarProducto = async (id) => {
    const confirmar = window.confirm('¿Deseas eliminar este producto?');

    if (!confirmar) {
      return;
    }

    try {
      const respuesta = await fetch('/api/admin/productos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudo eliminar el producto.');
      }

      await cargarProductos();
      if (editandoId === id) {
        limpiarFormulario();
      }
    } catch (err) {
      setError(err.message);
      console.error('Error al eliminar producto:', err);
    }
  };

  // Reinicia el formulario para volver a crear un producto nuevo.
  const limpiarFormulario = () => {
    setFormulario(estadoInicial);
    setEditandoId(null);
  };

  return (
    <main style={styles.page}>
      <section style={styles.panel}>
        <h1 style={styles.title}>Administración de productos</h1>
        <p style={styles.subtitle}>
          Agrega, edita o elimina productos desde Supabase.
        </p>

        <form onSubmit={manejarSubmit} style={styles.form}>
          <h2 style={styles.formTitle}>
            {editandoId ? 'Editar producto' : 'Agregar producto'}
          </h2>

          <input
            name="nombre"
            value={formulario.nombre}
            onChange={manejarCambio}
            placeholder="Nombre"
            style={styles.input}
            required
          />

          <input
            name="precio"
            type="number"
            step="0.01"
            value={formulario.precio}
            onChange={manejarCambio}
            placeholder="Precio"
            style={styles.input}
            required
          />

          <input
            name="imagen"
            value={formulario.imagen}
            onChange={manejarCambio}
            placeholder="URL de imagen"
            style={styles.input}
          />

          <input
            name="categoria"
            value={formulario.categoria}
            onChange={manejarCambio}
            placeholder="Categoría"
            style={styles.input}
            required
          />

          <div style={styles.buttonRow}>
            <button type="submit" style={styles.primaryButton}>
              {editandoId ? 'Actualizar producto' : 'Agregar producto'}
            </button>
            {editandoId ? (
              <button type="button" onClick={limpiarFormulario} style={styles.secondaryButton}>
                Cancelar
              </button>
            ) : null}
          </div>
        </form>

        {error ? <p style={styles.error}>{error}</p> : null}

        <div style={styles.tableWrapper}>
          <h2 style={styles.tableTitle}>Productos actuales</h2>

          {cargando ? (
            <p>Cargando productos...</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nombre</th>
                  <th style={styles.th}>Precio</th>
                  <th style={styles.th}>Categoría</th>
                  <th style={styles.th}>Imagen</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td style={styles.td}>{producto.nombre}</td>
                    <td style={styles.td}>${Number(producto.precio).toFixed(2)}</td>
                    <td style={styles.td}>{producto.categoria}</td>
                    <td style={styles.td}>
                      {producto.imagen ? (
                        <img src={producto.imagen} alt={producto.nombre} style={styles.image} />
                      ) : (
                        'Sin imagen'
                      )}
                    </td>
                    <td style={styles.td}>
                      <button
                        type="button"
                        onClick={() => editarProducto(producto)}
                        style={styles.editButton}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => eliminarProducto(producto.id)}
                        style={styles.deleteButton}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    padding: '40px 20px',
    background: '#0a0a0a',
    color: '#ffffff'
  },
  panel: {
    maxWidth: '1200px',
    margin: '0 auto',
    background: '#111111',
    border: '1px solid #2a2a2a',
    borderRadius: '16px',
    padding: '24px'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '8px'
  },
  subtitle: {
    color: '#b0b0b0',
    marginBottom: '24px'
  },
  form: {
    display: 'grid',
    gap: '12px',
    marginBottom: '24px'
  },
  formTitle: {
    fontSize: '1.2rem'
  },
  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #444',
    background: '#1b1b1b',
    color: '#fff'
  },
  buttonRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  primaryButton: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: 'none',
    background: '#ffffff',
    color: '#111',
    cursor: 'pointer'
  },
  secondaryButton: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #666',
    background: 'transparent',
    color: '#fff',
    cursor: 'pointer'
  },
  error: {
    color: '#ff6b6b',
    marginBottom: '16px'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  tableTitle: {
    fontSize: '1.1rem',
    marginBottom: '12px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    textAlign: 'left',
    padding: '10px',
    borderBottom: '1px solid #333',
    color: '#b0b0b0'
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #222'
  },
  image: {
    width: '48px',
    height: '48px',
    objectFit: 'cover',
    borderRadius: '8px'
  },
  editButton: {
    marginRight: '8px',
    padding: '6px 10px',
    borderRadius: '6px',
    border: 'none',
    background: '#f5c542',
    color: '#111',
    cursor: 'pointer'
  },
  deleteButton: {
    padding: '6px 10px',
    borderRadius: '6px',
    border: 'none',
    background: '#ff5c5c',
    color: '#fff',
    cursor: 'pointer'
  }
};
