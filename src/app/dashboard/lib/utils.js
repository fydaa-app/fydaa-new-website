// ─── Formatting Utilities ───

/** Format number to ₹ Indian locale string: rupee(5000) → "₹5,000" */
export const rupee = (n) => "₹" + n.toLocaleString("en-IN");

/** Compact ₹ display: compact(1247832) → "₹12.5L" */
export const compact = (n) => {
  if (n >= 1e7) return "₹" + (n / 1e7).toFixed(1) + "Cr";
  if (n >= 1e5) return "₹" + (n / 1e5).toFixed(1) + "L";
  return "₹" + Math.round(n).toLocaleString("en-IN");
};

/** Ordinal suffix: getOrdinal(1) → "st", getOrdinal(15) → "th" */
export const getOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};

/** SIP future value: sipFV(5000, 12, 10) → corpus for ₹5K/mo at 12% for 10yrs */
export const sipFV = (monthlyAmt, cagrPct, years) => {
  const months = years * 12;
  const rM = Math.pow(1 + cagrPct / 100, 1 / 12) - 1;
  return monthlyAmt * ((Math.pow(1 + rM, months) - 1) / rM);
};

/** Lumpsum future value */
export const lumpFV = (principal, ratePct, years) => {
  const months = years * 12;
  const r = ratePct / 100 / 12;
  return principal * Math.pow(1 + r, months);
};
