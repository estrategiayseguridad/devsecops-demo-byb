# Biblioteca de prompts DevSecOps — Productos ByB

Colección de **prompts reutilizables** para aplicar lo aprendido en el curso de
DevSecOps a proyectos reales. Pégalos en cualquier IA capaz (Claude, Claude
Code, ChatGPT, etc.) para auditar un proyecto, arrancar uno nuevo con seguridad,
diseñar tu pipeline, elegir herramientas o responder a un incidente.

> **Material interno de Productos ByB · cortesía de ES Consulting** (Estrategia y
> Seguridad Consulting). Enfoque **defensivo**: detectar, prevenir y corregir —
> nunca explotar.

## Agnóstico por diseño

**Ningún prompt asume lenguaje, framework, nube ni herramienta.** Cada uno
instruye a la IA a **detectar** tu stack (si le das código) o **preguntarlo** (si
no) y adaptar todo a tu realidad. No estás casado con ninguna marca: cuando hay
que recomendar, siempre verás **al menos una opción libre/OSS y una de pago**,
con su trade-off.

## Cómo usar (3 pasos)

1. **Abre tu IA** preferida (web, IDE o terminal).
2. **Pega primero** el bloque [`_contexto-devsecops.md`](_contexto-devsecops.md)
   — le da a la IA el lenguaje común del equipo y el marco del curso.
3. **Pega debajo** el prompt que necesites de la tabla de abajo. Responde sus
   preguntas iniciales (stack, dónde despliegas, criticidad, etc.) y deja que
   adapte todo a tu caso.

> 💡 Si usas una IA con acceso a tu repositorio (p. ej. Claude Code), puede
> **detectar** el stack en vez de preguntarlo. Si trabajas en la web pegando
> texto, **prepara** las respuestas: lenguaje, dónde se despliega, criticidad
> (alta/media/baja), tamaño del equipo, herramientas que ya usan y si priorizan
> opciones gratuitas/OSS.

## Índice de prompts — cuándo usar cada uno

| # | Prompt | Úsalo cuando… |
|---|--------|---------------|
| — | [`_contexto-devsecops.md`](_contexto-devsecops.md) | **Siempre primero.** Bloque de contexto a anteponer a cualquier prompt. |
| 01 | [`01-analizar-proyecto-existente.md`](01-analizar-proyecto-existente.md) | Tienes un proyecto/repo y quieres **auditar** su madurez, brechas y un plan de acción. |
| 02 | [`02-iniciar-proyecto-seguro.md`](02-iniciar-proyecto-seguro.md) | Vas a **arrancar un proyecto nuevo** y quieres seguridad desde el día cero. |
| 03 | [`03-modelado-de-amenazas.md`](03-modelado-de-amenazas.md) | Quieres correr un **threat model (STRIDE)** sobre un sistema o feature. |
| 04 | [`04-disenar-pipeline-seguro.md`](04-disenar-pipeline-seguro.md) | Quieres **diseñar tu pipeline CI/CD** con security gates por fase. |
| 05 | [`05-recomendar-herramientas.md`](05-recomendar-herramientas.md) | Necesitas **elegir herramientas** (SAST/SCA/DAST/secretos) según tu stack y presupuesto. |
| 06 | [`06-respuesta-a-incidentes.md`](06-respuesta-a-incidentes.md) | Estás respondiendo a un **incidente** o quieres dejar listo el **playbook**. |

### Ruta sugerida

- **Proyecto que ya existe:** 01 → (03 sobre lo crítico) → 04 → 05.
- **Proyecto nuevo:** 02 → 03 → 04 → 05.
- **Incidente en curso:** 06 directo (y luego 01 para cerrar brechas).

---

## Marco DevSecOps del curso (referencia rápida)

Esta es la fuente de verdad que comparten todos los prompts. La versión completa
para anteponer está en [`_contexto-devsecops.md`](_contexto-devsecops.md).

### SSDLC — 7 fases
Planificación · Código · Build · Test · Staging/Pre-prod · Producción ·
Operación. La seguridad va integrada en **cada** fase, no como paso final.

### Cuatro categorías de herramienta
- **SAST** — análisis estático del código.
- **SCA** — dependencias de terceros (CVEs, cadena de suministro).
- **DAST** — la app en ejecución (caja negra).
- **Gestión de secretos** — evitar y custodiar credenciales.

(Avanzadas: IaC scanning, contenedores, WAF/RASP, gestión de vulnerabilidades.)

### OWASP Top 10 : 2025 — top 5
- **A01** Broken Access Control · **A02** Security Misconfiguration ·
  **A03** Software Supply Chain Failures · **A04** Cryptographic Failures ·
  **A05** Injection.

### Security gate vs. riesgo aceptado
Un **gate** bloquea lo crítico; una **advertencia** avisa y registra. El **riesgo
aceptado** es una excepción explícita con **responsable + justificación + fecha**;
nunca silenciosa.

### Ambientes y menor privilegio
Separar Desarrollo / QA-Staging / Producción, con compuertas entre ellos. Menor
privilegio: cada quien y cada token solo con el acceso que necesita.

### Respuesta a incidentes — 5 pasos
Identificación → Contención → Notificación → Erradicación → Lecciones
aprendidas. **Contener antes de investigar.**

### Madurez y prioridades
ad-hoc → definido → integrado → optimizado. Horizontes **90 días / 6 meses /
12 meses** = **P1 (0–3 m) / P2 (3–6 m) / P3 (6–12 m)**, con esfuerzo estimado
(bajo / medio / alto).
