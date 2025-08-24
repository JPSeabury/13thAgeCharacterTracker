export const DEFAULT_ARRAY: number[] = [17, 15, 14, 13, 12, 10];
export const ABILITY_KEYS = ['str','dex','con','int','wis','cha'] as const;

export const CLASS_TALENT_COUNTS: Record<string, { talents: number }> = {
  Barbarian: { talents: 3 },
  Bard: { talents: 3 },
  Cleric: { talents: 3 },
  Fighter: { talents: 3 },
  Paladin: { talents: 3 },
  Ranger: { talents: 3 },
  Rogue: { talents: 3 },
  Sorcerer: { talents: 3 },
  Wizard: { talents: 3 },
};