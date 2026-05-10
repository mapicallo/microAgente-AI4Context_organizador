import type { ExecutionPlan, Locale, OrchestratorTask } from './types';

/**
 * Planificador MVP sin LLM: reglas por palabras clave / plantillas.
 * Sustituible más adelante por un Planner que llame a un modelo.
 */

const ID_ECHO = 'ai4context.ma.echo';
const ID_UPPERCASE = 'ai4context.ma.uppercase';
const ID_SPLIT_LINES = 'ai4context.ma.split_lines';

export function planFromTask(task: OrchestratorTask): ExecutionPlan {
  const t = task.userText.trim();
  const lower = t.toLowerCase();

  if (!t) {
    return {
      plannerNote:
        task.locale === 'es'
          ? 'Texto vacío: solo paso comprobación.'
          : 'Empty input: single check step only.',
      steps: [{ agentId: ID_ECHO, input: { text: '' } }],
    };
  }

  if (/\becho\b/i.test(t) || lower.startsWith('echo:')) {
    const payload = t.replace(/^\s*echo\s*:?\s*/i, '').trim();
    return {
      plannerNote:
        task.locale === 'es'
          ? 'Modo demo: cadena devuelta por el agente echo.'
          : 'Demo mode: string returned by echo agent.',
      steps: [{ agentId: ID_ECHO, input: { text: payload || t } }],
    };
  }

  if (/\b(mayúsculas|uppercase|caps)\b/i.test(t)) {
    return {
      plannerNote:
        task.locale === 'es'
          ? 'Cadena pasada a mayúsculas (demo de dos pasos).'
          : 'Uppercase pipeline (two-step demo).',
      steps: [
        { agentId: ID_ECHO, input: { text: t } },
        { agentId: ID_UPPERCASE, input: { text: '{{prev:0.text}}' } },
      ],
    };
  }

  if (/\b(lista|lines|líneas|lineas)\b/i.test(t)) {
    return {
      plannerNote:
        task.locale === 'es'
          ? 'Partir el texto en líneas no vacías.'
          : 'Split non-empty lines.',
      steps: [{ agentId: ID_SPLIT_LINES, input: { text: t } }],
    };
  }

  return {
    plannerNote:
      task.locale === 'es'
        ? 'Plan por defecto: eco del texto para validar el tubo.'
        : 'Default plan: echo text to validate the pipeline.',
    steps: [{ agentId: ID_ECHO, input: { text: t } }],
  };
}

/** Resuelve placeholders {{prev:i.field}} en inputs usando resultados de pasos anteriores */
export function resolveStepInputs(
  stepIndex: number,
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
