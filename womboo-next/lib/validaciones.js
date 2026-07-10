// Funciones de validación compartidas por las rutas de la API.

/**
 * Función auxiliar para validar el formato de un email
 * Utiliza una expresión regular simple pero efectiva
 * @param {string} email - El email a validar
 * @returns {boolean} - true si el email tiene un formato válido
 */
export function validarEmail(email) {
  // Expresión regular para validar email: debe tener formato usuario@dominio.extensión
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexEmail.test(email);
}

/**
 * Función auxiliar para validar que un campo no esté vacío
 * @param {string} campo - El valor del campo a validar
 * @returns {boolean} - true si el campo no está vacío
 */
export function validarCampoNoVacio(campo) {
  return campo && campo.trim().length > 0;
}
