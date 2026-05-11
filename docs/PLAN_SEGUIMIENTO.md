# Plan de seguimiento — MicroAgente-AI4Context (organizador)

Este archivo es la **fuente de verdad** para retomar el trabajo tras pausas, urgencias o desvíos.  
**Regla:** al cerrar una sesión de trabajo, actualiza al menos **Estado por fase**, **Última sesión** y **Siguiente paso**.

---

## Cómo volver al plan (ritual rápido)

1. Abrir este documento y la tabla **Estado por fase**.
2. Leer **Última sesión** y **Notas / bloqueos**.
3. Ejecutar **Siguiente paso** (una sola acción concreta).
4. Si algo cambió el alcance, anotarlo en **Decisiones registradas** con fecha.

---

## Leyenda de estado

| Estado        | Significado |
|---------------|-------------|
| `pendiente`   | No empezado |
| `en_curso`    | Alguien está trabajando activamente |
| `hecho`       | Entregable aceptado para esa fase |
| `pausado`     | Parado a propósito (motivo en notas) |
| `bloqueado`   | No puede avanzar sin desbloquear (motivo obligatorio) |
| `recortado`   | Alcance reducido respecto al plan original |

---

## Estado por fase (actualizar siempre)

Referencia de fases: ver plan maestro acordado (Mission Engine, connectors API/web, seguridad, MCP opcional).

| Fase | Nombre breve                     | Estado    | Notas / enlaces PR-commit |
|------|----------------------------------|-----------|----------------------------|
| 0    | Modelo + Agent Contract borrador | `hecho` | `src/contracts/agentContract.ts`, `src/mission/types.ts` |
| 1    | Mission Engine + IndexedDB       | `hecho` | `src/storage/missionsDb.ts`, `src/mission/runMission.ts`, panel lista |
| 2    | Planner modular                  | `hecho` | `Planner`, `planners/rulesPlanner.ts`, Vitest |
| 3    | Connector API (ej. OpenAI-compat)| `pendiente` |                            |
| 4    | Connector web_tab (demo curada)  | `pendiente` |                            |
| 5    | Seguridad / trust / permisos UI  | `pendiente` |                            |
| 6    | Spike MCP (opcional)             | `pendiente` |                            |
| 7    | Landing AI4Context / legal       | `pendiente` |                            |

---

## Última sesión de trabajo

| Campo | Valor |
|-------|--------|
| **Fecha** | 2026-05-11 |
| **Quién** | implementación asistida |
| **Qué se hizo** | Fase 2: interfaz `Planner`, `rulesPlanner`, interpolación en `resolveStepInputs`; tests Vitest (`npm test`). |
| **Commit / PR** | _(tras push)_ |

---

## Siguiente paso (una sola cosa)

_Escribir aquí la **única** acción siguiente para no dispersarse._

> **Siguiente paso:** Fase 3 — connector API (OpenAI-compatible u otro): UI guardar API key en `chrome.storage`, un agente demo que llame `fetch`, artefacto persistido en misión.

---

## Bloqueos activos

_Lista corta. Si está vacío, escribir “Ninguno”._

| ID | Desde | Descripción | Desbloqueo necesario |
|----|-------|-------------|----------------------|
| — | — | — | — |

---

## Decisiones registradas

_Orden cronológico inverso (última arriba)._

| Fecha | Decisión | Motivo |
|-------|----------|--------|
| — | — | — |

---

## Checklist “¿estamos perdidos?”

- [ ] ¿La tabla **Estado por fase** refleja la realidad del código?
- [ ] ¿**Última sesión** tiene fecha y qué se hizo?
- [ ] ¿**Siguiente paso** está escrito y es una sola acción?
- [ ] ¿Los bloqueos tienen dueño o siguiente paso para desbloquear?

Si algo falla, dedicar **15 min** solo a actualizar este archivo antes de codificar.

---

## Versión del plan maestro

_Pega aquí la fecha o versión del documento de planificación largo que sigáis (para saber si hay que re-sincronizar)._

- Plan maestro referenciado: _fecha / versión_
- Última revisión de coherencia con este archivo: _fecha_
