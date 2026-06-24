import "../styles/main.css";

// Buscador (rama INSEGURA del demo).
//
// VULN: A03 – Cross-Site Scripting (DOM-based).
// El término de búsqueda llega por la query string (?q=) y se inyecta en el
// DOM con innerHTML SIN escapar. Un atacante puede mandar un enlace como:
//   /pages/buscar.html?q=<img src=x onerror=alert(document.cookie)>
// y el navegador ejecutará el script en el contexto del sitio.
//
// FIX (rama main): usar textContent / setText() en lugar de innerHTML.
// SonarQube (SAST), ESLint y OWASP ZAP (DAST) deben marcar esto.

// VULN: A10 – Open Redirect / SSRF.
// Si la URL trae ?next=, se navega directo a ese destino SIN validar contra
// una allowlist. Permite /pages/buscar.html?next=https://sitio-atacante.example
// FIX (rama main): safeRedirect() con allowlist (lib/redirect.ts).
const params = new URLSearchParams(location.search);

const next = params.get("next");
if (next) {
  // VULN: A10 – redirección a destino controlado por el usuario, sin validar.
  location.href = next;
}

const result = document.getElementById("search-result");
const input = document.getElementById("q") as HTMLInputElement | null;
const form = document.getElementById("search-form") as HTMLFormElement | null;

function showTerm(term: string): void {
  if (!result) return;
  // VULN: A03 – innerHTML con dato del usuario sin sanitizar.
  result.innerHTML = `Resultados para: "${term}" (demostración).`;
}

// VULN: A03 – el término viene de la URL y se inyecta como HTML al cargar.
const initialTerm = params.get("q") ?? "";
if (input) input.value = initialTerm;
showTerm(initialTerm);

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  showTerm(input?.value ?? "");
});
