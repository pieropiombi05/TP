// API Route para manejar el formulario de contacto
// Ubicación: app/api/contacto/route.js
// Este archivo recibe las peticiones POST desde el cliente, valida los datos y los guarda en Supabase

import { getSupabaseClient } from '../../../lib/supabase.js';

// Fuerza esta ruta a evaluar la información fresca en cada petición para que los mensajes aparezcan inmediatamente.
export const dynamic = 'force-dynamic';

/**
 * Función auxiliar para validar el formato de un email
 * Utiliza una expresión regular simple pero efectiva
 * @param {string} email - El email a validar
 * @returns {boolean} - true si el email tiene un formato válido
 */
function validarEmail(email) {
  // Expresión regular para validar email: debe tener formato usuario@dominio.extensión
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexEmail.test(email);
}

/**
 * Función auxiliar para validar que un campo no esté vacío
 * @param {string} campo - El valor del campo a validar
 * @returns {boolean} - true si el campo no está vacío
 */
function validarCampoNoVacio(campo) {
  return campo && campo.trim().length > 0;
}

/**
 * Manejador de solicitudes POST
 * Recibe datos del formulario de contacto, los valida y devuelve una respuesta JSON
 * @param {Request} request - Objeto de solicitud HTTP
 * @returns {Response} - Respuesta JSON con resultado de la validación
 */
export async function POST(request) {
  try {
    // Extraer los datos JSON del cuerpo de la solicitud
    const { nombre, email, mensaje } = await request.json();

    // Array para almacenar errores de validación
    const errores = [];

    // VALIDACIÓN DEL NOMBRE
    if (!validarCampoNoVacio(nombre)) {
      errores.push('El nombre es requerido');
    }

    // VALIDACIÓN DEL EMAIL
    if (!validarCampoNoVacio(email)) {
      errores.push('El email es requerido');
    } else if (!validarEmail(email)) {
      // Si el email no está vacío pero no tiene formato válido
      errores.push('El email no tiene un formato válido');
    }

    // VALIDACIÓN DEL MENSAJE
    if (!validarCampoNoVacio(mensaje)) {
      errores.push('El mensaje es requerido');
    } else if (mensaje.trim().length < 10) {
      // Validación adicional: el mensaje debe tener al menos 10 caracteres
      errores.push('El mensaje debe tener al menos 10 caracteres');
    }

    // Si hay errores, devolvemos respuesta con código 400 (Bad Request)
    if (errores.length > 0) {
      return Response.json(
        {
          éxito: false,
          mensaje: 'Validación fallida',
          errores: errores,
        },
        { status: 400 }
      );
    }

    // Si todas las validaciones pasaron, creamos el cliente de Supabase y guardamos el mensaje en la tabla mensajes.
    const supabase = getSupabaseClient();

    const mensajeParaGuardar = {
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      mensaje: mensaje.trim(),
    };

    // Insertamos el registro en Supabase y devolvemos el mensaje creado para confirmar el guardado.
    const { data, error } = await supabase
      .from('mensajes')
      .insert([mensajeParaGuardar])
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log('Mensaje guardado en Supabase:', data);

    // Devolver respuesta de éxito con código 200 (OK)
    return Response.json(
      {
        éxito: true,
        mensaje: 'Tu mensaje ha sido recibido correctamente. Nos pondremos en contacto pronto.',
        datos: {
          nombre: data?.nombre ?? nombre,
          email: data?.email ?? email,
          fechaRecibida: data?.created_at ?? new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    // Capturar errores inesperados (ej: JSON inválido)
    console.error('Error en la API de contacto:', error);

    return Response.json(
      {
        éxito: false,
        mensaje: 'Error interno del servidor',
        detalleError: error.message,
      },
      { status: 500 }
    );
  }
}
