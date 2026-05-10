import type { RegisteredAgent } from './types';

const agents = new Map<string, RegisteredAgent>();

export function registerAgent(agent: RegisteredAgent): void {
  if (agents.has(agent.manifest.id)) {
    console.warn(`[orchestrator] overwriting agent ${agent.manifest.id}`);
  }
  agents.set(agent.manifest.id, agent);
}

export function getAgent(id: string): RegisteredAgent | undefined {
  return agents.get(id);
}

export function listAgents(): RegisteredAgent[] {
  return [...agents.values()].sort((a, b) => a.manifest.id.localeCompare(b.manifest.id));
}

export function listAgentManifests(): RegisteredAgent['manifest'][] {
  return listAgents().map((a) => a.manifest);
}
