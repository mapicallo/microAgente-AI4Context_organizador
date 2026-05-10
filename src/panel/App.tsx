import { useCallback, useEffect, useState } from 'react';
import type { AgentManifest, TaskRunResult } from '../orchestrator/types';
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
  }
> = {
  es: {
    title: 'MicroAgente-AI4Context (organizador)',
    hint: 'Escribe una petición. Prueba: echo: hola · texto con mayúsculas · lista de líneas…',
    run: 'Ejecutar plan',
    agents: 'Micro-agentes registrados',
    result: 'Resultado',
    steps: 'Pasos',
    planner: 'Planificador',
    localeLabel: 'Idioma',
  },
  en: {
    title: 'MicroAgente-AI4Context (organizer)',
    hint: 'Enter a request. Try: echo: hello · uppercase · lines…',
    run: 'Run plan',
    agents: 'Registered micro-agents',
    result: 'Result',
    steps: 'Steps',
    planner: 'Planner',
    localeLabel: 'Language',
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

export default function App() {
  const [locale, setLocale] = useState<Locale>('es');
  const [text, setText] = useState('');
  const [manifests, setManifests] = useState<AgentManifest[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<TaskRunResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const t = STRINGS[locale];

  useEffect(() => {
    void sendMessage({ type: 'ORG_LIST_AGENTS' }).then((r) => {
      if (r.type === 'ORG_LIST_AGENTS_RESULT') {
        setManifests(r.payload.manifests);
      }
    });
  }, []);

  const onRun = useCallback(async () => {
    setLoading(true);
    setError(null);
    setLastResult(null);
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
        setLastResult(r.payload);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [text, locale]);

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

      {lastResult ? (
        <section className="org-section">
          <h2>{t.result}</h2>
          <pre className="org-pre">{lastResult.summary}</pre>
          {lastResult.plan.plannerNote ? (
            <p className="org-planner">
              <strong>{t.planner}:</strong> {lastResult.plan.plannerNote}
            </p>
          ) : null}
          <h3>{t.steps}</h3>
          <ul className="org-steps">
            {lastResult.steps.map((s) => (
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
