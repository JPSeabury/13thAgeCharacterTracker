import { describe, it, expect } from 'vitest';
import { applyAbilityScores } from './abilityScores';
import type { AbilityKey } from '../types/character';

const baseAssign: Record<AbilityKey, number> = {
  str: 17,
  dex: 15,
  con: 14,
  int: 13,
  wis: 12,
  cha: 10,
};

describe('applyAbilityScores', () => {
  it('applies +2 to exactly two chosen abilities', () => {
    const result = applyAbilityScores(baseAssign, ['str', 'dex']);
    expect(result.str).toBe(19);
    expect(result.dex).toBe(17);
    expect(result.con).toBe(14);
    expect(result.cha).toBe(10);
  });

  it('throws if fewer than 2 boosts', () => {
    expect(() => applyAbilityScores(baseAssign, ['str'])).toThrow(
      /exactly 2 abilities/i
    );
  });

  it('throws if more than 2 boosts', () => {
    expect(() =>
      applyAbilityScores(baseAssign, ['str', 'dex', 'con'])
    ).toThrow(/exactly 2 abilities/i);
  });

  it('throws if the same ability is boosted twice', () => {
    expect(() =>
      applyAbilityScores(baseAssign, ['str', 'str'])
    ).toThrow(/2 different abilities/i);
  });
});
