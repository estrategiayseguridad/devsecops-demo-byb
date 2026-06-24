import "../styles/main.css";
import { setText } from "../lib/dom";

// Formulario de contacto (solo refleja el mensaje, sin backend).
//
// SEGURO (OWASP A03 / XSS): el nombre y el mensaje del usuario se escriben con
// textContent a través de setText(). Aunque el usuario escriba "<script>..."
// se mostrará como texto literal y nunca se ejecutará.

const form = document.getElementById("contact-form") as HTMLFormElement | null;
const result = document.getElementById("contact-result");

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = String(data.get("name") ?? "").trim();
  const message = String(data.get("message") ?? "").trim();

  if (!name && !message) {
    setText(result, "Escribe tu nombre y un mensaje para ver la vista previa.");
    return;
  }

  // Construimos el texto con plantilla y lo insertamos como TEXTO, no como HTML.
  setText(
    result,
    `Gracias, ${name || "proveedor"}. Recibimos tu mensaje: "${message}"`,
  );
});
