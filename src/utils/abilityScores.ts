import type { AbilityKey } from '../types/character';
import { ABILITY_KEYS } from '../types/rules';

/**
 * Apply +2 boosts to a base assignment.
 * Valid only if exactly 2 distinct boosts are selected.
 */
export function applyAbilityScores(
  assign: Record<AbilityKey, number>,
  boosts: AbilityKey[]
): Record<AbilityKey, number> {
  if (boosts.length !== 2) {
    throw new Error('You must apply boosts to exactly 2 abilities.');
  }
  const unique = new Set(boosts);
  if (unique.size !== 2) {
    throw new Error('Boosts must be applied to 2 different abilities.');
  }

  return ABILITY_KEYS.reduce((acc, k) => {
    acc[k] = assign[k] + (unique.has(k) ? 2 : 0);
    return acc;
  }, {} as Record<AbilityKey, number>);
}
