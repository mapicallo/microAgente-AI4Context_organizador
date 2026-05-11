import { useCallback, useEffect, useState } from 'react';
import type { AgentManifest } from '../orchestrator/types';
import type { MissionRecord } from '../mission/types';
import type { BackgroundToPanelMessage, PanelToBackgroundMessage } from '../messages';

type Locale = 'es' | 'en';

const STRINGS: Record<
  Locale,
  {
    title: string;
    hint: string;
    run: string;
    agents: string;
    result: string;
    steps: string;
    planner: string;
    localeLabel: string;
    missions: string;
    missionState: Record<MissionRecord['state'], string>;
    noMissions: string;
    missionId: string;
  }
> = {
  es: {
    title: 'MicroAgente-AI4Context (organizador)',
    hint: 'Escribe una petición. Prueba: echo: hola · texto con mayúsculas · lista de líneas…',
    run: 'Ejecutar misión',
    agents: 'Micro-agentes registrados',
    result: 'Resultado',
    steps: 'Pasos',
    planner: 'Planificador',
    localeLabel: 'Idioma',
    missions: 'Misiones recientes (IndexedDB local)',
    missionState: {
      draft: 'borrador',
      running: 'en curso',
      paused: 'pausada',
      completed: 'completada',
      failed: 'fallida',
    },
    noMissions: 'Aún no hay misiones guardadas.',
    missionId: 'ID',
  },
  en: {
    title: 'MicroAgente-AI4Context (organizer)',
    hint: 'Enter a request. Try: echo: hello · uppercase · lines…',
    run: 'Run mission',
    agents: 'Registered micro-agents',
    result: 'Result',
    steps: 'Steps',
    planner: 'Planner',
    localeLabel: 'Language',
    missions: 'Recent missions (local IndexedDB)',
    missionState: {
      draft: 'draft',
      running: 'running',
      paused: 'paused',
      completed: 'completed',
      failed: 'failed',
    },
    noMissions: 'No saved missions yet.',
    missionId: 'ID',
  },
};

function sendMessage(msg: PanelToBackgroundMessage): Promise<BackgroundToPanelMessage> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(msg, (response: BackgroundToPanelMessage) => {
      const err = chrome.runtime.lastError;
      if (err) {
        reject(new Error(err.message));
        return;
      }
      resolve(response);
    });
  });
}

function loadMissionsList(): Promise<MissionRecord[]> {
  return sendMessage({ type: 'ORG_LIST_MISSIONS' }).then((r) => {
    if (r.type === 'ORG_LIST_MISSIONS_RESULT') {
      return r.payload.missions;
    }
    return [];
  });
}

export default function App() {
  const [locale, setLocale] = useState<Locale>('es');
  const [text, setText] = useState('');
  const [manifests, setManifests] = useState<AgentManifest[]>([]);
  const [missions, setMissions] = useState<MissionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastMission, setLastMission] = useState<MissionRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  const t = STRINGS[locale];

  const refreshMissions = useCallback(() => {
    void loadMissionsList().then(setMissions);
  }, []);

  useEffect(() => {
    void sendMessage({ type: 'ORG_LIST_AGENTS' }).then((r) => {
      if (r.type === 'ORG_LIST_AGENTS_RESULT') {
        setManifests(r.payload.manifests);
      }
    });
    refreshMissions();
  }, [refreshMissions]);

  const onRun = useCallback(async () => {
    setLoading(true);
    setError(null);
    setLastMission(null);
    try {
      const r = await sendMessage({
        type: 'ORG_RUN_TASK',
        payload: { userText: text, locale },
      });
      if (r.type === 'ORG_RUN_TASK_ERROR') {
        setError(r.payload.message);
        return;
      }
      if (r.type === 'ORG_RUN_TASK_RESULT') {
        setLastMission(r.payload);
        refreshMissions();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [text, locale, refreshMissions]);

  return (
    <div className="org-shell">
      <header className="org-header">
        <h1 className="org-title">{t.title}</h1>
        <div className="org-locale">
          <label>
            {t.localeLabel}{' '}
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as Locale)}
              className="org-select"
            >
              <option value="es">ES</option>
              <option value="en">EN</option>
            </select>
          </label>
        </div>
      </header>

      <p className="org-hint">{t.hint}</p>

      <textarea
        className="org-input"
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="echo: …"
      />

      <button type="button" className="org-run" onClick={() => void onRun()} disabled={loading}>
        {loading ? '…' : t.run}
      </button>

      {error ? <p className="org-error">{error}</p> : null}

      <section className="org-section">
        <div className="org-section-head">
          <h2 className="org-section-title">{t.missions}</h2>
          <button type="button" className="org-refresh" onClick={() => refreshMissions()}>
            ↻
          </button>
        </div>
        {missions.length === 0 ? (
          <p className="org-muted">{t.noMissions}</p>
        ) : (
          <ul className="org-mission-list">
            {missions.map((m) => (
              <li key={m.missionId} className="org-mission-row">
                <span className={`org-mission-badge org-mission-badge--${m.state}`}>
                  {t.missionState[m.state]}
                </span>
                <span className="org-mission-goal" title={m.goal}>
                  {m.goal.slice(0, 72)}
                  {m.goal.length > 72 ? '…' : ''}
                </span>
                <span className="org-mission-time">
                  {new Date(m.updatedAt).toLocaleString(locale === 'es' ? 'es' : 'en')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {lastMission ? (
        <section className="org-section">
          <h2>{t.result}</h2>
          <p className="org-meta">
            <code>{t.missionId}</code> {lastMission.missionId.slice(0, 8)}… ·{' '}
            <span className={`org-mission-badge org-mission-badge--${lastMission.state}`}>
              {t.missionState[lastMission.state]}
            </span>
          </p>
          {lastMission.error ? <p className="org-error">{lastMission.error}</p> : null}
          <pre className="org-pre">{lastMission.summary ?? '—'}</pre>
          {lastMission.plan?.plannerNote ? (
            <p className="org-planner">
              <strong>{t.planner}:</strong> {lastMission.plan.plannerNote}
            </p>
          ) : null}
          <h3>{t.steps}</h3>
          <ul className="org-steps">
            {(lastMission.steps ?? []).map((s) => (
              <li key={`${s.stepIndex}-${s.agentId}`} className={s.ok ? 'org-step-ok' : 'org-step-err'}>
                <span className="org-step-id">{s.agentId}</span>
                {s.ok ? (
                  <pre className="org-pre-small">{JSON.stringify(s.output, null, 2)}</pre>
                ) : (
                  <span>{s.error}</span>
                )}
                <span className="org-ms">{s.durationMs} ms</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="org-section">
        <h2>{t.agents}</h2>
        <ul className="org-agents">
          {manifests.map((m) => (
            <li key={m.id}>
              <code>{m.id}</code>
              <span className="org-agent-title">
                {locale === 'es' ? m.titleEs : m.titleEn}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
