// src/pages/RegistroPaciente.jsx
import { useState } from "react";
import api from "../services/api";

export default function RegistroPaciente({ onLogin }) {
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [mensajeOk, setMensajeOk] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensajeOk("");

    if (!nombreCompleto || !username || !email || !password) {
      setError("Por favor completá los campos obligatorios.");
      return;
    }

    try {
      setCargando(true);
      const body = {
        nombreCompleto,
        username,
        email,
        telefono,
        password,
      };

      const { data } = await api.post("/auth/register", body);

      if (data.ok) {
        setMensajeOk("Te registraste correctamente. Entrando a la app...");
        // Llamamos a onLogin para guardar usuario + token en el estado global
        if (onLogin) {
          onLogin(data.usuario, data.token);
        }
      } else {
        setError(data.mensaje || "Ocurrió un error al registrarte.");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.mensaje) {
        setError(err.response.data.mensaje);
      } else {
        setError("No se pudo conectar con el servidor.");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="card">
      <h1 className="h1">Registrarme como paciente</h1>
      <p className="text-muted">
        Completá estos datos para crear tu usuario y poder pedir turnos.
      </p>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre y apellido *</label>
          <input
            type="text"
            value={nombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}
            placeholder="Tu nombre completo"
          />
        </div>

        <div className="form-group">
          <label>Nombre de usuario *</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ej: paciente1"
          />
        </div>

        <div className="form-group">
          <label>Correo electrónico *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com"
          />
        </div>

        <div className="form-group">
          <label>Teléfono (opcional)</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Tu teléfono"
          />
        </div>

        <div className="form-group">
          <label>Contraseña *</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Elegí una contraseña"
          />
        </div>

        {error && (
          <div style={{ color: "red", fontSize: "0.95rem" }}>{error}</div>
        )}

        {mensajeOk && (
          <div style={{ color: "green", fontSize: "0.95rem" }}>{mensajeOk}</div>
        )}

        <button className="btn btn-primary" type="submit" disabled={cargando}>
          {cargando ? "Registrando..." : "Crear mi cuenta"}
        </button>
      </form>
    </div>
  );
}
