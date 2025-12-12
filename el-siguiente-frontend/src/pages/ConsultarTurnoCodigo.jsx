import { useState } from "react";
import api from "../services/api";

const formatearFecha = (isoString) => {
  if (!isoString) return "";
  return new Date(isoString).toLocaleString("es-AR", {
    dateStyle: "full",
    timeStyle: "short",
  });
};

export default function ConsultarTurnoCodigo() {
  const [codigo, setCodigo] = useState("");
  const [turno, setTurno] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setTurno(null);

    if (!codigo.trim()) {
      setError("Por favor escribí el código de tu turno.");
      return;
    }

    try {
      setCargando(true);
      const { data } = await api.get(`/turnos/codigo/${codigo.trim()}`);

      if (data.ok && data.turno) {
        setTurno(data.turno);
      } else {
        setError(data.mensaje || "No se encontró un turno con ese código.");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        setError("No se encontró un turno con ese código.");
      } else if (err.response?.data?.mensaje) {
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
      <h1 className="h1">Consultar código de turno</h1>
      <p className="text-muted">
        Escribí el código que recibiste al sacar el turno. No necesitás
        usuario ni contraseña para consultar.
      </p>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Código de reserva *</label>
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            placeholder="Ej: 1234AB"
            maxLength={8}
          />
        </div>

        {error && (
          <div style={{ color: "red", fontSize: "0.95rem" }}>{error}</div>
        )}

        <button className="btn btn-primary" type="submit" disabled={cargando}>
          {cargando ? "Buscando..." : "Buscar turno"}
        </button>
      </form>

      {turno && (
        <div className="card" style={{ marginTop: "1.5rem" }}>
          <h2 className="card-title">Turno encontrado ✅</h2>
          <p>
            <strong>Código:</strong> {turno.codigoReserva}
          </p>
          <p>
            <strong>Paciente:</strong>{" "}
            {turno.paciente?.nombreCompleto || "No disponible"}
          </p>
          <p>
            <strong>Profesional:</strong>{" "}
            {turno.profesional?.nombreCompleto || "No disponible"}
          </p>
          <p>
            <strong>Especialidad:</strong>{" "}
            {turno.profesional?.especialidad || "No informada"}
          </p>
          <p>
            <strong>Matrícula:</strong>{" "}
            {turno.profesional?.matricula || "No informada"}
          </p>
          <p>
            <strong>Fecha y hora:</strong> {formatearFecha(turno.fecha)}
          </p>
          <p>
            <strong>Medio:</strong> {turno.medio}
          </p>
          <p>
            <strong>Estado:</strong>{" "}
            {turno.estado === "cancelado" ? "Cancelado" : "Activo"}
          </p>
          <p className="text-muted" style={{ marginTop: "0.5rem" }}>
            Si tenés dudas o no podés asistir, comunicate con el centro médico
            para reprogramar o cancelar tu turno.
          </p>
        </div>
      )}
    </div>
  );
}
