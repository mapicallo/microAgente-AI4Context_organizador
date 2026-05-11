/**
 * Contrato interno del organizador (microAgente-AI4Context_organizador).
 * IDs de agentes: prefijo estable `ai4context.ma.*`
 */

export type Locale = 'es' | 'en';

/**
 * Petición en vuelo al ejecutar un plan (ligada a `missionId` en Mission Engine).
 */
export type OrchestratorTask = {
  taskId: string;
  userText: string;
  locale: Locale;
  /** Metadatos opcionales (p. ej. pestaña activa en fases posteriores) */
  context?: Record<string, unknown>;
};

/** Un paso del plan dirigido a un micro-agente registrado */
export type PlanStep = {
  agentId: string;
  /** Entrada acotada para ese agente */
  input: Record<string, unknown>;
  /** Índices de pasos previos cuyo output se inyecta (futuro) */
  dependsOn?: number[];
};

export type ExecutionPlan = {
  steps: PlanStep[];
  /** Motivo legible de por qué el planificador eligió estos pasos */
  plannerNote?: string;
};

export type StepResult = {
  stepIndex: number;
  agentId: string;
  ok: boolean;
  output?: Record<string, unknown>;
  error?: string;
  durationMs: number;
};

export type TaskRunResult = {
  taskId: string;
  plan: ExecutionPlan;
  steps: StepResult[];
  /** Texto final para mostrar al usuario (síntesis simple en MVP) */
  summary: string;
};

export type AgentExecuteContext = {
  locale: Locale;
  signal: AbortSignal;
  taskId: string;
};

/** Manifiesto opcional para UI y documentación */
export type AgentManifest = {
  id: string;
  titleEn: string;
  titleEs: string;
  descriptionEn: string;
  descriptionEs: string;
};

export type RegisteredAgent = {
  manifest: AgentManifest;
  execute: (
    input: Record<string, unknown>,
    ctx: AgentExecuteContext,
  ) => Promise<Record<string, unknown>>;
};
