import { useEffect, useMemo, useRef, useState } from 'react';
import { useCharacterStore } from '../../../store/characterStore';
import { CLASSES, type ClassDef, type ClassId } from '../../../data/classes';

type Props = { onNext: () => void; onBack: () => void };

export default function StepClass({ onNext, onBack }: Props) {
  const startDraft = useCharacterStore((s) => s.startDraft);
  const updateDraft = useCharacterStore((s) => s.updateDraft);
  const draft = useCharacterStore((s) => s.draft);

  // ensure draft exists (StrictMode-safe)
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    startDraft();
  }, [startDraft]);

  // local selection (hydrate from draft if present)
  const [classId, setClassId] = useState<ClassId | ''>((draft?.class as ClassId) ?? '');

  useEffect(() => {
    if (draft?.class && !classId) setClassId(draft.class as ClassId);
  }, [draft]);

  const selected: ClassDef | undefined = useMemo(
    () => CLASSES.find(c => c.id === classId),
    [classId]
  );

  const isValid = !!classId;

  function handleNext() {
    if (!isValid) return;
    updateDraft({ class: classId as any });
    onNext();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Step 4: Class</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CLASSES.map(c => (
          <label
            key={c.id}
            className={`cursor-pointer border rounded-xl p-4 bg-zinc-900 border-zinc-800 hover:border-zinc-700 flex gap-3 ${
              classId === c.id ? 'outline outline-2 outline-indigo-500' : ''
            }`}
          >
            <input
              type="radio"
              name="class"
              className="mt-1"
              checked={classId === c.id}
              onChange={() => setClassId(c.id)}
            />
            <div>
              <div className="font-semibold">{c.name}</div>
              {c.blurb && <div className="text-sm text-zinc-400">{c.blurb}</div>}
              <div className="mt-2 text-xs text-zinc-400">
                {renderPicksSummary(c)}
              </div>
            </div>
          </label>
        ))}
      </div>

      {selected && (
        <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900">
          <h3 className="font-semibold">Class Requirements (preview)</h3>
          <ul className="mt-2 text-sm list-disc list-inside text-zinc-300">
            {selected.picks.talents ? <li>{selected.picks.talents} Talents</li> : null}
            {selected.picks.powers ? <li>{selected.picks.powers} Powers</li> : null}
            {selected.picks.spells ? <li>{selected.picks.spells} Spells</li> : null}
            {selected.picks.maneuvers ? <li>{selected.picks.maneuvers} Maneuvers</li> : null}
          </ul>
          <p className="mt-2 text-xs text-zinc-400">
            You’ll pick these in Step 5.
          </p>
        </div>
      )}

      <div className="flex justify-between">
        <button className="px-3 py-2 rounded-md bg-zinc-800" onClick={onBack}>
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

      {!isValid && (
        <p className="text-xs text-red-400">Choose a class to continue.</p>
      )}
    </div>
  );
}

function renderPicksSummary(c: ClassDef) {
  const parts: string[] = [];
  if (c.picks.talents) parts.push(`${c.picks.talents} Talents`);
  if (c.picks.powers) parts.push(`${c.picks.powers} Powers`);
  if (c.picks.spells) parts.push(`${c.picks.spells} Spells`);
  if (c.picks.maneuvers) parts.push(`${c.picks.maneuvers} Maneuvers`);
  return parts.length ? parts.join(' • ') : 'No picks required';
}
