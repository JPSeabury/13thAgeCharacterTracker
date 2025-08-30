import { useEffect, useMemo, useRef, useState } from 'react';
import { useCharacterStore } from '../../../store/characterStore';
import { CLASSES, type ClassDef } from '../../../data/classes';
import { byClassAndKind, type FeatureDef } from '../../../data/features';

type Props = { onNext: () => void; onBack: () => void };

type Bucket = 'talents' | 'powers' | 'spells' | 'maneuvers';
const BUCKETS: Bucket[] = ['talents', 'powers', 'spells', 'maneuvers'];
const LABEL: Record<Bucket, string> = {
  talents: 'Talents',
  powers: 'Powers',
  spells: 'Spells',
  maneuvers: 'Maneuvers',
};

export default function StepTalentsPowers({ onNext, onBack }: Props) {
  const startDraft   = useCharacterStore(s => s.startDraft);
  const updateDraft  = useCharacterStore(s => s.updateDraft);
  const draft        = useCharacterStore(s => s.draft);

  // ensure draft exists
  const ran = useRef(false);
  useEffect(() => { if (ran.current) return; ran.current = true; startDraft(); }, [startDraft]);

  // Must have selected a class in Step 4
  const classId = draft?.class as ClassDef['id'] | undefined;
  const classDef = useMemo(() => CLASSES.find(c => c.id === classId), [classId]);

  // Local UI state: selections per bucket
  const [picks, setPicks] = useState<Record<Bucket, string[]>>({
    talents: draft?.picks?.talents ?? [],
    powers: draft?.picks?.powers ?? [],
    spells: draft?.picks?.spells ?? [],
    maneuvers: draft?.picks?.maneuvers ?? [],
  });

  // Derived: how many required per bucket for this class
  const required: Record<Bucket, number> = useMemo(() => ({
    talents: classDef?.picks.talents ?? 0,
    powers: classDef?.picks.powers ?? 0,
    spells: classDef?.picks.spells ?? 0,
    maneuvers: classDef?.picks.maneuvers ?? 0,
  }), [classDef]);

  // Derived: catalog per bucket (by selected class)
  const catalog: Record<Bucket, FeatureDef[]> = useMemo(() => {
    if (!classId) return { talents: [], powers: [], spells: [], maneuvers: [] };
    return {
      talents:   byClassAndKind(classId, 'talent'),
      powers:    byClassAndKind(classId, 'power'),
      spells:    byClassAndKind(classId, 'spell'),
      maneuvers: byClassAndKind(classId, 'maneuver'),
    };
  }, [classId]);

  // Validation: each required bucket must have exactly that many picks
  const valid = BUCKETS.every(b => picks[b].length === required[b]);

  function toggle(b: Bucket, id: string) {
    setPicks(prev => {
      const chosen = new Set(prev[b]);
      if (chosen.has(id)) {
        chosen.delete(id);
      } else {
        if (chosen.size >= required[b]) return prev; // block exceeding the limit
        chosen.add(id);
      }
      return { ...prev, [b]: Array.from(chosen) };
    });
  }

  function handleNext() {
    if (!classId) return alert('Pick a class first (Step 4).');
    if (!valid)  return; // UI prevents this
    updateDraft({ picks });
    onNext();
  }

  if (!classId || !classDef) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Step 5: Talents / Powers</h2>
        <p className="text-red-400 text-sm">You need to choose a class in Step 4 before picking Talents/Powers.</p>
        <div className="flex justify-between">
          <button className="px-3 py-2 rounded-md bg-zinc-800" onClick={onBack}>Back</button>
          <button className="px-3 py-2 rounded-md bg-zinc-800 opacity-50 cursor-not-allowed">Next</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Step 5: {classDef.name} — Picks</h2>
      <p className="text-zinc-400 text-sm">Choose the required number in each category. You’ll attach feats later.</p>

      <div className="grid md:grid-cols-2 gap-4">
        {BUCKETS.map(b => {
          const need = required[b];
          if (need === 0) return null; // skip categories this class doesn't use
          const list = catalog[b] ?? [];
          const chosen = new Set(picks[b]);
          return (
            <div key={b} className="border border-zinc-800 rounded-xl p-4 bg-zinc-900">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{LABEL[b]}</h3>
                <span className="text-xs text-zinc-400">
                  {chosen.size}/{need} selected
                </span>
              </div>
              <div className="mt-3 grid gap-2">
                {list.length === 0 && (
                  <div className="text-xs text-zinc-500">No {LABEL[b]} available yet for this class.</div>
                )}
                {list.map(f => (
                  <label key={f.id} className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={chosen.has(f.id)}
                      disabled={!chosen.has(f.id) && chosen.size >= need}
                      onChange={() => toggle(b, f.id)}
                    />
                    <div>
                      <div className="font-medium">{f.name} <span className="ml-1 text-[10px] uppercase tracking-wide text-zinc-400">{f.usage}</span></div>
                      {f.description && <div className="text-xs text-zinc-400">{f.description}</div>}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between">
        <button className="px-3 py-2 rounded-md bg-zinc-800" onClick={onBack}>Back</button>
        <button
          className="px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
          onClick={handleNext}
          disabled={!valid}
        >
          Next
        </button>
      </div>

      {!valid && (
        <p className="text-xs text-red-400">Complete the required picks in each category.</p>
      )}
    </div>
  );
}
