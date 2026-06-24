---
name: secure-web
description: Checklist OWASP de seguridad para front-end web estático (Vite + TypeScript/JavaScript). Úsalo al escribir, editar o revisar archivos .ts/.js o HTML de este proyecto, o cuando se mencione XSS, secretos en el bundle, open redirect, dependencias vulnerables o cabeceras de seguridad. Da el patrón inseguro y su versión segura.
---

# Seguridad para front-end web (OWASP)

Checklist defensivo para esta web estática (Vite + vanilla TS). Para cada riesgo:
**cómo se ve inseguro → cómo se hace seguro**. Objetivo: detectar y corregir.

## 1. XSS DOM-based (OWASP A03)

Insertar datos del usuario como HTML permite ejecutar scripts.

```ts
// ❌ INSEGURO — el atacante controla el HTML
el.innerHTML = new URLSearchParams(location.search).get("q");

// ✅ SEGURO — texto plano, nunca se interpreta como HTML
el.textContent = new URLSearchParams(location.search).get("q") ?? "";
// o usa el helper del proyecto:
import { setText } from "../lib/dom";
setText(el, getQueryParam("q"));
```

Regla: **nunca** `innerHTML`, `outerHTML` ni `insertAdjacentHTML` con datos que
vengan de la URL, formularios, `postMessage`, `localStorage`, etc. Usa
`textContent`. Si necesitas crear nodos, usa `document.createElement` +
`textContent`/`setAttribute` con valores controlados.

## 2. Secretos en el bundle (OWASP A02 – Cryptographic Failures)

Todo lo que se compila al front-end es **público**. Un secreto en el código
termina en el JS que cualquiera puede leer en el navegador.

```ts
// ❌ INSEGURO — la clave queda en el bundle público
const API_KEY = "sk_live_51HxYz...";

// ✅ SEGURO — configuración pública por import.meta.env (sin secretos)
import { config } from "../lib/config";
config.appName; // valores NO sensibles únicamente
```

Reglas:
- Variables `VITE_*` son **públicas** (van al bundle). Solo valores no sensibles.
- Secretos reales (API keys, tokens) **requieren un backend**; no van en estáticos.
- gitleaks bloquea secretos en el pipeline; no intentes “esconderlos”.

## 3. Open Redirect / SSRF (OWASP A10)

Redirigir a un destino controlado por el usuario permite phishing y bypass.

```ts
// ❌ INSEGURO — destino arbitrario
location.href = new URLSearchParams(location.search).get("next");

// ✅ SEGURO — allowlist de rutas internas y hosts permitidos
import { safeRedirect } from "../lib/redirect";
safeRedirect(getQueryParam("next")); // cae a "/" si no está permitido
```

Reglas: permite solo rutas internas relativas (`/algo`, **no** `//host`) o hosts
de una allowlist explícita. Rechaza esquemas raros (`javascript:`, `data:`).

## 4. Broken Access Control (OWASP A01)

```text
// ❌ INSEGURO — página "interna" que solo está oculta porque no se enlaza
src/pages/interno.html  (cualquiera que adivine la URL entra)
```

Reglas: un sitio **estático** no puede imponer control de acceso real (todo el
contenido publicado es accesible por URL). Si algo es sensible, **no** se publica
en estáticos; va detrás de autenticación en un backend. “Security by obscurity”
no es control de acceso.

## 5. Dependencias vulnerables (OWASP A06)

```jsonc
// ❌ INSEGURO — versión vieja con CVE conocido
"lodash": "4.17.11"   // prototype pollution (CVE-2019-10744, CVE-2020-8203)

// ✅ SEGURO — versión parcheada (o evitar la dependencia)
"lodash": "^4.17.21"
```

Reglas: no introduzcas paquetes con CVEs. Mantén `package.json` al día;
Dependabot abre PRs de actualización. Menos dependencias = menos superficie.

## 6. Security Misconfiguration / cabeceras (OWASP A05)

Sin cabeceras de seguridad, el navegador no tiene defensas extra (CSP, etc.).

```yaml
# ✅ SEGURO — customHttp.yml aplica cabeceras en Amplify
customHeaders:
  - pattern: "**"
    headers:
      - key: "Content-Security-Policy"
        value: "default-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'"
      - key: "X-Content-Type-Options"
        value: "nosniff"
      - key: "X-Frame-Options"
        value: "DENY"
      - key: "Referrer-Policy"
        value: "strict-origin-when-cross-origin"
```

Reglas: mantén y no debilites `customHttp.yml`. CSP debe ser lo más estricta
posible (evita `unsafe-inline`/`unsafe-eval` en `script-src`).

## Mini-checklist al revisar un diff

- [ ] ¿Hay `innerHTML`/`outerHTML`/`insertAdjacentHTML`? → cambiar a `textContent`.
- [ ] ¿Cadenas que parezcan claves/tokens? → fuera del código; usar backend.
- [ ] ¿`location.href`/`location.assign`/`window.open` con valor del usuario? → allowlist.
- [ ] ¿Páginas nuevas “ocultas” como control de acceso? → no aplica en estáticos.
- [ ] ¿Dependencias nuevas o versiones viejas? → revisar CVEs, fijar versión parcheada.
- [ ] ¿Cambios que afecten `customHttp.yml` o la CSP? → no debilitar.
