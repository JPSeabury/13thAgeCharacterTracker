import { useEffect, useMemo, useRef, useState } from 'react';
import { useCharacterStore } from '../../../store/characterStore';
import { featsFor, type FeatDef } from '../../../data/feats';
import type { FeatTier } from '../../../data/feats';
import { allowedTiersByLevel, totalFeatsByLevel } from '../../../utils/feats';
import { CLASSES } from '../../../data/classes';

type Props = { onNext: () => void; onBack: () => void };

const TIERS: FeatTier[] = ['Adventurer', 'Champion', 'Epic'];

export default function StepFeats({ onNext, onBack }: Props) {
  const startDraft  = useCharacterStore(s => s.startDraft);
  const updateDraft = useCharacterStore(s => s.updateDraft);
  const draft       = useCharacterStore(s => s.draft);

  // ensure draft exists once
  const ran = useRef(false);
  useEffect(() => { if (ran.current) return; ran.current = true; startDraft(); }, [startDraft]);

  const level = draft?.level ?? 1;
  const classId = draft?.class as (typeof CLASSES[number]['id']) | undefined;

  // features chosen in Step 5 (for prereqs)
  const chosenIds = new Set([
    ...(draft?.picks?.talents ?? []),
    ...(draft?.picks?.powers ?? []),
    ...(draft?.picks?.spells ?? []),
    ...(draft?.picks?.maneuvers ?? []),
  ]);

  const allowedTiers = useMemo(() => allowedTiersByLevel(level), [level]);
  const maxFeats = useMemo(() => totalFeatsByLevel(level), [level]);

  const catalog = useMemo(() => featsFor(classId, allowedTiers), [classId, allowedTiers]);

  // local selection
  const [selected, setSelected] = useState<string[]>(draft?.feats ?? []);

  const count = selected.length;
  const valid = count <= maxFeats; // can be < max; not forcing exact yet

  function toggle(id: string) {
    setSelected(prev => {
      const has = prev.includes(id);
      if (has) return prev.filter(x => x !== id);
      if (prev.length >= maxFeats) return prev; // block exceeding total
      return [...prev, id];
    });
  }

  function isDisabled(feat: FeatDef): boolean {
    // block if over cap or prereq missing
    if (selected.length >= maxFeats && !selected.includes(feat.id)) return true;
    if (feat.requiresFeatureId && !chosenIds.has(feat.requiresFeatureId)) return true;
    // tier gating is already applied in catalog; leaving here for clarity
    return false;
  }

  function handleNext() {
    if (!valid) return;
    updateDraft({ feats: selected });
    onNext();
  }

  // Group by tier for display
  const byTier: Record<FeatTier, FeatDef[]> = useMemo(() => {
    const map = { Adventurer: [] as FeatDef[], Champion: [] as FeatDef[], Epic: [] as FeatDef[] };
    for (const f of catalog) map[f.tier].push(f);
    return map;
  }, [catalog]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Step 6: Feats</h2>
      <p className="text-zinc-400 text-sm">
        You can choose up to <strong>{maxFeats}</strong> feat{maxFeats !== 1 ? 's' : ''} at level {level}.
        {level < 5 && ' (Adventurer feats only)'}
        {level >= 5 && level < 8 && ' (Adventurer & Champion feats available)'}
        {level >= 8 && ' (All tiers available)'}
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        {TIERS.map(tier => (
          <div key={tier} className="border border-zinc-800 rounded-xl p-4 bg-zinc-900">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{tier}</h3>
              {!allowedTiers.has(tier) && (
                <span className="text-[11px] text-zinc-500">Locked at lvl {level}</span>
              )}
            </div>
            <div className="grid gap-2">
              {byTier[tier].length === 0 && (
                <div className="text-xs text-zinc-500">No {tier} feats available for your class yet.</div>
              )}
              {byTier[tier].map(f => {
                const disabled = isDisabled(f);
                const checked = selected.includes(f.id);
                return (
                  <label key={f.id} className={`flex items-start gap-2 ${disabled ? 'opacity-50' : ''}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => toggle(f.id)}
                    />
                    <div>
                      <div className="font-medium">{f.name}</div>
                      {f.description && (
                        <div className="text-xs text-zinc-400">{f.description}</div>
                      )}
                      {f.requiresFeatureId && !chosenIds.has(f.requiresFeatureId) && (
                        <div className="text-[11px] text-amber-300">Requires a specific selection in Step 5.</div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
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
        <p className="text-xs text-red-400">You’ve selected too many feats (max {maxFeats}).</p>
      )}
    </div>
  );
}
