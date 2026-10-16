function formatDob(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function stageDetails(stage, type) {
  const list = Array.isArray(stage?.profileStage) ? stage.profileStage : [];
  return list.find((item) => item?.type === type)?.details || {};
}

export function mapStageProfile(stage) {
  const details = stageDetails(stage, "DETAILS");
  const pan = stageDetails(stage, "PAN");
  const name = String(details.fullName || "").trim();
  const parts = name.split(/\s+/).filter(Boolean);
  const address = details.address || {};
  const lines = [address.addressLine1, address.addressLine2, address.addressLine3]
    .map((line) => String(line || "").trim())
    .filter(Boolean);
  const phoneRaw = String(details.phone || "").trim();
  const phone = phoneRaw && !phoneRaw.startsWith("+") && phoneRaw.length === 10 ? `+91 ${phoneRaw}` : phoneRaw;

  return {
    name,
    firstName: parts[0] || "",
    initials: parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase(),
    phone,
    dob: formatDob(details.dob || pan.dob),
    pan: String(pan.panValue || "").trim(),
    address: lines.join("\n"),
  };
}

export function mapUserDetails(payload) {
  const people = Array.isArray(payload?.user_personal_details) ? payload.user_personal_details : [];
  const personal = people.find((row) => row && Number(row.is_delete) !== 1) || {};
  const name = String(personal.name || "").trim();
  const parts = name.split(/\s+/).filter(Boolean);
  const subscriptions = Array.isArray(payload?.user_subscription_details)
    ? payload.user_subscription_details
    : [];
  const plan = subscriptions.find((row) => row && Number(row.is_delete) !== 1);
  const planName = String(plan?.name || plan?.plan_name || plan?.planName || "").trim();
  const mobile = payload?.data?.mobile_number;
  const phone = mobile ? `${payload?.data?.country_code || ""} ${mobile}`.trim() : "";
  const address = [personal.city_name, personal.state_name, personal.country_name].filter(Boolean).join(", ");

  return {
    name,
    firstName: parts[0] || "",
    initials: parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase(),
    email: personal.email ? String(personal.email) : "",
    phone,
    dob: formatDob(personal.dob),
    address,
    plan: planName,
  };
}

export function mapBankDetails(payload) {
  const bank = payload?.data?.bank_details;
  if (!bank) return null;
  const raw = String(bank.account_number || "").replace(/\s/g, "");
  const last4 = raw.slice(-4);
  return {
    name: String(bank.bank_name || "").trim(),
    account: last4 ? `xxxxxxx ${last4}` : "",
    branch: String(bank.branch_name || "").trim(),
    ifsc: String(bank.ifsc_code || "").trim(),
  };
}
