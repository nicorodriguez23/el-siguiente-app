// src/pages/SacarTurno.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api, { LS_USER_KEY, LS_TOKEN_KEY } from "../services/api";

export default function SacarTurno({ usuario }) {
  const [profesionales, setProfesionales] = useState([]);
  const [cargandoProfesionales, setCargandoProfesionales] = useState(true);

  const [profesionalId, setProfesionalId] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");
  const [medio, setMedio] = useState("presencial");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [turnoCreado, setTurnoCreado] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const obtenerUsuarioPaciente = () => {
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

    if (!usuarioEfectivo || usuarioEfectivo.rol !== "paciente") {
      return null;
    }

    return usuarioEfectivo;
  };

  useEffect(() => {
    const inicializar = async () => {
      try {
        setCargandoProfesionales(true);
        setError("");

        const token = localStorage.getItem(LS_TOKEN_KEY);
        if (!token) {
          navigate("/login");
          return;
        }

        const usuarioPaciente = obtenerUsuarioPaciente();
        if (!usuarioPaciente) {
          navigate("/login");
          return;
        }

        const { data } = await api.get("/usuarios/profesionales");

        if (data.ok) {
          setProfesionales(data.profesionales || []);

          // Si viene profesionalId por query, lo seteamos si existe
          const params = new URLSearchParams(location.search);
          const idFromUrl = params.get("profesionalId");
          if (idFromUrl && data.profesionales?.some((p) => p._id === idFromUrl)) {
            setProfesionalId(idFromUrl);
          }
        } else {
          setError(data.mensaje || "No se pudieron cargar los profesionales.");
        }
      } catch (err) {
        console.error("Error al cargar profesionales:", err);
        if (err.response?.data?.mensaje) {
          setError(err.response.data.mensaje);
        } else {
          setError("No se pudo conectar con el servidor.");
        }
      } finally {
        setCargandoProfesionales(false);
      }
    };

    inicializar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, usuario, location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setTurnoCreado(null);

    if (!profesionalId || !fecha || !hora || !motivo) {
      setError("Por favor completá todos los campos.");
      return;
    }

    const usuarioPaciente = obtenerUsuarioPaciente();
    if (!usuarioPaciente) {
      navigate("/login");
      return;
    }

    try {
      setCargando(true);

      const fechaHoraISO = new Date(`${fecha}T${hora}:00`).toISOString();

      const body = {
        pacienteId: usuarioPaciente._id,
        profesionalId,
        fecha: fechaHoraISO,
        motivo,
        medio,
      };

      const { data } = await api.post("/turnos", body);

      if (data.ok) {
        setTurnoCreado(data.turno);
      } else {
        setError(data.mensaje || "Ocurrió un error al crear el turno.");
      }
    } catch (err) {
      console.error("⚠️ Error al crear turno:", err);

      if (err.response?.data?.mensaje) {
        setError(err.response.data.mensaje);
      } else {
        setError("No se pudo conectar con el servidor.");
      }
    } finally {
      setCargando(false);
    }
  };

  const profesionalSeleccionado = profesionales.find(
    (p) => p._id === profesionalId
  );

  return (
    <div className="card">
      <h1 className="h1">Sacar turno</h1>
      <p className="text-muted">
        Elegí el profesional, el día y la hora. El turno quedará registrado con
        un código único que podrás consultar más adelante.
      </p>

      {cargandoProfesionales && <p>Cargando lista de profesionales...</p>}

      {!cargandoProfesionales && profesionales.length === 0 && !error && (
        <p className="text-muted">
          No hay profesionales cargados todavía. Registrá un profesional desde
          la opción de registro.
        </p>
      )}

      {error && (
        <div style={{ color: "red", fontSize: "0.95rem" }}>{error}</div>
      )}

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Profesional *</label>
          <select
            value={profesionalId}
            onChange={(e) => setProfesionalId(e.target.value)}
          >
            <option value="">Seleccionar profesional...</option>
            {profesionales.map((pro) => (
              <option key={pro._id} value={pro._id}>
                {pro.nombreCompleto} · {pro.especialidad || "Especialidad N/D"}{" "}
                {pro.matricula
                  ? `(Mat. ${pro.matricula})`
                  : "(Matrícula no cargada)"}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Fecha *</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="form-group">
          <label>Hora *</label>
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Motivo de la consulta *</label>
          <input
            type="text"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ej: Control de presión, consulta general..."
          />
        </div>

        <div className="form-group">
          <label>Medio</label>
          <select value={medio} onChange={(e) => setMedio(e.target.value)}>
            <option value="presencial">Presencial</option>
            <option value="virtual">Virtual (videollamada)</option>
          </select>
        </div>

        <button
          className="btn btn-primary"
          type="submit"
          disabled={cargando || profesionales.length === 0}
        >
          {cargando ? "Reservando..." : "Confirmar turno"}
        </button>
      </form>

      {turnoCreado && (
        <div className="card" style={{ marginTop: "1.5rem" }}>
          <h2 className="card-title">Turno reservado correctamente ✅</h2>
          <p>
            <strong>Profesional:</strong>{" "}
            {profesionalSeleccionado
              ? profesionalSeleccionado.nombreCompleto
              : "Profesional"}
          </p>
          <p>
            <strong>Especialidad:</strong>{" "}
            {profesionalSeleccionado?.especialidad || "N/D"}
          </p>
          <p>
            <strong>Matrícula:</strong>{" "}
            {profesionalSeleccionado?.matricula || "No informada"}
          </p>
          <p>
            <strong>Fecha y hora:</strong>{" "}
            {new Date(turnoCreado.fecha).toLocaleString("es-AR", {
              dateStyle: "full",
              timeStyle: "short",
            })}
          </p>
          <p>
            <strong>Medio:</strong> {turnoCreado.medio}
          </p>
          <p>
            <strong>Código de reserva:</strong>{" "}
            <span style={{ fontSize: "1.2rem" }}>
              {turnoCreado.codigoReserva}
            </span>
          </p>
          <p className="text-muted">
            Guardá este código. Podés usarlo en la opción{" "}
            <strong>“Consultar código”</strong> del menú.
          </p>
        </div>
      )}
    </div>
  );
}
