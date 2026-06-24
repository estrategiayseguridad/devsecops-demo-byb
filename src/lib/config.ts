// Configuración de la app.
//
// SEGURO: la configuración pública se lee de import.meta.env (variables VITE_*),
// nunca se escriben secretos en el código fuente.
//
// IMPORTANTE: todo lo que pongas en una variable VITE_* queda visible en el
// bundle del navegador. Por eso aquí solo viven valores NO sensibles
// (nombre de la app, email de contacto público). Para claves/tokens reales
// se necesita un backend; este sitio es estático y no maneja secretos.

export const config = {
  appName: import.meta.env.VITE_APP_NAME ?? "Portal de Proveedores — Demo",
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL ?? "contacto@example.com",
} as const;
