export default function StepTalentsPowers({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Step 5: Talents / Powers</h2>
      <p className="text-zinc-400">Class picks & usage types — coming soon.</p>
      <div className="flex justify-between">
        <button className="px-3 py-2 rounded-md bg-zinc-800" onClick={onBack}>Back</button>
        <button className="px-3 py-2 rounded-md bg-indigo-600" onClick={onNext}>Next</button>
      </div>
    </div>
  );
}