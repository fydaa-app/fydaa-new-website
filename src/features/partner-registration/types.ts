export interface PartnerFormData {
  partner_id: string;
  registration_number: string;
  email: string;
  phone: string;
  email_otp: string;
  mobile_otp: string;
  name: string;
  location: string;
  expiry_date: string;
  main_euin: string;
  other_euins: string[];
  account_holder: string;
  bank_name: string;
  account_number: string;
  confirm_account_number: string;
  ifsc: string;
  nominee_name: string;
  relationship: string;
  dob: string;
  pan_card: string;
}

export interface StepProps {
  formData: PartnerFormData;
  updateField: (field: string, value: string) => void;
  updateOtherEuins?: (otherEuins: string[]) => void;
  onSubmit?: (message?: string) => void;
  onNext?: () => void;
  onBack?: () => void;
}

export interface StepConfig {
  id: number;
  label: string;
}

export const PARTNER_STEPS: StepConfig[] = [
  { id: 1, label: 'ARN Details' },
  { id: 2, label: 'Partner Details' },
  { id: 3, label: 'Bank Details' },
  { id: 4, label: 'Nominee' },
];

export const INPUT_CLASS =
  'w-full h-12 px-4 border border-gray-300 rounded-xl text-base sm:text-sm text-ink placeholder:text-gray-500 focus:outline-none focus:border-jade focus:ring-1 focus:ring-jade transition-colors';

export const LABEL_CLASS =
  'block text-sm font-medium text-grey-800 mb-1';

export const PRIMARY_BUTTON_CLASS =
  'btn btn-primary btn-lg w-full';

export const SECONDARY_BUTTON_CLASS =
  'btn btn-secondary btn-lg w-full';

export const inputClassWithError = (hasError: boolean = false) =>
  hasError
    ? `${INPUT_CLASS} border-red-500 focus:border-red-500 focus:ring-red-500`
    : INPUT_CLASS;
