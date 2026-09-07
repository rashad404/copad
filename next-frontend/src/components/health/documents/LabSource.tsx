"use client";
import type { LabResult } from "@/api/documents";
import { usePublicCopy } from "@/components/public/ProductLayout";
import styles from "./documents.module.css";
export function labSourceLabel(
  row: Pick<LabResult, "source" | "confirmed">,
  c: (en: string, az: string) => string,
) {
  if (row.source === "MANUAL")
    return c("Manually entered", "Əl ilə daxil edilib");
  if (row.source === "EXTRACTED")
    return row.confirmed
      ? c("Read from document, confirmed", "Sənəddən oxunub, təsdiqlənib")
      : c("Read from document, unconfirmed", "Sənəddən oxunub, təsdiqlənməyib");
  return c("Source unavailable", "Mənbə göstərilməyib");
}
export function LabSource({
  row,
}: {
  row: Pick<LabResult, "source" | "confirmed">;
}) {
  const c = usePublicCopy();
  return (
    <span className={styles.muted} data-lab-source={row.source || "UNKNOWN"}>
      {labSourceLabel(row, c)}
    </span>
  );
}
