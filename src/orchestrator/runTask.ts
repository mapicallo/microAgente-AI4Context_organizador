import { getAgent } from './registry';
import { planFromTask, resolveStepInputs } from './planFromTask';
import type {
  OrchestratorTask,
  StepResult,
  TaskRunResult,
} from './types';

function synthesizeSummary(
  steps: StepResult[],
  locale: OrchestratorTask['locale'],
): string {
  const last = steps[steps.length - 1];
  if (!last) {
    return locale === 'es' ? 'Sin pasos ejecutados.' : 'No steps executed.';
  }
  if (!last.ok) {
    return locale === 'es'
      ? `Error en paso ${last.stepIndex + 1} (${last.agentId}): ${last.error ?? '?'}`
      : `Error at step ${last.stepIndex + 1} (${last.agentId}): ${last.error ?? '?'}`;
  }
  const out = last.output ?? {};
  if (typeof out.text === 'string') {
    return out.text;
  }
  if (Array.isArray(out.lines)) {
    return (out.lines as string[]).join('\n');
  }
  try {
    return JSON.stringify(out, null, 2);
  } catch {
    return locale === 'es' ? 'Hecho.' : 'Done.';
  }
}

export async function runTask(
  task: OrchestratorTask,
  signal: AbortSignal,
): Promise<TaskRunResult> {
  const plan = planFromTask(task);
  const stepResults: StepResult[] = [];
  const outputs: Record<string, unknown>[] = [];

  for (let i = 0; i < plan.steps.length; i++) {
    const step = plan.steps[i];
    const agent = getAgent(step.agentId);
    const t0 = performance.now();

    if (!agent) {
      stepResults.push({
        stepIndex: i,
        agentId: step.agentId,
        ok: false,
        error: `Unknown agent: ${step.agentId}`,
        durationMs: Math.round(performance.now() - t0),
      });
      break;
    }

    const resolvedInput = resolveStepInputs(i, step.input, outputs);

    try {
      signal.throwIfAborted();
      const output = await agent.execute(resolvedInput, {
        locale: task.locale,
        signal,
        taskId: task.taskId,
      });
      outputs.push(output);
      stepResults.push({
        stepIndex: i,
        agentId: step.agentId,
        ok: true,
        output,
        durationMs: Math.round(performance.now() - t0),
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      stepResults.push({
        stepIndex: i,
        agentId: step.agentId,
        ok: false,
        error: msg,
        durationMs: Math.round(performance.now() - t0),
      });
      break;
    }
  }

  const summary = synthesizeSummary(stepResults, task.locale);

  return {
    taskId: task.taskId,
    plan,
    steps: stepResults,
    summary,
  };
}
