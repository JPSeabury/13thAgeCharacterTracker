export type KinId =
  | 'human' | 'dwarf' | 'high-elf' | 'silver-elf' | 'wood-elf' | 'gnome'
  | 'half-elf' | 'halfling' | 'troll-kin' | 'dragonic' | 'forgeborn'
  | 'holy-one' | 'tiefling';

export interface KinPowerDef {
  id: string;
  name: string;
  description?: string;
}

export interface KinDef {
  id: KinId;
  name: string;
  // how many powers the player must pick for this kin
  requiredPicks: number;
  powers: KinPowerDef[];
}

export const KIN: KinDef[] = [
  { id: 'human', name: 'Human', requiredPicks: 1, powers: [
    { id: 'human-quick-to-fight', name: 'Quick to Fight', description: 'Roll initiative twice, take the best.' },
    { id: 'human-rapid-reload',    name: 'Rapid Reload',    description: 'Reload faster (house rule placeholder).' },
  ]},
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
