import { dateLabel } from "../model";
import type { LabResult, MemberDocument } from "@/api/documents";
export const documentTypes = {
  LAB_RESULT: ["Lab result", "Analiz cavabı"],
  IMAGING: ["Imaging", "Tibbi görüntü"],
  PRESCRIPTION: ["Prescription", "Resept"],
  DISCHARGE_SUMMARY: ["Discharge summary", "Epikriz"],
  REFERRAL: ["Referral", "Göndəriş"],
  VACCINATION: ["Vaccination", "Peyvənd sənədi"],
  INSURANCE: ["Insurance", "Sığorta sənədi"],
  OTHER: ["Other", "Digər"],
} satisfies Record<string, [string, string]>;
export const extracting = (d: MemberDocument) =>
  d.extractionStatus === "PENDING" || d.extractionStatus === "PROCESSING";
export const confirmedLabs = (rows: LabResult[]) =>
  rows.filter((r) => r.confirmed === true);
// Only a complete numeric interval is chartable. Never infer bounds from a
// qualitative, age-dependent, one-sided or otherwise ambiguous reference label.
export function referenceBand(label: string | null): [number, number] | null {
  const match = label
    ?.trim()
    .match(/^(-?\d+(?:[.,]\d+)?)\s+-\s+(-?\d+(?:[.,]\d+)?)$/);
  if (!match) return null;
  const low = Number(match[1].replace(",", ".")),
    high = Number(match[2].replace(",", "."));
  return Number.isFinite(low) && Number.isFinite(high) && low < high
    ? [low, high]
    : null;
}
export function sortedDocuments(docs: MemberDocument[], oldest = false) {
  return [...docs].sort((a, b) => {
    if (!a.documentDate)
      return b.documentDate ? 1 : b.createdAt.localeCompare(a.createdAt);
    if (!b.documentDate) return -1;
    return (
      (oldest ? 1 : -1) * a.documentDate.localeCompare(b.documentDate) ||
      b.id - a.id
    );
  });
}

export function documentDateLabel(value: string | null, locale: string) {
  if (value && locale.startsWith("az")) {
    const date = new Date(value.length === 10 ? value + "T12:00:00" : value);
    if (!Number.isNaN(date.getTime()))
      return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
  }
  return dateLabel(value, locale);
}
