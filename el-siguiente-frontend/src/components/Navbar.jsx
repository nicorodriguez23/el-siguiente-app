// src/components/Navbar.jsx
import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar({ usuario, onLogout }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setMenuAbierto(false);
      setMenuUsuarioAbierto(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [{ to: "/", label: "Inicio" }];

  // Invitado O paciente -> pueden ver la lista de profesionales
  if (!usuario || usuario.rol === "paciente") {
    navLinks.push({ to: "/profesionales", label: "Profesionales" });
  }

  // Todos pueden consultar código
  navLinks.push({ to: "/consultar-codigo", label: "Consultar código" });

  if (!usuario) {
    navLinks.push(
      { to: "/login", label: "Iniciar sesión" },
      { to: "/registro", label: "Registrarme" }
    );
  }

  if (usuario?.rol === "paciente") {
    navLinks.push(
      { to: "/sacar-turno", label: "Sacar turno" },
      { to: "/mis-turnos", label: "Mis turnos" }
    );
  }

  if (usuario?.rol === "profesional") {
    navLinks.push({
      to: "/mis-turnos-profesional",
      label: "Mis turnos",
    });
  }

  const enlacesUnicos = navLinks.filter(
    (link, i, arr) => i === arr.findIndex((l) => l.to === link.to)
  );

  const handleLogout = () => {
    if (onLogout) onLogout();
    setMenuUsuarioAbierto(false);
    setMenuAbierto(false);
  };

  const inicial =
    usuario?.username?.charAt(0)?.toUpperCase() ??
    usuario?.nombreCompleto?.charAt(0)?.toUpperCase() ??
    "U";

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          El Siguiente
          <span>Turnos médicos simples</span>
        </Link>

        <nav
          className={
            "navbar-links" + (menuAbierto ? " navbar-links-open" : "")
          }
        >
          {enlacesUnicos.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                "nav-link" + (isActive ? " nav-link-active" : "")
              }
              onClick={() => setMenuAbierto(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-user-wrapper">
          <button
            type="button"
            className="navbar-user-avatar"
            onClick={() => setMenuUsuarioAbierto((prev) => !prev)}
          >
            <span className="navbar-user-icon">{inicial}</span>
          </button>

          <div
            className={
              "navbar-user-menu" +
              (menuUsuarioAbierto ? " navbar-user-menu-open" : "")
            }
          >
            {usuario ? (
              <>
                <div className="navbar-user-menu-header">
                  Hola, <strong>{usuario.username}</strong>
                  <br />
                  <span
                    className={
                      "badge " +
                      (usuario.rol === "profesional"
                        ? "badge-rol-profesional"
                        : "badge-rol-paciente")
                    }
                  >
                    {usuario.rol === "profesional"
                      ? "Profesional"
                      : "Paciente"}
                  </span>
                </div>

                <button
                  type="button"
                  className="navbar-user-menu-item"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="navbar-user-menu-item"
                  onClick={() => setMenuUsuarioAbierto(false)}
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/registro"
                  className="navbar-user-menu-item"
                  onClick={() => setMenuUsuarioAbierto(false)}
                >
                  Registrarme
                </Link>
              </>
            )}
          </div>

          <button
            className="navbar-toggle"
            type="button"
            onClick={() => {
              setMenuAbierto((prev) => !prev);
              setMenuUsuarioAbierto(false);
            }}
            aria-label="Abrir menú"
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
