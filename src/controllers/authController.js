/**
 * ============================================================
 * CONTROLADOR DE AUTENTICACIÓN
 * Archivo: controllers/authController.js
 * ============================================================
 * Descripción: Contiene la lógica de negocio para el registro
 * y el inicio de sesión de usuarios.
 * ============================================================
 */

const bcrypt = require('bcryptjs');       // Librería para cifrar contraseñas
const jwt = require('jsonwebtoken');       // Librería para generar tokens JWT
const { buscarPorUsuario, crearUsuario } = require('../models/usuarioModel');

// Clave secreta para firmar los tokens JWT
// ⚠️ En producción, esto debe estar en una variable de entorno (.env)
const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta_2024';

// Número de "rondas" de cifrado para bcrypt (mayor = más seguro pero más lento)
const SALT_ROUNDS = 10;

// ─── REGISTRO ────────────────────────────────────────────────────────────────

/**
 * Controlador: Registrar un nuevo usuario.
 *
 * Método HTTP esperado: POST
 * Cuerpo esperado: { "usuario": "string", "contrasena": "string" }
 *
 * Flujo:
 * 1. Validar que se enviaron usuario y contraseña.
 * 2. Verificar que el usuario no exista previamente.
 * 3. Cifrar la contraseña con bcrypt.
 * 4. Guardar el nuevo usuario.
 * 5. Retornar respuesta de éxito.
 */
const registrar = async (req, res) => {
  try {
    // Extraemos los datos del cuerpo de la solicitud
    const { usuario, contrasena } = req.body;

    // ── Validación: campos obligatorios ──────────────────────────────────────
    if (!usuario || !contrasena) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Los campos "usuario" y "contrasena" son obligatorios.',
      });
    }

    // ── Validación: longitud mínima de contraseña ─────────────────────────────
    if (contrasena.length < 6) {
      return res.status(400).json({
        exito: false,
        mensaje: 'La contraseña debe tener al menos 6 caracteres.',
      });
    }

    // ── Verificar que el usuario no exista ya ─────────────────────────────────
    const usuarioExistente = buscarPorUsuario(usuario);
    if (usuarioExistente) {
      return res.status(409).json({
        exito: false,
        mensaje: 'El nombre de usuario ya está en uso. Elija otro.',
      });
    }

    // ── Cifrar la contraseña antes de guardar ─────────────────────────────────
    // bcrypt genera un hash único cada vez (nunca guardamos texto plano)
    const contrasenaHash = await bcrypt.hash(contrasena, SALT_ROUNDS);

    // ── Crear el usuario en la base de datos ──────────────────────────────────
    const nuevoUsuario = crearUsuario(usuario, contrasenaHash);

    // ── Respuesta de éxito ────────────────────────────────────────────────────
    return res.status(201).json({
      exito: true,
      mensaje: 'Usuario registrado exitosamente.',
      datos: nuevoUsuario,
    });

  } catch (error) {
    // Capturamos cualquier error inesperado del servidor
    console.error('Error en registro:', error.message);
    return res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor.',
    });
  }
};

// ─── INICIO DE SESIÓN ─────────────────────────────────────────────────────────

/**
 * Controlador: Iniciar sesión de un usuario.
 *
 * Método HTTP esperado: POST
 * Cuerpo esperado: { "usuario": "string", "contrasena": "string" }
 *
 * Flujo:
 * 1. Validar que se enviaron usuario y contraseña.
 * 2. Buscar el usuario en la base de datos.
 * 3. Comparar la contraseña ingresada con el hash guardado.
 * 4. Si es correcta: generar y retornar un token JWT.
 * 5. Si es incorrecta: retornar error de autenticación.
 */
const iniciarSesion = async (req, res) => {
  try {
    // Extraemos los datos del cuerpo de la solicitud
    const { usuario, contrasena } = req.body;

    // ── Validación: campos obligatorios ──────────────────────────────────────
    if (!usuario || !contrasena) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Los campos "usuario" y "contrasena" son obligatorios.',
      });
    }

    // ── Buscar el usuario en la base de datos ─────────────────────────────────
    const usuarioEncontrado = buscarPorUsuario(usuario);

    // Si el usuario no existe, retornamos error genérico (por seguridad
    // no revelamos si fue el usuario o la contraseña lo incorrecto)
    if (!usuarioEncontrado) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Error en la autenticación: usuario o contraseña incorrectos.',
      });
    }

    // ── Comparar la contraseña con el hash almacenado ─────────────────────────
    // bcrypt.compare compara texto plano con el hash de forma segura
    const contrasenaValida = await bcrypt.compare(contrasena, usuarioEncontrado.contrasena);

    if (!contrasenaValida) {
      // Las credenciales no coinciden → autenticación fallida
      return res.status(401).json({
        exito: false,
        mensaje: 'Error en la autenticación: usuario o contraseña incorrectos.',
      });
    }

    // ── Autenticación exitosa: generar token JWT ───────────────────────────────
    // El token contiene el ID y usuario, expira en 2 horas
    const token = jwt.sign(
      { id: usuarioEncontrado.id, usuario: usuarioEncontrado.usuario },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    // ── Respuesta de éxito ────────────────────────────────────────────────────
    return res.status(200).json({
      exito: true,
      mensaje: 'Autenticación satisfactoria.',
      token,                              // Token para solicitudes futuras
      usuario: usuarioEncontrado.usuario, // Nombre del usuario autenticado
    });

  } catch (error) {
    // Capturamos cualquier error inesperado del servidor
    console.error('Error en inicio de sesión:', error.message);
    return res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor.',
    });
  }
};

module.exports = { registrar, iniciarSesion };
