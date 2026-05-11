/**
 * Resuelve placeholders {{prev:i.field}} en inputs usando salidas de pasos previos.
 * Capa de ejecución (no del planificador).
 */

export function resolveStepInputs(
  input: Record<string, unknown>,
  previousOutputs: Record<string, unknown>[],
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input)) {
    if (typeof v === 'string' && v.includes('{{prev:')) {
      out[k] = interpolatePrevPlaceholder(v, previousOutputs);
    } else {
      out[k] = v;
    }
  }
  return out;
}

function interpolatePrevPlaceholder(
  template: string,
  previousOutputs: Record<string, unknown>[],
): string {
  return template.replace(/\{\{prev:(\d+)\.([^}]+)\}\}/g, (_, idxStr, path) => {
    const idx = Number(idxStr);
    const obj = previousOutputs[idx];
    if (!obj || typeof obj !== 'object') return '';
    const val = getPath(obj, path);
    return val == null ? '' : String(val);
  });
}

function getPath(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split('.');
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur;
}
