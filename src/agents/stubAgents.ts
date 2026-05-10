import { registerAgent } from '../orchestrator/registry';
import type { AgentManifest, RegisteredAgent } from '../orchestrator/types';

const echo: RegisteredAgent = {
  manifest: {
    id: 'ai4context.ma.echo',
    titleEn: 'Echo (demo)',
    titleEs: 'Eco (demo)',
    descriptionEn: 'Returns the input text unchanged.',
    descriptionEs: 'Devuelve el texto de entrada sin cambios.',
  },
  async execute(input) {
    const text = typeof input.text === 'string' ? input.text : '';
    return { text };
  },
};

const uppercase: RegisteredAgent = {
  manifest: {
    id: 'ai4context.ma.uppercase',
    titleEn: 'Uppercase (demo)',
    titleEs: 'Mayúsculas (demo)',
    descriptionEn: 'Uppercases the input string.',
    descriptionEs: 'Pasa el texto a mayúsculas.',
  },
  async execute(input) {
    const text = typeof input.text === 'string' ? input.text : '';
    return { text: text.toUpperCase() };
  },
};

const splitLines: RegisteredAgent = {
  manifest: {
    id: 'ai4context.ma.split_lines',
    titleEn: 'Split lines (demo)',
    titleEs: 'Partir líneas (demo)',
    descriptionEn: 'Splits text into non-empty lines.',
    descriptionEs: 'Divide el texto en líneas no vacías.',
  },
  async execute(input) {
    const text = typeof input.text === 'string' ? input.text : '';
    const lines = text
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    return { lines, count: lines.length };
  },
};

/** Registra los micro-agentes demo incluidos en este paquete */
export function registerStubAgents(): void {
  registerAgent(echo);
  registerAgent(uppercase);
  registerAgent(splitLines);
}

export const STUB_MANIFESTS: AgentManifest[] = [
  echo.manifest,
  uppercase.manifest,
  splitLines.manifest,
];
