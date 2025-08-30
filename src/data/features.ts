import type { ClassId } from './classes';

export type Usage = 'At-Will' | 'Battle' | 'Encounter' | 'Daily' | 'Arc' | 'Recharge';
export type FeatureKind = 'talent' | 'power' | 'spell' | 'maneuver';

export interface FeatureDef {
  id: string;
  classId: ClassId;        // which class it belongs to
  kind: FeatureKind;       // talent / power / spell / maneuver
  name: string;
  usage: Usage;
  description?: string;
}

/** Minimal sample set for wiring Step 5 UI */
export const FEATURES: FeatureDef[] = [
  // Fighter
  { id: 'ftr-weapon-mastery', classId: 'fighter', kind: 'talent', name: 'Weapon Mastery', usage: 'Passive', description: 'Proficiency boosts.' } as any,
  { id: 'ftr-armor-master',   classId: 'fighter', kind: 'talent', name: 'Armor Master',   usage: 'Passive' } as any,
  { id: 'ftr-power-cleave',   classId: 'fighter', kind: 'maneuver', name: 'Power Attack', usage: 'Encounter' },
  { id: 'ftr-defend',         classId: 'fighter', kind: 'maneuver', name: 'Defensive Fighting', usage: 'Battle' },

  // Wizard
  { id: 'wiz-book',     classId: 'wizard', kind: 'talent', name: 'Bookish Wizard', usage: 'Passive' } as any,
  { id: 'wiz-evoker',   classId: 'wizard', kind: 'talent', name: 'Evocation', usage: 'Passive' } as any,
  { id: 'wiz-magic-missile', classId: 'wizard', kind: 'spell', name: 'Magic Missile', usage: 'At-Will' },
  { id: 'wiz-fireball',      classId: 'wizard', kind: 'spell', name: 'Fireball', usage: 'Daily' },

  // Barbarian (example)
  { id: 'barb-rage',    classId: 'barbarian', kind: 'talent', name: 'Rage', usage: 'Encounter' },
  { id: 'barb-strong',  classId: 'barbarian', kind: 'talent', name: 'Strongheart', usage: 'Passive' } as any,
  { id: 'barb-crush',   classId: 'barbarian', kind: 'power',  name: 'Crushing Blow', usage: 'Battle' },
];

/** Utility to filter by class/kind */
export function byClassAndKind(classId: ClassId, kind: FeatureKind) {
  return FEATURES.filter(f => f.classId === classId && f.kind === kind);
}
