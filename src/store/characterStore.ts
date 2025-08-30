import { create } from 'zustand';
import { createBattleSlice, BattleSlice } from '@/rules/wiring';

import { persist, createJSONStorage } from 'zustand/middleware';
import type { Character } from '../types/character';
import { emptyAbilities } from '../utils/calc';
import { nanoid } from '../utils/id';

export const useBattleStore = create<BattleSlice>()((...a) => ({
  ...createBattleSlice(...a),
}));

/** A temporary character-in-progress used by the wizard */
type Draft = (Partial<Character> & { id?: string }) & {
  // The Kin the user picked (store just the id)
  kinId?: string;        // 'human' | 'dwarf' ...
  // Selected Kin Power ids for that Kin
  kinPowers?: string[];  // e.g., ['human-quick-to-fight']
  picks?: {
    talents?: string[];
    powers?: string[];
    spells?: string[];
    maneuvers?: string[];
  };
  feats?: string[];
};

interface CharacterState {
  // Saved characters
  characters: Record<string, Character>;
  upsertCharacter: (c: Character) => void;
  deleteCharacter: (id: string) => void;
  createBlankCharacter: () => Character;

  // Wizard draft
  draft: Draft | null;
  startDraft: () => void;
  updateDraft: (patch: Partial<Character>) => void;
  discardDraft: () => void;
  commitDraft: () => string; // returns new character id

  // Wizard kin selection helpers
  setKin: (kinId: string) => void;
  setKinPowers: (powerIds: string[]) => void;
}

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set, get) => ({
      /* -------- Saved characters -------- */
      characters: {},
      upsertCharacter: (c) =>
        set((s) => ({
          characters: { ...s.characters, [c.id]: { ...c, updatedAt: Date.now() } },
        })),
      deleteCharacter: (id) =>
        set((s) => {
          const next = { ...s.characters };
          delete next[id];
          return { characters: next };
        }),
      createBlankCharacter: () => {
        const now = Date.now();
        const c: Character = {
          id: nanoid(),
          name: '',
          level: 1,
          abilityScores: emptyAbilities(),
          createdAt: now,
          updatedAt: now,
        };
        get().upsertCharacter(c);
        return c;
      },

      /* -------- Wizard draft -------- */
      draft: null,

      /** Initialize a new draft once (safe under StrictMode) */
      startDraft: () => {
        const existing = get().draft;
        if (existing?.id) return; // already started
        const now = Date.now();
        set({
          draft: {
            id: nanoid(),
            name: '',
            level: 1,
            notes: '',
            // initialize kin defaults for the wizard (optional)
            kinId: undefined,     // or 'human' if you prefer to preselect
            kinPowers: [],
            abilityScores: emptyAbilities(),
            createdAt: now,
            updatedAt: now,
          },
        });
      },

      /** Shallow-merge updates from wizard steps */
      updateDraft: (patch) =>
        set((s) =>
          s.draft
            ? { draft: { ...s.draft, ...patch, updatedAt: Date.now() } }
            : s
        ),

      /** Set kin id for the draft */
      setKin: (kinId) =>
        set((s) =>
          s.draft
            ? {
                draft: {
                  ...s.draft,
                  kinId,
                  // clear powers when kin changes
                  kinPowers: [],
                  updatedAt: Date.now(),
                },
              }
            : s
        ),

      /** Replace the selected kin power ids for the draft */
      setKinPowers: (ids) =>
        set((s) =>
          s.draft
            ? {
                draft: {
                  ...s.draft,
                  kinPowers: [...ids],
                  updatedAt: Date.now(),
                },
              }
            : s
        ),

      /** Throw away the draft (e.g., cancel flow) */
      discardDraft: () => set({ draft: null }),

      /** Save draft as a real character and clear draft */
      commitDraft: () => {
        const d = get().draft;
        if (!d?.id) throw new Error('No draft to commit');

        const now = Date.now();
        const c: Character = {
          id: d.id,
          name: d.name ?? '',
          level: d.level ?? 1,
          notes: d.notes ?? '',

          // If your Character type has `kin` (string), prefer draft.kinId when present:
          kin: (d as any).kin ?? d.kinId,   // keeps backward compat with your existing drafts
          class: d.class,

          // add if supported by your Character type:
          kinPowers: d.kinPowers ?? [],

          abilityScores: d.abilityScores ?? emptyAbilities(),

          // If your Character type doesn't yet have `kinPowers`, you can temporarily keep them in features.
          // Replace this once you add a `kinPowers` field to Character.
          features: [
            ...(d.features ?? []),
            ...(d.kinPowers?.map(id => ({ type: 'kin-power', id })) ?? []),
          ],

          feats: d.feats ?? [],
          equipment: d.equipment ?? { weapons: [] },
          defenses: d.defenses,
          hp: d.hp,
          usage: d.usage ?? {},
          createdAt: typeof d.createdAt === 'number' ? d.createdAt : now,
          updatedAt: now,
        };

        get().upsertCharacter(c);
        set({ draft: null });
        return c.id;
      },
    }),
    {
      name: '13act:characters',
      storage: createJSONStorage(() => localStorage),
      version: 2, // bumped because we added `draft`
    }
  )
);
