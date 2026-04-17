/**
 * ============================================================
 * MODELO DE USUARIOS
 * Archivo: models/usuarioModel.js
 * ============================================================
 * Descripción: Simula una base de datos en memoria para
 * almacenar usuarios registrados. En un entorno real se
 * conectaría a MongoDB, MySQL u otro motor de base de datos.
 * ============================================================
 */

const { v4: uuidv4 } = require('uuid'); // Generador de IDs únicos

/**
 * "Base de datos" en memoria.
 * Cada usuario tiene la estructura:
 * {
 *   id: string,
 *   usuario: string,
 *   contrasena: string (hash bcrypt),
 *   creadoEn: Date
 * }
 */
const usuarios = [];

/**
 * Busca un usuario por su nombre de usuario.
 * @param {string} usuario - Nombre de usuario a buscar.
 * @returns {Object|undefined} El usuario encontrado o undefined.
 */
const buscarPorUsuario = (usuario) => {
  return usuarios.find((u) => u.usuario === usuario);
};

/**
 * Crea y guarda un nuevo usuario en la base de datos.
 * @param {string} usuario - Nombre de usuario único.
 * @param {string} contrasenaHash - Contraseña ya cifrada con bcrypt.
 * @returns {Object} El nuevo usuario creado (sin la contraseña).
 */
const crearUsuario = (usuario, contrasenaHash) => {
  const nuevoUsuario = {
    id: uuidv4(),           // ID único generado automáticamente
    usuario,                // Nombre de usuario
    contrasena: contrasenaHash, // Contraseña cifrada (NUNCA texto plano)
    creadoEn: new Date(),   // Fecha de registro
  };

  usuarios.push(nuevoUsuario); // Guardamos en memoria

  // Retornamos sin la contraseña por seguridad
  const { contrasena, ...usuarioSinContrasena } = nuevoUsuario;
  return usuarioSinContrasena;
};

module.exports = { buscarPorUsuario, crearUsuario };
