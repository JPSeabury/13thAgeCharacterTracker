// rules/wiring.ts
// Minimal, modular wiring for: Human Resourceful feat allocation + Quick to Fight initiative helper
// Tech: React + TS + Zustand (slice example at bottom)

// ---------- Types shared with your project ----------
export type FeatTier = 'adventurer' | 'champion' | 'epic';
export type KinId =
  | 'human' | 'dwarf' | 'high-elf' | 'silver-elf' | 'wood-elf' | 'gnome'
  | 'half-elf' | 'halfling' | 'troll-kin' | 'dragonic' | 'forgeborn'
  | 'holy-one' | 'tiefling';

export interface CharacterFeat { id: string; tier: FeatTier; }

export interface Character {
  id: string;
  name: string;
  level: number;           // 1..10
  kinId: KinId;
  // Selected kin power ids (e.g., 'human-resourceful', 'human-quick-to-fight', 'human-push-it')
  kinPowers: string[];
  // How many feats the character may allocate per tier (UI enforces max)
  featSlots: Record<FeatTier, number>;
  // Actual chosen feats
  feats: CharacterFeat[];
  // Initiative (cached per battle; computed by helper)
  lastInitiative?: number;
  // Battle flags
  flags?: {
    quickToFightBestOfTwo?: boolean; // set when we used best-of-2 this battle
    quickToFightDefenseBonusAppliedRound1?: boolean;
  };
}

// ---------- Utility: tiers by level ----------
export function tierForLevel(level: number): FeatTier {
  if (level <= 4) return 'adventurer';
  if (level <= 7) return 'champion';
  return 'epic';
}

// Base (non-Human) feat slots by level per 13th Age core
// L1: 1 adv, L2: 2 adv, L3: 3 adv, L4: 4 adv,
// L5: 4 adv + 1 champ, L6: 4 adv + 2 champ, L7: 4 adv + 3 champ,
// L8: 4 adv + 3 champ + 1 epic, L9: 4 adv + 3 champ + 2 epic, L10: 4 adv + 3 champ + 3 epic
export function baseFeatSlots(level: number): Record<FeatTier, number> {
  const adv = Math.min(4, Math.max(0, level)); // 1..4 (cap at 4)
  const champ = Math.max(0, Math.min(3, level - 4)); // 0..3
  const epic = Math.max(0, Math.min(3, level - 7)); // 0..3
  return { adventurer: Math.max(0, adv), champion: champ, epic };
}

// Human Resourceful adds +1 slot at the highest tier the character qualifies for
// (i.e., adv at 1–4; champ at 5–7; epic at 8–10)
export function withResourcefulSlots(level: number, slots: Record<FeatTier, number>): Record<FeatTier, number> {
  const highest = tierForLevel(level);
  return { ...slots, [highest]: slots[highest] + 1 };
}

// Hook sentinel id for Human power as authored in kin.ts
export const RESOURCEFUL_HOOK_ID = 'human-resourceful';
export const QUICK_TO_FIGHT_ID = 'human-quick-to-fight';

export const hasKinPower = (c: Character, powerId: string) => c.kinPowers?.includes(powerId);

// Compute feat slots for a character, honoring Resourceful if present
export function computeFeatSlots(c: Pick<Character, 'level' | 'kinPowers'>): Record<FeatTier, number> {
  const base = baseFeatSlots(c.level);
  return hasKinPower(c as Character, RESOURCEFUL_HOOK_ID) ? withResourcefulSlots(c.level, base) : base;
}

// ---------- Initiative helpers for Quick to Fight ----------
export interface InitiativeRollResult {
  final: number;               // the initiative used
  firstRoll: number;           // first d20 + mods already applied by caller
  secondRoll?: number;         // present if Quick to Fight used
  usedBestOfTwo: boolean;      // true when we kept the max of two rolls
}

/**
 * Computes initiative with Quick to Fight (best of two) if the kin power is present.
 *
 * Caller is responsible for supplying rolls with all mods already applied
 * (e.g., Dex mod, class bonus, magic item bonus).
 */
