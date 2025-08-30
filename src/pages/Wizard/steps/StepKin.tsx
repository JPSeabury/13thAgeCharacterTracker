import { useEffect, useMemo, useRef, useState } from 'react';
import { useCharacterStore } from '../../../store/characterStore';
import { KIN, type KinDef, type KinId } from '../../../data/kin';

type Props = { onNext: () => void; onBack: () => void };

export default function StepKin({ onNext, onBack }: Props) {
  const startDraft = useCharacterStore((s) => s.startDraft);
  const updateDraft = useCharacterStore((s) => s.updateDraft);
  const draft = useCharacterStore((s) => s.draft);

  // ensure a draft exists once
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    startDraft();
  }, [startDraft]);

  // local state
  const [kinId, setKinId] = useState<KinId | ''>((draft?.kin as KinId) ?? '');
  const [powerIds, setPowerIds] = useState<string[]>(draft?.kinPowerIds ?? []);

  // sync when draft already had values
  useEffect(() => {
    if (draft?.kin && !kinId) setKinId(draft.kin as KinId);
    if (draft?.kinPowerIds && powerIds.length === 0) setPowerIds(draft.kinPowerIds);
  }, [draft]);

  const selectedKin: KinDef | undefined = useMemo(
    () => KIN.find(k => k.id === kinId),
    [kinId]
  );

  const required = selectedKin?.requiredPicks ?? 0;
  const isValid = !!kinId && powerIds.length === required;

  function togglePower(id: string) {
    setPowerIds(prev => {
      const has = prev.includes(id);
      if (has) return prev.filter(x => x !== id);
      // if adding would exceed requiredPicks, block
      if (selectedKin && prev.length >= selectedKin.requiredPicks) return prev;
      return [...prev, id];
    });
  }

  function handleNext() {
    if (!isValid) return;
    updateDraft({ kin: kinId as any, kinPowerIds: powerIds });
    onNext();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Step 3: Kin</h2>

      {/* Kin selection */}
      <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900">
        <h3 className="font-semibold mb-3">Choose your kin</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
          {KIN.map(k => (
            <label key={k.id} className={`flex items-center gap-2 rounded-md px-3 py-2 bg-zinc-800 cursor-pointer border ${kinId === k.id ? 'border-indigo-500' : 'border-transparent'}`}>
              <input
                type="radio"
                name="kin"
                checked={kinId === k.id}
                onChange={() => {
                  setKinId(k.id);
                  setPowerIds([]); // reset powers when changing kin
                }}
              />
              <span>{k.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Powers for selected kin */}
      {selectedKin && (
        <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Kin Powers</h3>
            <span className="text-xs text-zinc-400">
              Choose {selectedKin.requiredPicks} {selectedKin.requiredPicks === 1 ? 'power' : 'powers'}
            </span>
          </div>
          <div className="mt-3 grid gap-2">
            {selectedKin.powers.map(p => (
              <label key={p.id} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={powerIds.includes(p.id)}
                  onChange={() => togglePower(p.id)}
                  disabled={
                    !powerIds.includes(p.id) &&
                    powerIds.length >= selectedKin.requiredPicks
                  }
                />
                <div>
                  <div className="font-medium">{p.name}</div>
                  {p.description && (
                    <div className="text-xs text-zinc-400">{p.description}</div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
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

      {/* Validation hints */}
      {!kinId && <p className="text-xs text-red-400">Choose a kin to continue.</p>}
      {kinId && powerIds.length !== required && (
        <p className="text-xs text-red-400">
          Select exactly {required} kin {required === 1 ? 'power' : 'powers'}.
        </p>
      )}
    </div>
  );
}
