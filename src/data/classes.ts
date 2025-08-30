export type ClassId =
  | 'barbarian' | 'bard' | 'cleric' | 'fighter' | 'paladin'
  | 'ranger' | 'rogue' | 'sorcerer' | 'wizard';

export interface ClassDef {
  id: ClassId;
  name: string;
  blurb?: string;
  // What we’ll enforce in Step 5 (Talents/Powers/Spells/Maneuvers)
  picks: {
    talents?: number;
    powers?: number;     // generic “powers” bucket for classes that aren’t spellcasters
    spells?: number;     // casters
    maneuvers?: number;  // fighter, etc.
  };
}

export const CLASSES: ClassDef[] = [
  { id: 'barbarian', name: 'Barbarian', blurb: 'Smash + rage.',
    picks: { talents: 3, powers: 0, spells: 0, maneuvers: 0 } },
  { id: 'bard', name: 'Bard', blurb: 'Songs, spells, and support.',
    picks: { talents: 3, spells: 2 } },
  { id: 'cleric', name: 'Cleric', blurb: 'Divine magic and blessings.',
    picks: { talents: 3, spells: 2 } },
  { id: 'fighter', name: 'Fighter', blurb: 'Steel and maneuvers.',
    picks: { talents: 3, maneuvers: 2 } },
  { id: 'paladin', name: 'Paladin', blurb: 'Holy warrior.',
    picks: { talents: 3, powers: 1 } },
  { id: 'ranger', name: 'Ranger', blurb: 'Arrows and animal grit.',
    picks: { talents: 3, powers: 2 } },
  { id: 'rogue', name: 'Rogue', blurb: 'Sneak and stab.',
    picks: { talents: 3, powers: 2 } },
  { id: 'sorcerer', name: 'Sorcerer', blurb: 'Innate arcane power.',
    picks: { talents: 3, spells: 2 } },
  { id: 'wizard', name: 'Wizard', blurb: 'Prepared arcane spells.',
    picks: { talents: 3, spells: 3 } },
];
