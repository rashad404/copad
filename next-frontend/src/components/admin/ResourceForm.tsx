'use client';

import { useState, FormEvent } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { ResourceConfig, ResourceField } from './types';

interface ResourceFormProps<T> {
  config: ResourceConfig<T>;
  initial?: Partial<T>;
  onSubmit: (values: Partial<T>) => Promise<void>;
  onCancel: () => void;
}

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-white';

export default function ResourceForm<T extends object>({
  config,
  initial = {},
  onSubmit,
  onCancel,
}: ResourceFormProps<T>) {
  const [values, setValues] = useState<Partial<T>>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
      const value = (values as Record<string, unknown>)[field.key];

      if (field.required && (value === undefined || value === null || value === '')) {
        found[field.key] = `${field.label} is required`;
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
    setSubmitError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Could not save. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: ResourceField<T>) => {
    const value = (values as Record<string, unknown>)[field.key];
    const id = `field-${field.key}`;
    const invalid = Boolean(errors[field.key]);
    const describedBy = invalid ? `${id}-error` : field.helpText ? `${id}-help` : undefined;

    if (field.type === 'boolean') {
      return (
        <label htmlFor={id} className="flex items-center gap-3">
          <input
            id={id}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => setValue(field.key, e.target.checked)}
            disabled={submitting}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">{field.label}</span>
        </label>
      );
    }

    return (
      <div>
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.label}
          {field.required && <span className="ml-1 text-red-500" aria-hidden="true">*</span>}
        </label>

        {field.type === 'textarea' ? (
          <textarea
            id={id}
            rows={5}
            value={String(value ?? '')}
            placeholder={field.placeholder}
            onChange={(e) => setValue(field.key, e.target.value)}
            disabled={submitting}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className={inputClass}
          />
        ) : field.type === 'select' ? (
          <select
            id={id}
            value={String(value ?? '')}
            onChange={(e) => setValue(field.key, e.target.value)}
            disabled={submitting}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className={inputClass}
          >
            <option value="">Select…</option>
            {field.options?.map((opt) => (
              <option key={String(opt.value)} value={String(opt.value)}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={id}
            type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
            value={String(value ?? '')}
            placeholder={field.placeholder}
            onChange={(e) =>
              setValue(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)
            }
            disabled={submitting}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className={inputClass}
          />
        )}

        {invalid ? (
          <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600 dark:text-red-400">
            {errors[field.key]}
          </p>
        ) : field.helpText ? (
          <p id={`${id}-help`} className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            {field.helpText}
          </p>
        ) : null}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-8">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl dark:bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isEdit ? `Edit ${config.singular}` : `New ${config.singular}`}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-5 px-6 py-5">
            {editable.map((field) => (
              <div key={String(field.key)}>{renderField(field)}</div>
            ))}

            {submitError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
                {submitError}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {isEdit ? 'Save changes' : `Create ${config.singular}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
