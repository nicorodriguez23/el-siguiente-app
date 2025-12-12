// src/pages/MisTurnosProfesional.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { LS_USER_KEY, LS_TOKEN_KEY } from "../services/api";

export default function MisTurnosProfesional({ usuario }) {
  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const cargarTurnos = async () => {
      try {
        setCargando(true);
        setError("");

        // 1) Verificamos token
        const token = localStorage.getItem(LS_TOKEN_KEY);
        if (!token) {
          navigate("/login");
          return;
        }

        // 2) Obtenemos usuario efectivo (prop o localStorage)
        let usuarioEfectivo = usuario;
        if (!usuarioEfectivo) {
          const storedUser = localStorage.getItem(LS_USER_KEY);
          if (storedUser) {
            try {
              usuarioEfectivo = JSON.parse(storedUser);
            } catch (err) {
              console.error("Error al parsear usuario desde LS:", err);
            }
          }
        }

        // 3) Validamos rol profesional
        if (!usuarioEfectivo || usuarioEfectivo.rol !== "profesional") {
          navigate("/login");
          return;
        }

        // 4) Traemos turnos del profesional
        const { data } = await api.get(
          `/turnos/profesional/${usuarioEfectivo._id}`
        );

        if (data.ok) {
          setTurnos(data.turnos || []);
        } else {
          setError(data.mensaje || "No se pudieron cargar tus turnos.");
        }
      } catch (err) {
        console.error("Error al cargar turnos del profesional:", err);
        setError("No se pudo conectar con el servidor.");
      } finally {
        setCargando(false);
      }
    };

    cargarTurnos();
  }, [usuario, navigate]);

  const handleCancelar = async (turnoId) => {
    const confirma = window.confirm(
      "¿Estás seguro de que querés cancelar este turno? Esta acción no se puede deshacer."
    );
    if (!confirma) return;

    try {
      const { data } = await api.patch(`/turnos/${turnoId}/cancelar`);

      if (data.ok) {
        setTurnos((prev) =>
          prev.map((t) => (t._id === turnoId ? data.turno : t))
        );
      } else {
        alert(data.mensaje || "No se pudo cancelar el turno.");
      }
    } catch (err) {
      console.error("Error al cancelar turno (profesional):", err);
      alert("Ocurrió un error al cancelar el turno.");
    }
  };

  return (
    <section className="card">
      <h1 className="h1">Mis turnos (profesional)</h1>
      <p className="text-muted">
        Acá vas a ver todos los turnos agendados con vos. Podés revisar el
        detalle de cada paciente y organizar tu día.
      </p>

      <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
        <strong>Importante:</strong> una vez que canceles un turno, la acción no
        se puede deshacer.
      </p>

      {cargando && <p>Cargando agenda...</p>}

      {!cargando && error && (
        <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>
      )}

      {!cargando && !error && turnos.length === 0 && (
        <p className="text-muted" style={{ marginTop: "1rem" }}>
          Todavía no tenés turnos agendados.
        </p>
      )}

      {!cargando &&
        !error &&
        turnos.map((turno) => (
          <div
            key={turno._id}
            className="card"
            style={{ marginTop: "1.2rem", borderLeft: "4px solid #4f46e5" }}
          >
            <h2 className="h2">
              Paciente: {turno.paciente?.nombreCompleto || "Paciente"}
            </h2>
            <p className="text-muted">
              Usuario: {turno.paciente?.username || "-"} ·{" "}
              {turno.paciente?.email || "Sin mail"}
            </p>

            <p>
              <strong>Fecha y hora:</strong>{" "}
              {new Date(turno.fecha).toLocaleString("es-AR", {
                dateStyle: "full",
                timeStyle: "short",
              })}
            </p>
            <p>
              <strong>Motivo:</strong> {turno.motivo}
            </p>
            <p>
              <strong>Medio:</strong> {turno.medio}
            </p>
            <p>
              <strong>Código de reserva:</strong>{" "}
              <span
                style={{
                  display: "inline-block",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "999px",
                  backgroundColor: "#111827",
                  color: "#fff",
                  fontFamily: "monospace",
                  fontSize: "0.9rem",
                }}
              >
                {turno.codigoReserva}
              </span>
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              <span
                style={{
                  display: "inline-block",
                  padding: "0.1rem 0.6rem",
                  borderRadius: "999px",
                  fontSize: "0.85rem",
                  backgroundColor:
                    turno.estado === "cancelado" ? "#fee2e2" : "#dcfce7",
                  color:
                    turno.estado === "cancelado" ? "#b91c1c" : "#166534",
                }}
              >
                {turno.estado === "cancelado" ? "Cancelado" : "Activo"}
              </span>
            </p>

            {turno.estado !== "cancelado" && (
              <button
                type="button"
                className="btn btn-outline-danger"
                style={{ marginTop: "0.8rem" }}
                onClick={() => handleCancelar(turno._id)}
              >
                Cancelar turno
              </button>
            )}
          </div>
        ))}
    </section>
  );
}
