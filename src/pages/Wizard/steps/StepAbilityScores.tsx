import { useEffect, useMemo, useRef, useState } from 'react';
import { useCharacterStore } from '../../../store/characterStore';
import { ABILITY_KEYS, DEFAULT_ARRAY } from '../../../types/rules';
import type { AbilityKey } from '../../../types/character';
import { applyAbilityScores } from '../../../utils/abilityScores'; // <-- wire the helper

type Props = { onNext: () => void; onBack: () => void };

const LABELS: Record<AbilityKey, string> = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};

export default function StepAbilityScores({ onNext, onBack }: Props) {
  const startDraft = useCharacterStore((s) => s.startDraft);
  const updateDraft = useCharacterStore((s) => s.updateDraft);
  const draft = useCharacterStore((s) => s.draft);

  // Ensure a draft exists (StrictMode safe)
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    startDraft();
  }, [startDraft]);

  // ----- Local UI state -----
  const [assign, setAssign] = useState<Record<AbilityKey, number | null>>({
    str: null, dex: null, con: null, int: null, wis: null, cha: null,
  });

  const [boost, setBoost] = useState<Record<AbilityKey, boolean>>({
    str: false, dex: false, con: false, int: false, wis: false, cha: false,
  });

  // Hydrate from draft if it already has non-default scores
  useEffect(() => {
    if (!draft?.abilityScores) return;
    const allTen = ABILITY_KEYS.every((k) => draft.abilityScores![k] === 10);
    if (allTen) return;

    const current = draft.abilityScores;
    const pool = [...DEFAULT_ARRAY];
    const nextAssign: Record<AbilityKey, number | null> = { str: null, dex: null, con: null, int: null, wis: null, cha: null };
    const nextBoost: Record<AbilityKey, boolean> = { str: false, dex: false, con: false, int: false, wis: false, cha: false };

    for (const k of ABILITY_KEYS) {
      const score = current[k];
      const plusTwoMatch = pool.find((v) => v + 2 === score);
      if (plusTwoMatch !== undefined) {
        nextAssign[k] = plusTwoMatch;
        nextBoost[k] = true;
        pool.splice(pool.indexOf(plusTwoMatch), 1);
        continue;
      }
      const exact = pool.find((v) => v === score);
      if (exact !== undefined) {
        nextAssign[k] = exact;
        pool.splice(pool.indexOf(exact), 1);
      }
    }

    setAssign(nextAssign);
    setBoost(nextBoost);
  }, [draft]);

  // ---- Derived state & validation ----
  const usedValues = useMemo(
    () => new Set(Object.values(assign).filter((v): v is number => v !== null)),
    [assign]
  );
  const availableFor = (current: number | null) =>
    DEFAULT_ARRAY.filter((v) => v === current || !usedValues.has(v));

  const boostCount = useMemo(
    () => ABILITY_KEYS.reduce((n, k) => n + (boost[k] ? 1 : 0), 0),
    [boost]
  );

  const assignedAll = useMemo(
    () => ABILITY_KEYS.every((k) => assign[k] !== null),
    [assign]
  );

  const isValid = assignedAll && boostCount === 2;

  const mod = (score: number) => Math.floor((score - 10) / 2);

  // ---- Handlers ----
  function handleAssign(k: AbilityKey, val: number | '') {
    setAssign((prev) => ({ ...prev, [k]: val === '' ? null : Number(val) }));
  }

  function toggleBoost(k: AbilityKey) {
    setBoost((prev) => {
      if (!prev[k] && boostCount >= 2) return prev; // block turning on a 3rd
      return { ...prev, [k]: !prev[k] };
    });
  }

  function handleNext() {
    if (!isValid) return;

    // Build inputs for the helper
    const boosts = ABILITY_KEYS.filter((k) => boost[k]); // will be length 2
    const assigned: Record<AbilityKey, number> = {} as any;
    for (const k of ABILITY_KEYS) {
      const v = assign[k];
      if (v == null) return; // safety; UI should prevent this
      assigned[k] = v;
    }

    try {
      const finalScores = applyAbilityScores(assigned, boosts); // <-- tested rule
      updateDraft({ abilityScores: finalScores });
      onNext();
    } catch (err) {
      alert((err as Error).message);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Step 2: Ability Scores</h2>
      <p className="text-zinc-400">
        Assign the default array <code>[{DEFAULT_ARRAY.join(', ')}]</code> once each. Then apply <strong>+2</strong> to exactly two abilities.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Assignment table */}
        <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900">
          <h3 className="font-semibold mb-3">Assign Values</h3>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            {ABILITY_KEYS.map((k) => (
              <div key={k} className="contents">
                <label className="self-center text-sm">{LABELS[k]}</label>
                <select
                  className="px-3 py-2 rounded-md bg-zinc-800 border border-transparent focus:border-indigo-500"
                  value={assign[k] ?? ''}
                  onChange={(e) => handleAssign(k, e.target.value === '' ? '' : Number(e.target.value))}
                >
                  <option value="">—</option>
                  {availableFor(assign[k]).map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Boosts */}
        <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900">
          <h3 className="font-semibold mb-3">+2 Boosts ({boostCount}/2)</h3>
          <div className="grid gap-2">
            {ABILITY_KEYS.map((k) => (
              <label key={k} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!boost[k]}
                  onChange={() => toggleBoost(k)}
                  disabled={!boost[k] && boostCount >= 2}
                />
                <span>{LABELS[k]}</span>
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs text-zinc-400">
            You must select exactly two abilities for the +2 bonus.
          </p>
        </div>
      </div>

      {/* Preview */}
      <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900">
        <h3 className="font-semibold mb-3">Preview</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-sm">
          {ABILITY_KEYS.map((k) => {
            const base = assign[k];
            const plus = boost[k] ? 2 : 0;
            const val = base !== null ? base + plus : null;
            return (
              <div key={k} className="rounded-md bg-zinc-800 px-2 py-1 text-center">
                <div className="text-xs text-zinc-400">{k.toUpperCase()}</div>
                {val === null ? (
                  <div className="font-semibold">—</div>
                ) : (
                  <div className="font-semibold">
                    {val} <span className="text-zinc-400">({mod(val) >= 0 ? `+${mod(val)}` : mod(val)})</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

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
      {!assignedAll && (
        <p className="text-xs text-red-400">Assign all six values before continuing.</p>
      )}
      {assignedAll && boostCount !== 2 && (
        <p className="text-xs text-red-400">Select exactly two abilities for the +2 bonus.</p>
      )}
    </div>
  );
}
