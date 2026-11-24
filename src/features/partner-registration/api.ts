const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

export const ARN_PARTNER_API_URL = `${BASE_URL}arn/partner`;

export interface SendEmailOtpRequest {
  arnNumber: string;
  email: string;
}

export interface SendEmailOtpResponse {
  success: boolean;
  message: string;
  data: {
    partnerId: number;
    arnNumber: string;
    email: string;
    isEmailVerified: boolean;
    isMobileVerified: boolean;
    currentStep: string;
  };
}

export interface VerifyEmailOtpRequest {
  partnerId: number;
  emailOtp: string;
}

export interface VerifyEmailOtpResponse {
  success: boolean;
  message: string;
  data: {
    partnerId: number;
    isEmailVerified: boolean;
    isMobileVerified: boolean;
    currentStep: string;
  };
}

async function postRequest<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const result = await res.json().catch(() => ({}));

  if (!res.ok || !result.success) {
    const msg =
      result.message || result.error || 'An unexpected error occurred';
    throw new Error(msg);
  }

  return result as T;
}

async function postRequestAllowSoftFail<T>(
  url: string,
  body: unknown,
): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const result = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg =
      result.message || result.error || 'An unexpected error occurred';
    throw new Error(msg);
  }

  return result as T;
}

export async function sendEmailOtp(
  arnNumber: string,
  email: string,
): Promise<SendEmailOtpResponse> {
  return postRequest<SendEmailOtpResponse>(
    `${ARN_PARTNER_API_URL}/send-email-otp`,
    { arnNumber, email },
  );
}

export async function verifyEmailOtp(
  partnerId: number,
  emailOtp: string,
): Promise<VerifyEmailOtpResponse> {
  return postRequest<VerifyEmailOtpResponse>(
    `${ARN_PARTNER_API_URL}/verify-email-otp`,
    { partnerId, emailOtp },
  );
}

export interface SendMobileOtpRequest {
  partnerId: number;
  mobileNumber: string;
  callingCode?: string;
}

export interface SendMobileOtpResponse {
  success: boolean;
  message: string;
  data: {
    partnerId: number;
    mobileEndingIn: string;
    smsDelivered: boolean;
    isEmailVerified: boolean;
    isMobileVerified: boolean;
    currentStep: string;
  };
}

export interface VerifyMobileOtpRequest {
  partnerId: number;
  mobileOtp: string;
}

export interface VerifyMobileOtpResponse {
  success: boolean;
  message: string;
  data: {
    partnerId: number;
    isEmailVerified: boolean;
    isMobileVerified: boolean;
    canConfirm: boolean;
    currentStep: string;
  };
}

export async function sendMobileOtp(
  partnerId: number,
  mobileNumber: string,
  callingCode: string = '+91',
): Promise<SendMobileOtpResponse> {
  return postRequest<SendMobileOtpResponse>(
    `${ARN_PARTNER_API_URL}/send-mobile-otp`,
    { partnerId, mobileNumber, callingCode },
  );
}

export async function verifyMobileOtp(
  partnerId: number,
  mobileOtp: string,
): Promise<VerifyMobileOtpResponse> {
  return postRequest<VerifyMobileOtpResponse>(
    `${ARN_PARTNER_API_URL}/verify-mobile-otp`,
    { partnerId, mobileOtp },
  );
}

export interface ConfirmArnDetailsResponse {
  success: boolean;
  message: string;
  data: {
    partnerId: number;
    arnNumber: string;
    email: string;
    mobileNumber: string;
    isEmailVerified: boolean;
    isMobileVerified: boolean;
    verificationStatus: string;
    currentStep: string;
  };
}

export async function confirmArnDetails(
  partnerId: number,
): Promise<ConfirmArnDetailsResponse> {
  return postRequest<ConfirmArnDetailsResponse>(
    `${ARN_PARTNER_API_URL}/confirm-arn-details`,
    { partnerId },
  );
}

export interface SavePartnerDetailsRequest {
  partnerId: number;
  name: string;
  location: string;
  expiryDate?: string;
  yourEuinNumber: string;
  euins?: string[];
}

export interface SavePartnerDetailsResponse {
  success: boolean;
  message: string;
  data: {
    partnerId: number;
    currentStep: string;
  };
}

export async function savePartnerDetails(
  dto: SavePartnerDetailsRequest,
): Promise<SavePartnerDetailsResponse> {
  return postRequest<SavePartnerDetailsResponse>(
    `${ARN_PARTNER_API_URL}/details`,
    dto,
  );
}

export interface SaveBankDetailsRequest {
  partnerId: number;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
}

export interface SaveBankDetailsResponse {
  success: boolean;
  message: string;
  data: {
    partnerId: number;
    currentStep: string;
  };
}

export async function saveBankDetails(
  dto: SaveBankDetailsRequest,
): Promise<SaveBankDetailsResponse> {
  return postRequest<SaveBankDetailsResponse>(
    `${ARN_PARTNER_API_URL}/bank-details`,
    dto,
  );
}

export interface SaveNomineeRequest {
  partnerId: number;
  nomineeName: string;
  relationship: string;
  dateOfBirth: string;
  pan: string;
}

export interface SaveNomineeResponse {
  success: boolean;
  message: string;
  data: {
    partnerId: number;
    verificationStatus?: string;
    finprimError?: string | null;
    currentStep: string;
  };
}

export async function saveNominee(
  dto: SaveNomineeRequest,
): Promise<SaveNomineeResponse> {
  return postRequestAllowSoftFail<SaveNomineeResponse>(
    `${ARN_PARTNER_API_URL}/nominee`,
    dto,
  );
}
