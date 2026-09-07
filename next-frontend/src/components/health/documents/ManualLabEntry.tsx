"use client";
import { useEffect, useRef, useState } from "react";
import { documentsApi, type ManualLabInput } from "@/api/documents";
import { usePublicCopy } from "@/components/public/ProductLayout";
import { RecordDialog } from "../RecordForms";
import { readableError } from "../model";
import styles from "./documents.module.css";
import health from "../health.module.css";

export default function ManualLabEntry({
  memberId,
  onClose,
  onSaved,
}: {
  memberId: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const c = usePublicCopy();
  const [mode, setMode] = useState("numeric");
  const [values, setValues] = useState({
    analyte: "",
    value: "",
    valueText: "",
    unit: "",
    referenceLow: "",
    referenceHigh: "",
    referenceLabel: "",
    collectedAt: "",
  });
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  const set = (key: keyof typeof values, value: string) =>
    setValues((old) => ({ ...old, [key]: value }));
  const optionalNumber = (value: string) =>
    value.trim() === "" ? null : Number(value);
  const fields: [keyof typeof values, string, string][] = [
    ["analyte", c("Test name", "Analizin adı"), "text"],
    ...((mode === "numeric"
      ? [["value", c("Result", "Nəticə"), "number"]]
      : [["valueText", c("Result as text", "Mətnlə nəticə"), "text"]]) as [
      keyof typeof values,
      string,
      string,
    ][]),
    ["unit", c("Unit (optional)", "Ölçü vahidi (istəyə bağlı)"), "text"],
    [
      "collectedAt",
      c(
        "Collection date and time (optional)",
        "Analizin tarixi və saatı (istəyə bağlı)",
      ),
      "datetime-local",
    ],
    [
      "referenceLow",
      c(
        "Reference lower bound (optional)",
        "Normanın aşağı həddi (istəyə bağlı)",
      ),
      "number",
    ],
    [
      "referenceHigh",
      c(
        "Reference upper bound (optional)",
        "Normanın yuxarı həddi (istəyə bağlı)",
      ),
      "number",
    ],
    [
      "referenceLabel",
      c(
        "Reference range as printed (optional)",
        "Sənəddəki norma aralığı (istəyə bağlı)",
      ),
      "text",
    ],
  ];
  return (
    <RecordDialog
      title={c("Enter a lab result", "Analiz nəticəsi əlavə et")}
      onClose={onClose}
      busy={busy}
    >
      <p className={styles.muted}>
        {c(
          "Copy the result from your report. It will be saved immediately as a manually entered result, without a review step.",
          "Nəticəni analiz cavabından köçürün. Qeyd əl ilə daxil edilmiş nəticə kimi dərhal saxlanacaq; ayrıca təsdiqləmə tələb olunmur.",
        )}
      </p>
      <form
        noValidate
        onSubmit={async (event) => {
          event.preventDefault();
          if (controller.current) return;
          setError("");
          if (!values.analyte.trim()) {
            setError(c("Enter the test name.", "Analizin adını yazın."));
            return;
          }
          if (
            !(mode === "numeric"
              ? values.value.trim()
              : values.valueText.trim())
          ) {
            setError(
              c(
                "Enter a numeric or text result.",
                "Nəticəni rəqəmlə və ya mətnlə yazın.",
              ),
            );
            return;
          }
          const body: ManualLabInput = {
            analyte: values.analyte.trim(),
            value: mode === "numeric" ? optionalNumber(values.value) : null,
            valueText: mode === "text" ? values.valueText.trim() : null,
            unit: values.unit.trim() || null,
            referenceLow: optionalNumber(values.referenceLow),
            referenceHigh: optionalNumber(values.referenceHigh),
            referenceLabel: values.referenceLabel.trim() || null,
            collectedAt: values.collectedAt
              ? values.collectedAt.length === 16
                ? `${values.collectedAt}:00`
                : values.collectedAt
              : null,
          };
          if (
            [body.value, body.referenceLow, body.referenceHigh].some(
              (value) => value !== null && !Number.isFinite(value),
            )
          ) {
            setError(
              c(
                "Check the numeric fields.",
                "Rəqəmlərin düzgün yazıldığını yoxlayın.",
              ),
            );
            return;
          }
          if (
            body.referenceLow !== null &&
            body.referenceHigh !== null &&
            body.referenceLow > body.referenceHigh
          ) {
            setError(
              c(
                "The lower reference bound cannot exceed the upper bound.",
                "Normanın aşağı həddi yuxarı həddindən böyük ola bilməz.",
              ),
            );
            return;
          }
          const request = new AbortController();
          controller.current = request;
          setBusy(true);
          try {
            await documentsApi.createLab(memberId, body, request.signal);
            if (!request.signal.aborted) onSaved();
          } catch (err) {
            if (!request.signal.aborted)
              setError(
                readableError(
                  err,
                  c(
                    "Could not save the lab result.",
                    "Analiz nəticəsini saxlamaq mümkün olmadı.",
                  ),
                ),
              );
          } finally {
            if (!request.signal.aborted) {
              controller.current = null;
              setBusy(false);
            }
          }
        }}
      >
        <fieldset disabled={busy} className={styles.section}>
          <legend>{c("Result format", "Nəticənin formatı")}</legend>
          <label className={styles.field}>
            <select
              aria-label={c("Result format", "Nəticənin formatı")}
              value={mode}
              onChange={(event) => setMode(event.target.value)}
            >
              <option value="numeric">{c("Number", "Rəqəm")}</option>
              <option value="text">
                {c(
                  "Text, such as negative or trace",
                  "Mətn, məsələn, neqativ və ya iz miqdarda",
                )}
              </option>
            </select>
          </label>
          <div className={health.fields}>
            {fields.map(([key, label, type]) => (
              <label key={key} className={styles.field}>
                {label}
                <input
                  name={key}
                  type={type}
                  step={type === "number" ? "any" : undefined}
                  value={values[key]}
                  required={["analyte", "value", "valueText"].includes(key)}
                  onChange={(event) => set(key, event.target.value)}
                />
              </label>
            ))}
          </div>
          <p className={styles.muted}>
            {c(
              "Reference ranges vary by laboratory. Enter them only if shown on the report. Without a range, no abnormal flag will be assigned.",
              "Norma aralığı laboratoriyadan asılıdır. Yalnız analiz cavabında göstərilibsə, daxil edin. Aralıq olmadıqda nəticənin normadan kənar olub-olmadığı göstərilməyəcək.",
            )}
          </p>
        </fieldset>
        {error && (
          <p role="alert" className={health.error}>
            {error}
          </p>
        )}
        <div className={styles.actions}>
          <button
            type="button"
            className={health.secondary}
            disabled={busy}
            onClick={onClose}
          >
            {c("Cancel", "Ləğv et")}
          </button>
          <button type="submit" className={styles.primary} disabled={busy}>
            {busy
              ? c("Saving...", "Saxlanılır...")
              : c("Save result", "Nəticəni saxla")}
          </button>
        </div>
      </form>
    </RecordDialog>
  );
}
