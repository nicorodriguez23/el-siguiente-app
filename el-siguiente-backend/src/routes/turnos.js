// src/routes/turnos.js
const express = require("express");
const {
  crearTurno,
  obtenerTurnosPorPaciente,
  obtenerTurnosPacienteLogueado,
  obtenerTurnosProfesionalLogueado,
  obtenerTurnosPorProfesional,
  obtenerTurnoPorCodigo,
  cancelarTurno,
} = require("../controllers/turnoController");

const { proteger } = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * POST /api/turnos
 * Crear turno
 * (para simplificar demo: se usa pacienteId enviado en el body)
 */
router.post("/", crearTurno);

/**
 * GET /api/turnos/mis-turnos
 * (NO lo vamos a usar desde el frontend, pero lo dejamos igual)
 */
router.get("/mis-turnos", proteger, obtenerTurnosPacienteLogueado);

/**
 * GET /api/turnos/mis-turnos-profesional
 * (NO lo vamos a usar desde el frontend, pero lo dejamos igual)
 */
router.get(
  "/mis-turnos-profesional",
  proteger,
  obtenerTurnosProfesionalLogueado
);

/**
 * GET /api/turnos/paciente/:pacienteId
 * Turnos por paciente (SIN token, lo usamos desde el frontend)
 */
router.get("/paciente/:pacienteId", obtenerTurnosPorPaciente);

/**
 * GET /api/turnos/profesional/:profesionalId
 * Turnos por profesional (SIN token, lo usamos desde el frontend)
 */
router.get("/profesional/:profesionalId", obtenerTurnosPorProfesional);

/**
 * GET /api/turnos/codigo/:codigoReserva
 * Buscar un turno por código de reserva (público, sin login)
 */
router.get("/codigo/:codigoReserva", obtenerTurnoPorCodigo);

/**
 * PATCH /api/turnos/:id/cancelar
 * Cancelar turno (SIN token, para no tener más problemas de 401)
 */
router.patch("/:id/cancelar", cancelarTurno);

module.exports = router;
