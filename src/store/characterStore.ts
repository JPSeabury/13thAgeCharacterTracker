import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Character } from '../types/character';
import { emptyAbilities } from '../utils/calc';
import { nanoid } from '../utils/id';

/** A temporary character-in-progress used by the wizard */
type Draft = (Partial<Character> & { id?: string }) & {
  kinPowerIds?: string[];
  picks?: {
    talents?: string[];
    powers?: string[];
    spells?: string[];
    maneuvers?: string[];
  };
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
          kin: d.kin,
          class: d.class,
          abilityScores: d.abilityScores ?? emptyAbilities(),
          features: d.features ?? [],
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
