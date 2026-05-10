import type { Locale } from './orchestrator/types';
import type { TaskRunResult } from './orchestrator/types';

export type PanelToBackgroundMessage =
  | {
      type: 'ORG_RUN_TASK';
      payload: { userText: string; locale: Locale };
    }
  | { type: 'ORG_LIST_AGENTS' };

export type BackgroundToPanelMessage =
  | {
      type: 'ORG_RUN_TASK_RESULT';
      payload: TaskRunResult;
    }
  | {
      type: 'ORG_RUN_TASK_ERROR';
      payload: { message: string };
    }
  | {
      type: 'ORG_LIST_AGENTS_RESULT';
      payload: { manifests: import('./orchestrator/types').AgentManifest[] };
    };
