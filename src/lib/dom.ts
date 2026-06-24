// Utilidades DOM seguras.
//
// SEGURO (OWASP A03 / XSS): para mostrar datos del usuario usamos SIEMPRE
// textContent. El navegador trata el valor como texto plano, nunca como HTML,
// así que un <script> o un <img onerror=...> se muestra literalmente y no se ejecuta.

/** Escribe texto plano en un elemento. Nunca interpreta HTML. */
export function setText(el: HTMLElement | null, value: string): void {
  if (!el) return;
  el.textContent = value;
}

/** Obtiene un parámetro de la query string de forma segura. */
export function getQueryParam(name: string): string {
  return new URLSearchParams(window.location.search).get(name) ?? "";
}
