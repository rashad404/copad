import type { MedicineDetail } from "@/api/medicines";
export const azCompare = new Intl.Collator("az", {
  sensitivity: "base",
  numeric: true,
}).compare;
export const price = (value: number | null | undefined) =>
  value == null
    ? "qiymət yoxdur"
    : `${new Intl.NumberFormat("az-AZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)} ₼`;
export const priceOrder = (a: number | null, b: number | null) =>
  (a ?? Infinity) - (b ?? Infinity) || 0;
export const lowestPrice = (d: MedicineDetail) =>
  d.prices.reduce<number | null>(
    (min, p) =>
      p.retailPrice == null ? min : Math.min(min ?? Infinity, p.retailPrice),
    null,
  );
export const saving = (current: number | null, alternative: number | null) =>
  current != null && alternative != null && current > alternative
    ? Math.round((current - alternative) * 100) / 100
    : null;
export const medicineUrl = (slug: string) =>
  `${(process.env.NEXT_PUBLIC_APP_URL || "https://azdoc.ai").replace(/\/$/, "")}/dermanlar/${encodeURIComponent(slug)}`;
export function drugSchema(d: MedicineDetail) {
  const status = d.prescription_status?.toLocaleLowerCase("az");
  return {
    "@context": "https://schema.org",
    "@type": "Drug",
    name: d.name,
    url: medicineUrl(d.slug),
    ...(d.active_ingredient ? { activeIngredient: d.active_ingredient } : {}),
    ...(d.manufacturer
      ? { manufacturer: { "@type": "Organization", name: d.manufacturer } }
      : {}),
    ...(d.release_form ? { dosageForm: d.release_form } : {}),
    ...(status === "reseptsiz"
      ? { prescriptionStatus: "https://schema.org/OTC" }
      : status === "reseptlə"
        ? { prescriptionStatus: "https://schema.org/PrescriptionOnly" }
        : {}),
  };
}
export const safeJsonLd = (value: unknown) =>
  JSON.stringify(value).replace(/</g, "\\u003c");
