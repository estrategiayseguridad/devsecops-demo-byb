# Convenciones del proyecto — Portal de Proveedores (Demo DevSecOps)

Sitio informacional **estático** hecho con **Vite + vanilla TypeScript**. Sin
backend ni base de datos. La salida estática (`dist/`) se publica en AWS Amplify.

> Este repo es material **educativo y defensivo**. El objetivo es **detectar y
> corregir** vulnerabilidades, nunca explotarlas.

## Reglas de seguridad (obligatorias al escribir o editar código)

1. **Nunca uses `innerHTML` / `outerHTML` / `insertAdjacentHTML` con datos del
   usuario** (OWASP A03 – XSS). Para mostrar texto usa `textContent`
   (`setText()` en `src/lib/dom.ts`). El lint bloquea `innerHTML`.
2. **Jamás escribas secretos en el código** (OWASP A02). API keys, tokens y
   credenciales no van en el repo. La configuración pública se lee de
   `import.meta.env` (variables con prefijo `VITE_`). Recuerda que **cualquier
   `VITE_*` queda visible en el bundle del navegador**: ahí solo van valores no
   sensibles. Para secretos reales se necesita un backend.
3. **Valida toda redirección contra una allowlist** (OWASP A10 – Open
   Redirect/SSRF). Nunca hagas `location.href = <valor del usuario>` directo;
   usa `safeRedirect()` / `safeDestination()` de `src/lib/redirect.ts`.
4. **No agregues páginas "internas" protegidas solo por no enlazarlas** (OWASP
   A01 – Broken Access Control). Un sitio estático no puede imponer control de
   acceso; si algo es sensible, no va en estáticos públicos.
5. **Mantén las dependencias actualizadas** (OWASP A06). No introduzcas
   paquetes con CVEs conocidos. Dependabot vigila `package.json`.
6. **Mantén `customHttp.yml`** (OWASP A05 – Misconfiguration). Es el archivo que
   aplica las cabeceras de seguridad en Amplify (CSP, X-Content-Type-Options,
   X-Frame-Options, Referrer-Policy, HSTS). No lo borres ni lo debilites.

## Estructura

- `src/` — `index.html`, `main.ts`, `pages/`, `styles/`, `lib/` (config, dom, redirect).
- `.github/workflows/` — `security.yml` (lint + gitleaks + SonarQube), `dast.yml` (ZAP).
- `amplify.yml` / `customHttp.yml` — build y cabeceras de Amplify.
- `docs/threat-model.md` — modelo STRIDE.

## Flujo de ramas

- **`main`** = versión segura. **Es la única rama que Amplify despliega.**
- **`feature/demo-vuln`** = versión insegura, solo como PR para que el pipeline
  la rechace. **No se mergea ni se despliega.**

## Comandos

- `npm run dev` — servidor de desarrollo.
- `npm run build` — typecheck + build a `dist/`.
- `npm run lint` — ESLint sobre `src/`.
