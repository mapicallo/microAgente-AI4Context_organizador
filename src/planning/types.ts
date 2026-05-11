import type { ExecutionPlan, OrchestratorTask } from '../orchestrator/types';

/**
 * Planificador sustituible (reglas, LLM en fases posteriores).
 */
export type Planner = {
  readonly id: string;
  plan(task: OrchestratorTask): ExecutionPlan;
};
