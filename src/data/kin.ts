export type KinId =
  | 'human' | 'dwarf' | 'high-elf' | 'silver-elf' | 'wood-elf' | 'gnome'
  | 'half-elf' | 'halfling' | 'troll-kin' | 'dragonic' | 'forgeborn'
  | 'holy-one' | 'tiefling';

export type FeatTier = 'adventurer' | 'champion' | 'epic';

export interface KinPowerFeat {
  tier: FeatTier;
  description: string;
}

export interface KinPowerDef {
  id: string;
  name: string;
  /** Short UI blurb */
  summary?: string;
  /** Rules-facing metadata (optional) */
  usage?: 'once-per-battle' | 'passive';
  trigger?: string;
  requirements?: string;      // e.g., "Escalation Die 2+, non-crit hit"
  effect?: string;
  missEffect?: string;
  critEffect?: string;
  notes?: string;
  feats?: KinPowerFeat[];

  /**
   * Optional hook for rules engine effects that aren’t a simple combat button.
   * e.g., “human-resourceful” grants an extra highest-tier feat during feat allocation.
   */
  rulesHookId?: string;
}

export interface KinDef {
  id: KinId;
  name: string;
  // how many powers the player must pick for this kin
  requiredPicks: number;
  powers: KinPowerDef[];
}

export const KIN: KinDef[] = [
  {
    id: 'human',
    name: 'Human',
    requiredPicks: 1,
    powers: [
      {
        id: 'human-push-it',
        name: 'Push It',
        summary: 'Once per battle, after a non-crit hit at ED 2+, gamble for bigger damage.',
        usage: 'once-per-battle',
        requirements: 'Escalation Die 2+ and you hit (but don’t crit).',
        trigger: 'Immediately after you hit a target with an attack.',
        effect:
          'Choose to “push it” as a free action: your original hit has no effect yet; make a second attack roll vs the same target with the same attack bonus. If the second roll hits, deal double damage; if it crits, deal triple damage.',
        missEffect:
          'If the second roll misses, the original attack deals only half damage to that target. On a natural 1, your attack deals no damage and has no effect (a fumble).',
        feats: [
          {
            tier: 'champion',
            description:
              'If you miss when you push it, this power is not expended; you can use it again on a later turn this battle.',
          },
        ],
      },
      {
        id: 'human-quick-to-fight',
        name: 'Quick to Fight',
        summary: 'Roll initiative twice and take the better result.',
        usage: 'passive',
        trigger: 'At the start of each battle.',
        effect: 'Roll initiative twice and choose the result you want.',
        feats: [
          {
            tier: 'adventurer',
            description:
              'If your initiative is higher than all enemies, you gain +2 to all defenses during round 1.',
          },
        ],
      },
      {
        id: 'human-resourceful',
        name: 'Resourceful',
        summary: 'You have a bonus feat of the highest tier you qualify for.',
        usage: 'passive',
        rulesHookId: 'human-resourceful', // engine interprets this during feat allocation
        notes:
          'At each level, grant +1 extra feat at the highest tier the character currently qualifies for. For UI help, show the progression table from the rulebook.',
        // Optional: include the reference progression to help the UI tooltip
        feats: [
          { tier: 'adventurer', description: 'Lvl 1: Two adventurer-tier feats.' },
          { tier: 'adventurer', description: 'Lvl 2: Three adventurer-tier feats.' },
          { tier: 'adventurer', description: 'Lvl 3: Four adventurer-tier feats.' },
          { tier: 'adventurer', description: 'Lvl 4: Five adventurer-tier feats.' },
          { tier: 'champion',   description: 'Lvl 5: Two champion feats, four adventurer feats.' },
          { tier: 'champion',   description: 'Lvl 6: Three champion feats, four adventurer feats.' },
          { tier: 'champion',   description: 'Lvl 7: Four champion feats, four adventurer feats.' },
          { tier: 'epic',       description: 'Lvl 8: Two epic, three champion, four adventurer feats.' },
          { tier: 'epic',       description: 'Lvl 9: Three epic, three champion, four adventurer feats.' },
          { tier: 'epic',       description: 'Lvl 10: Four epic, three champion, four adventurer feats.' },
        ],
      },
    ],
  },
  { id: 'dwarf', name: 'Dwarf', requiredPicks: 1, powers: [
    { id: 'dwarf-stubborn', name: 'That’s Your Best Shot?', description: '+1 to saves vs ongoing damage.' },
  ]},
  { id: 'high-elf', name: 'High Elf', requiredPicks: 1, powers: [
    { id: 'high-elf-teleport-shield', name: 'Highblood Teleport', description: 'Short-range teleport (placeholder).' },
  ]},
  { id: 'silver-elf', name: 'Silver Elf', requiredPicks: 1, powers: [
    { id: 'silver-elf-liminal', name: 'Liminal Grace', description: 'Edge-case magic bonus (placeholder).' },
  ]},
  { id: 'wood-elf', name: 'Wood Elf', requiredPicks: 1, powers: [
    { id: 'wood-elf-woodcraft', name: 'Elven Woodcraft', description: '+ skilly wood stuff (placeholder).' },
  ]},
  { id: 'gnome', name: 'Gnome', requiredPicks: 1, powers: [
    { id: 'gnome-illusion', name: 'Minor Illusions', description: 'Illusion knack (placeholder).' },
  ]},
  { id: 'half-elf', name: 'Half-elf', requiredPicks: 1, powers: [
    { id: 'half-elf-surprising', name: 'Surprising', description: 'Occasional bonus (placeholder).' },
  ]},
  { id: 'halfling', name: 'Halfling', requiredPicks: 1, powers: [
    { id: 'halfling-luck', name: 'Halfling’s Luck', description: 'Reroll 1s sometimes (placeholder).' },
  ]},
  { id: 'troll-kin', name: 'Troll-kin', requiredPicks: 1, powers: [
    { id: 'troll-kin-regen', name: 'Regeneration (limited)', description: 'Regain a bit after battle (placeholder).' },
  ]},
  { id: 'dragonic', name: 'Dragonic', requiredPicks: 1, powers: [
    { id: 'dragonic-breath', name: 'Breath Weapon', description: 'Cone breath (placeholder).' },
  ]},
  { id: 'forgeborn', name: 'Forgeborn', requiredPicks: 1, powers: [
    { id: 'forgeborn-construct', name: 'Constructed', description: 'Resist/immune edge (placeholder).' },
  ]},
  { id: 'holy-one', name: 'Holy One', requiredPicks: 1, powers: [
    { id: 'holy-one-sanctity', name: 'Sanctity', description: 'Divine favor (placeholder).' },
  ]},
  { id: 'tiefling', name: 'Tiefling', requiredPicks: 1, powers: [
    { id: 'tiefling-curse', name: 'Curse of Chaos', description: 'Chaotic surge (placeholder).' },
  ]},
];
