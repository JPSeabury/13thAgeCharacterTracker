import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Character } from '../types/character';
import { emptyAbilities } from '../utils/calc';
import { nanoid } from '../utils/id';

interface CharacterState {
  characters: Record<string, Character>;
  upsertCharacter: (c: Character) => void;
  deleteCharacter: (id: string) => void;
  createBlankCharacter: () => Character;
}

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set, get) => ({
      characters: {},
      upsertCharacter: (c) =>
        set((s) => ({ characters: { ...s.characters, [c.id]: { ...c, updatedAt: Date.now() } } })),
      deleteCharacter: (id) => set((s) => {
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
    }),
    {
      name: '13act:characters',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);