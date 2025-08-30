import type { FeatTier } from '../data/feats';

/**
 * 13th Age grants a feat at odd levels (1,3,5,7,9) → total = ceil(level/2).
 * Tier gating (simplified):
 * - Levels 1–4: Adventurer only
 * - Levels 5–7: Adventurer or Champion
 * - Levels 8–10: Adventurer, Champion, Epic
 */
export function totalFeatsByLevel(level: number): number {
  return Math.ceil(level / 2);
}

export function allowedTiersByLevel(level: number): Set<FeatTier> {
  if (level >= 8) return new Set<FeatTier>(['Adventurer', 'Champion', 'Epic']);
  if (level >= 5) return new Set<FeatTier>(['Adventurer', 'Champion']);
  return new Set<FeatTier>(['Adventurer']);
}
