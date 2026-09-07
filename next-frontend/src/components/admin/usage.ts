import type { AdminUsage } from "@/api/admin";

export const usd = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
export function costPerCall(cost: number, calls: number) {
  if (calls === 0) return "-";
  const average = cost / calls;
  if (average > 0 && average < 0.000001) return "< $0.000001";
  return `$${average.toFixed(6)}`;
}

/** A malformed response must not look like a healthy zero-spend day. */
export function validateUsage(value: AdminUsage): AdminUsage {
  const number = (n: unknown) =>
    typeof n === "number" && Number.isFinite(n) && n >= 0;
  const metrics = (v: AdminUsage["totals"]) =>
    v &&
    number(v.costUsd) &&
    number(v.calls) &&
    Number.isInteger(v.calls) &&
    number(v.tokens) &&
    Number.isInteger(v.tokens);
  if (
    !value ||
    !number(value.dailyLimitUsd) ||
    !number(value.spentTodayUsd) ||
    !metrics(value.totals) ||
    !Array.isArray(value.daily) ||
    !Array.isArray(value.byModel) ||
    !value.daily.every(
      (day) => metrics(day) && /^\d{4}-\d{2}-\d{2}$/.test(day.date),
    ) ||
    !value.byModel.every(
      (model) => metrics(model) && typeof model.model === "string",
    )
  ) {
    throw new Error(
      "Usage data is incomplete. The current spend and remaining budget could not be verified.",
    );
  }
  return value;
}
