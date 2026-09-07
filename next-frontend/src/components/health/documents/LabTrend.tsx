"use client";
import { LabSource, labSourceLabel } from "./LabSource";
import { documentDateLabel as dateLabel } from "./model";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { documentsApi, type LabResult } from "@/api/documents";
import { usePublicCopy } from "@/components/public/ProductLayout";
import { useResource } from "../useResource";

import { Flag } from "../Vitals";
import { confirmedLabs, labReferenceBand } from "./model";
import styles from "./documents.module.css";
import health from "../health.module.css";
export function AnalyteChart({
  rows,
  unit,
}: {
  rows: LabResult[];
  unit: string;
}) {
  const c = usePublicCopy();
  const { i18n } = useTranslation();
  const points = confirmedLabs(rows)
    .filter((r) => r.unit === (unit || null) || (r.unit || "") === unit)
    .filter(
      (r) =>
        r.value != null &&
        Number.isFinite(r.value) &&
        r.collectedAt &&
        Number.isFinite(Date.parse(r.collectedAt)),
    )
    .sort((a, b) => Date.parse(a.collectedAt!) - Date.parse(b.collectedAt!));
  if (!points.length)
    return (
      <p className={styles.muted}>
        {c(
          "No dated numeric results to chart. All confirmed results are listed below.",
          "Qrafik üçün tarixi göstərilmiş rəqəmli nəticə yoxdur. Təsdiqlənmiş nəticələr aşağıdakı cədvəldədir.",
        )}
      </p>
    );
  const all = points.flatMap((p) => [p.value!, ...(labReferenceBand(p) || [])]);
  const min = Math.min(...all),
    max = Math.max(...all),
    padding = (max - min || Math.abs(max) || 1) * 0.15;
  const low = min - padding,
    high = max + padding;
  const start = Date.parse(points[0].collectedAt!),
    end = Date.parse(points[points.length - 1].collectedAt!);
  const x = (r: LabResult) =>
    start === end
      ? 350
      : 70 + ((Date.parse(r.collectedAt!) - start) / (end - start)) * 560;
  const y = (value: number) => 225 - ((value - low) / (high - low)) * 185;
  return (
    <>
      <svg
        viewBox="0 0 700 280"
        className={styles.chart}
        role="img"
        aria-label={c(
          `Confirmed lab results in ${unit || "an unspecified unit"}`,
          `Təsdiqlənmiş analiz nəticələri: ${unit || "vahid göstərilməyib"}`,
          `Подтвержденные результаты: ${unit || "единица не указана"}`,
        )}
      >
        <title>
          {c(
            "Confirmed results; shaded columns show each result's reported reference interval",
            "Təsdiqlənmiş nəticələr; rəngli sütunlar sənəddəki norma aralığını göstərir",
          )}
        </title>
        {[low, (low + high) / 2, high].map((v) => (
          <g key={v}>
            <line x1="65" x2="645" y1={y(v)} y2={y(v)} stroke="#dce1da" />
            <text x="58" y={y(v) + 4} textAnchor="end">
              {Number(v.toPrecision(4))}
            </text>
          </g>
        ))}
        {points.map((p) => {
          const band = labReferenceBand(p);
          return band ? (
            <rect
              key={p.id}
              x={x(p) - 9}
              y={y(band[1])}
              width="18"
              height={y(band[0]) - y(band[1])}
              fill="#d9e8c8"
            >
              <title>{p.referenceLabel}</title>
            </rect>
          ) : null;
        })}
        <polyline
          points={points.map((p) => `${x(p)},${y(p.value!)}`).join(" ")}
          fill="none"
          stroke="#334f41"
          strokeWidth="2"
        />
        {points.map((p) =>
          p.source !== "MANUAL" && p.source !== "EXTRACTED" ? (
            <path
              key={p.id}
              d={`M${x(p) - 4},${y(p.value!) - 4} l8,8 m0,-8 l-8,8`}
              stroke="#6b7280"
              strokeWidth="2"
            >
              <title>
                {dateLabel(p.collectedAt, i18n.language)}: {p.displayValue}.{" "}
                {labSourceLabel(p, c)}
              </title>
            </path>
          ) : (
            <circle
              key={p.id}
              cx={x(p)}
              cy={y(p.value!)}
              r="4"
              fill={
                p.source === "MANUAL"
                  ? "white"
                  : p.abnormal
                    ? "#9f3427"
                    : "#334f41"
              }
              stroke={p.abnormal ? "#9f3427" : "#334f41"}
              strokeWidth="2"
            >
              <title>
                {dateLabel(p.collectedAt, i18n.language)}: {p.displayValue}.{" "}
                {p.referenceLabel}. {labSourceLabel(p, c)}
              </title>
            </circle>
          ),
        )}
        <text x="70" y="255">
          {dateLabel(points[0].collectedAt, i18n.language)}
        </text>
        <text x="630" y="255" textAnchor="end">
          {dateLabel(points[points.length - 1].collectedAt, i18n.language)}
        </text>
      </svg>
      {points.some(
        (p) => p.source !== "MANUAL" && p.source !== "EXTRACTED",
      ) && (
        <p className={styles.muted}>
          x: {c("Source unavailable", "Mənbə göstərilməyib")}
        </p>
      )}
      <p className={styles.muted}>
        {c(
          "Hollow points: manual entry. Filled points: read from a document. Source details are listed below.",
          "İçi boş nöqtə: əl ilə daxil edilib. Dolu nöqtə: sənəddən oxunub. Mənbə aşağıdakı cədvəldə göstərilir.",
        )}
      </p>

      <p className={styles.muted}>
        {c(
          "Green columns show the numeric reference interval reported for each result. Text-only or missing intervals are not drawn. Different units are charted separately.",
          "Yaşıl sütunlar hər nəticə üçün sənəddə göstərilmiş rəqəmli norma aralığıdır. Mətnlə verilmiş və ya göstərilməmiş aralıq çəkilmir. Fərqli ölçü vahidləri ayrı qrafiklərdə göstərilir.",
        )}
      </p>
    </>
  );
}
export default function LabTrend({
  memberId,
  analyteKey,
  version,
}: {
  memberId: number;
  analyteKey: string;
  version: number;
}) {
  const c = usePublicCopy();
  const { i18n } = useTranslation();
  const [retry, setRetry] = useState(0);
  const result = useResource(
    `${memberId}.${analyteKey}.${version}.${retry}`,
    (signal) => documentsApi.series(memberId, analyteKey, signal),
    c(
      "Could not load lab history.",
      "Analiz tarixçəsini yükləmək mümkün olmadı.",
    ),
  );
  const rows = confirmedLabs(result.data || []).sort((a, b) =>
    (a.collectedAt || "").localeCompare(b.collectedAt || ""),
  );
  return (
    <section className={styles.section}>
      {result.loading ? (
        <p role="status">{c("Loading history...", "Tarixçə yüklənir...")}</p>
      ) : result.error ? (
        <p role="alert" className={health.error}>
          {result.error}
          <button onClick={() => setRetry((n) => n + 1)}>
            {c("Retry", "Yenidən cəhd et")}
          </button>
        </p>
      ) : (
        <>
          {[...new Set(rows.map((r) => r.unit || ""))].map((unit) => (
            <div key={unit}>
              <h3>
                {unit || c("Unit not recorded", "Ölçü vahidi göstərilməyib")}
              </h3>
              <AnalyteChart rows={rows} unit={unit} />
            </div>
          ))}
          <div className={styles.table}>
            <table>
              <caption>
                {c("Confirmed lab history", "Təsdiqlənmiş analiz nəticələri")}
              </caption>
              <thead>
                <tr>
                  <th>{c("Date", "Tarix")}</th>
                  <th>{c("Result", "Nəticə")}</th>
                  <th>{c("Reference", "Norma aralığı")}</th>
                  <th>{c("Flag", "Qiymətləndirmə")}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>
                      {r.collectedAt
                        ? dateLabel(r.collectedAt, i18n.language)
                        : c("Not recorded", "Göstərilməyib")}
                      <div>
                        <LabSource row={r} />
                      </div>
                    </td>
                    <td>
                      {r.displayValue ?? c("Not recorded", "Göstərilməyib")}
                    </td>
                    <td>
                      {r.referenceLabel ?? c("Not recorded", "Göstərilməyib")}
                    </td>
                    <td>
                      <Flag flag={r.abnormalFlag} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!rows.length && (
            <p>
              {c(
                "No confirmed results for this analyte.",
                "Bu analiz üzrə təsdiqlənmiş nəticə yoxdur.",
              )}
            </p>
          )}
        </>
      )}
    </section>
  );
}
