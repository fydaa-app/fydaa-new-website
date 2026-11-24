/**
 * Rupee formatting with Indian grouping (₹12,34,567) and the short forms used in figures
 * (₹11.6 L, ₹1.2 Cr). See DESIGN.md, Numbers.
 */
const grouping = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** ₹12,34,567 */
export function formatInr(value: number): string {
  return `₹${grouping.format(Math.round(value))}`;
}

/** ₹11.60 L, ₹1.25 Cr, or the full figure below one lakh. */
export function formatInrShort(value: number, digits = 2): string {
  if (value >= 1e7) return `₹${(value / 1e7).toFixed(digits)} Cr`;
  if (value >= 1e5) return `₹${(value / 1e5).toFixed(digits)} L`;
  return formatInr(value);
}

/** "11.6 lakh", "1.25 crore": for sentences and screen readers. */
export function formatInrWords(value: number): string {
  if (value >= 1e7) return `₹${Number((value / 1e7).toFixed(2))} crore`;
  if (value >= 1e5) return `₹${Number((value / 1e5).toFixed(2))} lakh`;
  return formatInr(value);
}

/** Future value of a monthly SIP paid at the start of each month. */
export function sipFutureValue(monthly: number, years: number, annualRatePercent: number): number {
  const r = annualRatePercent / 100 / 12;
  const n = years * 12;
  if (r === 0) return monthly * n;
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}
