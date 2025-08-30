import React, { useState } from 'react';
import StepKinSelect from './StepKinSelect';
import StepKinPowers from './StepKinPowers';

export default function CharacterWizard() {
  const [step, setStep] = useState(2); // start on Step 2 for kin selection

  return (
    <div className="p-6">
      {step === 2 && <StepKinSelect onContinue={() => setStep(3)} />}
      {step === 3 && <StepKinPowers />}
    </div>
  );
}
