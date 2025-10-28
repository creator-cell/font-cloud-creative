type SupportedCurrency = "USD" | "INR" | "SAR";

type FxTable = Record<SupportedCurrency, Record<SupportedCurrency, number>>;

const parseRate = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const buildFxTable = (): FxTable => {
  const usdToInr = parseRate(process.env.FX_USD_INR, 83.5);
  const usdToSar = parseRate(process.env.FX_USD_SAR, 3.75);

  const usdToUsd = 1;
  const inrToUsd = 1 / usdToInr;
  const sarToUsd = 1 / usdToSar;

  return {
    USD: {
      USD: usdToUsd,
      INR: usdToInr,
      SAR: usdToSar
    },
    INR: {
      USD: inrToUsd,
      INR: 1,
      SAR: usdToSar * inrToUsd
    },
    SAR: {
      USD: sarToUsd,
      INR: usdToInr * sarToUsd,
      SAR: 1
    }
  };
};

let currentFxTable: FxTable = buildFxTable();
let lastUpdated = new Date();

export const refreshFxRates = (): void => {
  currentFxTable = buildFxTable();
  lastUpdated = new Date();
};

export const getFxRates = (): { table: FxTable; lastUpdated: Date } => ({
  table: currentFxTable,
  lastUpdated
});

export const convertCents = (
  amountCents: number,
  from: SupportedCurrency,
  to: SupportedCurrency
): number => {
  if (to === from) {
    return Math.round(amountCents);
  }

  const rate = currentFxTable[from]?.[to];
  if (!rate) {
    throw new Error(`Missing FX rate from ${from} to ${to}`);
  }

  return Math.round(amountCents * rate);
};

export type { SupportedCurrency };
