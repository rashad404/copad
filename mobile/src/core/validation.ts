export function decimal(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return NaN;
  const raw = value.trim();
  return /^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(raw)
    ? Number(raw.replace(",", "."))
    : NaN;
}
export function calendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}
