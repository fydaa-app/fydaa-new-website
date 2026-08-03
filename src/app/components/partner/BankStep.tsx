'use client';

import React, { useState } from 'react';
import {
  INPUT_CLASS,
  LABEL_CLASS,
  PRIMARY_BUTTON_CLASS,
  SECONDARY_BUTTON_CLASS,
  StepProps,
  inputClassWithError,
} from './types';
import { Eye, EyeOff } from 'lucide-react';
import { saveBankDetails } from '../../config/arnPartnerApi';

interface BankErrors {
  account_holder: boolean;
  bank_name: boolean;
  account_number: boolean;
  confirm_account_number: boolean;
  ifsc: boolean;
  match: boolean;
}

const INITIAL_ERRORS: BankErrors = {
  account_holder: false,
  bank_name: false,
  account_number: false,
  confirm_account_number: false,
  ifsc: false,
  match: false,
};

export default function BankStep({
  formData,
  updateField,
  onNext,
  onBack,
}: StepProps) {
  const [errors, setErrors] = useState<BankErrors>(INITIAL_ERRORS);
  const [showAccount, setShowAccount] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: BankErrors = {
      account_holder: !formData.account_holder.trim(),
      bank_name: !formData.bank_name.trim(),
      account_number: !formData.account_number.trim(),
      confirm_account_number: !formData.confirm_account_number.trim(),
      ifsc: !formData.ifsc.trim(),
      match:
        formData.account_number.trim() !== '' &&
        formData.confirm_account_number.trim() !== '' &&
        formData.account_number !== formData.confirm_account_number,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((v) => v);
  };

  const handleChange = (field: string, value: string) => {
    if (field === 'account_number' || field === 'confirm_account_number') {
      value = value.replace(/\D/g, '');
    }
    updateField(field, value);
    if (errors[field as keyof BankErrors]) {
      setErrors((prev) => ({ ...prev, [field]: false, match: false }));
    }
  };

  const handleNext = async () => {
    if (!validate()) return;
    if (!formData.partner_id) return;

    setIsLoading(true);
    setApiError(null);

    try {
      await saveBankDetails({
        partnerId: parseInt(formData.partner_id, 10),
        accountHolderName: formData.account_holder,
        bankName: formData.bank_name,
        accountNumber: formData.account_number,
        confirmAccountNumber: formData.confirm_account_number,
        ifscCode: formData.ifsc,
      });
      onNext?.();
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : 'Failed to save bank details',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-gilroy font-semibold text-2xl text-[#001E3C]">
          Bank Details
        </h2>
        <p className="font-inter text-sm text-gray-600 mt-1">
          Enter your bank account details.
        </p>
      </div>

      <div>
        <label htmlFor="account_holder" className={LABEL_CLASS}>
          Account Holder <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="account_holder"
          value={formData.account_holder}
          onChange={(e) => handleChange('account_holder', e.target.value)}
          className={inputClassWithError(errors.account_holder)}
          placeholder="Enter account holder name"
        />
        {errors.account_holder && (
          <p className="text-red-500 text-xs mt-1 font-inter">
            Account holder name is required
          </p>
        )}
      </div>

      <div>
        <label htmlFor="bank_name" className={LABEL_CLASS}>
          Bank Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="bank_name"
          value={formData.bank_name}
          onChange={(e) => handleChange('bank_name', e.target.value)}
          className={inputClassWithError(errors.bank_name)}
          placeholder="Enter bank name"
        />
        {errors.bank_name && (
          <p className="text-red-500 text-xs mt-1 font-inter">
            Bank name is required
          </p>
        )}
      </div>

      <div>
        <label htmlFor="account_number" className={LABEL_CLASS}>
          Account Number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showAccount ? 'text' : 'password'}
            id="account_number"
            value={formData.account_number}
            onChange={(e) => handleChange('account_number', e.target.value)}
            className={inputClassWithError(
              errors.account_number || errors.match
            )}
            placeholder="Enter account number"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowAccount((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={showAccount ? 'Hide' : 'Show'}
          >
            {showAccount ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.account_number && (
          <p className="text-red-500 text-xs mt-1 font-inter">
            Account number is required
          </p>
        )}
      </div>

      <div>
        <label htmlFor="confirm_account_number" className={LABEL_CLASS}>
          Confirm Account Number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            id="confirm_account_number"
            value={formData.confirm_account_number}
            onChange={(e) =>
              handleChange('confirm_account_number', e.target.value)
            }
            className={inputClassWithError(
              errors.confirm_account_number || errors.match
            )}
            placeholder="Confirm account number"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={showConfirm ? 'Hide' : 'Show'}
          >
            {showConfirm ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.confirm_account_number && (
          <p className="text-red-500 text-xs mt-1 font-inter">
            Confirm account number is required
          </p>
        )}
        {errors.match && (
          <p className="text-red-500 text-xs mt-1 font-inter">
            Account numbers do not match
          </p>
        )}
      </div>

      <div>
        <label htmlFor="ifsc" className={LABEL_CLASS}>
          IFSC <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="ifsc"
          value={formData.ifsc}
          onChange={(e) => handleChange('ifsc', e.target.value.toUpperCase())}
          className={inputClassWithError(errors.ifsc)}
          placeholder="Enter IFSC code"
        />
        {errors.ifsc && (
          <p className="text-red-500 text-xs mt-1 font-inter">
            IFSC code is required
          </p>
        )}
      </div>

      {apiError && (
        <p className="text-xs text-red-500 font-inter">{apiError}</p>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className={SECONDARY_BUTTON_CLASS}
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={isLoading}
          className={PRIMARY_BUTTON_CLASS}
        >
          {isLoading ? 'Saving...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
