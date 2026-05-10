import { registerStubAgents } from './agents';
import { listAgentManifests } from './orchestrator/registry';
import { runTask } from './orchestrator/runTask';
import type { BackgroundToPanelMessage, PanelToBackgroundMessage } from './messages';

registerStubAgents();

chrome.runtime.onInstalled.addListener(() => {
  console.info('[microAgente-AI4Context_organizador] installed');
});

chrome.action.onClicked.addListener(() => {
  const url = chrome.runtime.getURL('panel.html');
  void chrome.windows.create({
    url,
    type: 'popup',
    width: 480,
    height: 820,
    focused: true,
  });
});

chrome.runtime.onMessage.addListener(
  (
    msg: PanelToBackgroundMessage,
    _sender,
    sendResponse: (r: BackgroundToPanelMessage) => void,
  ): boolean => {
    if (msg.type === 'ORG_LIST_AGENTS') {
      sendResponse({
        type: 'ORG_LIST_AGENTS_RESULT',
        payload: { manifests: listAgentManifests() },
      });
      return false;
    }

    if (msg.type === 'ORG_RUN_TASK') {
      void (async () => {
        const taskId = crypto.randomUUID();
        const controller = new AbortController();
        try {
          const result = await runTask(
            {
              taskId,
              userText: msg.payload.userText,
              locale: msg.payload.locale,
            },
            controller.signal,
          );
          sendResponse({ type: 'ORG_RUN_TASK_RESULT', payload: result });
        } catch (e) {
          const message = e instanceof Error ? e.message : String(e);
          sendResponse({ type: 'ORG_RUN_TASK_ERROR', payload: { message } });
        }
      })();
      return true;
    }

    return false;
  },
);
