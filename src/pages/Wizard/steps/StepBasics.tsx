import { useEffect, useRef, useState, useMemo } from 'react';
import { useCharacterStore } from '../../../store/characterStore';

type Props = { onNext: () => void; onBack: () => void };

export default function StepBasics({ onNext, onBack }: Props) {
  const startDraft = useCharacterStore((s) => s.startDraft);
  const updateDraft = useCharacterStore((s) => s.updateDraft);
  const draft = useCharacterStore((s) => s.draft);

  // ensure draft exists once (StrictMode safe)
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    startDraft();
  }, [startDraft]);

  // Local input state (avoids typing lag with persisted store)
  const [name, setName] = useState(draft?.name ?? '');
  const [level, setLevel] = useState<number>(draft?.level ?? 1);
  const [notes, setNotes] = useState(draft?.notes ?? '');

  // keep in sync if draft is created fresh
  useEffect(() => {
    if (!draft) return;
    if (name === '' && draft.name) setName(draft.name);
    if (!level && draft.level) setLevel(draft.level);
    if (notes === '' && draft.notes) setNotes(draft.notes);
  }, [draft]);

  const isValid = useMemo(() => {
    const lvlOk = Number.isInteger(level) && level >= 1 && level <= 10;
    return name.trim().length > 0 && lvlOk;
  }, [name, level]);

  function handleNext() {
    updateDraft({ name: name.trim(), level, notes });
    onNext();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Step 1: Basics</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Name */}
        <div className="grid gap-1">
          <label className="text-sm text-zinc-400">Name *</label>
          <input
            className="px-3 py-2 rounded-md bg-zinc-800 outline-none border border-transparent focus:border-indigo-500"
            placeholder="Fangril Pentarion"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {name.trim() === '' && (
            <p className="text-xs text-red-400">Name is required.</p>
          )}
        </div>

        {/* Level */}
        <div className="grid gap-1">
          <label className="text-sm text-zinc-400">Level (1–10) *</label>
          <input
            type="number"
            min={1}
            max={10}
            className="px-3 py-2 rounded-md bg-zinc-800 outline-none border border-transparent focus:border-indigo-500"
            value={level}
            onChange={(e) => setLevel(parseInt(e.target.value || '1', 10))}
          />
        </div>

        {/* Notes */}
        <div className="grid gap-1 sm:col-span-2">
          <label className="text-sm text-zinc-400">Notes</label>
          <textarea
            rows={5}
            className="px-3 py-2 rounded-md bg-zinc-800 outline-none border border-transparent focus:border-indigo-500"
            placeholder="Backstory, icon relationships, quirks…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          className="px-3 py-2 rounded-md bg-zinc-800"
          onClick={onBack}
        >
          Back
        </button>
        <button
          className="px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
          onClick={handleNext}
          disabled={!isValid}
        >
          Next
        </button>
      </div>
    </div>
  );
}