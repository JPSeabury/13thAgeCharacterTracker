export default function StepReview({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Step 8: Review & Create</h2>
      <p className="text-zinc-400">Summary + validation — coming soon.</p>
      <div className="flex justify-between">
        <button className="px-3 py-2 rounded-md bg-zinc-800" onClick={onBack}>Back</button>
        <button className="px-3 py-2 rounded-md bg-green-600" onClick={onNext}>Create Character</button>
      </div>
    </div>
  );
}