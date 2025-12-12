// src/App.jsx
import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import RegistroTipo from "./pages/RegistroTipo";
import RegistroPaciente from "./pages/RegistroPaciente";
import RegistroProfesional from "./pages/RegistroProfesional";
import SacarTurno from "./pages/SacarTurno";
import MisTurnosPaciente from "./pages/MisTurnosPaciente";
import MisTurnosProfesional from "./pages/MisTurnosProfesional";
import ConsultarTurnoCodigo from "./pages/ConsultarTurnoCodigo";
import Profesionales from "./pages/Profesionales";

// claves usadas en localStorage (mismas que en api.js)
import { LS_USER_KEY, LS_TOKEN_KEY } from "./services/api";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);

  const [mensajeBienvenida, setMensajeBienvenida] = useState("");
  const [mostrarBienvenida, setMostrarBienvenida] = useState(false);

  const navigate = useNavigate();

  // Cargar usuario/token desde LocalStorage al iniciar la app
  useEffect(() => {
    const storedUser = localStorage.getItem(LS_USER_KEY);
    const storedToken = localStorage.getItem(LS_TOKEN_KEY);

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUsuario(parsedUser);
        setToken(storedToken);
      } catch (error) {
        console.error("Error al parsear usuario guardado:", error);
        localStorage.removeItem(LS_USER_KEY);
        localStorage.removeItem(LS_TOKEN_KEY);
      }
    }
  }, []);

  // Cartel de bienvenida suave
  const mostrarCartelBienvenida = (usuarioData) => {
    const nombre =
      usuarioData.nombreCompleto || usuarioData.username || "usuario";

    const texto =
      usuarioData.rol === "profesional"
        ? `¡Bienvenido/a, Dr./Dra. ${nombre}!`
        : `¡Bienvenido/a, ${nombre}!`;

    setMensajeBienvenida(texto);
    setMostrarBienvenida(true);

    setTimeout(() => {
      setMostrarBienvenida(false);
    }, 3000);
  };

  // Login exitoso
  const handleLogin = (usuarioData, tokenValue) => {
    setUsuario(usuarioData);
    setToken(tokenValue);

    localStorage.setItem(LS_USER_KEY, JSON.stringify(usuarioData));
    localStorage.setItem(LS_TOKEN_KEY, tokenValue);

    mostrarCartelBienvenida(usuarioData);

    if (usuarioData.rol === "paciente") {
      navigate("/sacar-turno");
    } else if (usuarioData.rol === "profesional") {
      navigate("/mis-turnos-profesional");
    } else {
      navigate("/");
    }
  };

  // Logout
  const handleLogout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem(LS_USER_KEY);
    localStorage.removeItem(LS_TOKEN_KEY);
    setMostrarBienvenida(false);
    setMensajeBienvenida("");
    navigate("/");
  };

  return (
    <div className="app-container">
      <Navbar usuario={usuario} onLogout={handleLogout} />

      <main className="app-main">
        {mostrarBienvenida && (
          <div className="welcome-banner">
            <span>{mensajeBienvenida}</span>
          </div>
        )}

        <Routes>
          {/* Público */}
          <Route path="/" element={<Home usuario={usuario} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/consultar-codigo" element={<ConsultarTurnoCodigo />} />
          <Route
            path="/profesionales"
            element={<Profesionales usuario={usuario} />}
          />

          {/* Registro (selector + formularios) */}
          <Route path="/registro" element={<RegistroTipo />} />
          <Route
            path="/registro-paciente"
            element={<RegistroPaciente onLogin={handleLogin} />}
          />
          <Route
            path="/registro-profesional"
            element={<RegistroProfesional onLogin={handleLogin} />}
          />

          {/* Paciente */}
          <Route
            path="/sacar-turno"
            element={<SacarTurno usuario={usuario} />}
          />
          <Route
            path="/mis-turnos"
            element={<MisTurnosPaciente usuario={usuario} />}
          />

          {/* Profesional */}
          <Route
            path="/mis-turnos-profesional"
            element={<MisTurnosProfesional usuario={usuario} />}
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
