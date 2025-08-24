import { useMemo, useState } from 'react';
import StepBasics from './steps/StepBasics';
import StepAbilityScores from './steps/StepAbilityScores';
import StepKin from './steps/StepKin';
import StepClass from './steps/StepClass';
import StepTalentsPowers from './steps/StepTalentsPowers';
import StepFeats from './steps/StepFeats';
import StepEquipment from './steps/StepEquipment';
import StepReview from './steps/StepReview';

const STEPS = [
  { key: 'basics', label: 'Basics', component: StepBasics },
  { key: 'abilities', label: 'Ability Scores', component: StepAbilityScores },
  { key: 'kin', label: 'Kin', component: StepKin },
  { key: 'class', label: 'Class', component: StepClass },
  { key: 'powers', label: 'Talents/Powers', component: StepTalentsPowers },
  { key: 'feats', label: 'Feats', component: StepFeats },
  { key: 'equipment', label: 'Equipment', component: StepEquipment },
  { key: 'review', label: 'Review & Create', component: StepReview },
] as const;

export default function CharacterWizard() {
  const [idx, setIdx] = useState(0);
  const Step = useMemo(() => STEPS[idx].component, [idx]);

  return (
    <section className="grid gap-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Create a New Character</h1>
        <ol className="hidden md:flex gap-2 text-xs text-zinc-400">
          {STEPS.map((s, i) => (
            <li key={s.key} className={`px-2 py-1 rounded ${i === idx ? 'bg-zinc-800 text-zinc-100' : 'bg-zinc-900'}`}>{i+1}. {s.label}</li>
          ))}
        </ol>
      </header>

      <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900">
        <Step onNext={() => setIdx((i) => Math.min(i + 1, STEPS.length - 1))} onBack={() => setIdx((i) => Math.max(i - 1, 0))} />
      </div>

      <footer className="flex items-center justify-between">
        <button className="px-3 py-2 rounded-md bg-zinc-800 disabled:opacity-50" onClick={() => setIdx((i) => Math.max(i - 1, 0))} disabled={idx === 0}>Back</button>
        <button className="px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500" onClick={() => setIdx((i) => Math.min(i + 1, STEPS.length - 1))}>
          {idx === STEPS.length - 1 ? 'Finish' : 'Next'}
        </button>
      </footer>
    </section>
  );
}