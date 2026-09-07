"use client";
import { LabSource } from "./LabSource";
import { documentDateLabel as dateLabel } from "./model";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  documentsApi,
  type LabResult,
  type ProposedMedication,
  type MedicationCorrections,
} from "@/api/documents";
import { usePublicCopy } from "@/components/public/ProductLayout";
import { RecordDialog } from "../RecordForms";
import { enumLabel, readableError } from "../model";
import { Flag } from "../Vitals";
import styles from "./documents.module.css";
import health from "../health.module.css";
export type Proposal =
  | { kind: "lab"; row: LabResult }
  | { kind: "medication"; row: ProposedMedication };
export function ProposalBadge() {
  const c = usePublicCopy();
  return (
    <span className={styles.pending}>
      {c("Unconfirmed extraction", "Oxunub, təsdiqlənməyib")}
    </span>
  );
}
export function ProposalCard({
  proposal,
  write,
  onReview,
  onSource,
}: {
  proposal: Proposal;
  write: boolean;
  onReview: (action: "accept" | "edit" | "reject") => void;
  onSource: (id: number) => void;
}) {
  const c = usePublicCopy();
  const { i18n } = useTranslation();
  const shownDate = (value: string | null) =>
    value ? dateLabel(value, i18n.language) : null;
  const missing = c("Not provided", "Göstərilməyib");
  const row = proposal.row;
  const source =
    proposal.kind === "lab"
      ? proposal.row.documentId
      : proposal.row.sourceDocumentId;
  const facts: [string, string | null][] =
    proposal.kind === "lab"
      ? [
          [c("Extracted value", "Oxunan nəticə"), proposal.row.displayValue],
          [c("Reference", "Norma aralığı"), proposal.row.referenceLabel],
          [
            c("Collected at", "Analizin tarixi"),
            shownDate(proposal.row.collectedAt),
          ],
        ]
      : [
          [c("Dose", "Doza"), proposal.row.doseLabel],
          [c("Frequency", "Qəbul tezliyi"), proposal.row.frequency],
          [
            c("Route", "Qəbul yolu"),
            proposal.row.route ? enumLabel(proposal.row.route, c) : null,
          ],
          [c("Started", "Başlama tarixi"), shownDate(proposal.row.startedOn)],
          [c("Ended", "Bitmə tarixi"), shownDate(proposal.row.endedOn)],
          [c("Prescriber", "Resepti yazan həkim"), proposal.row.prescriber],
        ];
  return (
    <article className={styles.proposal} data-proposal-id={row.id}>
      <ProposalBadge />
      {proposal.kind === "lab" && <LabSource row={proposal.row} />}
      <h3>
        {proposal.kind === "lab"
          ? proposal.row.analyte
          : proposal.row.name || missing}
      </h3>
      <dl className={styles.facts}>
        {facts.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value ?? missing}</dd>
          </div>
        ))}
      </dl>
      {proposal.kind === "lab" && (
        <div>
          <span className={styles.muted}>
            {c("Extracted flag: ", "Sənəddən oxunan qiymətləndirmə: ")}
          </span>
          <Flag flag={proposal.row.abnormalFlag} />
        </div>
      )}
      <div className={styles.actions}>
        {source != null ? (
          <button className={health.secondary} onClick={() => onSource(source)}>
            {c("Open original", "Sənədin əslinə bax")}
          </button>
        ) : (
          <span className={styles.muted}>
            {c("Source document not provided", "Mənbə sənəd göstərilməyib")}
          </span>
        )}
        {write && (
          <>
            <button
              className={styles.primary}
              onClick={() => onReview("accept")}
            >
              {c("Accept", "Təsdiqlə")}
            </button>
            <button
              className={health.secondary}
              onClick={() => onReview("edit")}
            >
              {c("Correct", "Düzəliş et")}
            </button>
            <button
              className={styles.danger}
              onClick={() => onReview("reject")}
            >
              {c("Reject", "Rədd et")}
            </button>
          </>
        )}
      </div>
    </article>
  );
}
export default function ProposalReview({
  memberId,
  proposal,
  action,
  onClose,
  onSaved,
}: {
  memberId: number;
  proposal: Proposal;
  action: "accept" | "edit" | "reject";
  onClose: () => void;
  onSaved: () => void;
}) {
  const c = usePublicCopy();
  const request = useRef<AbortController | null>(null);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  useEffect(() => () => request.current?.abort(), []);
  const fields: {
    key: string;
    label: string;
    type?: string;
    value: string | number | null;
    options?: string[];
  }[] =
    proposal.kind === "lab"
      ? [
          {
            key: "value",
            label: c("Numeric value", "Rəqəmli nəticə"),
            type: "number",
            value: proposal.row.value,
          },
          {
            key: "unit",
            label: c("Unit", "Ölçü vahidi"),
            value: proposal.row.unit,
          },
        ]
      : [
          {
            key: "name",
            label: c("Medicine name", "Dərmanın adı"),
            value: proposal.row.name,
          },
          {
            key: "doseAmount",
            label: c("Dose amount", "Dozanın miqdarı"),
            type: "number",
            value: proposal.row.doseAmount,
          },
          {
            key: "doseUnit",
            label: c("Dose unit", "Dozanın ölçü vahidi"),
            value: proposal.row.doseUnit,
          },
          {
            key: "frequency",
            label: c("Frequency", "Qəbul tezliyi"),
            value: proposal.row.frequency,
          },
          {
            key: "route",
            label: c("Route", "Qəbul yolu"),
            value: proposal.row.route,
            options: [
              "ORAL",
              "TOPICAL",
              "INHALED",
              "INJECTION",
              "NASAL",
              "OPHTHALMIC",
              "OTIC",
              "RECTAL",
              "OTHER",
            ],
          },
          {
            key: "startedOn",
            label: c("Started", "Başlama tarixi"),
            type: "date",
            value: proposal.row.startedOn,
          },
          {
            key: "endedOn",
            label: c("Ended", "Bitmə tarixi"),
            type: "date",
            value: proposal.row.endedOn,
          },
        ];
  const title =
    action === "reject"
      ? c("Reject this proposal?", "Oxunan məlumat rədd edilsin?")
      : action === "edit"
        ? c("Correct before confirming", "Təsdiqdən əvvəl düzəliş edin")
        : c("Confirm this proposal?", "Oxunan məlumat təsdiqlənsin?");
  return (
    <RecordDialog title={title} onClose={onClose} busy={busy}>
      <ProposalBadge />
      {proposal.kind === "lab" && <LabSource row={proposal.row} />}
      <h3>
        {proposal.kind === "lab"
          ? proposal.row.analyte
          : proposal.row.name || c("Name missing", "Ad göstərilməyib")}
      </h3>
      <p className={styles.muted}>
        {action === "reject"
          ? c(
              "This extracted proposal will be removed. The original document stays saved.",
              "Oxunan bu məlumat silinəcək. Sənədin əsli saxlanacaq.",
            )
          : c(
              "Check the original document before confirming. Confirmation adds this information to the person's record.",
              "Təsdiqdən əvvəl məlumatı sənədin əsli ilə tutuşdurun. Təsdiqlədikdə bu məlumat şəxsin sağlamlıq qeydinə əlavə olunur.",
            )}
      </p>
      {action === "accept" && proposal.kind === "medication" && (
        <dl className={styles.facts}>
          {fields.map((f) => (
            <div key={f.key}>
              <dt>{f.label}</dt>
              <dd>
                {f.value == null
                  ? c("Not provided", "Göstərilməyib")
                  : f.key === "route"
                    ? enumLabel(String(f.value), c)
                    : String(f.value)}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {proposal.kind === "lab" && (
        <p>
          {proposal.row.displayValue ??
            c("Value missing", "Nəticə göstərilməyib")}
        </p>
      )}
      {action === "edit" &&
        proposal.kind === "lab" &&
        proposal.row.valueText != null && (
          <p className={styles.muted}>
            {c(
              "Text results cannot be edited here. Correct the numeric value if appropriate, or reject an incorrectly read text result.",
              "Mətnlə verilmiş nəticəni burada dəyişmək olmur. Uyğundursa, rəqəmli nəticəni yazın; mətn səhv oxunubsa, onu rədd edin.",
            )}
          </p>
        )}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (request.current) return;
          const data = new FormData(e.currentTarget),
            body: Record<string, string | number> = {};
          if (action === "edit") {
            for (const f of fields) {
              const raw = String(data.get(f.key) ?? "").trim();
              if (!raw && f.value != null && String(f.value) !== "") {
                setError(
                  c(
                    "An extracted field cannot be cleared here. Correct it or reject the proposal.",
                    "Oxunmuş sahəni boş saxlamaq olmur. Düzgün məlumatı yazın və ya bu qeydi rədd edin.",
                  ),
                );
                return;
              }
              if (raw) {
                if (f.type === "number" && !Number.isFinite(Number(raw))) {
                  setError(c("Enter a valid number.", "Düzgün rəqəm yazın."));
                  return;
                }
                body[f.key] = f.type === "number" ? Number(raw) : raw;
              }
            }
            if (
              body.startedOn &&
              body.endedOn &&
              body.endedOn < body.startedOn
            ) {
              setError(
                c(
                  "The end date cannot precede the start date.",
                  "Bitmə tarixi başlama tarixindən əvvəl ola bilməz.",
                ),
              );
              return;
            }
          }
          const controller = new AbortController();
          request.current = controller;
          setBusy(true);
          setError("");
          try {
            if (action === "reject") {
              if (proposal.kind === "lab")
                await documentsApi.rejectLab(
                  memberId,
                  proposal.row.id,
                  controller.signal,
                );
              else
                await documentsApi.rejectMedication(
                  memberId,
                  proposal.row.id,
                  controller.signal,
                );
            } else {
              const result =
                proposal.kind === "lab"
                  ? await documentsApi.confirmLab(
                      memberId,
                      proposal.row.id,
                      body,
                      controller.signal,
                    )
                  : await documentsApi.confirmMedication(
                      memberId,
                      proposal.row.id,
                      body as MedicationCorrections,
                      controller.signal,
                    );
              if (result.confirmed !== true)
                throw new Error("Confirmation not completed");
            }
            if (!controller.signal.aborted) onSaved();
          } catch (err) {
            if (!controller.signal.aborted)
              setError(
                readableError(
                  err,
                  c(
                    "Could not save your review. Please try again.",
                    "Yoxlamanın nəticəsini saxlamaq mümkün olmadı. Yenidən cəhd edin.",
                  ),
                ),
              );
          } finally {
            if (!controller.signal.aborted) {
              request.current = null;
              setBusy(false);
            }
          }
        }}
      >
        {action === "edit" && (
          <fieldset disabled={busy} className={styles.form}>
            {fields.map((f) => (
              <label key={f.key} className={styles.field}>
                {f.label}
                {f.options ? (
                  <select name={f.key} defaultValue={f.value ?? ""}>
                    <option value="">
                      {c("Not provided", "Göstərilməyib")}
                    </option>
                    {f.options.map((value) => (
                      <option key={value} value={value}>
                        {enumLabel(value, c)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    name={f.key}
                    type={f.type || "text"}
                    step={f.type === "number" ? "any" : undefined}
                    defaultValue={f.value ?? ""}
                    placeholder={c("Not provided", "Göstərilməyib")}
                  />
                )}
              </label>
            ))}
          </fieldset>
        )}
        {error && (
          <p role="alert" className={health.error}>
            {error}
          </p>
        )}
        <div className={styles.actions}>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className={health.secondary}
          >
            {c("Cancel", "Ləğv et")}
          </button>
          <button
            className={action === "reject" ? styles.danger : styles.primary}
            disabled={busy}
          >
            {busy
              ? c("Saving...", "Saxlanılır...")
              : action === "reject"
                ? c("Reject proposal", "Oxunan məlumatı rədd et")
                : c("Confirm and add to record", "Təsdiqlə və qeydə əlavə et")}
          </button>
        </div>
      </form>
    </RecordDialog>
  );
}
