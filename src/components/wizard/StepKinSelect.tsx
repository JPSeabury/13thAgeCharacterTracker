import React, { useMemo } from 'react';
import { useCharacterStore } from '@/store/characterStore';
import { KIN, type KinDef } from '@/data/kin';

/**
 * StepKinSelect
 * Wizard Step 2 – choose a Kin. This writes to draft.kinId and clears draft.kinPowers.
 * - Shows name, required picks, and a compact list of powers per kin.
 * - Highlights the selected kin; clicking a selected card toggles (optional: keep selected).
 * - Calls optional onContinue() when a kin is selected and the user clicks Next.
 */
export default function StepKinSelect({ onContinue }: { onContinue?: () => void }) {
  const draftKinId = useCharacterStore(s => s.draft?.kinId);
  const setKin = useCharacterStore(s => s.setKin);

  // Precompute a light-weight projection for UI
  const items = useMemo(() =>
    KIN.map(k => ({
      id: k.id,
      name: k.name,
      requiredPicks: k.requiredPicks,
      powerNames: k.powers.map(p => p.name),
      powerSummaries: k.powers.map(p => p.summary).filter(Boolean) as string[],
    })),
  []);

  const canContinue = Boolean(draftKinId);

  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Choose Your Kin</h1>
          <p className="text-sm text-muted-foreground">This sets your available Kin Powers for the next step.</p>
        </div>
        <button
          type="button"
          className={
            'rounded-xl px-3 py-2 text-sm font-medium shadow ' +
            (canContinue
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed')
          }
          disabled={!canContinue}
          onClick={() => canContinue && onContinue?.()}
        >
          Next
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map(k => (
          <KinCard
            key={k.id}
            kin={k as KinDef & { powerNames: string[]; powerSummaries: string[] }}
            selected={draftKinId === k.id}
            onSelect={() => setKin(k.id)}
          />
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Tip: Humans choose <strong>1</strong> kin power but can preview all three in the next step.
      </p>
    </div>
  );
}

function KinCard({
  kin,
  selected,
  onSelect,
}: {
  kin: KinDef & { powerNames: string[]; powerSummaries: string[] };
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={
        'group w-full text-left rounded-2xl border p-4 shadow-sm transition ' +
        (selected
          ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300')
      }
      aria-pressed={selected}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold truncate">{kin.name}</h3>
          <p className="text-xs text-muted-foreground">
            Requires <strong>{kin.requiredPicks}</strong> power{kin.requiredPicks > 1 ? 's' : ''}
          </p>

          <div className="mt-3 space-y-1">
            {kin.powerNames.slice(0, 3).map((n, i) => (
              <div key={i} className="text-sm">
                • {n}
              </div>
            ))}
          </div>

          {kin.powerSummaries.length > 0 && (
            <div className="mt-3 rounded-xl bg-gray-50 p-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-600">At a glance</div>
              <ul className="mt-1.5 space-y-1.5">
                {kin.powerSummaries.slice(0, 3).map((s, i) => (
                  <li key={i} className="text-xs leading-snug text-gray-700">{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <span
          className={
            'mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold ' +
            (selected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600')
          }
          aria-hidden="true"
        >
          {selected ? '✓' : ''}
        </span>
      </div>
    </button>
  );
}
