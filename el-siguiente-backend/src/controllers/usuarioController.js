// src/controllers/usuarioController.js
const Usuario = require("../models/Usuario");

// (opcional) crear usuario simple desde /api/usuarios - casi no lo usamos ahora
const crearUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.create(req.body);
    return res.status(201).json({ ok: true, usuario });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al crear usuario",
    });
  }
};

// GET /api/usuarios/profesionales
const obtenerProfesionales = async (req, res) => {
  try {
    const profesionales = await Usuario.find({ rol: "profesional" }).select(
      "nombreCompleto username especialidad matricula"
    );

    return res.json({
      ok: true,
      profesionales,
    });
  } catch (error) {
    console.error("Error al obtener profesionales:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al obtener profesionales",
    });
  }
};

module.exports = {
  crearUsuario,
  obtenerProfesionales,
};
