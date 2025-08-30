import type { ClassId } from './classes';

export type FeatTier = 'Adventurer' | 'Champion' | 'Epic';

export interface FeatDef {
  id: string;
  classId?: ClassId;          // omit = generic feat (rare, but supported)
  tier: FeatTier;
  name: string;
  description?: string;

  // Optional requirement: only selectable if this feature was chosen in Step 5
  requiresFeatureId?: string;
}

export const FEATS: FeatDef[] = [
  // ----- Wizard feats -----
  { id: 'feat-wiz-bookish-a',   classId: 'wizard', tier: 'Adventurer', name: 'Bookish Wizard (A)',
    description: 'Small bonus to a bookish talent.',
    requiresFeatureId: 'wiz-book' },

  { id: 'feat-wiz-evoker-a',    classId: 'wizard', tier: 'Adventurer', name: 'Evocation (A)',
    description: 'Improve damage/targets on evocation effects.',
    requiresFeatureId: 'wiz-evoker' },

  { id: 'feat-wiz-cantrip-a',   classId: 'wizard', tier: 'Adventurer', name: 'Cantrip Mastery (A)',
    description: 'More flexible cantrips.',
    requiresFeatureId: 'wiz-cantrip-mastery' },

  { id: 'feat-wiz-missile-a',   classId: 'wizard', tier: 'Adventurer', name: 'Magic Missile (A)',
    description: 'Enhance at-will missile.',
    requiresFeatureId: 'wiz-magic-missile' },

  { id: 'feat-wiz-fireball-c',  classId: 'wizard', tier: 'Champion',   name: 'Fireball (C)',
    description: 'Bigger boom.',
    requiresFeatureId: 'wiz-fireball' },

  { id: 'feat-wiz-shield-c',    classId: 'wizard', tier: 'Champion',   name: 'Shield (C)',
    description: 'Improved protection.',
    requiresFeatureId: 'wiz-shield' },

  { id: 'feat-wiz-evoker-e',    classId: 'wizard', tier: 'Epic',       name: 'Evocation (E)',
    description: 'Top-tier evocation bonus.',
    requiresFeatureId: 'wiz-evoker' },

  // ----- Fighter feats (a couple just to demo multi-class) -----
  { id: 'feat-ftr-weapon-a',    classId: 'fighter', tier: 'Adventurer', name: 'Weapon Mastery (A)',
    requiresFeatureId: 'ftr-weapon-mastery' },

  { id: 'feat-ftr-power-c',     classId: 'fighter', tier: 'Champion',   name: 'Power Attack (C)',
    requiresFeatureId: 'ftr-power-cleave' },
];

/** Filter feat list by class and allowed tiers; keep generic feats too */
export function featsFor(classId: ClassId | undefined, allowedTiers: Set<FeatTier>) {
  return FEATS.filter(f =>
    allowedTiers.has(f.tier) && (!f.classId || f.classId === classId)
  );
}
