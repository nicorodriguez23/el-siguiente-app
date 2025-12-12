// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    usuarioOEmail: "",
    password: "",
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.usuarioOEmail || !form.password) {
      setError("Completá usuario/email y contraseña.");
      return;
    }

    try {
      setCargando(true);

      const payload = {
        usernameOrEmail: form.usuarioOEmail,
        password: form.password,
      };

      const { data } = await api.post("/auth/login", payload);

      if (onLogin && data?.usuario && data?.token) {
        onLogin(data.usuario, data.token);
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Error en login:", err);
      const mensaje =
        err.response?.data?.mensaje || "No se pudo iniciar sesión.";
      setError(mensaje);
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="card">
      <h1 className="h1">Iniciar sesión</h1>
      <p className="text-muted">
        Ingresá con tu usuario o email y tu contraseña para usar{" "}
        <strong>El Siguiente</strong>.
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
            name="usuarioOEmail"
            type="text"
            placeholder="Ej: mario01 o correo@ejemplo.com"
            value={form.usuarioOEmail}
            onChange={handleChange}
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Tu contraseña"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
        </div>

        {error && (
          <p style={{ color: "#dc2626", marginTop: "0.5rem" }}>{error}</p>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={cargando}
          style={{ marginTop: "0.8rem" }}
        >
          {cargando ? "Ingresando..." : "Iniciar sesión"}
        </button>

        <p className="text-muted" style={{ marginTop: "0.5rem" }}>
          ¿Olvidaste tu contraseña?{" "}
          <Link to="/olvide-password">Recuperarla</Link>
        </p>

        <p className="text-muted" style={{ marginTop: "0.5rem" }}>
          ¿Todavía no tenés cuenta?{" "}
          <Link to="/registro">Registrarme</Link>
        </p>
      </form>
    </section>
  );
}
