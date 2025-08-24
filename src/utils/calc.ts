import type { AbilityScores } from '../types/character';

export const mod = (score: number) => Math.floor((score - 10) / 2);

export function emptyAbilities(): AbilityScores {
  return { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
}