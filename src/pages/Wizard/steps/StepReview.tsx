import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../../../store/characterStore';
import { ABILITY_KEYS } from '../../../types/rules';
import { KIN } from '../../../data/kin';
import { CLASSES } from '../../../data/classes';
import { FEATURES } from '../../../data/features';

type Props = { onNext: () => void; onBack: () => void };

export default function StepReview({ onBack }: Props) {
  const navigate = useNavigate();
  const draft = useCharacterStore(s => s.draft);
  const commitDraft = useCharacterStore(s => s.commitDraft);

  const kin = useMemo(() => KIN.find(k => k.id === draft?.kin), [draft?.kin]);
  const klass = useMemo(() => CLASSES.find(c => c.id === draft?.class), [draft?.class]);
  const picks = draft?.picks ?? {};
  const pickedFeatures = useMemo(
    () => FEATURES.filter(f =>
      (picks.talents ?? []).includes(f.id) ||
      (picks.powers ?? []).includes(f.id) ||
      (picks.spells ?? []).includes(f.id) ||
      (picks.maneuvers ?? []).includes(f.id)
    ),
    [picks]
  );
  const kinPowers = useMemo(
    () => (kin ? kin.powers.filter(p => (draft?.kinPowerIds ?? []).includes(p.id)) : []),
    [kin, draft?.kinPowerIds]
  );

  // simple validation: ensure the core steps are done
  const validBasics = !!draft?.name && Number.isInteger(draft?.level);
  const validAbilities = !!draft?.abilityScores && ABILITY_KEYS.every(k => typeof draft!.abilityScores![k] === 'number');
  const validKin = !!kin && kinPowers.length === (kin?.requiredPicks ?? 0);
  const validClass = !!klass;
  const validStep5 = (() => {
    if (!klass) return false;
    const req = klass.picks;
    const ok = (picks.talents?.length ?? 0) === (req.talents ?? 0)
      && (picks.powers?.length ?? 0) === (req.powers ?? 0)
      && (picks.spells?.length ?? 0) === (req.spells ?? 0)
      && (picks.maneuvers?.length ?? 0) === (req.maneuvers ?? 0);
    return ok;
  })();

  const allValid = validBasics && validAbilities && validKin && validClass && validStep5;

  function finish() {
    if (!allValid) return;
    const id = commitDraft();          // persist draft → characters, clears draft
    navigate(`/character/${id}`);      // go to the character sheet
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Step 8: Review & Create</h2>

      {!allValid && (
        <div className="rounded-lg border border-amber-500/40 bg-amber-950/30 p-3 text-amber-300 text-sm">
          Some steps are incomplete. Use “Back” to fix:
          <ul className="list-disc list-inside mt-2 space-y-1">
            {!validBasics && <li>Basics (name & level)</li>}
            {!validAbilities && <li>Ability Scores</li>}
            {!validKin && <li>Kin & required kin power(s)</li>}
            {!validClass && <li>Class</li>}
            {!validStep5 && <li>Talents/Powers/Spells/Maneuvers picks</li>}
          </ul>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900">
          <h3 className="font-semibold mb-2">Basics</h3>
          <div className="text-sm text-zinc-300">
            <div><span className="text-zinc-400">Name:</span> {draft?.name || '—'}</div>
            <div><span className="text-zinc-400">Level:</span> {draft?.level ?? '—'}</div>
            {draft?.notes && <div className="mt-2 text-zinc-400 whitespace-pre-wrap">{draft.notes}</div>}
          </div>
        </div>

        <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900">
          <h3 className="font-semibold mb-2">Ability Scores</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-sm">
            {ABILITY_KEYS.map(k => (
              <div key={k} className="rounded-md bg-zinc-800 px-2 py-1 text-center">
                <div className="text-xs text-zinc-400">{k.toUpperCase()}</div>
                <div className="font-semibold">{draft?.abilityScores?.[k] ?? '—'}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900">
          <h3 className="font-semibold mb-2">Kin</h3>
          <div className="text-sm text-zinc-300">
            <div><span className="text-zinc-400">Kin:</span> {kin?.name ?? '—'}</div>
            {kinPowers.length > 0 && (
              <ul className="list-disc list-inside mt-2">
                {kinPowers.map(p => <li key={p.id}>{p.name}</li>)}
              </ul>
            )}
          </div>
        </div>

        <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900">
          <h3 className="font-semibold mb-2">Class & Picks</h3>
          <div className="text-sm text-zinc-300">
            <div><span className="text-zinc-400">Class:</span> {klass?.name ?? '—'}</div>
            {pickedFeatures.length > 0 && (
              <ul className="list-disc list-inside mt-2">
                {pickedFeatures.map(f => (
                  <li key={f.id}>
                    {f.name}
                    <span className="ml-1 text-[10px] uppercase tracking-wide text-zinc-400">{f.usage}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button className="px-3 py-2 rounded-md bg-zinc-800" onClick={onBack}>Back</button>
        <button
          className="px-3 py-2 rounded-md bg-green-600 hover:bg-green-500 disabled:opacity-50"
          onClick={finish}
          disabled={!allValid}
        >
          Finish & Create
        </button>
      </div>
    </div>
  );
}
