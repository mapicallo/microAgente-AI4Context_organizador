import { runTask } from '../orchestrator/runTask';
import type { OrchestratorTask } from '../orchestrator/types';
import type { MissionRecord } from './types';
import { putMission } from '../storage/missionsDb';

function missionSucceeded(steps: MissionRecord['steps']): boolean {
  if (!steps?.length) return false;
  return steps.every((s) => s.ok);
}

/**
 * Crea registro en estado running, ejecuta el plan y persiste resultado final.
 */
export async function runMission(
  payload: { userText: string; locale: OrchestratorTask['locale'] },
  signal: AbortSignal,
): Promise<MissionRecord> {
  const missionId = crypto.randomUUID();
  const now = Date.now();

  const draft: MissionRecord = {
    missionId,
    goal: payload.userText,
    locale: payload.locale,
    state: 'running',
    createdAt: now,
    updatedAt: now,
  };

  await putMission(draft);

  const task: OrchestratorTask = {
    taskId: missionId,
    userText: payload.userText,
    locale: payload.locale,
  };

  try {
    const result = await runTask(task, signal);
    const finalState: MissionRecord = {
      ...draft,
      state: missionSucceeded(result.steps) ? 'completed' : 'failed',
      plan: result.plan,
      steps: result.steps,
      summary: result.summary,
      updatedAt: Date.now(),
    };
    await putMission(finalState);
    return finalState;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const failed: MissionRecord = {
      ...draft,
      state: 'failed',
      error: msg,
      updatedAt: Date.now(),
    };
    await putMission(failed);
    return failed;
  }
}
