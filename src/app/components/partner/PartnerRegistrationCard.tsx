'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RegistrationStep from './RegistrationStep';
import PartnerDetailsStep from './PartnerDetailsStep';
import BankStep from './BankStep';
import NomineeStep from './NomineeStep';
import PartnerSidebar from './PartnerSidebar';
import PartnerSuccessModal from './PartnerSuccessModal';
import { PartnerFormData } from './types';

const initialFormData: PartnerFormData = {
  partner_id: '',
  registration_number: '',
  email: '',
  phone: '',
  email_otp: '',
  mobile_otp: '',
  name: '',
  location: '',
  expiry_date: '',
  euins: [''],
  account_holder: '',
  bank_name: '',
  account_number: '',
  confirm_account_number: '',
  ifsc: '',
  nominee_name: '',
  relationship: '',
  dob: '',
  pan_card: '',
};

const STEP_COUNT = 4;

export default function PartnerRegistrationCard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PartnerFormData>(initialFormData);
  const [euins, setEuins] = useState<string[]>(['']);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(
    'We will share the login details in 24-48 hours after verification.',
  );

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateEuins = (newEuins: string[]) => {
    setEuins(newEuins);
    setFormData((prev) => ({ ...prev, euins: newEuins }));
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
    window.location.href = '/';
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEuins(['']);
    setCurrentStep(1);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <RegistrationStep
            formData={formData}
            updateField={updateField}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <PartnerDetailsStep
            formData={formData}
            updateField={updateField}
            updateEuins={updateEuins}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <BankStep
            formData={formData}
            updateField={updateField}
            onNext={handleNext}
            onBack={handleBack}
          />
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
    <div className="bg-[#F7F7F7] min-h-screen pt-12 lg:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col lg:flex-row">
          <PartnerSidebar currentStep={currentStep} />
          <div className="flex-1 p-6 sm:p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <PartnerSuccessModal
        open={showSuccessModal}
        message={successMessage}
        onOk={handleOk}
      />

      <button
        type="button"
        onClick={resetForm}
        className="hidden"
        aria-label="Reset form"
      />
    </div>
  );
}
