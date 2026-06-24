import "../styles/main.css";
import { setText, getQueryParam } from "../lib/dom";
import { safeRedirect } from "../lib/redirect";

// Buscador (demo: refleja el término) + manejo de redirección con allowlist.
//
// SEGURO (A03 / XSS): el término ?q= se muestra con textContent (setText),
//   así que cualquier "<img onerror=...>" aparece como texto, no se ejecuta.
// SEGURO (A10 / Open Redirect): si llega ?next=, NO navegamos directo.
//   Pasamos el valor por safeRedirect(), que solo permite rutas internas o
//   hosts de la allowlist; cualquier otro destino cae a "/".

const input = document.getElementById("q") as HTMLInputElement | null;
const result = document.getElementById("search-result");
const form = document.getElementById("search-form") as HTMLFormElement | null;

function showTerm(term: string): void {
  if (!term) {
    setText(result, "Escribe un término para ver resultados de ejemplo.");
    return;
  }
  setText(result, `Resultados para: "${term}" (demostración, sin índice real).`);
}

// Si la URL trae ?q=, lo mostramos al cargar (de forma segura).
const initialTerm = getQueryParam("q");
if (input) input.value = initialTerm;
showTerm(initialTerm);

// Redirección opcional validada contra la allowlist (A10).
const next = getQueryParam("next");
if (next) {
  safeRedirect(next);
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  showTerm(input?.value.trim() ?? "");
});
