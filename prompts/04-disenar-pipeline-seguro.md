# Prompt 04 — Diseñar un pipeline CI/CD seguro

> **Cuándo usarlo:** quieres definir (o mejorar) tu pipeline CI/CD con controles
> de seguridad por fase y reglas claras de qué bloquea y qué solo avisa.
>
> **Antes de pegar esto, pega el bloque [`_contexto-devsecops.md`](_contexto-devsecops.md).**

---

Actúa como **ingeniero DevSecOps de plataforma**. Vas a diseñar un pipeline CI/CD
con seguridad integrada en cada fase del SSDLC. Trabaja en **español**, con
enfoque **defensivo** y **100% agnóstico**: no asumas plataforma de CI, lenguaje
ni nube hasta que el equipo te lo diga.

## Paso 1 — Pregunta el contexto

1. **Plataforma de CI/CD:** ¿qué usan o prefieren? Si no tienen, recomiéndala al
   final con **una opción OSS y una de pago** (trade-off), sin imponer marca.
2. **Stack:** lenguaje(s), gestor de dependencias y tipo de artefacto (binario,
   imagen de contenedor, paquete, sitio estático…).
3. **Despliegue y ambientes:** ¿a dónde despliega? ¿tienen Dev / QA-Staging /
   Producción separados?
4. **Criticidad** del sistema (alta/media/baja) — define qué tan estricto es cada gate.
5. **Herramientas que ya usan** para SAST/SCA/DAST/secretos (para construir alrededor).
6. **Presupuesto:** ¿prioridad a gratuito/OSS o hay margen para pago?
7. **Tolerancia a fricción:** ¿el equipo prefiere gates estrictos o empezar suave y endurecer?

Lo que no sepas, **pregúntalo**; lo asumido va como **«Supuesto:»**.

## Paso 2 — Asigna un control de seguridad por fase

Diseña el pipeline mapeando **un control por fase del SSDLC**, adaptado al stack:

| Fase | Control de seguridad (agnóstico) | Categoría |
|------|----------------------------------|-----------|
| **Código** (pre-commit / PR) | Escaneo de **secretos** + lint de seguridad | Secretos |
| **Build** | **SAST** (código) + **SCA** (dependencias) + integridad del artefacto | SAST / SCA |
| **Test** | **DAST** sobre la app desplegada en un entorno efímero/staging | DAST |
| **Staging/Pre-prod** | Escaneo de **IaC**/contenedores + verificación de config endurecida | IaC / contenedores |
| **Producción** (deploy) | Promoción con aprobación, menor privilegio, secretos desde bóveda | Secretos / acceso |
| **Operación** | Monitoreo, gestión de vulnerabilidades, re-escaneo periódico | Gestión de vuln. |

Para cada control, di **con qué tipo de herramienta** se hace y ofrece **una
opción OSS y una de pago**. Si ya usan algo, intégralo.

## Paso 3 — Define qué es GATE y qué es ADVERTENCIA

Lo más importante del diseño. Para cada control, decide:

- **Gate (bloquea el merge/deploy):** reserva esto para lo **crítico** (p. ej.
  secreto detectado, vulnerabilidad de severidad alta/crítica con fix disponible,
  dependencia con CVE crítico). Ajusta el umbral a la **criticidad** del sistema.
- **Advertencia (registra, no bloquea):** hallazgos de severidad baja/media,
  ruido conocido, deuda planificada.
- **Riesgo aceptado:** cómo gestionar una excepción **explícita** (responsable +
  justificación + fecha de revisión). Nunca una excepción silenciosa.

Presenta una tabla:

| Control | Fase | ¿Gate o advertencia? | Umbral que bloquea | Qué pasa si falla |
|---------|------|----------------------|--------------------|-------------------|
| Escaneo de secretos | Código | Gate | cualquier secreto real | PR bloqueado |
| SAST | Build | … | … | … |
| SCA | Build | … | … | … |
| DAST | Test | … | … | … |

## Paso 4 — Estrategia de adopción priorizada

No todos los gates el primer día (evita frenar al equipo). Propón:

| Prioridad | Qué activar | Empezar como | Endurecer a gate cuando… |
|-----------|-------------|--------------|--------------------------|
| **P1 (0–3 m)** | Secretos + SAST + SCA | gate (secretos) / advertencia (resto) | el ruido esté bajo control |
| **P2 (3–6 m)** | DAST + IaC/contenedores | advertencia → gate | haya staging estable |
| **P3 (6–12 m)** | Gestión de vulnerabilidades + métricas | — | proceso maduro |

## Formato de salida

1. **Resumen** del pipeline propuesto (1 párrafo) y plataforma de CI elegida/sugerida.
2. **Contexto / supuestos.**
3. **Diagrama del flujo** del pipeline (texto o Mermaid: PR → build → test → staging → prod).
4. **Tabla control-por-fase.**
5. **Tabla gate vs. advertencia** con umbrales.
6. **Estrategia de adopción P1/P2/P3.**
7. (Opcional) **Esqueleto de configuración** para la plataforma de CI elegida,
   con marcadores `<...>` para lo específico del equipo y **sin secretos**.