export function computeInitiative(
  hasQuickToFight: boolean,
  firstRollWithMods: number,
  secondRollWithMods?: number,
): InitiativeRollResult {
  if (!hasQuickToFight) {
    return { final: firstRollWithMods, firstRoll: firstRollWithMods, usedBestOfTwo: false };
  }
  const r1 = firstRollWithMods;
  const r2 = secondRollWithMods ?? firstRollWithMods; // safeguard; treat as same if not provided
  const final = Math.max(r1, r2);
  return { final, firstRoll: r1, secondRoll: r2, usedBestOfTwo: true };
}

/**
 * Round-1 +2 defenses bonus if: character has the Adventurer feat on Quick to Fight AND
 * the character's initiative is higher than all enemies.
 */
export function firstRoundDefenseBonus(
  character: Character,
  myInitiative: number,
  enemyInitiatives: number[],
  hasAdventurerFeatOnQuickToFight: boolean,
): number {
  if (!hasKinPower(character, QUICK_TO_FIGHT_ID)) return 0;
  if (!hasAdventurerFeatOnQuickToFight) return 0;
  const highestEnemy = Math.max(-Infinity, ...enemyInitiatives);
  return myInitiative > highestEnemy ? 2 : 0;
}

// ---------- Zustand slice sketch ----------
// This is a lightweight example you can fold into your store. Replace RootState as needed.
import { StateCreator } from 'zustand';

export interface BattleState {
  character: Character;
  enemyInitiatives: number[];
}

export interface BattleActions {
  // Recompute feat slots from level + kin powers (call on level-up and on kin-power change)
  allocateFeatSlots: () => void;
  // Roll (or accept) initiative and compute round-1 defense bonus if applicable
  setInitiative: (opts: { first: number; second?: number; enemyInits: number[] }) => { initiative: number; defenseBonus: number };
}

export type BattleSlice = BattleState & { actions: BattleActions };

export const createBattleSlice: StateCreator<BattleSlice, [], [], BattleSlice> = (set, get) => ({
  character: {
    id: 'temp', name: 'New Hero', level: 1, kinId: 'human',
    kinPowers: [RESOURCEFUL_HOOK_ID, QUICK_TO_FIGHT_ID],
    featSlots: { adventurer: 0, champion: 0, epic: 0 },
    feats: [], flags: {},
  },
  enemyInitiatives: [],
  actions: {
    allocateFeatSlots: () => {
      const state = get();
      const slots = computeFeatSlots(state.character);
      set({ character: { ...state.character, featSlots: slots } });
      return;
    },
    setInitiative: ({ first, second, enemyInits }) => {
      const state = get();
      const qtf = hasKinPower(state.character, QUICK_TO_FIGHT_ID);
      const result = computeInitiative(qtf, first, second);

      // Determine whether the Adventurer feat is present on Quick to Fight.
      // If you track feat IDs explicitly, replace the predicate below as appropriate.
      const hasAdvFeatOnQTF = state.character.feats?.some(f => f.tier === 'adventurer' && f.id === 'feat-quick-to-fight-adventurer') ?? false;

      const defBonus = firstRoundDefenseBonus(state.character, result.final, enemyInits, hasAdvFeatOnQTF);

      set({
        enemyInitiatives: enemyInits,
        character: {
          ...state.character,
          lastInitiative: result.final,
          flags: {
            ...state.character.flags,
            quickToFightBestOfTwo: result.usedBestOfTwo,
            quickToFightDefenseBonusAppliedRound1: defBonus > 0,
          },
        },
      });

      return { initiative: result.final, defenseBonus: defBonus };
    },
  },
});

// ---------- Example helpers for UI wiring ----------
export function formatFeatSlots(slots: Record<FeatTier, number>) {
  return `${slots.adventurer} Adv / ${slots.champion} Champ / ${slots.epic} Epic`;
}

export function humanFeatProgressionTooltip(level: number) {
  const slots = withResourcefulSlots(level, baseFeatSlots(level));
  return `Human Resourceful at L${level}: ${formatFeatSlots(slots)} slots`;
}