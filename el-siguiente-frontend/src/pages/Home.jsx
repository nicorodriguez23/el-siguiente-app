// src/pages/Home.jsx

export default function Home({ usuario }) {
  return (
    <section className="card">
      <h1 className="h1">Bienvenido a El Siguiente</h1>

      {usuario ? (
        <p className="text-muted">
          Estás conectado como <strong>{usuario.username}</strong>{" "}
          (<strong>{usuario.rol}</strong>). Usá el menú de arriba para sacar un
          turno o ver tu agenda.
        </p>
      ) : (
        <p className="text-muted">
          Aquí podés registrarte, iniciar sesión y pedir turnos médicos de forma
          sencilla. Todo pensado con letra grande y pasos claros.
        </p>
      )}

      <div className="card" style={{ marginTop: "1rem" }}>
        <h2 className="h2">¿Qué querés hacer?</h2>
        <ul>
          <li>Si es tu primera vez, andá a <strong>Registrarme</strong>.</li>
          <li>
            Si ya tenés usuario, andá a <strong>Iniciar sesión</strong>.
          </li>
          <li>
            Una vez dentro, vas a poder <strong>sacar turnos</strong> y ver{" "}
            <strong>mis turnos</strong>.
          </li>
        </ul>
      </div>
    </section>
  );
}
