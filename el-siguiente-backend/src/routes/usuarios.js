// src/routes/usuarios.js
const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

// Crear usuario básico (opcional, para pruebas)
router.post("/", usuarioController.crearUsuario);

// Listar profesionales
router.get("/profesionales", usuarioController.obtenerProfesionales);

module.exports = router;
