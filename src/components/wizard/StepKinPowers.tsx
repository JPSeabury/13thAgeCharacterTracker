import React, { useMemo } from 'react';
import { cn } from '@/utils/cn';
import { KIN } from '@/data/kin';
import type { KinPowerDef, KinDef } from '@/data/kin';
import { useCharacterStore } from '@/store/characterStore';

export default function StepKinPowers() {
  const kinId = useCharacterStore(s => s.draft?.kinId);
  const chosenPowerIds = useCharacterStore(s => s.draft?.kinPowers ?? []);
  const setKinPowers = useCharacterStore(s => s.setKinPowers);

  const kin: KinDef | undefined = useMemo(() => KIN.find(k => k.id === kinId), [kinId]);

  if (!kinId) {
    return (
      <div className="text-sm text-muted-foreground p-4 rounded border bg-gray-50">
        Please choose a kin first to see available powers.
      </div>
    );
  }

  const powers = kin?.powers ?? [];
  const maxPicks = kin?.requiredPicks ?? 1;
  const picksRemaining = Math.max(0, maxPicks - (chosenPowerIds?.length ?? 0));

  // <-- Move togglePower ABOVE the final return
  function togglePower(id: string) {
    const current = new Set(chosenPowerIds ?? []);
    if (current.has(id)) {
      current.delete(id);
    } else {
      if (current.size >= maxPicks) return;
      current.add(id);
    }
    setKinPowers(Array.from(current));
  }

  // <-- Keep ONLY this return
  return (
    <div className="space-y-4">
      <header className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">Choose Kin Power{maxPicks > 1 ? 's' : ''}</h1>
        <span className="text-sm text-muted-foreground">
          {picksRemaining} pick{picksRemaining === 1 ? '' : 's'} remaining
        </span>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {powers.map(p => (
          <KinPowerCard
            key={p.id}
            power={p}
            checked={chosenPowerIds?.includes(p.id) ?? false}
            disabled={!chosenPowerIds?.includes(p.id) && (chosenPowerIds?.length ?? 0) >= maxPicks}
            onChange={() => togglePower(p.id)}
          />
        ))}
      </div>

      <footer className="flex items-center justify-between pt-2">
        <div className="text-xs text-muted-foreground">
          Kin: <strong>{kin?.name ?? 'Unknown'}</strong> · Required picks: {maxPicks}
        </div>
        <div className="text-xs text-muted-foreground">
          Selections: {(chosenPowerIds ?? []).length}/{maxPicks}
        </div>
      </footer>
    </div>
  );
}

/** Card with rich preview for a Kin Power */
function KinPowerCard({
  power,
  checked,
  disabled,
  onChange,
}: {
  power: KinPowerDef;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}) {
  const { name, summary, usage, requirements, trigger, effect, missEffect, critEffect, feats, notes } = power;

  return (
    <label
      className={cn(
        'group relative block cursor-pointer rounded-2xl border p-4 shadow-sm transition-all',
        checked ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-gray-200 hover:border-gray-300',
        disabled && !checked ? 'opacity-60 cursor-not-allowed' : ''
      )}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 h-5 w-5"
          checked={checked}
          disabled={disabled && !checked}
          onChange={onChange}
          aria-label={`Select ${name}`}
        />
        <div className="min-w-0">
          <h3 className="text-lg font-semibold leading-snug">{name}</h3>
          {/* 👇 this shows the summary under the name */}
          {summary && <p className="text-sm text-muted-foreground mt-0.5">{summary}</p>}

          <div className="mt-3 space-y-1.5 text-sm">
            {usage && <KV label="Usage" value={<Mono>{usage === 'once-per-battle' ? '1/Battle' : 'Passive'}</Mono>} />}
            {requirements && <KV label="Requirements" value={requirements} />}
            {trigger && <KV label="Trigger" value={trigger} />}
            {effect && <KV label="Effect" value={effect} />}
            {missEffect && <KV label="On Miss" value={missEffect} />}
            {critEffect && <KV label="On Crit" value={critEffect} />}
            {notes && <KV label="Notes" value={notes} />}
          </div>

          {feats && feats.length > 0 && (
            <div className="mt-3 rounded-xl bg-gray-50 p-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-600">Feats</div>
              <ul className="mt-1.5 space-y-1.5">
                {sortFeats(feats).map((f, i) => (
                  <li key={i} className="text-sm leading-snug">
                    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium mr-2">
                      {badgeForTier(f.tier)}
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
}

function KV({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] items-start gap-2">
      <div className="text-xs uppercase tracking-wide text-gray-600 pt-0.5">{label}</div>
      <div className="text-gray-900">{value}</div>
    </div>
  );
}

function Mono({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-gray-100 px-1 py-0.5 text-[0.85em]">{children}</code>;
}

function sortFeats(feats: NonNullable<KinPowerDef['feats']>) {
  const order = { adventurer: 0, champion: 1, epic: 2 } as const;
  return [...feats].sort((a, b) => order[a.tier] - order[b.tier]);
}

function badgeForTier(tier: NonNullable<KinPowerDef['feats']>[number]['tier']) {
  switch (tier) {
    case 'adventurer':
      return <span className="text-green-700">Adventurer</span>;
    case 'champion':
      return <span className="text-blue-700">Champion</span>;
    case 'epic':
      return <span className="text-purple-700">Epic</span>;
    default:
      return <span>Feat</span>;
  }
}