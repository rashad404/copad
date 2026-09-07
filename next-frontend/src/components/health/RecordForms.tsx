"use client";
import { useId, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { X } from "lucide-react";
import {
  healthApi,
  type ClinicalEntry,
  type RecordKind,
  type RecordValue,
  type Member,
} from "@/api/healthRecord";
import { usePublicCopy } from "@/components/public/ProductLayout";
import {
  enumLabel,
  formPayload,
  readableError,
  recordDefinitions,
  type Field,
} from "./model";
import styles from "./health.module.css";
export function RecordDialog({
  title,
  children,
  onClose,
  busy = false,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  busy?: boolean;
}) {
  const c = usePublicCopy();
  return (
    <Dialog
      open
      onClose={() => {
        if (!busy) onClose();
      }}
      className={styles.dialog}
    >
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.dialogPosition}>
        <DialogPanel className={styles.dialogPanel}>
          <div className={styles.dialogHeading}>
            <DialogTitle>{title}</DialogTitle>
            <button
              type="button"
              aria-label={c("Close", "Bağla")}
              disabled={busy}
              onClick={onClose}
            >
              <X size={21} />
            </button>
          </div>
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
export function Fields({
  fields,
  values,
  onChange,
}: {
  fields: Field[];
  values: Record<string, RecordValue>;
  onChange: (key: string, value: RecordValue) => void;
}) {
  const c = usePublicCopy();
  const prefix = useId();
  return (
    <div className={styles.fields}>
      {fields.map((field) => {
        const id = prefix + field.key;
        return (
          <label
            key={field.key}
            htmlFor={id}
            className={
              field.type === "textarea"
                ? styles.wide
                : field.type === "checkbox"
                  ? styles.checkbox
                  : undefined
            }
          >
            {field.type === "checkbox" ? (
              <>
                <input
                  id={id}
                  type="checkbox"
                  checked={Boolean(values[field.key])}
                  onChange={(e) => onChange(field.key, e.target.checked)}
                />
                {c(...field.label)}
              </>
            ) : (
              <>
                {c(...field.label)}
                {field.required && <span className={styles.required}> *</span>}
                {field.type === "select" ? (
                  <select
                    id={id}
                    value={String(values[field.key] ?? "")}
                    required={field.required}
                    onChange={(e) => onChange(field.key, e.target.value)}
                  >
                    <option value="">
                      {c("Not recorded", "Qeyd edilməyib")}
                    </option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {enumLabel(option, c)}
                      </option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    id={id}
                    rows={3}
                    value={String(values[field.key] ?? "")}
                    onChange={(e) => onChange(field.key, e.target.value)}
                  />
                ) : (
                  <input
                    id={id}
                    type={field.type || "text"}
                    required={field.required}
                    min={field.min}
                    step={field.step}
                    value={String(values[field.key] ?? "")}
                    onChange={(e) => onChange(field.key, e.target.value)}
                  />
                )}
              </>
            )}
          </label>
        );
      })}
    </div>
  );
}
export function ClinicalForm({
  member,
  kind,
  entry,
  onClose,
  onSaved,
}: {
  member: Member;
  kind: RecordKind;
  entry?: ClinicalEntry;
  onClose: () => void;
  onSaved: () => void;
}) {
  const c = usePublicCopy();
  const definition = recordDefinitions[kind];
  const [values, setValues] = useState<Record<string, RecordValue>>(() =>
    Object.fromEntries(
      definition.fields.map((field) => [
        field.key,
        entry?.[field.key] ?? field.default ?? "",
      ]),
    ),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <RecordDialog
      title={`${entry ? c("Edit", "Redaktə et") : c("Add", "Əlavə et")} · ${c(...definition.singular)}`}
      onClose={onClose}
      busy={busy}
    >
      <p className={styles.formPerson}>{member.fullName}</p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (busy) return;
          setBusy(true);
          setError("");
          try {
            const body = formPayload(definition.fields, values);
            if (kind === "medications" && entry?.medicineId != null)
              body.medicineId = entry.medicineId;
            await healthApi.save(member.id, kind, body, entry?.id);
            onSaved();
          } catch (err) {
            setError(
              readableError(
                err,
                c(
                  "Could not save this record. Please try again.",
                  "Qeydi saxlamaq mümkün olmadı. Yenidən cəhd edin.",
                ),
              ),
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        <fieldset disabled={busy}>
          <Fields
            fields={definition.fields}
            values={values}
            onChange={(key, value) =>
              setValues((old) => ({ ...old, [key]: value }))
            }
          />
        </fieldset>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.secondary}
            disabled={busy}
            onClick={onClose}
          >
            {c("Cancel", "Ləğv et")}
          </button>
          <button className="public-button" disabled={busy}>
            {busy
              ? c("Saving...", "Saxlanılır...")
              : c("Save record", "Qeydi saxla")}
          </button>
        </div>
      </form>
    </RecordDialog>
  );
}
export const memberFields: Field[] = [
  { key: "fullName", label: ["Full name", "Ad və soyad"], required: true },
  {
    key: "relationship",
    label: ["Relationship", "Qohumluq"],
    type: "select",
    options: ["SELF", "SPOUSE", "CHILD", "PARENT", "SIBLING", "OTHER"],
    default: "OTHER",
    required: true,
  },
  {
    key: "dateOfBirth",
    label: ["Date of birth", "Doğum tarixi"],
    type: "date",
  },
  {
    key: "biologicalSex",
    label: ["Sex assigned at birth", "Doğumda təyin olunan cins"],
    type: "select",
    options: ["MALE", "FEMALE", "INTERSEX", "UNDISCLOSED"],
    default: "UNDISCLOSED",
  },
  {
    key: "bloodType",
    label: ["Blood type", "Qan qrupu"],
    type: "select",
    options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
];
const birthFields: Field[] = [
  {
    key: "gestationalAgeWeeks",
    label: [
      "Gestational age at birth (weeks)",
      "Doğumda hamiləlik yaşı (həftə)",
    ],
    type: "number",
    min: 0,
    step: "any",
  },
  {
    key: "birthWeightGrams",
    label: ["Birth weight (g)", "Doğum çəkisi (g)"],
    type: "number",
    min: 0,
    step: "1",
  },
  {
    key: "birthLengthCm",
    label: ["Birth length (cm)", "Doğum boyu (cm)"],
    type: "number",
    min: 0,
    step: "any",
  },
];
export function MemberForm({
  familyId,
  member,
  onClose,
  onSaved,
}: {
  familyId: number;
  member?: Member;
  onClose: () => void;
  onSaved: (member: Member) => void;
}) {
  const c = usePublicCopy();
  const fields = [...memberFields, ...birthFields];
  const [values, setValues] = useState<Record<string, RecordValue>>(
    () =>
      Object.fromEntries(
        fields.map((field) => [
          field.key,
          member?.[field.key as keyof Member] ?? field.default ?? "",
        ]),
      ) as Record<string, RecordValue>,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const update = (key: string, value: RecordValue) =>
    setValues((old) => ({ ...old, [key]: value }));
  return (
    <RecordDialog
      title={
        member
          ? c("Edit member", "Üzvü redaktə et")
          : c("Add a family member", "Ailə üzvü əlavə et")
      }
      onClose={onClose}
      busy={busy}
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (busy) return;
          setBusy(true);
          setError("");
          try {
            const body = formPayload(fields, values);
            body.avatarUrl = member?.avatarUrl ?? null;
            if (
              body.dateOfBirth &&
              String(body.dateOfBirth) > new Date().toLocaleDateString("en-CA")
            )
              throw new Error("future-date");
            const saved = member
              ? await healthApi.updateMember(member.id, body)
              : await healthApi.addMember(familyId, body);
            onSaved(saved);
          } catch (err) {
            setError(
              err instanceof Error && err.message === "future-date"
                ? c(
                    "Date of birth cannot be in the future.",
                    "Doğum tarixi gələcəkdə ola bilməz.",
                  )
                : readableError(
                    err,
                    c(
                      "Could not save this member. Please try again.",
                      "Üzvü saxlamaq mümkün olmadı. Yenidən cəhd edin.",
                    ),
                  ),
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        <fieldset disabled={busy}>
          <Fields fields={memberFields} values={values} onChange={update} />
          <details
            className={styles.birthDetails}
            open={Boolean(member?.gestationalAgeWeeks)}
          >
            <summary>
              {c(
                "Birth details (optional)",
                "Doğum məlumatları (istəyə bağlı)",
              )}
            </summary>
            <p>
              {c(
                "For children born early, gestational age is used to show corrected age.",
                "Erkən doğulmuş uşaqlarda düzəldilmiş yaşın göstərilməsi üçün hamiləlik yaşından istifadə olunur.",
              )}
            </p>
            <Fields fields={birthFields} values={values} onChange={update} />
          </details>
        </fieldset>
        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}
        <div className={styles.formActions}>
          <button
            className={styles.secondary}
            type="button"
            onClick={onClose}
            disabled={busy}
          >
            {c("Cancel", "Ləğv et")}
          </button>
          <button className="public-button" disabled={busy}>
            {busy
              ? c("Saving...", "Saxlanılır...")
              : c("Save member", "Üzvü saxla")}
          </button>
        </div>
      </form>
    </RecordDialog>
  );
}
export function DeleteDialog({
  title,
  description,
  onDelete,
  onClose,
}: {
  title: string;
  description: string;
  onDelete: () => Promise<void>;
  onClose: () => void;
}) {
  const c = usePublicCopy();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <RecordDialog title={title} onClose={onClose} busy={busy}>
      <p>{description}</p>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.secondary}
          disabled={busy}
          onClick={onClose}
          autoFocus
        >
          {c("Cancel", "Ləğv et")}
        </button>
        <button
          type="button"
          className={styles.dangerButton}
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setError("");
            try {
              await onDelete();
            } catch (err) {
              setError(
                readableError(
                  err,
                  c(
                    "Could not remove this item. Please try again.",
                    "Qeydi silmək mümkün olmadı. Yenidən cəhd edin.",
                  ),
                ),
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? c("Removing...", "Silinir...") : c("Remove", "Sil")}
        </button>
      </div>
    </RecordDialog>
  );
}
