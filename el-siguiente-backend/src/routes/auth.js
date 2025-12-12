// src/routes/auth.js
const express = require("express");
const {
  registrarPaciente,
  registrarProfesional,
  login,
  obtenerPerfil,
  solicitarResetPassword,
  resetPassword,
} = require("../controllers/authController");
const { proteger } = require("../middlewares/authMiddleware");

const router = express.Router();

// Registro público de pacientes
router.post("/register", registrarPaciente);

// Registro de profesionales (para demo/portfolio, público; en prod debería ser admin)
router.post("/register-profesional", registrarProfesional);

// Login
router.post("/login", login);

// Recuperación de contraseña
router.post("/forgot-password", solicitarResetPassword);
router.post("/reset-password", resetPassword);

// Perfil del usuario logueado
router.get("/me", proteger, obtenerPerfil);

module.exports = router;
