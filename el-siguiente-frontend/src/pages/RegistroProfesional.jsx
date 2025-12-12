// src/pages/RegistroProfesional.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function RegistroProfesional({ onLogin }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombreCompleto: "",
    username: "",
    email: "",
    telefono: "",
    password: "",
    repetirPassword: "",
    especialidad: "",
    matricula: "",
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOkMsg("");

    if (!form.nombreCompleto || !form.username || !form.email) {
      setError("Completá nombre, usuario y email.");
      return;
    }

    if (!form.especialidad || !form.matricula) {
      setError("La especialidad y la matrícula son obligatorias.");
      return;
    }

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (form.password !== form.repetirPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setCargando(true);

      const payload = {
        nombreCompleto: form.nombreCompleto,
        username: form.username,
        email: form.email,
        telefono: form.telefono,
        password: form.password,
        especialidad: form.especialidad,
        matricula: form.matricula,
      };

      // 👇 Endpoint del backend para registrar PROFESIONAL
      const { data } = await api.post("/auth/register-profesional", payload);

      setOkMsg("Profesional registrado correctamente.");

      // Si nos pasan onLogin, logueamos y mandamos directo a sus turnos
      if (onLogin && data?.usuario && data?.token) {
        onLogin(data.usuario, data.token);
        // onLogin ya navega a /mis-turnos-profesional
      } else {
        // fallback: volver al login
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (err) {
      console.error("Error al registrar profesional:", err);
      const mensaje =
        err.response?.data?.mensaje ||
        "No se pudo registrar el profesional. Probá de nuevo.";
      setError(mensaje);
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="card">
      <h1 className="h1">Registro de profesional</h1>
      <p className="text-muted">
        Creá tu cuenta como profesional de la salud para administrar tu agenda
        en <strong>El Siguiente</strong>.
      </p>

      <form onSubmit={handleSubmit} className="form-grid" style={{ marginTop: "1rem" }}>
        {/* Datos básicos */}
        <div className="form-group">
          <label htmlFor="nombreCompleto">Nombre completo *</label>
          <input
            id="nombreCompleto"
            name="nombreCompleto"
            type="text"
            placeholder="Ej: Dra. Laura García"
            value={form.nombreCompleto}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Nombre de usuario *</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Ej: laura.garcia"
            value={form.username}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Ej: correo@ejemplo.com"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            placeholder="Opcional"
            value={form.telefono}
            onChange={handleChange}
          />
        </div>

        {/* Datos profesionales */}
        <div className="form-group">
          <label htmlFor="especialidad">Especialidad *</label>
          <input
            id="especialidad"
            name="especialidad"
            type="text"
            placeholder="Ej: Clínica médica, Cardiología..."
            value={form.especialidad}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="matricula">Matrícula *</label>
          <input
            id="matricula"
            name="matricula"
            type="text"
            placeholder="N° de matrícula"
            value={form.matricula}
            onChange={handleChange}
          />
        </div>

        {/* Contraseña */}
        <div className="form-group">
          <label htmlFor="password">Contraseña *</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="repetirPassword">Repetir contraseña *</label>
          <input
            id="repetirPassword"
            name="repetirPassword"
            type="password"
            placeholder="Repetí la contraseña"
            value={form.repetirPassword}
            onChange={handleChange}
          />
        </div>

        {/* Mensajes */}
        {error && (
          <p style={{ color: "#dc2626", marginTop: "0.5rem" }}>
            {error}
          </p>
        )}
        {okMsg && (
          <p style={{ color: "#16a34a", marginTop: "0.5rem" }}>
            {okMsg}
          </p>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={cargando}
          style={{ marginTop: "0.8rem" }}
        >
          {cargando ? "Registrando..." : "Registrarme como profesional"}
        </button>

        <p className="text-muted" style={{ marginTop: "0.5rem" }}>
          ¿Ya tenés cuenta?{" "}
          <Link to="/login">
            Iniciá sesión
          </Link>
        </p>
      </form>
    </section>
  );
}
