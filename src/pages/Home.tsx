// src/pages/Home.tsx
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../store/characterStore';

export default function Home() {
  const navigate = useNavigate();

  // Grab raw pieces separately so we don't construct a new object each render
  const charactersMap = useCharacterStore((s) => s.characters);
  const deleteCharacter = useCharacterStore((s) => s.deleteCharacter);
  const createBlankCharacter = useCharacterStore((s) => s.createBlankCharacter);

  const characters = useMemo(
    () => Object.values(charactersMap).sort((a, b) => b.updatedAt - a.updatedAt),
    [charactersMap]
  );

  function onCreate() {
    const c = createBlankCharacter();      
    navigate(`/character/${c.id}`);
  }

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Characters</h1>
        <button onClick={onCreate} className="px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500">
          Create New
        </button>
      </header>

      {/* simple list for now */}
      {characters.length === 0 ? (
        <p className="text-zinc-400">No characters yet.</p>
      ) : (
        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map((c) => (
            <li key={c.id} className="border border-zinc-800 rounded-xl p-4 bg-zinc-900">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <a href={`/character/${c.id}`} className="font-semibold text-lg hover:underline">
                    {c.name || 'Unnamed Hero'}
                  </a>
                  <p className="text-sm text-zinc-400">Lv {c.level}</p>
                </div>
                <button className="text-red-400 hover:underline" onClick={() => deleteCharacter(c.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
