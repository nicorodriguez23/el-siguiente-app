// src/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const usuarioRoutes = require("./routes/usuarios");
const turnoRoutes = require("./routes/turnos");
const authRoutes = require("./routes/auth");

dotenv.config();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB correctamente");
  })
  .catch((error) => {
    console.error("❌ Error al conectar a MongoDB:", error.message);
  });

// Healthcheck
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "El Siguiente API funcionando ✅" });
});

// Rutas con prefijo /api
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/turnos", turnoRoutes);

// Levantar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor El Siguiente escuchando en el puerto ${PORT}`);
});
