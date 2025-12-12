// src/pages/ResetPassword.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [usuarioOEmail, setUsuarioOEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (location.state?.usuarioOEmail) {
      setUsuarioOEmail(location.state.usuarioOEmail);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!usuarioOEmail || !codigo || !password || !password2) {
      setError("Completá todos los campos.");
      return;
    }

    if (password !== password2) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setCargando(true);

      // Endpoint esperado en backend:
      // POST /auth/reset-password { usernameOrEmail, code, newPassword }
      const { data } = await api.post("/auth/reset-password", {
        usernameOrEmail: usuarioOEmail,
        code: codigo,
        newPassword: password,
      });

      if (data.ok) {
        setMensaje("Contraseña actualizada correctamente. Ya podés iniciar sesión.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.mensaje || "No se pudo actualizar la contraseña.");
      }
    } catch (err) {
      console.error("Error en reset password:", err);
      const msg =
        err.response?.data?.mensaje ||
        "No se pudo conectar con el servidor. Intentá nuevamente.";
      setError(msg);
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="card">
      <h1 className="h1">Crear nueva contraseña</h1>
      <p className="text-muted">
        Ingresá el código que te enviamos por email junto con tu nueva
        contraseña.
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

        <div className="form-group">
          <label htmlFor="codigo">Código de verificación</label>
          <input
            id="codigo"
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Ej: 123456"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Nueva contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password2">Repetir contraseña</label>
          <input
            id="password2"
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
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
          {cargando ? "Actualizando..." : "Actualizar contraseña"}
        </button>
      </form>
    </section>
  );
}
