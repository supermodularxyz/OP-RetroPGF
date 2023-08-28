import { suffixNumber } from "./suffixNumber";

export function formatCurrency(amount: number, currency: string, short = true) {
  const format = (n: number) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  return `${short ? suffixNumber(amount) : format(amount)} ${currency}`;
}
