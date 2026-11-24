/**
 * Application form state, validation and small input helpers for the FYIAEP application.
 * Step indexes match the order of `getSteps()` in components/steps.tsx.
 */

export type FormState = Record<string, unknown>;
export type UploadsState = Record<string, File[]>;
export type ErrorsState = Record<string, boolean>;
export type FieldSetter = (name: string, val: string) => void;
export type ChipPicker = (name: string, val: string) => void;
export type CheckSetter = (name: string, val: boolean) => void;
export type FileAdder = (name: string, fileList: FileList | File[]) => void;
export type FileRemover = (name: string, index: number) => void;

export function asStr(value: unknown): string {
  if (value === undefined || value === null) return "";
  return String(value);
}

export function firstNameFromForm(form: FormState) {
  return asStr(form.fullName).split(" ")[0] ?? "";
}

function isFilled(val: unknown) {
  return val !== undefined && val !== null && String(val).trim() !== "";
}

function hasUpload(uploads: UploadsState, name: string) {
  return Array.isArray(uploads[name]) && uploads[name].length > 0;
}

const PROGRAMME_SELECTION_KEY = "fyiaep_selected_programme";

export function persistSelectedProgramme(id: string) {
  if (typeof window === "undefined") return;
  if (id) sessionStorage.setItem(PROGRAMME_SELECTION_KEY, id);
  else sessionStorage.removeItem(PROGRAMME_SELECTION_KEY);
}

export function clearPersistedProgramme() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PROGRAMME_SELECTION_KEY);
}

/** 2-month track requires Passed on both NISM exams + at least 2 uploaded NISM docs. */
export function isNismCertifiedForOnField(form: FormState, uploads: UploadsState) {
  const bothPassed = form.nismXA === "Passed" && form.nismXB === "Passed";
  const certCount =
    (Array.isArray(uploads.nismCertDoc) ? uploads.nismCertDoc.filter(Boolean).length : 0) +
    (Array.isArray(uploads.nismScorecard) ? uploads.nismScorecard.filter(Boolean).length : 0);
  return bothPassed && certCount >= 2;
}

/** Indian PAN: 5 letters + 4 digits + 1 letter (e.g. ABCDE1234F) */
function isValidPan(val: unknown) {
  return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(String(val ?? "").trim().toUpperCase());
}

/** Last 4 digits of Aadhaar only */
function isValidAadhaarLast4(val: unknown) {
  return /^[0-9]{4}$/.test(String(val ?? "").trim());
}

export function normalizePanInput(raw: string) {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
}

export function normalizeAadhaarLast4Input(raw: string) {
  return raw.replace(/\D/g, "").slice(0, 4);
}

/** Indian mobile: exactly 10 digits */
function isValidMobile10(val: unknown) {
  return /^[0-9]{10}$/.test(String(val ?? "").replace(/\D/g, ""));
}

export function normalizeMobile10Input(raw: string) {
  return raw.replace(/\D/g, "").slice(0, 10);
}

/** Compare names ignoring case / extra spaces */
function normalizePersonName(val: unknown) {
  return String(val ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function isSamePersonName(a: unknown, b: unknown) {
  const left = normalizePersonName(a);
  const right = normalizePersonName(b);
  return left.length > 0 && right.length > 0 && left === right;
}

export function validateStep(step: number, form: FormState, uploads: UploadsState) {
  const missing: string[] = [];
  let message = "Please fill all required fields marked with * before continuing.";

  const need = (fields: string[]) => {
    fields.forEach((f) => {
      if (!isFilled(form[f])) missing.push(f);
    });
  };

  if (step === 0) {
    need([
      "fullName", "gender", "dob", "whatsapp", "email", "pan", "aadhaar",
      "maritalStatus", "guardian", "emergencyContact", "emergencyRelation",
      "emergencyPhone", "medicalCondition",
      "permHouse", "permStreet", "permCity", "permDistrict", "permState", "permPin",
    ]);
    if (form.medicalCondition === "Yes" && !isFilled(form.medicalDetails)) {
      missing.push("medicalDetails");
    }
    if (!form.sameAddress) {
      need(["currHouse", "currStreet", "currCity", "currDistrict", "currState", "currPin"]);
    }
    if (isFilled(form.emergencyContact) && isSamePersonName(form.emergencyContact, form.fullName)) {
      if (!missing.includes("emergencyContact")) missing.push("emergencyContact");
      message = "Emergency contact person cannot be the same as your full name.";
    }

    const wa = String(form.whatsapp || "").replace(/\D/g, "");
    if (isFilled(form.whatsapp) && !isValidMobile10(wa)) {
      if (!missing.includes("whatsapp")) missing.push("whatsapp");
      message = "Enter a valid 10-digit WhatsApp number.";
    }
    const ep = String(form.emergencyPhone || "").replace(/\D/g, "");
    if (isFilled(form.emergencyPhone) && !isValidMobile10(ep)) {
      if (!missing.includes("emergencyPhone")) missing.push("emergencyPhone");
      if (message === "Please fill all required fields marked with * before continuing." || message.startsWith("Enter a valid 10-digit WhatsApp")) {
        message = missing.includes("whatsapp") && !isValidMobile10(wa)
          ? "Enter valid 10-digit WhatsApp and emergency contact numbers."
          : "Enter a valid 10-digit emergency contact number.";
      }
    }

    if (isFilled(form.pan) && !isValidPan(form.pan)) {
      if (!missing.includes("pan")) missing.push("pan");
      message = "Enter a valid PAN (e.g. ABCDE1234F).";
    }
    if (isFilled(form.aadhaar) && !isValidAadhaarLast4(form.aadhaar)) {
      if (!missing.includes("aadhaar")) missing.push("aadhaar");
      message =
        missing.includes("pan") && !isValidPan(form.pan)
          ? "Enter a valid PAN and the last 4 digits of Aadhaar."
          : "Enter the last 4 digits of your Aadhaar number.";
    }
  }

  if (step === 1) {
    need(["nismXA", "nismXB", "registeredXA", "registeredXB", "previouslyAppeared", "needGuidance"]);
    if (form.nismXA === "Passed") need(["nismXA_cert", "nismXA_date", "nismXA_valid"]);
    if (form.nismXB === "Passed") need(["nismXB_cert", "nismXB_date", "nismXB_valid"]);
    if (form.previouslyAppeared === "Yes" && !isFilled(form.attemptDetails)) {
      missing.push("attemptDetails");
    }
  }

  if (step === 2) {
    need([
      "professionalStatus", "currentOrg", "designation", "workExperience", "industry",
      "workMode", "fieldActivities", "reasonJoining",
      "currentCity", "currentState", "willingToTravel", "needTravelSupport",
      "clientFacing", "preferredLang",
    ]);
  }

  if (step === 4) {
    ["photo", "panCard", "aadhaarCard", "gradCert"].forEach((name) => {
      if (!hasUpload(uploads, name)) missing.push(name);
    });
  }

  if (step === 5) {
    need(["esign_name", "esign_date", "esign_place", "esign_sig"]);
    if (!form.allAnnex_agree) missing.push("allAnnex_agree");
  }

  if (step === 6) {
    if (!isFilled(form.selectedProgramme)) {
      missing.push("selectedProgramme");
      message = "Please select a programme to continue.";
    } else if (
      form.selectedProgramme === "onfield" &&
      !isNismCertifiedForOnField(form, uploads)
    ) {
      missing.push("selectedProgramme");
      message = "This programme is only for NISM certified candidates";
    }
  }

  if (missing.length === 0) return null;
  return {
    fields: missing,
    message,
  };
}
