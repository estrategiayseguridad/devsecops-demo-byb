import "../styles/main.css";
// VULN: A01 – Broken Access Control.
// Página "interna" sin ningún control de acceso (solo no está enlazada).
// Para que el contenido "sensible" sea evidente en el bundle, importamos el
// módulo de secretos hardcodeados (VULN A02) y lo usamos aquí.
import { reportingConfig, PAYMENTS_API_KEY } from "../lib/secrets";

const el = document.querySelector(".panel");
if (el) {
  const p = document.createElement("p");
  // VULN: A02 – se filtra parte de un secreto al DOM de una página pública.
  p.textContent = `Reporting endpoint: ${reportingConfig.endpoint} (key ${PAYMENTS_API_KEY.slice(0, 6)}...)`;
  el.appendChild(p);
}
