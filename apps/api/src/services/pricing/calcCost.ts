export type CostCalculationInput = {
  tokensIn: number;
  tokensOut: number;
  price: {
    inputPer1kCents: number;
    outputPer1kCents: number;
  };
};

export const calcCostCents = ({ tokensIn, tokensOut, price }: CostCalculationInput): number => {
  const inputCost = (Math.max(tokensIn, 0) / 1000) * price.inputPer1kCents;
  const outputCost = (Math.max(tokensOut, 0) / 1000) * price.outputPer1kCents;
  return Math.round(inputCost + outputCost);
};
