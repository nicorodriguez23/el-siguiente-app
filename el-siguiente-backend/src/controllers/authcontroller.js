// src/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const { enviarEmail } = require("../helpers/enviarEmail");

// Usamos la variable de entorno si existe, y un valor de respaldo para desarrollo
const JWT_SECRET =
  process.env.JWT_SECRET || "el-siguiente-super-secreto-dev";

const generarToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario._id,
      rol: usuario.rol,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Función auxiliar para buscar usuario por username o email
const buscarUsuarioPorUsernameOEmail = async (usernameOrEmail) => {
  const identificador = usernameOrEmail.toLowerCase();
  return Usuario.findOne({
    $or: [{ email: identificador }, { username: identificador }],
  });
};

// POST /api/auth/register  -> registra PACIENTE
const registrarPaciente = async (req, res) => {
  try {
    const { nombreCompleto, username, email, telefono, password } = req.body;

    if (!nombreCompleto || !username || !email || !password) {
      return res.status(400).json({
        ok: false,
        mensaje:
          "nombreCompleto, username, email y password son obligatorios",
      });
    }

    const usernameLower = username.toLowerCase();
    const emailLower = email.toLowerCase();

    const usuarioExistente = await Usuario.findOne({
      $or: [{ username: usernameLower }, { email: emailLower }],
    });

    if (usuarioExistente) {
      return res.status(400).json({
        ok: false,
        mensaje: "Ya existe un usuario con ese username o email",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHasheada = await bcrypt.hash(password, salt);

    const nuevoUsuario = await Usuario.create({
      nombreCompleto,
      username: usernameLower,
      email: emailLower,
      telefono,
      password: passwordHasheada,
      rol: "paciente",
    });

    const token = generarToken(nuevoUsuario);
    const usuarioSinPassword = nuevoUsuario.toObject();
    delete usuarioSinPassword.password;

    return res.status(201).json({
      ok: true,
      mensaje: "Paciente registrado correctamente",
      usuario: usuarioSinPassword,
      token,
    });
  } catch (error) {
    console.error("Error al registrar paciente:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al registrar paciente",
    });
  }
};

// POST /api/auth/register-profesional  -> registra PROFESIONAL
const registrarProfesional = async (req, res) => {
  try {
    const {
      nombreCompleto,
      username,
      email,
      telefono,
      password,
      especialidad,
      matricula,
    } = req.body;

    if (
      !nombreCompleto ||
      !username ||
      !email ||
      !password ||
      !especialidad ||
      !matricula
    ) {
      return res.status(400).json({
        ok: false,
        mensaje:
          "nombreCompleto, username, email, password, especialidad y matricula son obligatorios",
      });
    }

    const usernameLower = username.toLowerCase();
    const emailLower = email.toLowerCase();

    const usuarioExistente = await Usuario.findOne({
      $or: [{ username: usernameLower }, { email: emailLower }],
    });

    if (usuarioExistente) {
      return res.status(400).json({
        ok: false,
        mensaje: "Ya existe un usuario con ese username o email",
      });
    }

    const matriculaExistente = await Usuario.findOne({ matricula });
    if (matriculaExistente) {
      return res.status(400).json({
        ok: false,
        mensaje: "Ya existe un profesional registrado con esa matrícula",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHasheada = await bcrypt.hash(password, salt);

    const nuevoUsuario = await Usuario.create({
      nombreCompleto,
      username: usernameLower,
      email: emailLower,
      telefono,
      password: passwordHasheada,
      rol: "profesional",
      especialidad,
      matricula,
    });

    const token = generarToken(nuevoUsuario);
    const usuarioSinPassword = nuevoUsuario.toObject();
    delete usuarioSinPassword.password;

    return res.status(201).json({
      ok: true,
      mensaje: "Profesional registrado correctamente",
      usuario: usuarioSinPassword,
      token,
    });
  } catch (error) {
    console.error("Error al registrar profesional:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al registrar profesional",
    });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({
        ok: false,
        mensaje: "usernameOrEmail y password son obligatorios",
      });
    }

    const usuario = await buscarUsuarioPorUsernameOEmail(usernameOrEmail);

    if (!usuario || !usuario.password) {
      return res.status(400).json({
        ok: false,
        mensaje: "Credenciales inválidas",
      });
    }

    const esPasswordValida = await bcrypt.compare(password, usuario.password);
    if (!esPasswordValida) {
      return res.status(400).json({
        ok: false,
        mensaje: "Credenciales inválidas",
      });
    }

    const token = generarToken(usuario);
    const usuarioSinPassword = usuario.toObject();
    delete usuarioSinPassword.password;

    return res.json({
      ok: true,
      mensaje: "Login correcto",
      usuario: usuarioSinPassword,
      token,
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno en login",
    });
  }
};

// POST /api/auth/forgot-password
const solicitarResetPassword = async (req, res) => {
  try {
    const { usernameOrEmail } = req.body;

    if (!usernameOrEmail) {
      return res.status(400).json({
        ok: false,
        mensaje: "usernameOrEmail es obligatorio",
      });
    }

    const usuario = await buscarUsuarioPorUsernameOEmail(usernameOrEmail);

    // Mensaje genérico, para no revelar si el usuario existe o no
    const mensajeGenerico =
      "Si existe una cuenta asociada, enviamos un código de recuperación a ese email.";

    if (!usuario) {
      // No revelamos nada, pero devolvemos 200 igualmente
      return res.json({
        ok: true,
        mensaje: mensajeGenerico,
      });
    }

    // Código de 6 dígitos
    const codigo = String(Math.floor(100000 + Math.random() * 900000));
    const expiracion = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos

    usuario.resetPasswordCode = codigo;
    usuario.resetPasswordExpiresAt = expiracion;
    await usuario.save();

    // Log para entorno de desarrollo / demo
    console.log(
      `Código de recuperación para ${usuario.email}: ${codigo} (válido 30 min)`
    );

    // Intentamos enviar email, pero NO rompemos la app si falla
    try {
      await enviarEmail({
        to: usuario.email,
        subject: "Recuperación de contraseña - El Siguiente",
        text: `Hola ${usuario.nombreCompleto}, tu código para recuperar la contraseña es ${codigo}. Tiene una validez de 30 minutos.`,
        html: `
          <p>Hola ${usuario.nombreCompleto},</p>
          <p>Tu código para recuperar la contraseña es:</p>
          <p style="font-size: 22px; font-weight: bold;">${codigo}</p>
          <p>Este código es válido por 30 minutos.</p>
          <p>Si no solicitaste este cambio, podés ignorar este mensaje.</p>
        `,
      });
    } catch (errEmail) {
      console.error("Error al enviar email de recuperación:", errEmail);
      // En modo portfolio no devolvemos 500, solo registramos el error
    }

    return res.json({
      ok: true,
      mensaje: mensajeGenerico,
    });
  } catch (error) {
    console.error("Error en solicitarResetPassword:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al solicitar recuperación de contraseña",
    });
  }
};

// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { usernameOrEmail, code, newPassword } = req.body;

    if (!usernameOrEmail || !code || !newPassword) {
      return res.status(400).json({
        ok: false,
        mensaje: "usernameOrEmail, code y newPassword son obligatorios",
      });
    }

    const usuario = await buscarUsuarioPorUsernameOEmail(usernameOrEmail);

    if (
      !usuario ||
      !usuario.resetPasswordCode ||
      !usuario.resetPasswordExpiresAt
    ) {
      return res.status(400).json({
        ok: false,
        mensaje: "Código inválido o inexistente",
      });
    }

    const ahora = new Date();

    if (usuario.resetPasswordCode !== String(code)) {
      return res.status(400).json({
        ok: false,
        mensaje: "El código ingresado no es correcto",
      });
    }

    if (usuario.resetPasswordExpiresAt < ahora) {
      return res.status(400).json({
        ok: false,
        mensaje: "El código ha expirado, solicitá uno nuevo",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHasheada = await bcrypt.hash(newPassword, salt);

    usuario.password = passwordHasheada;
    usuario.resetPasswordCode = null;
    usuario.resetPasswordExpiresAt = null;

    await usuario.save();

    return res.json({
      ok: true,
      mensaje: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    console.error("Error en resetPassword:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al restablecer contraseña",
    });
  }
};

// GET /api/auth/me
const obtenerPerfil = async (req, res) => {
  try {
    return res.json({
      ok: true,
      usuario: req.usuario,
    });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al obtener perfil",
    });
  }
};

module.exports = {
  registrarPaciente,
  registrarProfesional,
  login,
  obtenerPerfil,
  solicitarResetPassword,
  resetPassword,
};
