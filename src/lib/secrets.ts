// Módulo de "configuración" de la integración con un servicio externo.
//
// VULN: A02 – Cryptographic Failures / secretos hardcodeados.
// Una API key y un token quedan escritos en el código fuente. Como esto se
// compila al bundle del navegador, CUALQUIERA puede leerlos en el JS público.
// gitleaks (CI) y el hook block-secrets.sh deben detectar esto.
//
// FIX (rama main): no existe este archivo; la config pública va por
// import.meta.env y los secretos reales viven en un backend, nunca en el front.
//
// Nota: estos valores son ficticios y con prefijos genéricos a propósito, para
// no disparar el "push protection" de GitHub (que bloquea el push y nos
// impediría abrir el PR). Aun así, son claramente secretos hardcodeados que el
// pipeline (gitleaks + SonarQube) debe marcar.

// VULN: A02 – clave de API hardcodeada (alta entropía).
export const PAYMENTS_API_KEY = "api_live_8f3Kd92LpQzR7xW1mN4bV6cY0tH5sJ2a";

// VULN: A02 – token de servicio hardcodeado.
export const INTERNAL_SERVICE_TOKEN =
  "svc_tok_AbCdEf0123456789AbCdEf0123456789AbCd";

// VULN: A02 – credenciales "básicas" embebidas.
export const reportingConfig = {
  endpoint: "https://reporting.internal.example.com",
  username: "svc-portal",
  password: "P0rt4l-Sup3rS3cret-2024",
};
