// Redirecciones seguras con allowlist.
//
// SEGURO (OWASP A10 / Open Redirect & SSRF): nunca redirigimos a un destino
// controlado por el usuario sin validarlo. Solo se permiten:
//   1. Rutas internas relativas (que empiezan con "/" pero no "//").
//   2. Hosts incluidos explícitamente en ALLOWED_HOSTS.
// Cualquier otro valor cae a un destino por defecto seguro ("/").

const ALLOWED_HOSTS: readonly string[] = [
  "estrategiayseguridad.com",
  "www.estrategiayseguridad.com",
];

const DEFAULT_DESTINATION = "/";

/**
 * Devuelve un destino seguro a partir de un valor potencialmente no confiable.
 * No realiza la navegación; solo decide a dónde es seguro ir.
 */
export function safeDestination(rawNext: string | null): string {
  if (!rawNext) return DEFAULT_DESTINATION;

  // Ruta interna relativa: permitida. Rechazamos "//host" (redirección protocol-relative).
  if (rawNext.startsWith("/") && !rawNext.startsWith("//")) {
    return rawNext;
  }

  // URL absoluta: solo si el host está en la allowlist y el esquema es https/http.
  try {
    const url = new URL(rawNext, window.location.origin);
    const schemeOk = url.protocol === "https:" || url.protocol === "http:";
    if (schemeOk && ALLOWED_HOSTS.includes(url.hostname)) {
      return url.toString();
    }
  } catch {
    // URL inválida → destino por defecto.
  }

  return DEFAULT_DESTINATION;
}

/** Navega de forma segura usando la allowlist. */
export function safeRedirect(rawNext: string | null): void {
  window.location.href = safeDestination(rawNext);
}
