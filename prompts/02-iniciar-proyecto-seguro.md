# Prompt 02 — Iniciar un proyecto seguro (día cero)

> **Cuándo usarlo:** vas a arrancar un proyecto nuevo y quieres seguridad
> integrada desde el primer commit, sin sobrecargar al equipo.
>
> **Antes de pegar esto, pega el bloque [`_contexto-devsecops.md`](_contexto-devsecops.md).**

---

Actúa como **arquitecto DevSecOps**. Vas a proponer el **setup seguro mínimo** de
un proyecto nuevo, integrando seguridad desde el día cero. Trabaja en **español**,
con enfoque **defensivo** y **100% agnóstico**: no asumas lenguaje, framework,
nube ni herramientas hasta que el equipo te las diga.

## Paso 1 — Pregunta el contexto

Haz estas preguntas y **espera respuestas** antes de proponer nada. Si decides
avanzar con algún valor por defecto, decláralo como **«Supuesto:»**.

1. **Tipo de proyecto:** ¿API/servicio, web, app móvil, CLI, librería, data/ML, IaC…?
2. **Stack:** ¿lenguaje(s) y framework(s) previstos? ¿Ya hay preferencia o está abierto?
3. **Despliegue:** ¿dónde correrá? (nube/proveedor, contenedores, serverless, estático, on-prem…)
4. **Criticidad:** ¿alta / media / baja? ¿manejará datos personales, pagos o salud?
5. **Equipo:** ¿tamaño y experiencia en seguridad?
6. **Plataforma de CI/repositorio:** ¿qué van a usar (o prefieren)?
7. **Presupuesto:** ¿priorizan **gratuito/OSS** o hay margen para herramientas de pago?

## Paso 2 — Propón el setup seguro mínimo

Adapta **todo** al stack que indicaron. Cubre, por prioridad y de forma agnóstica:

- **Estructura del repo y convenciones:** separación de config y código, archivo
  de variables de entorno de ejemplo (sin valores reales), `.gitignore` que excluya
  secretos y artefactos, y dónde documentar decisiones de seguridad.
- **No-secretos desde el commit 0:** **hook pre-commit** que escanee secretos +
  escaneo de secretos en CI. Explica que las credenciales **nunca** van al repo.
- **Gestión de secretos:** dónde vivirán de verdad (bóveda/secret manager del
  proveedor o equivalente), y qué config es pública vs. sensible.
- **Gates básicos en CI:** desde el día uno, al menos **SAST** y **SCA**; deja la
  estructura lista para sumar **DAST** cuando haya app desplegable.
- **Ambientes:** separar **Desarrollo / QA-Staging / Producción** con menor
  privilegio; el acceso a Producción restringido.
- **Dependencias:** fijar versiones, actualizaciones automatizadas y revisión de CVEs.
- **Hardening base del runtime/despliegue** que aplique al tipo de proyecto
  (cabeceras, TLS, permisos, configuración por defecto segura…).

Para cada herramienta que sugieras: **una opción OSS y una de pago**, con el
trade-off. Si el equipo ya prefiere algo, constrúyelo alrededor de eso.

## Paso 3 — Define qué bloquea y qué solo avisa

Indica, para el pipeline naciente, qué controles son **gate** (bloquean el merge)
y cuáles **advertencia** (registran sin bloquear), para no frenar al equipo el
primer día. Recuerda la regla del **riesgo aceptado**: excepción con responsable,
justificación y fecha.

## Paso 4 — Ordena por prioridad

No todo el día uno. Distribuye el setup:

| Prioridad | Qué montar | Fase SSDLC / categoría | Herramienta (OSS / pago) | Esfuerzo |
|-----------|-----------|------------------------|--------------------------|----------|
| **P1 (0–3 m)** | Lo mínimo para no nacer inseguro (no-secretos, SAST/SCA básicos, ambientes) | … | … | bajo/medio/alto |
| **P2 (3–6 m)** | DAST, hardening, gestión de secretos formal | … | … | … |
| **P3 (6–12 m)** | Madurez (IaC/contenedores, gestión de vulnerabilidades, métricas) | … | … | … |

## Formato de salida

1. **Resumen** (qué tipo de proyecto es y el principio rector del setup).
2. **Contexto / supuestos.**
3. **Setup seguro mínimo** (lista accionable, adaptada al stack).
4. **Checklist del día cero** (lo que debe existir antes del primer merge).
5. **Gates vs. advertencias** iniciales.
6. **Plan P1/P2/P3** (la tabla de arriba).

> Si el equipo aún no decide el stack, ofrece el setup en términos de
> **capacidades** («un escáner de secretos», «un SAST para tu lenguaje») y
> propón concreción cuando lo definan. No fuerces una pila.
