'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import PartnerSidebar from './PartnerSidebar';
import RegistrationStep from './RegistrationStep';
import PartnerDetailsStep from './PartnerDetailsStep';
import BankStep from './BankStep';
import NomineeStep from './NomineeStep';
import PartnerSuccessModal from './PartnerSuccessModal';
import {
  PartnerFormData,
  PARTNER_STEPS,
} from './types';

const initialFormData: PartnerFormData = {
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

export default function PartnerRegistrationCard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState<PartnerFormData>(initialFormData);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateEuins = (euins: string[]) => {
    setFormData((prev) => ({ ...prev, euins }));
  };

  const handleArnContinue = () => {
    setCompletedSteps((prev) => [...new Set([...prev, 1])]);
    setCurrentStep(2);
  };

  const handleNext = () => {
    setCompletedSteps((prev) => [...new Set([...prev, currentStep])]);
    setCurrentStep((prev) => Math.min(prev + 1, PARTNER_STEPS.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    setShowSuccessModal(true);
  };

  const handleOk = () => {
    setShowSuccessModal(false);
    router.push('/');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <RegistrationStep
            formData={formData}
            updateField={updateField}
            onNext={handleArnContinue}
            onBack={() => {}}
          />
        );
      case 2:
        return (
          <PartnerDetailsStep
            formData={formData}
            updateField={updateField}
            updateEuins={updateEuins}
            onNext={handleNext}
          onBack={() => {
            setCurrentStep(1);
          }}
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
            onNext={() => {}}
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-[1100px] mx-auto px-4 py-8">
      <div className="bg-white rounded-[24px] shadow-md border border-gray-200/50 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          <PartnerSidebar
            currentStep={currentStep}
            completedSteps={completedSteps}
          />

          <div className="flex-1 p-8 min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="w-full"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="border-t border-gray-200/50 px-8 py-6 text-center">
          <p className="font-inter text-sm text-gray-600">
            Already a Partner?{' '}
            <a
              href="https://partner.fydaa.com/signin"
              className="text-[#001E3C] font-medium underline underline-offset-2 hover:no-underline transition-colors"
            >
              Login
            </a>
          </p>
        </div>
      </div>

      <PartnerSuccessModal open={showSuccessModal} onOk={handleOk} />
    </div>
  );
}
