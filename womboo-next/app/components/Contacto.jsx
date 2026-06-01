'use client';

import { useState } from 'react';
import styles from './Contacto.module.css';

export default function Contacto() {
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: '',
  });

  // Estado para almacenar los errores de validación de cada campo
  // Cada propiedad corresponde a un campo del formulario
  const [errores, setErrores] = useState({
    nombre: '',
    email: '',
    mensaje: '',
  });

  // Estado para controlar si el formulario está siendo enviado
  const [enviando, setEnviando] = useState(false);

  // Estado para almacenar el mensaje de respuesta (éxito o error general)
  const [mensajeRespuesta, setMensajeRespuesta] = useState({
    tipo: '', // 'éxito' o 'error'
    contenido: '',
  });

  /**
   * Función para validar el formato de un email
   * @param {string} email - El email a validar
   * @returns {boolean} - true si el email tiene un formato válido
   */
  const validarEmail = (email) => {
    // Expresión regular para validar email: usuario@dominio.extensión
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  };

  /**
   * Función para validar un campo específico
   * Retorna el mensaje de error o una cadena vacía si es válido
   * @param {string} nombre - El nombre del campo (nombre, email, mensaje)
   * @param {string} valor - El valor del campo a validar
   * @returns {string} - Mensaje de error o cadena vacía
   */
  const validarCampo = (nombre, valor) => {
    // Si el campo está vacío
    if (!valor.trim()) {
      if (nombre === 'nombre') return 'El nombre es requerido';
      if (nombre === 'email') return 'El email es requerido';
      if (nombre === 'mensaje') return 'El mensaje es requerido';
    }

    // Validaciones específicas por campo
    if (nombre === 'email' && valor.trim()) {
      // Si el email no está vacío pero no tiene formato válido
      if (!validarEmail(valor)) {
        return 'Por favor ingresa un email válido (ej: usuario@dominio.com)';
      }
    }

    if (nombre === 'mensaje' && valor.trim()) {
      // El mensaje debe tener al menos 10 caracteres
      if (valor.trim().length < 10) {
        return 'El mensaje debe tener al menos 10 caracteres';
      }
    }

    // Si todo es válido, retornar cadena vacía
    return '';
  };

  /**
   * Manejador para cambios en los inputs del formulario
   * Actualiza el estado y valida el campo en tiempo real
   * @param {Event} e - Evento del input
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Actualizar los datos del formulario
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Validar el campo en tiempo real y actualizar el estado de errores
    const errorMensaje = validarCampo(name, value);
    setErrores((prevState) => ({
      ...prevState,
      [name]: errorMensaje,
    }));

    // Limpiar mensaje de respuesta anterior cuando el usuario comienza a editar
    if (mensajeRespuesta.contenido) {
      setMensajeRespuesta({ tipo: '', contenido: '' });
    }
  };

  /**
   * Función para validar todo el formulario antes de enviarlo
   * @returns {boolean} - true si no hay errores, false en caso contrario
   */
  const validarFormularioCompleto = () => {
    const nuevosErrores = {
      nombre: validarCampo('nombre', formData.nombre),
      email: validarCampo('email', formData.email),
      mensaje: validarCampo('mensaje', formData.mensaje),
    };

    setErrores(nuevosErrores);

    // Retornar true solo si no hay ningún error
    return Object.values(nuevosErrores).every((error) => error === '');
  };

  /**
   * Manejador para el envío del formulario
   * Valida los datos en cliente y luego hace un fetch a la API
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todo el formulario antes de enviar
    if (!validarFormularioCompleto()) {
      setMensajeRespuesta({
        tipo: 'error',
        contenido: 'Por favor, completa todos los campos correctamente',
      });
      return;
    }

    try {
      // Cambiar estado a "enviando" para deshabilitar el botón
      setEnviando(true);

      // Realizar el fetch POST a la API route
      const respuesta = await fetch('/api/contacto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Enviar los datos del formulario como JSON
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          mensaje: formData.mensaje,
        }),
      });

      // Parsear la respuesta JSON
      const datos = await respuesta.json();

      // Si la respuesta fue exitosa (status 200)
      if (respuesta.ok && datos.éxito) {
        // Mostrar mensaje de éxito
        setMensajeRespuesta({
          tipo: 'éxito',
          contenido: datos.mensaje,
        });

        // Limpiar el formulario
        setFormData({
          nombre: '',
          email: '',
          mensaje: '',
        });

        // Limpiar los errores
        setErrores({
          nombre: '',
          email: '',
          mensaje: '',
        });

        // Ocultar el mensaje de éxito después de 5 segundos
        setTimeout(() => {
          setMensajeRespuesta({ tipo: '', contenido: '' });
        }, 5000);
      } else {
        // Si la API devolvió errores de validación
        setMensajeRespuesta({
          tipo: 'error',
          contenido: datos.mensaje || 'Hubo un error al enviar el formulario',
        });
      }
    } catch (error) {
      // Capturar errores de red o de parsing
      console.error('Error al enviar el formulario:', error);
      setMensajeRespuesta({
        tipo: 'error',
        contenido: 'Error de conexión. Por favor, intenta de nuevo.',
      });
    } finally {
      // Cambiar estado a "no enviando" para habilitar el botón nuevamente
      setEnviando(false);
    }
  };

  return (
    <section className={styles.contact} id="contact">
      <h2 className={styles.contactTitle}>Contacto</h2>
      <form
        className={styles.contactForm}
        onSubmit={handleSubmit}
        aria-label="Formulario de contacto"
        noValidate
      >
        {/* CAMPO DE NOMBRE */}
        <div className={styles.formGroup}>
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            // Si hay error en el campo, agregar clase de error (opcional, para CSS)
            className={errores.nombre ? styles.inputError : ''}
            placeholder="Tu nombre completo"
            disabled={enviando}
          />
          {/* Mostrar mensaje de error debajo del input si existe */}
          {errores.nombre && (
            <p className={styles.errorMessage} role="alert">
              {errores.nombre}
            </p>
          )}
        </div>

        {/* CAMPO DE EMAIL */}
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            // Si hay error en el campo, agregar clase de error
            className={errores.email ? styles.inputError : ''}
            placeholder="tu@correo.com"
            disabled={enviando}
          />
          {/* Mostrar mensaje de error debajo del input si existe */}
          {errores.email && (
            <p className={styles.errorMessage} role="alert">
              {errores.email}
            </p>
          )}
        </div>

        {/* CAMPO DE MENSAJE */}
        <div className={styles.formGroup}>
          <label htmlFor="mensaje">Mensaje</label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows="5"
            value={formData.mensaje}
            onChange={handleChange}
            // Si hay error en el campo, agregar clase de error
            className={errores.mensaje ? styles.inputError : ''}
            placeholder="Escribe tu mensaje aquí (mínimo 10 caracteres)"
            disabled={enviando}
          ></textarea>
          {/* Mostrar mensaje de error debajo del textarea si existe */}
          {errores.mensaje && (
            <p className={styles.errorMessage} role="alert">
              {errores.mensaje}
            </p>
          )}
        </div>

        {/* BOTÓN DE ENVÍO */}
        <button
          type="submit"
          className={styles.formButton}
          disabled={enviando}
          aria-busy={enviando}
        >
          {enviando ? 'Enviando...' : 'Enviar'}
        </button>

        {/* MENSAJE DE RESPUESTA (ÉXITO O ERROR) */}
        {mensajeRespuesta.contenido && (
          <div
            className={`${styles.formMessage} ${
              mensajeRespuesta.tipo === 'éxito'
                ? styles.mensajeExito
                : styles.mensajeError
            }`}
            role="alert"
          >
            {mensajeRespuesta.contenido}
          </div>
        )}
      </form>
    </section>
  );
}
