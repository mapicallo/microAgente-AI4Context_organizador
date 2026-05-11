import { describe, expect, it } from 'vitest';
import { resolveStepInputs } from './resolveStepInputs';

describe('resolveStepInputs', () => {
  it('interpolates {{prev:0.text}}', () => {
    const prev = [{ text: 'hello' }];
    const out = resolveStepInputs({ text: '{{prev:0.text}}', keep: 1 }, prev);
    expect(out.text).toBe('hello');
    expect(out.keep).toBe(1);
  });

  it('returns empty string when previous step missing', () => {
    const out = resolveStepInputs({ x: '{{prev:9.text}}' }, []);
    expect(out.x).toBe('');
  });
});
