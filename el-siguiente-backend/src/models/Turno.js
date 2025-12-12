// src/models/Turno.js
const { Schema, model } = require("mongoose");

const turnoSchema = new Schema(
  {
    paciente: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    profesional: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    fecha: {
      type: Date,
      required: true,
    },
    estado: {
      type: String,
      enum: ["pendiente", "atendido", "cancelado"],
      default: "pendiente",
    },
    motivo: {
      type: String,
      trim: true,
    },
    codigoReserva: {
      type: String,
      required: true,
      unique: true, // no queremos dos turnos con el mismo código
    },
    medio: {
      type: String,
      enum: ["presencial", "online"],
      default: "presencial",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Turno", turnoSchema);
