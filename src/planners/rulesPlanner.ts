import type { Planner } from '../planning/types';
import type { ExecutionPlan, OrchestratorTask } from '../orchestrator/types';

const ID_ECHO = 'ai4context.ma.echo';
const ID_UPPERCASE = 'ai4context.ma.uppercase';
const ID_SPLIT_LINES = 'ai4context.ma.split_lines';

function planRules(task: OrchestratorTask): ExecutionPlan {
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

/** Planificador MVP por palabras clave (sin LLM). */
export const rulesPlanner: Planner = {
  id: 'ai4context.planner.rules',
  plan: planRules,
};
