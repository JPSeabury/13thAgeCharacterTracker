export default function StepFeats({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Step 6: Feats</h2>
      <p className="text-zinc-400">Adventurer / Champion / Epic — coming soon.</p>
      <div className="flex justify-between">
        <button className="px-3 py-2 rounded-md bg-zinc-800" onClick={onBack}>Back</button>
        <button className="px-3 py-2 rounded-md bg-indigo-600" onClick={onNext}>Next</button>
      </div>
    </div>
  );
}