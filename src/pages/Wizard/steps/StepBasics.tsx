export default function StepBasics({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Step 1: Basics</h2>
      <p className="text-zinc-400">Name, level, alignment, notes — coming next iteration.</p>
      <div className="flex justify-between">
        <button className="px-3 py-2 rounded-md bg-zinc-800" onClick={onBack}>Back</button>
        <button className="px-3 py-2 rounded-md bg-indigo-600" onClick={onNext}>Next</button>
      </div>
    </div>
  );
}