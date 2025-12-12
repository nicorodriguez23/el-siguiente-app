// src/helpers/generarCodigoReserva.js

function generarCodigoReserva() {
  // 1) Generar los 4 números
  const numero = Math.floor(Math.random() * 10000); // 0 - 9999
  const parteNumerica = String(numero).padStart(4, "0"); // ej: "0047"

  // 2) Generar las 2 letras (sin I ni O para evitar confusiones)
  const letrasDisponibles = "ABCDEFGHJKLMNPQRSTUVWXYZ";

  const letra1 =
    letrasDisponibles[Math.floor(Math.random() * letrasDisponibles.length)];
  const letra2 =
    letrasDisponibles[Math.floor(Math.random() * letrasDisponibles.length)];

  const parteLetras = `${letra1}${letra2}`;

  // 3) Combinar: NNNNLL
  return `${parteNumerica}${parteLetras}`; // ej: "4827AB"
}

module.exports = generarCodigoReserva;
