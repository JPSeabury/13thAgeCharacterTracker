export type AbilityKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export interface AbilityScores {
  str: number; dex: number; con: number; int: number; wis: number; cha: number;
}

export type Kin =
  | 'Human' | 'Dwarf' | 'High Elf' | 'Silver Elf' | 'Wood Elf' | 'Gnome'
  | 'Half-elf' | 'Halfling' | 'Troll-kin' | 'Dragonic' | 'Forgeborn' | 'Holy One' | 'Tiefling';

export type ClassName =
  | 'Barbarian' | 'Bard' | 'Cleric' | 'Fighter' | 'Paladin' | 'Ranger' | 'Rogue' | 'Sorcerer' | 'Wizard';

export interface PowerLikeBase {
  id: string;
  name: string;
  usage: 'At-Will' | 'Battle' | 'Encounter' | 'Daily' | 'Arc' | 'Recharge';
  action?: string;
  trigger?: string;
  effect?: string;
  feats?: { adventurer?: string; champion?: string; epic?: string };
  bookRef?: string;
}

export type Talent = PowerLikeBase & { kind: 'Talent' };
export type Spell = PowerLikeBase & { kind: 'Spell'; level?: number };
export type Maneuver = PowerLikeBase & { kind: 'Maneuver' };
export type Feat = { id: string; name: string; tier: 'Adventurer' | 'Champion' | 'Epic'; linkedToId?: string };
export type KinPower = PowerLikeBase & { kind: 'KinPower' };

export interface Equipment {
  weapons: string[];
  armor?: string;
  shield?: string;
  implements?: string[];
  items?: string[];
}

export interface Character {
  id: string;
  name: string;
  level: number; // 1..10
  kin?: Kin;
  class?: ClassName;
  abilityScores: AbilityScores;
  notes?: string;
  features?: (Talent | Spell | Maneuver | KinPower)[];
  feats?: Feat[];
  equipment?: Equipment;
  // Derived / play state
  defenses?: { AC: number; PD: number; MD: number; init: number };
  hp?: { current: number; max: number; recoveries: number; recoveryDie?: string };
  usage?: Record<string, { spent: boolean; rechargeNeeded?: boolean; lastReset?: number }>;
  createdAt: number;
  updatedAt: number;
}