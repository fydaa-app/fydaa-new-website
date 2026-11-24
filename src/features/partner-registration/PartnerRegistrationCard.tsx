"use client";

import React, { useState, useEffect, useRef, type CSSProperties } from "react";
import { Container } from "@/components/layout/container";
import RegistrationStep from "./RegistrationStep";
import PartnerDetailsStep from "./PartnerDetailsStep";
import BankStep from "./BankStep";
import NomineeStep from "./NomineeStep";
import PartnerSidebar from "./PartnerSidebar";
import PartnerSuccessModal from "./PartnerSuccessModal";
import { PartnerFormData } from "./types";

const initialFormData: PartnerFormData = {
  partner_id: "",
  registration_number: "",
  email: "",
  phone: "",
  email_otp: "",
  mobile_otp: "",
  name: "",
  location: "",
  expiry_date: "",
  main_euin: "",
  other_euins: [""],
  account_holder: "",
  bank_name: "",
  account_number: "",
  confirm_account_number: "",
  ifsc: "",
  nominee_name: "",
  relationship: "",
  dob: "",
  pan_card: "",
};

const STEP_COUNT = 4;

export default function PartnerRegistrationCard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PartnerFormData>(initialFormData);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(
    "We will share the login details in 24-48 hours after verification.",
  );

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateOtherEuins = (newOtherEuins: string[]) => {
    setFormData((prev) => ({ ...prev, other_euins: newOtherEuins }));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, STEP_COUNT));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (message?: string) => {
    if (message) setSuccessMessage(message);
    setShowSuccessModal(true);
  };

  const handleOk = () => {
    setShowSuccessModal(false);
    window.location.href = "/";
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
  };

  const stepRef = useRef<HTMLDivElement>(null);
  const shownStep = useRef(currentStep);

  useEffect(() => {
    window.scrollTo(0, 0);
    // On a new step, move focus to its heading so keyboard and screen reader users start there.
    if (shownStep.current !== currentStep) {
      shownStep.current = currentStep;
      stepRef.current?.querySelector<HTMLElement>("[data-step-heading]")?.focus({ preventScroll: true });
    }
  }, [currentStep]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <RegistrationStep formData={formData} updateField={updateField} onNext={handleNext} />;
      case 2:
        return (
          <PartnerDetailsStep
            formData={formData}
            updateField={updateField}
            updateOtherEuins={updateOtherEuins}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <BankStep formData={formData} updateField={updateField} onNext={handleNext} onBack={handleBack} />
        );
      case 4:
        return (
          <NomineeStep
            formData={formData}
            updateField={updateField}
            onSubmit={handleSubmit}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <section
      aria-labelledby="partner-title"
      className="pb-16 pt-24 sm:pb-20 sm:pt-28 lg:pb-24 lg:pt-32"
      data-enter
    >
      <Container className="grid grid-cols-[minmax(0,1fr)] items-start gap-8 sm:gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <PartnerSidebar currentStep={currentStep} />
        <div
          ref={stepRef}
          className="rounded-4xl border border-line bg-white p-5 shadow-window sm:p-8 lg:p-10"
          data-enter-item
          style={{ "--i": 3 } as CSSProperties}
        >
          {renderStep()}
        </div>
      </Container>

      <PartnerSuccessModal open={showSuccessModal} message={successMessage} onOk={handleOk} />

      <button type="button" onClick={resetForm} className="hidden" aria-label="Reset form" />
    </section>
  );
}
