// src/pages/RegistroTipo.jsx
import { useNavigate } from "react-router-dom";

export default function RegistroTipo() {
  const navigate = useNavigate();

  const irARegistroPaciente = () => {
    navigate("/registro-paciente");
  };

  const irARegistroProfesional = () => {
    // 👇 ESTA es la ruta correcta del formulario de profesional
    navigate("/registro-profesional");
  };

  return (
    <section className="card">
      <h1 className="h1">Crear cuenta</h1>
      <p className="text-muted">
        Elegí qué tipo de usuario querés crear para usar <strong>El Siguiente</strong>.
      </p>

      <div className="form-grid" style={{ marginTop: "1.2rem" }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <h2 className="h2">Paciente</h2>
          <p className="text-muted">
            Si querés pedir turnos, ver tu agenda y consultar tus códigos de
            reserva, registrate como paciente.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={irARegistroPaciente}
            style={{ marginTop: "0.8rem" }}
          >
            Registrarme como paciente
          </button>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <h2 className="h2">Profesional</h2>
          <p className="text-muted">
            Si sos médico o profesional de la salud y querés administrar tu agenda,
            registrate como profesional.
          </p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={irARegistroProfesional}
            style={{ marginTop: "0.8rem" }}
          >
            Registrarme como profesional
          </button>
        </div>
      </div>
    </section>
  );
}
