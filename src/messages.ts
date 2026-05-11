import type { Locale } from './orchestrator/types';
import type { MissionRecord } from './mission/types';

export type PanelToBackgroundMessage =
  | {
      type: 'ORG_RUN_TASK';
      payload: { userText: string; locale: Locale };
    }
  | { type: 'ORG_LIST_AGENTS' }
  | { type: 'ORG_LIST_MISSIONS' };

export type BackgroundToPanelMessage =
  | {
      type: 'ORG_RUN_TASK_RESULT';
      payload: MissionRecord;
    }
  | {
      type: 'ORG_RUN_TASK_ERROR';
      payload: { message: string };
    }
  | {
      type: 'ORG_LIST_AGENTS_RESULT';
      payload: { manifests: import('./orchestrator/types').AgentManifest[] };
    }
  | {
      type: 'ORG_LIST_MISSIONS_RESULT';
      payload: { missions: MissionRecord[] };
    };
