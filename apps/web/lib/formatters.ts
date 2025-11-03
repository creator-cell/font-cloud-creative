export const formatTokens = (value: number, fractionDigits = 0) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits
  }).format(value ?? 0);

export const formatInr = (cents: number, fractionDigits = 2) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: fractionDigits
  }).format((cents ?? 0) / 100);

export const formatLatency = (value: number) =>
  `${Math.round(value ?? 0).toLocaleString("en-IN")} ms`;

