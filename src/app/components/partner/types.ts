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
  euins: string[];
  karvy_broker_code: string;
  cams_broker_code: string;
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
  updateEuins?: (euins: string[]) => void;
  onSubmit?: () => void;
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
  'w-full h-12 px-4 border border-gray-300 rounded-[12px] text-sm text-[#001E3C] placeholder:text-gray-400 focus:outline-none focus:border-[#001E3C] focus:ring-1 focus:ring-[#001E3C] transition-colors font-inter';

export const LABEL_CLASS =
  'block text-sm font-medium text-gray-700 mb-1 font-inter';

export const PRIMARY_BUTTON_CLASS =
  'w-full h-12 bg-black text-white rounded-[12px] font-medium font-inter hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300';

export const SECONDARY_BUTTON_CLASS =
  'w-full h-12 border border-gray-300 text-gray-700 rounded-[12px] font-medium font-inter hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300';

export const inputClassWithError = (hasError: boolean = false) =>
  hasError
    ? `${INPUT_CLASS} border-red-500 focus:border-red-500 focus:ring-red-500`
    : INPUT_CLASS;
