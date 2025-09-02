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
            <label
              key={k.id}
              className={`flex items-center gap-2 rounded-md px-3 py-2 bg-zinc-800 cursor-pointer border ${
                kinId === k.id ? 'border-indigo-500' : 'border-transparent'
              }`}
            >
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
              Choose {selectedKin.requiredPicks}{' '}
              {selectedKin.requiredPicks === 1 ? 'power' : 'powers'}
            </span>
          </div>

          {/* >>> REPLACED LIST WITH CARD GRID <<< */}
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {selectedKin.powers.map(p => {
              const checked = powerIds.includes(p.id);
              const disabled = !checked && powerIds.length >= selectedKin.requiredPicks;
              return (
                <label
                  key={p.id}
                  className={[
                    'block cursor-pointer rounded-xl border p-4 transition',
                    checked
                      ? 'border-indigo-500 ring-2 ring-indigo-500/30 bg-zinc-800'
                      : 'border-zinc-700 hover:border-zinc-500 bg-zinc-800/60',
                    disabled && !checked ? 'opacity-60 cursor-not-allowed' : ''
                  ].join(' ')}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 h-5 w-5"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => togglePower(p.id)}
                      aria-label={`Select ${p.name}`}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="text-base font-semibold leading-snug">{p.name}</div>
                        {p.usage && (
                          <span className="rounded-full border border-zinc-600 px-2 py-0.5 text-xs text-zinc-300">
                            {p.usage === 'once-per-battle' ? '1/Battle' : 'Passive'}
                          </span>
                        )}
                      </div>

                      {/* summary right under the title */}
                      {p.summary && (
                        <p className="text-sm text-zinc-400 mt-0.5">{p.summary}</p>
                      )}

                      {/* quick details */}
                      <div className="mt-3 space-y-1.5 text-sm">
                        {p.requirements && <KV label="Requirements" value={p.requirements} />}
                        {p.trigger && <KV label="Trigger" value={p.trigger} />}
                        {p.effect && <KV label="Effect" value={p.effect} />}
                        {p.missEffect && <KV label="On Miss" value={p.missEffect} />}
                        {p.critEffect && <KV label="On Crit" value={p.critEffect} />}
                        {p.notes && <KV label="Notes" value={p.notes} />}
                      </div>

                      {/* feats */}
                      {p.feats && p.feats.length > 0 && (
                        <div className="mt-3 rounded-lg bg-zinc-800/70 p-3">
                          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            Feats
                          </div>
                          <ul className="mt-1.5 space-y-1.5">
                            {sortFeats(p.feats).map((f, i) => (
                              <li key={i} className="text-sm leading-snug">
                                <span className="mr-2 inline-flex items-center gap-1 rounded-full border border-zinc-600 px-2 py-0.5 text-xs">
                                  {f.tier === 'adventurer'
                                    ? 'Adventurer'
                                    : f.tier === 'champion'
                                    ? 'Champion'
                                    : 'Epic'}
                                </span>
                                {f.description}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              );
            })}
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

/* --- tiny helpers --- */
function KV({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] items-start gap-2">
      <div className="text-xs uppercase tracking-wide text-zinc-400 pt-0.5">{label}</div>
      <div className="text-zinc-100">{value}</div>
    </div>
  );
}

function sortFeats(
  feats: NonNullable<KinDef['powers']>[number]['feats']
) {
  if (!feats) return [];
  const order = { adventurer: 0, champion: 1, epic: 2 } as const;
  return [...feats].sort((a, b) => order[a.tier] - order[b.tier]);
}
