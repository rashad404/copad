"use client";

import { useState, useEffect, FormEvent } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { getErrorMessage } from "@/utils/errors";
import { X, Loader2 } from "lucide-react";
import type { ResourceConfig, ResourceField } from "./types";

interface ResourceFormProps<T> {
  config: ResourceConfig<T>;
  initial?: Partial<T>;
  onSubmit: (values: Partial<T>) => Promise<void>;
  onCancel: () => void;
  inline?: boolean;
  pending?: boolean;
  title?: string;
  submitLabel?: string;
}

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-white";

export default function ResourceForm<T extends object>({
  config,
  initial = {},
  onSubmit,
  onCancel,
  inline = false,
  pending = false,
  title,
  submitLabel,
}: ResourceFormProps<T>) {
  const [values, setValues] = useState<Partial<T>>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const busy = submitting || pending;
  const dirty = JSON.stringify(values) !== JSON.stringify(initial);
  const cancel = () => {
    if (!busy && (!dirty || window.confirm("Discard unsaved changes?")))
      onCancel();
  };
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const editable = config.fields.filter((f) => f.inForm !== false);
  const isEdit = Boolean((initial as Record<string, unknown>)[config.idKey]);

  const setValue = (key: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Clear the error as soon as the field is touched, rather than making the
    // user resubmit to discover it is fixed.
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validate = (): boolean => {
    const found: Record<string, string> = {};

    for (const field of editable) {
      if (field.readOnly) continue;
      const value = (values as Record<string, unknown>)[field.key];

      if (
        field.required &&
        (value === undefined ||
          value === null ||
          (Array.isArray(value) && value.length === 0) ||
          (typeof value === "string" && !value.trim()))
      ) {
        found[field.key] = `${field.label} is required`;
        continue;
      }
      if (
        field.type === "number" &&
        value !== undefined &&
        value !== null &&
        value !== "" &&
        (typeof value !== "number" || !Number.isFinite(value))
      ) {
        found[field.key] = `${field.label} must be a valid number`;
        continue;
      }
      const custom = field.validate?.(value, values);
      if (custom) found[field.key] = custom;
    }

    setErrors(found);
    return Object.keys(found).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setSubmitError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setSubmitError(getErrorMessage(err, "Could not save. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: ResourceField<T>) => {
    const value = (values as Record<string, unknown>)[field.key];
    const id = `field-${field.key}`;
    const invalid = Boolean(errors[field.key]);
    const describedBy = invalid
      ? `${id}-error`
      : field.helpText
        ? `${id}-help`
        : undefined;

    if (field.type === "boolean") {
      return (
        <label htmlFor={id} className="flex items-center gap-3">
          <input
            id={id}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => setValue(field.key, e.target.checked)}
            disabled={busy}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {field.label}
            {invalid && (
              <span
                id={`${id}-error`}
                role="alert"
                className="mt-1 block text-sm text-red-600 dark:text-red-400"
              >
                {errors[field.key]}
              </span>
            )}
            {field.helpText && (
              <span
                id={`${id}-help`}
                className="mt-1 block text-xs text-gray-500 dark:text-gray-400"
              >
                {field.helpText}
              </span>
            )}
          </span>
        </label>
      );
    }

    return (
      <div>
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {field.label}
          {field.required && (
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
          )}
        </label>

        {field.readOnly ? (
          <div
            id={id}
            className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-200"
          >
            {field.render
              ? field.render(value, values as T)
              : String(value ?? "") || field.placeholder || "Not recorded"}
          </div>
        ) : field.type === "multiselect" ? (
          <select
            id={id}
            multiple
            size={Math.min(6, Math.max(3, field.options?.length || 3))}
            value={Array.isArray(value) ? value.map(String) : []}
            onChange={(e) =>
              setValue(
                field.key,
                Array.from(
                  e.target.selectedOptions,
                  (option) =>
                    field.options?.find(
                      (item) => String(item.value) === option.value,
                    )?.value ?? option.value,
                ),
              )
            }
            disabled={busy}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className={inputClass}
          >
            {field.options?.map((option) => (
              <option key={String(option.value)} value={String(option.value)}>
                {option.label}
              </option>
            ))}
            {(Array.isArray(value) ? value : [])
              .filter(
                (item) =>
                  !field.options?.some(
                    (option) => String(option.value) === String(item),
                  ),
              )
              .map((item) => (
                <option key={String(item)} value={String(item)}>
                  {String(item)} (not in available options)
                </option>
              ))}
          </select>
        ) : field.renderInput ? (
          field.renderInput({
            id,
            value,
            values,
            onChange: (next) => setValue(field.key, next),
            disabled: busy,
            invalid,
            describedBy,
          })
        ) : field.type === "textarea" ? (
          <textarea
            id={id}
            rows={5}
            value={String(value ?? "")}
            placeholder={field.placeholder}
            onChange={(e) => setValue(field.key, e.target.value)}
            disabled={busy}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className={inputClass}
          />
        ) : field.type === "select" ? (
          <select
            id={id}
            value={String(value ?? "")}
            onChange={(e) => setValue(field.key, e.target.value)}
            disabled={busy}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className={inputClass}
          >
            <option value="">Select...</option>
            {value != null &&
              value !== "" &&
              !field.options?.some(
                (option) => String(option.value) === String(value),
              ) && (
                <option value={String(value)}>
                  {String(value)} (not in available options)
                </option>
              )}
            {field.options?.map((opt) => (
              <option key={String(opt.value)} value={String(opt.value)}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={id}
            type={
              field.type === "number"
                ? "number"
                : field.type === "date"
                  ? "date"
                  : "text"
            }
            min={field.min}
            max={field.max}
            step={field.type === "number" ? (field.step ?? "any") : undefined}
            value={String(value ?? "")}
            placeholder={field.placeholder}
            onChange={(e) =>
              setValue(
                field.key,
                field.type === "number" && e.target.value !== ""
                  ? Number(e.target.value)
                  : e.target.value,
              )
            }
            disabled={busy}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className={inputClass}
          />
        )}

        {invalid ? (
          <p
            id={`${id}-error`}
            className="mt-1.5 text-sm text-red-600 dark:text-red-400"
          >
            {errors[field.key]}
          </p>
        ) : field.helpText ? (
          <p
            id={`${id}-help`}
            className="mt-1.5 text-sm text-gray-500 dark:text-gray-400"
          >
            {field.helpText}
          </p>
        ) : null}
      </div>
    );
  };

  const form = (
    <div
      className={`w-full ${inline ? "" : "max-w-2xl"} rounded-xl bg-white shadow-xl dark:bg-gray-800`}
    >
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title ??
            (isEdit ? `Edit ${config.singular}` : `New ${config.singular}`)}
        </h2>
        <button
          type="button"
          onClick={cancel}
          aria-label="Close"
          disabled={busy}
          className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <form onSubmit={handleSubmit} aria-busy={busy} noValidate>
        <div className="space-y-5 px-6 py-5">
          {editable.map((field) => (
            <div key={String(field.key)}>{renderField(field)}</div>
          ))}

          {submitError && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300"
            >
              {submitError}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <button
            type="button"
            onClick={cancel}
            disabled={busy}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting && (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            {submitLabel ??
              (isEdit ? "Save changes" : `Create ${config.singular}`)}
          </button>
        </div>
      </form>
    </div>
  );
  if (inline) return form;
  return (
    <Dialog
      open
      onClose={cancel}
      className="relative z-50"
      aria-label={
        title ?? (isEdit ? `Edit ${config.singular}` : `New ${config.singular}`)
      }
    >
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 overflow-y-auto p-4 sm:p-8">
        <DialogPanel className="mx-auto max-w-2xl">{form}</DialogPanel>
      </div>
    </Dialog>
  );
}
