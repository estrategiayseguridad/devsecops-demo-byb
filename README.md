# Portal de Proveedores — Demo DevSecOps

Web informacional **estática** (Vite + vanilla TypeScript) creada como material
de **capacitación DevSecOps** de *Estrategia y Seguridad Consulting*. Muestra, de
extremo a extremo, cómo un pipeline de seguridad **detecta y bloquea**
vulnerabilidades antes de que lleguen a producción.

> ⚠️ **Material educativo y defensivo.** El objetivo es **detectar y corregir**,
> nunca explotar. No usar en producción real.

- **Hosting/Deploy:** AWS Amplify (conectado solo a la rama `main`).
- **Pipeline de seguridad:** GitHub Actions → **gitleaks** (secretos) +
  **SonarQube Cloud** (SAST) + **OWASP ZAP** (DAST) + **Dependabot** (SCA).
- **Harness del asistente:** `.claude/` (hooks que bloquean secretos y revisan
  patrones de XSS al escribir código).

## Modelo de ramas (importante)

| Rama | Qué es | ¿Se despliega? |
|------|--------|----------------|
| **`main`** | Versión **SEGURA** del código | ✅ Sí, Amplify despliega solo esta rama |
| **`feature/demo-vuln`** | Versión **INSEGURA**, solo como **Pull Request** | ❌ No. Existe para que el pipeline la rechace |

La rama insegura **nunca** se mergea ni se despliega. Amplify está conectado
**únicamente** a `main` (sin PR previews públicas).

## Las vulnerabilidades del demo (solo en `feature/demo-vuln`)

Cada una está comentada en el código con `// VULN:` + categoría OWASP, y
**corregida** en `main`:

| OWASP | Vulnerabilidad | Fix en `main` |
|-------|----------------|----------------|
| **A03 – XSS (DOM-based)** | `el.innerHTML = params.get('q')` | `textContent` / `setText()` |
| **A02 – Cryptographic Failures** | API key/token hardcodeado en TS | Config por `import.meta.env`, sin secretos |
| **A01 – Broken Access Control** | Página “interna” oculta solo por no enlazarla | No publicar lo sensible en estáticos |
| **A10 – SSRF / Open Redirect** | `location.href = params.get('next')` | `safeRedirect()` con allowlist |
| **A06 – Vulnerable Components** | `lodash 4.17.11` (CVE conocido) | Versión parcheada / quitar dependencia |
| **A05 – Misconfiguration** | Sitio **sin** cabeceras de seguridad | `customHttp.yml` (CSP, HSTS, X-Frame-Options, …) |

Detalle y mapeo STRIDE en [`docs/threat-model.md`](docs/threat-model.md).

---

## Runbook del demo en vivo

### Paso 1 — El harness bloquea un secreto (antes del repo)

El asistente (`.claude/`) tiene un hook **PreToolUse** que revisa lo que se va a
escribir y **bloquea con exit code 2** si parece un secreto.

Pruébalo sin Claude, directo en la terminal:

```bash
echo '{"tool_input":{"file_path":"src/lib/secret.ts","content":"const API_KEY = \"sk_live_abcd1234efgh5678ijkl\";"}}' \
  | ./.claude/hooks/block-secrets.sh; echo "exit=$?"
# → 🚫 BLOQUEADO ... exit=2
```

Con un placeholder evidente, **pasa**:

```bash
echo '{"tool_input":{"file_path":"src/lib/config.ts","content":"const k = \"CHANGE_ME\";"}}' \
  | ./.claude/hooks/block-secrets.sh; echo "exit=$?"
# → exit=0
```

> En Claude Code, ese exit 2 hace que la escritura del archivo se **rechace**.
> Es defensa local; **gitleaks** repite el control en el CI.

### Paso 2 — Abrir el PR `feature/demo-vuln`: pipeline en rojo

Con el PR de `feature/demo-vuln` → `main` abierto, los checks fallan:

- **ESLint (lint)** → la regla `no-restricted-properties` marca `innerHTML` (A03). ❌
- **gitleaks (secrets)** → encuentra el secreto hardcodeado (A02). ❌
- **SonarCloud Code Analysis (SAST)** → detecta XSS por `innerHTML` (A03) y open
  redirect (A10). Lo aporta **Automatic Analysis** de SonarCloud (la app
  conectada al repo), no un job de Actions. ❌
