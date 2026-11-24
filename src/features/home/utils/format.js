// Currency formatter — Indian numbering (Lakh/Crore), matches reference HTML's fmt()
export function fmt(n) {
  if (n >= 10000000) return '₹' + (n / 10000000).toFixed(2) + ' Cr';
  if (n >= 100000) return '₹' + (n / 100000).toFixed(2) + ' L';
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

// SIP future value — standard SIP compounding formula, matches reference HTML's sipFV()
export function sipFV(monthly, years, ratePercent) {
  const r = ratePercent / 100 / 12;
  const n = years * 12;
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}
