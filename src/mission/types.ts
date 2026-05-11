import type { ExecutionPlan, Locale, StepResult } from '../orchestrator/types';

/**
 * Estados del ciclo de vida de una misión (Mission Engine).
 */
export type MissionState =
  | 'draft'
  | 'running'
  | 'paused'
  | 'completed'
  | 'failed';

/**
 * Registro persistido en IndexedDB tras ejecutar (o intentar) un plan.
 */
export type MissionRecord = {
  missionId: string;
  /** Objetivo en lenguaje natural (entrada del usuario) */
  goal: string;
  locale: Locale;
  state: MissionState;
  createdAt: number;
  updatedAt: number;
  plan?: ExecutionPlan;
  steps?: StepResult[];
  summary?: string;
  /** Mensaje si falló la ejecución antes del resultado estructurado */
  error?: string;
};
