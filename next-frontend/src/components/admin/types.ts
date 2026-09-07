import type { ReactNode } from "react";

/**
 * Declarative description of an admin resource.
 *
 * The roadmap adds admin screens for doctors, clinics, labs, drugs, bookings
 * and more. The existing hand-written pages run 430-709 lines each and have
 * already drifted apart in their loading, empty and error handling, so each new
 * one would repeat that. A resource is described once here and rendered by
 * shared components.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "select"
  | "multiselect"
  | "date"
  | "badge";

export interface FieldOption {
  label: string;
  value: string | number;
}

export interface ResourceField<T> {
  /** Property on the record. */
  key: keyof T & string;
  label: string;
  type: FieldType;

  /** Shown in the table. Defaults to true. */
  inTable?: boolean;
  /** Editable in the form. Defaults to true. */
  inForm?: boolean;

  readOnly?: boolean;
  min?: number;
  max?: number;
  step?: number | "any";
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  options?: FieldOption[];

  /** Column width hint, e.g. 'w-32'. */
  className?: string;

  /** Custom cell rendering; falls back to a type-appropriate default. */
  render?: (value: unknown, record: T) => ReactNode;

  renderInput?: (props: {
    id: string;
    value: unknown;
    values: Partial<T>;
    onChange: (value: unknown) => void;
    disabled: boolean;
    invalid: boolean;
    describedBy?: string;
  }) => ReactNode;

  /** Returns an error message, or null when valid. */
  validate?: (value: unknown, record: Partial<T>) => string | null;
}

export interface RowAction<T> {
  label: string;
  onClick: (record: T) => void | Promise<void>;
  confirmation?: (record: T) => string;
  /** Styles the action as destructive and asks for confirmation. */
  destructive?: boolean;
  /** Hide the action for records where it does not apply. */
  isAvailable?: (record: T) => boolean;
}

export interface ResourceConfig<T> {
  /** Plural, human-readable, e.g. "Specialties". */
  title: string;
  /** Singular, used in buttons and dialogs, e.g. "specialty". */
  singular: string;
  /** Unique key on the record. */
  idKey: keyof T & string;
  fields: ResourceField<T>[];
  /** Keys searched by the filter box; omit to hide search. */
  searchKeys?: (keyof T & string)[];
  emptyMessage?: string;
}
