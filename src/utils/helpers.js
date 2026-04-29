/**
 * ============================================================
 * UTILIDADES - FUNCIONES AUXILIARES
 * Archivo: src/utils/helpers.js
 * ============================================================
 * Descripción: Funciones auxiliares para la API
 * ============================================================
 */

/**
 * Validar formato de correo
 */
const validarCorreo = (correo) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo);
};

/**
 * Validar formato de color hexadecimal
 */
const validarColorHex = (color) => {
  const regex = /^#[0-9A-F]{6}$/i;
  return regex.test(color);
};

/**
 * Validar que una fecha sea válida y en formato YYYY-MM-DD
 */
const validarFecha = (fecha) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(fecha)) return false;
  
  const date = new Date(fecha);
  return date instanceof Date && !isNaN(date);
};

/**
 * Redondear número a 2 decimales
 */
const redondearDecimales = (numero, decimales = 2) => {
  return Math.round(numero * Math.pow(10, decimales)) / Math.pow(10, decimales);
};

/**
 * Formatear dinero
 */
const formatearDinero = (monto, moneda = 'COP') => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: moneda,
    minimumFractionDigits: 2,
  }).format(monto);
};

module.exports = {
  validarCorreo,
  validarColorHex,
  validarFecha,
  redondearDecimales,
  formatearDinero,
};