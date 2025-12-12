// src/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

// Middleware para proteger rutas con JWT
const proteger = async (req, res, next) => {
  try {
    const authHeader =
      req.headers["authorization"] || req.headers["Authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        ok: false,
        mensaje: "No autorizado. Falta token en el header.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        ok: false,
        mensaje: "No autorizado. Token vacío.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET no definido en .env");
      return res.status(500).json({
        ok: false,
        mensaje: "Error de configuración del servidor (JWT_SECRET).",
      });
    }

    // Debug suave: muestra longitud del token para ver si llega "raro"
    console.log("[AUTH] Verificando token, length:", token.length);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await Usuario.findById(decoded.id).select("-password");
    if (!usuario) {
      return res.status(401).json({
        ok: false,
        mensaje: "Token inválido: el usuario ya no existe.",
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    console.error("Error en middleware proteger:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        ok: false,
        mensaje: "Token expirado. Iniciá sesión nuevamente.",
      });
    }

    return res.status(401).json({
      ok: false,
      mensaje: "Token inválido. Cerrá sesión, volvé a iniciar sesión y probá otra vez.",
    });
  }
};

module.exports = {
  proteger,
};
