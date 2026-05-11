# MicroAgente-AI4Context (organizador)

Extensión Chromium (MV3) que implementa el **organizador** del ecosistema micro-agentes AI4Context: planifica y ejecuta pasos contra agentes registrados en el service worker (local-first, sin backend obligatorio). Las **misiones** se guardan en **IndexedDB** del navegador y aparecen en el panel como historial reciente.

**Seguimiento del plan (tras pausas o urgencias):** [`docs/PLAN_SEGUIMIENTO.md`](docs/PLAN_SEGUIMIENTO.md) — estado por fase, siguiente paso único, bloqueos.

## Desarrollo

```bash
npm install
npm run icons
npm run dev
```

Carga la carpeta `dist/` en `chrome://extensions` (modo desarrollador) tras `npm run build`.

## Demo

- `echo: hola` → agente `ai4context.ma.echo`
- Texto con **mayúsculas** / **uppercase** → eco + `ai4context.ma.uppercase`
- **lista** / **lines** → `ai4context.ma.split_lines`

## Empaquetado

```bash
npm run pack
```

Genera un `.zip` listo para subir a tiendas (ajusta iconos y manifest antes de publicar).

## IDs de agentes (MVP)

| ID | Rol |
|----|-----|
| `ai4context.ma.echo` | Demo eco |
| `ai4context.ma.uppercase` | Demo mayúsculas |
| `ai4context.ma.split_lines` | Demo partir líneas |
