// src/controllers/turnoController.js
const Turno = require("../models/Turno");
const Usuario = require("../models/Usuario");
const generarCodigoReserva = require("../helpers/generarCodigoReserva");

// POST /api/turnos
const crearTurno = async (req, res) => {
  try {
    const { pacienteId, profesionalId, fecha, motivo, medio } = req.body;

    console.log("📩 Body recibido en /api/turnos:", req.body);

    // 1) Validar datos mínimos
    if (!pacienteId || !profesionalId || !fecha) {
      return res.status(400).json({
        ok: false,
        mensaje:
          "pacienteId, profesionalId y fecha son obligatorios para crear el turno.",
      });
    }

    // 2) Buscar paciente
    const paciente = await Usuario.findById(pacienteId);
    if (!paciente) {
      return res
        .status(404)
        .json({ ok: false, mensaje: "Paciente no encontrado" });
    }

    // 3) Buscar profesional
    const profesional = await Usuario.findById(profesionalId);
    if (!profesional || profesional.rol !== "profesional") {
      return res.status(404).json({
        ok: false,
        mensaje: "Profesional no encontrado o no tiene rol profesional",
      });
    }

    // 4) Generar código de reserva único
    let codigoReserva;
    let existeCodigo = true;

    while (existeCodigo) {
      codigoReserva = generarCodigoReserva();
      const turnoConMismoCodigo = await Turno.findOne({ codigoReserva });
      if (!turnoConMismoCodigo) {
        existeCodigo = false;
      }
    }

    // 5) Crear turno
    const nuevoTurno = await Turno.create({
      paciente: paciente._id,
      profesional: profesional._id,
      fecha,
      motivo,
      medio,
      codigoReserva,
    });

    const turnoPopulado = await nuevoTurno.populate([
      { path: "paciente", select: "nombreCompleto username email" },
      {
        path: "profesional",
        select: "nombreCompleto username especialidad matricula",
      },
    ]);

    return res.status(201).json({
      ok: true,
      mensaje: "Turno creado correctamente",
      turno: turnoPopulado,
    });
  } catch (error) {
    console.error("Error al crear turno:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al crear turno",
    });
  }
};

// GET /api/turnos/paciente/:pacienteId
const obtenerTurnosPorPaciente = async (req, res) => {
  try {
    const { pacienteId } = req.params;

    const turnos = await Turno.find({ paciente: pacienteId })
      .populate([
        { path: "paciente", select: "nombreCompleto username email" },
        {
          path: "profesional",
          select: "nombreCompleto username especialidad matricula",
        },
      ])
      .sort({ fecha: 1 });

    return res.json({
      ok: true,
      total: turnos.length,
      turnos,
    });
  } catch (error) {
    console.error("Error al obtener turnos por paciente:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al obtener turnos del paciente",
    });
  }
};

// GET /api/turnos/mis-turnos  (paciente logueado)
const obtenerTurnosPacienteLogueado = async (req, res) => {
  try {
    const pacienteId = req.usuario._id;

    const turnos = await Turno.find({ paciente: pacienteId })
      .populate([
        { path: "paciente", select: "nombreCompleto username email" },
        {
          path: "profesional",
          select: "nombreCompleto username especialidad matricula",
        },
      ])
      .sort({ fecha: 1 });

    return res.json({
      ok: true,
      total: turnos.length,
      turnos,
    });
  } catch (error) {
    console.error("Error al obtener mis turnos:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al obtener mis turnos",
    });
  }
};

// GET /api/turnos/mis-turnos-profesional  (profesional logueado)
const obtenerTurnosProfesionalLogueado = async (req, res) => {
  try {
    const profesionalId = req.usuario._id;

    const turnos = await Turno.find({ profesional: profesionalId })
      .populate([
        { path: "paciente", select: "nombreCompleto username email" },
        {
          path: "profesional",
          select: "nombreCompleto username especialidad matricula",
        },
      ])
      .sort({ fecha: 1 });

    return res.json({
      ok: true,
      total: turnos.length,
      turnos,
    });
  } catch (error) {
    console.error("Error al obtener turnos del profesional:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al obtener turnos del profesional",
    });
  }
};

// GET /api/turnos/profesional/:profesionalId
const obtenerTurnosPorProfesional = async (req, res) => {
  try {
    const { profesionalId } = req.params;

    const turnos = await Turno.find({ profesional: profesionalId })
      .populate([
        { path: "paciente", select: "nombreCompleto username email" },
        {
          path: "profesional",
          select: "nombreCompleto username especialidad matricula",
        },
      ])
      .sort({ fecha: 1 });

    return res.json({
      ok: true,
      total: turnos.length,
      turnos,
    });
  } catch (error) {
    console.error("Error al obtener turnos por profesional:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al obtener turnos del profesional",
    });
  }
};

// GET /api/turnos/codigo/:codigoReserva
const obtenerTurnoPorCodigo = async (req, res) => {
  try {
    const { codigoReserva } = req.params;

    const turno = await Turno.findOne({ codigoReserva }).populate([
      { path: "paciente", select: "nombreCompleto username email" },
      {
        path: "profesional",
        select: "nombreCompleto username especialidad matricula",
      },
    ]);

    if (!turno) {
      return res
        .status(404)
        .json({ ok: false, mensaje: "No se encontró turno con ese código" });
    }

    return res.json({
      ok: true,
      turno,
    });
  } catch (error) {
    console.error("Error al obtener turno por código:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al obtener turno por código",
    });
  }
};

// PATCH /api/turnos/:id/cancelar
const cancelarTurno = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivoCancelacion } = req.body || {};

    const turno = await Turno.findById(id);

    if (!turno) {
      return res
        .status(404)
        .json({ ok: false, mensaje: "Turno no encontrado" });
    }

    if (turno.estado === "cancelado") {
      return res.status(400).json({
        ok: false,
        mensaje: "El turno ya estaba cancelado",
      });
    }

    // Permitimos cancelar siempre, sin límite de 48 hs
    turno.estado = "cancelado";

    // Guardamos el motivo si viene (si tu esquema no lo tiene, simplemente se ignora)
    if (motivoCancelacion) {
      turno.motivoCancelacion = motivoCancelacion;
    }

    await turno.save();

    const turnoPopulado = await turno.populate([
      { path: "paciente", select: "nombreCompleto username email" },
      {
        path: "profesional",
        select: "nombreCompleto username especialidad matricula",
      },
    ]);

    return res.json({
      ok: true,
      mensaje: "Turno cancelado correctamente",
      turno: turnoPopulado,
    });
  } catch (error) {
    console.error("Error al cancelar turno:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al cancelar turno",
    });
  }
};

module.exports = {
  crearTurno,
  obtenerTurnosPorPaciente,
  obtenerTurnosPacienteLogueado,
  obtenerTurnosProfesionalLogueado,
  obtenerTurnosPorProfesional,
  obtenerTurnoPorCodigo,
  cancelarTurno,
};
