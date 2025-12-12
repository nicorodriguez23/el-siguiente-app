// src/models/Usuario.js
const { Schema, model } = require("mongoose");

const usuarioSchema = new Schema(
  {
    nombreCompleto: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      // se completa para los que se registran por /auth
    },
    telefono: {
      type: String,
    },
    rol: {
      type: String,
      enum: ["paciente", "profesional", "admin"],
      default: "paciente",
    },
    especialidad: {
      type: String, // solo si es profesional
      trim: true,
    },
    matricula: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // permite que los pacientes no tengan matrícula
    },

    // -------- Recuperación de contraseña --------
    resetPasswordCode: {
      type: String,
      default: null,
    },
    resetPasswordExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Usuario", usuarioSchema);
