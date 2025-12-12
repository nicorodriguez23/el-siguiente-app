// src/pages/Profesionales.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Profesionales({ usuario }) {
  const [profesionales, setProfesionales] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const cargarProfesionales = async () => {
      try {
        setCargando(true);
        setError("");
        const { data } = await api.get("/usuarios/profesionales");

        if (data.ok) {
          setProfesionales(data.profesionales || []);
        } else {
          setError(
            data.mensaje || "No se pudieron cargar los profesionales."
          );
        }
      } catch (err) {
        console.error("Error al cargar profesionales:", err);
        setError("No se pudo conectar con el servidor.");
      } finally {
        setCargando(false);
      }
    };

    cargarProfesionales();
  }, []);

  const irASacarTurno = () => {
    // Si no está logueado, lo mando primero a login
    if (!usuario || usuario.rol !== "paciente") {
      navigate("/login");
    } else {
      navigate("/sacar-turno");
    }
  };

  // Si un profesional entra a esta URL a mano, le explicamos el contexto
  if (usuario?.rol === "profesional") {
    return (
      <section className="card">
        <h1 className="h1">Profesionales</h1>
        <p className="text-muted">
          Esta sección está pensada para que los pacientes conozcan a los
          profesionales disponibles. Como profesional, podés gestionar tus
          turnos desde{" "}
          <button
            className="btn-link"
            type="button"
            onClick={() => navigate("/mis-turnos-profesional")}
          >
            tu agenda
          </button>
          .
        </p>
      </section>
    );
  }

  return (
    <section className="card">
      <h1 className="h1">Profesionales disponibles</h1>
      <p className="text-muted">
        Estos son los especialistas que atienden a través de{" "}
        <strong>El Siguiente</strong>. Podés ver su especialidad, matrícula y
        elegir con quién querés sacar un turno.
      </p>

      {cargando && <p>Cargando profesionales...</p>}

      {!cargando && error && (
        <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>
      )}

      {!cargando && !error && profesionales.length === 0 && (
        <p className="text-muted" style={{ marginTop: "1rem" }}>
          Todavía no hay profesionales cargados en el sistema.
        </p>
      )}

      {!cargando && !error && profesionales.length > 0 && (
        <>
          <div
            className="card-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.2rem",
              marginTop: "1.5rem",
            }}
          >
            {profesionales.map((pro) => (
              <article
                key={pro._id}
                className="card"
                style={{
                  borderLeft: "4px solid #4f46e5",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h2 className="h2" style={{ marginBottom: "0.3rem" }}>
                    {pro.nombreCompleto}
                  </h2>
                  <p className="text-muted" style={{ marginBottom: "0.3rem" }}>
                    {pro.especialidad || "Especialidad no informada"}
                    {pro.matricula ? ` · Mat. ${pro.matricula}` : ""}
                  </p>
                  {pro.telefono && (
                    <p style={{ fontSize: "0.9rem" }}>
                      <strong>Teléfono:</strong> {pro.telefono}
                    </p>
                  )}
                  <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
                    Atendé de forma{" "}
                    <strong>presencial y/o virtual</strong> según la
                    disponibilidad del profesional. Vas a poder elegir fecha y
                    horario al momento de sacar el turno.
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={irASacarTurno}
            >
              Quiero sacar un turno
            </button>
          </div>
        </>
      )}
    </section>
  );
}
