import { cn } from "@/lib/utils/cn";

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
  { id: 1, label: "ARN details" },
  { id: 2, label: "Partner details" },
  { id: 3, label: "Bank details" },
  { id: 4, label: "Nominee" },
];

/*
 * Field styles, shared by every step. They match the home page's book-a-call form: a mist fill
 * that turns white with a jade ring on focus, 16px text (no zoom on iOS), 48px tall.
 */
export const INPUT_CLASS =
  "h-12 w-full min-w-0 rounded-card border border-line bg-mist px-4 text-base text-ink outline-none " +
  "transition-colors duration-quick placeholder:text-grey-500 focus:border-jade focus:bg-white " +
  "focus:ring-2 focus:ring-jade/15 disabled:opacity-60";

/** Added to a field that has an error. */
export const INPUT_ERROR_CLASS = "border-danger focus:border-danger focus:ring-danger/15";

/** Added to a field that is locked after verification (read-only). */
export const INPUT_LOCKED_CLASS = "cursor-not-allowed bg-grey-100 text-grey-600 focus:bg-grey-100";

export const LABEL_CLASS = "mb-1.5 block text-sm font-semibold text-ink";

/** Helper text under a field. */
export const HINT_CLASS = "mt-1.5 text-sm text-grey-500";

/** Inline field error: says what is wrong and how to fix it. */
export const ERROR_CLASS = "mt-1.5 text-sm text-danger";

/** An error from the server, shown once for the step; replays the shake when it changes. */
export const ALERT_CLASS = "t-shake rounded-card bg-red-50 px-4 py-3 text-sm text-danger";

/** Step heading and its one-line description. */
export const STEP_TITLE_CLASS = "text-title text-ink outline-none";
export const STEP_DESCRIPTION_CLASS = "mt-1 text-base text-grey-600";

export const PRIMARY_BUTTON_CLASS = "btn btn-primary btn-lg w-full sm:w-auto sm:min-w-40";

export const SECONDARY_BUTTON_CLASS = "btn btn-secondary btn-lg w-full sm:w-auto sm:min-w-32";

/** Back and Continue: primary on top on phones, Back left and Continue right from `sm`. */
export const STEP_ACTIONS_CLASS =
  "flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between";

/** Square 44px icon button (add or remove a row, show or hide a value). */
export const ICON_BUTTON_CLASS =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-btn text-grey-500 transition-colors " +
  "duration-quick hover:bg-mist hover:text-ink focus-visible:outline focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-jade";

export const inputClassWithError = (hasError: boolean = false, locked: boolean = false) =>
  cn(INPUT_CLASS, locked && INPUT_LOCKED_CLASS, hasError && INPUT_ERROR_CLASS);

/** The red asterisk after a required field's label (hidden from screen readers; inputs carry aria-required). */
export const REQUIRED_MARK_CLASS = "ml-0.5 text-danger";
