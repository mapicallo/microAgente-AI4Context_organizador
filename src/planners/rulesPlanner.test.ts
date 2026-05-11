import { describe, expect, it } from 'vitest';
import type { OrchestratorTask } from '../orchestrator/types';
import { rulesPlanner } from './rulesPlanner';

function task(userText: string, locale: OrchestratorTask['locale'] = 'es'): OrchestratorTask {
  return { taskId: 'test-task', userText, locale };
}

describe('rulesPlanner', () => {
  it('empty input yields echo with empty text', () => {
    const plan = rulesPlanner.plan(task('   '));
    expect(plan.steps).toHaveLength(1);
    expect(plan.steps[0].agentId).toBe('ai4context.ma.echo');
    expect(plan.steps[0].input).toEqual({ text: '' });
  });

  it('echo: prefix strips and uses echo agent', () => {
    const plan = rulesPlanner.plan(task('echo: hola mundo'));
    expect(plan.steps).toHaveLength(1);
    expect(plan.steps[0].agentId).toBe('ai4context.ma.echo');
    expect(plan.steps[0].input).toEqual({ text: 'hola mundo' });
  });

  it('uppercase keyword yields two-step pipeline', () => {
    const plan = rulesPlanner.plan(task('pon en mayúsculas esto'));
    expect(plan.steps).toHaveLength(2);
    expect(plan.steps[0].agentId).toBe('ai4context.ma.echo');
    expect(plan.steps[1].agentId).toBe('ai4context.ma.uppercase');
    expect(plan.steps[1].input.text).toBe('{{prev:0.text}}');
  });

  it('lines keyword uses split_lines', () => {
    const plan = rulesPlanner.plan(task('lista de cosas\nlíneas'));
    expect(plan.steps).toHaveLength(1);
    expect(plan.steps[0].agentId).toBe('ai4context.ma.split_lines');
  });

  it('default is single echo with full text', () => {
    const plan = rulesPlanner.plan(task('algo sin palabras clave'));
    expect(plan.steps).toHaveLength(1);
    expect(plan.steps[0].agentId).toBe('ai4context.ma.echo');
    expect(plan.steps[0].input).toEqual({ text: 'algo sin palabras clave' });
  });
});
