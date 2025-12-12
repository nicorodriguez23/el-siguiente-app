// src/pages/OlvidePassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function OlvidePassword() {
  const [usuarioOEmail, setUsuarioOEmail] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!usuarioOEmail) {
      setError("Ingresá tu usuario o email.");
      return;
    }

    try {
      setCargando(true);

      const { data } = await api.post("/auth/forgot-password", {
        usernameOrEmail: usuarioOEmail,
      });

      if (data.ok) {
        setMensaje(
          data.mensaje ||
            "Si existe una cuenta asociada, enviamos un código de recuperación a ese email."
        );
      } else {
        setError(data.mensaje || "No se pudo procesar la solicitud.");
      }
    } catch (err) {
      console.error("Error en olvide contraseña:", err);
      const msg =
        err.response?.data?.mensaje ||
        "No se pudo conectar con el servidor. Intentá nuevamente.";
      setError(msg);
    } finally {
      setCargando(false);
    }
  };

  const irARestablecer = () => {
    navigate("/reset-password", { state: { usuarioOEmail } });
  };

  return (
    <section className="card">
      <h1 className="h1">Recuperar contraseña</h1>
      <p className="text-muted">
        Ingresá tu usuario o email. Si existe una cuenta asociada, te vamos a
        enviar un código para que puedas crear una contraseña nueva.
      </p>

      <form
        onSubmit={handleSubmit}
        className="form-grid"
        style={{ marginTop: "1rem" }}
      >
        <div className="form-group">
          <label htmlFor="usuarioOEmail">Usuario o email</label>
          <input
            id="usuarioOEmail"
            type="text"
            value={usuarioOEmail}
            onChange={(e) => setUsuarioOEmail(e.target.value)}
            placeholder="Ej: mario01 o correo@ejemplo.com"
          />
        </div>

        {error && (
          <p style={{ color: "#dc2626", marginTop: "0.5rem" }}>{error}</p>
        )}

        {mensaje && (
          <p style={{ color: "#16a34a", marginTop: "0.5rem" }}>{mensaje}</p>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={cargando}
          style={{ marginTop: "0.8rem" }}
        >
          {cargando ? "Enviando código..." : "Enviar código"}
        </button>

        {/* Botón para ir al siguiente paso solo si hubo mensaje de éxito */}
        {mensaje && !error && (
          <button
            type="button"
            className="btn btn-secondary"
            style={{ marginTop: "0.8rem" }}
            onClick={irARestablecer}
          >
            Ya tengo el código, restablecer contraseña
          </button>
        )}
      </form>
    </section>
  );
}
