'use client';

import React from 'react';
import {
  INPUT_CLASS,
  LABEL_CLASS,
  PRIMARY_BUTTON_CLASS,
  SECONDARY_BUTTON_CLASS,
  StepProps,
} from './types';

export default function NomineeStep({
  formData,
  updateField,
  onBack,
  onSubmit,
}: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-gilroy font-semibold text-2xl text-[#001E3C]">
          Nominee
        </h2>
      </div>

      <div>
        <label htmlFor="nominee_name" className={LABEL_CLASS}>
          Nominee Name
        </label>
        <input
          type="text"
          id="nominee_name"
          value={formData.nominee_name}
          onChange={(e) => updateField('nominee_name', e.target.value)}
          className={INPUT_CLASS}
          placeholder="Enter nominee name"
        />
      </div>

      <div>
        <label htmlFor="relationship" className={LABEL_CLASS}>
          Relationship
        </label>
        <select
          id="relationship"
          value={formData.relationship}
          onChange={(e) => updateField('relationship', e.target.value)}
          className={INPUT_CLASS}
        >
          <option value="">Select relationship</option>
          <option value="son">Son</option>
          <option value="daughter">Daughter</option>
          <option value="spouse">Spouse</option>
          <option value="father">Father</option>
          <option value="mother">Mother</option>
          <option value="brother">Brother</option>
          <option value="sister">Sister</option>
          <option value="other">Other</option>
        </select>
      </div>

       <div>
        <label htmlFor="dob" className={LABEL_CLASS}>
          Date of Birth
        </label>
        <input
          type="date"
          id="dob"
          value={formData.dob}
          onChange={(e) => updateField('dob', e.target.value)}
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="pan_card" className={LABEL_CLASS}>
          PAN Card
        </label>
        <input
          type="text"
          id="pan_card"
          value={formData.pan_card}
          onChange={(e) => updateField('pan_card', e.target.value.toUpperCase())}
          className={INPUT_CLASS}
          placeholder="Enter PAN card number"
          maxLength={10}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button type="button" onClick={onBack} className={SECONDARY_BUTTON_CLASS}>
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className={PRIMARY_BUTTON_CLASS}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