- **OWASP ZAP (DAST)** → escanea la instancia efímera y marca cabeceras de
  seguridad ausentes (A05) y el XSS reflejado en `?q=`. (Reporte como artifact;
  informativo, no aborta el job.)
- **Dependabot / `npm audit`** → `lodash 4.17.11` con CVEs (A06). `npm audit`
  reporta "1 critical" en esta rama.

### Paso 3 — Aplicar el fix → verde

Se muestra el contraste con `main` (código ya corregido): `textContent`,
`import.meta.env`, `safeRedirect()`, dependencia actualizada y `customHttp.yml`.
En un PR ya corregido, los checks pasan. ✅

### Paso 4 — Merge a `main` → Amplify despliega solo

Al hacer push/merge a `main`, **AWS Amplify** detecta el cambio y **despliega
automáticamente** (no hay una Action de deploy). Se muestra el sitio en vivo:

- Servido por **HTTPS**.
- Con las **cabeceras de seguridad** ya aplicadas (revisar en DevTools → Network
  → Headers: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`, `Strict-Transport-Security`).

> Contraste visual de la misconfig (A05): la rama vuln se sirve **sin** estas
> cabeceras; `main` las aplica vía `customHttp.yml`.

---

## Desarrollo local

```bash
npm ci
npm run dev      # servidor de desarrollo (http://localhost:5173)
npm run build    # typecheck + build estático a dist/
npm run preview  # sirve dist/ localmente
npm run lint     # ESLint sobre src/
```

Probar el sitio construido (lo mismo que escanea ZAP en el CI):

```bash
npm run build
npx serve dist -l 8080   # http://127.0.0.1:8080
```

---

## Setup (pasos manuales — una sola vez)

> Estos pasos **no** están automatizados a propósito: no se crean tokens ni
> recursos cloud desde el repo.

### 1. AWS Amplify (hosting/deploy)

1. AWS Console → **AWS Amplify** → **Create new app** → **Host web app**.
2. Conecta **GitHub** y elige este repositorio.
3. **Conecta únicamente la rama `main`.** No actives PR previews públicas. (Si
   las activas, **protégelas con contraseña** en *App settings → Access control*.)
4. Amplify detecta [`amplify.yml`](amplify.yml) (build) y aplica
   [`customHttp.yml`](customHttp.yml) (cabeceras). Confirma y despliega.

### 2. SonarQube Cloud (SAST) — Automatic Analysis

Este proyecto usa **Automatic Analysis** (la app de SonarCloud conectada al
repo); **no** requiere `SONAR_TOKEN` ni un job de SonarScanner en Actions.

1. Entra a <https://sonarcloud.io> con tu cuenta de GitHub.
2. Importa la organización `estrategiayseguridad` y crea el proyecto a partir de
   este repo (repo **público** = análisis **gratuito**).
3. Deja activado **Automatic Analysis**. SonarCloud publicará el check
   **`SonarCloud Code Analysis`** en cada PR.

> Nota: Automatic Analysis y el SonarScanner basado en CI **no** pueden coexistir
> en el mismo proyecto. Por eso `security.yml` solo corre lint + gitleaks.

### 3. (Opcional, recomendado y gratis en repo público) Branch protection

Repo → **Settings → Branches → Add branch ruleset** sobre `main`:

- Exigir Pull Request antes de mergear.
- Exigir que pasen los checks: **Lint (ESLint)**, **Secret scanning (gitleaks)**
  y **SonarCloud Code Analysis** antes de mergear.

Así, ningún cambio inseguro puede llegar a `main` (y por tanto a Amplify).

---

## Estructura del repositorio

```
src/                  HTML, main.ts, pages/, styles/, lib/ (config, dom, redirect)
docs/threat-model.md  Modelo STRIDE (mermaid) + mapeo a las vulns
.github/workflows/    security.yml (lint + gitleaks), dast.yml (OWASP ZAP)
.github/dependabot.yml SCA semanal (npm + github-actions)
.claude/              Harness: CLAUDE.md, skills/, agents/, settings.json, hooks/
sonar-project.properties  Config de SonarQube (sources/exclusions)
amplify.yml           Build spec de Amplify
customHttp.yml        Cabeceras de seguridad (el FIX de la misconfig A05)
```
