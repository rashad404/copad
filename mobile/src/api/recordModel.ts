import { decimal } from "../core/validation";
import { shortDate } from "../utils/dates";
import { isAxiosError } from "axios";
import type {
  FamilyRole,
  RecordKind,
  RecordValue,
  VitalReading,
  VitalType,
} from "./healthRecord";
export type Copy = (en: string, az: string) => string;
export function canWrite(role: FamilyRole | string | undefined) {
  return role === "OWNER" || role === "ADULT";
}
export function readableError(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    const data: unknown = error.response?.data;
    if (typeof data === "string" && data.trim() && !data.trim().startsWith("<"))
      return data;
    if (data && typeof data === "object")
      for (const key of ["message", "detail", "error"]) {
        const value = (data as Record<string, unknown>)[key];
        if (typeof value === "string" && value.trim()) return value;
      }
  }
  if (!isAxiosError(error) && error instanceof Error && error.message)
    return error.message;
  return fallback;
}
export function enteredReading(reading: VitalReading) {
  return {
    value: reading.valueEntered ?? reading.value,
    unit: reading.unitEntered || reading.unit,
  };
}
export function enumLabel(value: string | null | undefined, c: Copy) {
  const labels: Record<string, [string, string]> = {
    OWNER: ["Owner", "Sahib"],
    ADULT: ["Can edit", "Redaktə edə bilər"],
    VIEWER: ["Read only", "Yalnız baxış"],
    SELF: ["Self", "Özü"],
    SPOUSE: ["Spouse", "Həyat yoldaşı"],
    CHILD: ["Child", "Uşaq"],
    PARENT: ["Parent", "Valideyn"],
    SIBLING: ["Sibling", "Bacı / qardaş"],
    OTHER: ["Other", "Digər"],
    MALE: ["Male", "Kişi"],
    FEMALE: ["Female", "Qadın"],
    INTERSEX: ["Intersex", "İnterseks"],
    UNDISCLOSED: ["Not specified", "Qeyd edilməyib"],
    UNKNOWN: ["Unknown", "Məlum deyil"],
    MILD: ["Mild", "Yüngül"],
    MODERATE: ["Moderate", "Orta"],
    SEVERE: ["Severe", "Ağır"],
    LIFE_THREATENING: ["Life-threatening", "Həyati təhlükəli"],
    ACTIVE: ["Active", "Aktiv"],
    RESOLVED: ["Resolved", "Sağalıb"],
    IN_REMISSION: ["In remission", "Remissiyada"],
    UNCONFIRMED: ["Unconfirmed", "Təsdiqlənməyib"],
    DRUG: ["Drug", "Dərman"],
    FOOD: ["Food", "Qida"],
    ENVIRONMENTAL: ["Environmental", "Ətraf mühit"],
    INSECT: ["Insect", "Həşərat"],
    LATEX: ["Latex", "Lateks"],
    ORAL: ["Oral", "Ağızdan"],
    TOPICAL: ["Topical", "Yerli"],
    INHALED: ["Inhaled", "İnhalyasiya"],
    INJECTION: ["Injection", "İnyeksiya"],
    NASAL: ["Nasal", "Burundan"],
    OPHTHALMIC: ["Eye", "Gözə"],
    OTIC: ["Ear", "Qulağa"],
    RECTAL: ["Rectal", "Rektal"],
    NORMAL: ["Normal", "Normal"],
    LOW: ["Low", "Aşağı"],
    HIGH: ["High", "Yüksək"],
    CRITICAL_LOW: ["Critically low", "Kritik dərəcədə aşağı"],
    CRITICAL_HIGH: ["Critically high", "Kritik dərəcədə yüksək"],
    RISING: ["Rising", "Artır"],
    FALLING: ["Falling", "Azalır"],
    STABLE: ["Stable", "Sabit"],
    CREATED: ["Added", "Əlavə edilib"],
    UPDATED: ["Updated", "Yenilənib"],
    DELETED: ["Removed", "Silinib"],
    CONDITION: ["Condition", "Xəstəlik"],
    ALLERGY: ["Allergy", "Allergiya"],
    MEDICATION: ["Medication", "Dərman"],
    IMMUNIZATION: ["Immunization", "Peyvənd"],
  };
  if (!value) return c("Not recorded", "Qeyd edilməyib");
  return labels[value] ? c(...labels[value]) : value;
}
export const vitalDefinitions: Record<
  VitalType,
  { label: [string, string]; unit: string; units: string[] }
> = {
  WEIGHT: { label: ["Weight", "Çəki"], unit: "kg", units: ["kg", "lb", "g"] },
  HEIGHT: { label: ["Height", "Boy"], unit: "cm", units: ["cm", "m", "in"] },
  BMI: {
    label: ["BMI", "Bədən kütlə indeksi"],
    unit: "kg/m2",
    units: ["kg/m2"],
  },
  BLOOD_PRESSURE_SYSTOLIC: {
    label: ["Systolic blood pressure", "Sistolik qan təzyiqi"],
    unit: "mmHg",
    units: ["mmHg"],
  },
  BLOOD_PRESSURE_DIASTOLIC: {
    label: ["Diastolic blood pressure", "Diastolik qan təzyiqi"],
    unit: "mmHg",
    units: ["mmHg"],
  },
  PULSE: { label: ["Pulse", "Nəbz"], unit: "bpm", units: ["bpm"] },
  RESPIRATORY_RATE: {
    label: ["Respiratory rate", "Tənəffüs tezliyi"],
    unit: "breaths/min",
    units: ["breaths/min"],
  },
  TEMPERATURE: {
    label: ["Temperature", "Temperatur"],
    unit: "C",
    units: ["C", "F"],
  },
  BLOOD_GLUCOSE: {
    label: ["Blood glucose", "Qan şəkəri"],
    unit: "mmol/L",
    units: ["mmol/L", "mg/dL"],
  },
  OXYGEN_SATURATION: {
    label: ["Oxygen saturation", "Oksigen saturasiyası"],
    unit: "%",
    units: ["%"],
  },
  WAIST_CIRCUMFERENCE: {
    label: ["Waist circumference", "Bel çevrəsi"],
    unit: "cm",
    units: ["cm", "in"],
  },
  HEAD_CIRCUMFERENCE: {
    label: ["Head circumference", "Baş çevrəsi"],
    unit: "cm",
    units: ["cm", "in"],
  },
};
export interface Field {
  key: string;
  label: [string, string];
  type?: "text" | "date" | "number" | "textarea" | "checkbox" | "select";
  options?: string[];
  required?: boolean;
  min?: number;
  step?: string;
  default?: RecordValue;
}
const notes: Field = {
  key: "notes",
  label: ["Notes", "Qeydlər"],
  type: "textarea",
};
const severity: Field = {
  key: "severity",
  label: ["Severity", "Ağırlıq dərəcəsi"],
  type: "select",
  options: ["UNKNOWN", "MILD", "MODERATE", "SEVERE", "LIFE_THREATENING"],
  default: "UNKNOWN",
};
export const recordDefinitions: Record<
  RecordKind,
  {
    label: [string, string];
    singular: [string, string];
    titleKey: string;
    fields: Field[];
  }
> = {
  conditions: {
    label: ["Conditions", "Xəstəliklər"],
    singular: ["condition", "xəstəlik"],
    titleKey: "label",
    fields: [
      { key: "label", label: ["Condition", "Xəstəlik"], required: true },
      {
        key: "icd10Code",
        label: ["ICD-10 code (optional)", "ICD-10 kodu (istəyə bağlı)"],
      },
      {
        key: "status",
        label: ["Status", "Status"],
        type: "select",
        options: ["ACTIVE", "RESOLVED", "IN_REMISSION", "UNCONFIRMED"],
        default: "ACTIVE",
      },
      severity,
      {
        key: "onsetDate",
        label: ["Onset date", "Başlama tarixi"],
        type: "date",
      },
      {
        key: "resolvedDate",
        label: ["Resolved date", "Sağalma tarixi"],
        type: "date",
      },
      notes,
    ],
  },
  allergies: {
    label: ["Allergies", "Allergiyalar"],
    singular: ["allergy", "allergiya"],
    titleKey: "allergen",
    fields: [
      { key: "allergen", label: ["Allergen", "Allergen"], required: true },
      {
        key: "allergenType",
        label: ["Allergen type", "Allergen növü"],
        type: "select",
        options: ["DRUG", "FOOD", "ENVIRONMENTAL", "INSECT", "LATEX", "OTHER"],
        default: "OTHER",
      },
      { key: "reaction", label: ["Reaction", "Reaksiya"] },
      severity,
      {
        key: "onsetDate",
        label: ["Onset date", "Başlama tarixi"],
        type: "date",
      },
      {
        key: "active",
        label: ["Active allergy", "Aktiv allergiya"],
        type: "checkbox",
        default: true,
      },
      notes,
    ],
  },
  medications: {
    label: ["Medications", "Dərmanlar"],
    singular: ["medication", "dərman"],
    titleKey: "name",
    fields: [
      {
        key: "name",
        label: ["Medication name", "Dərmanın adı"],
        required: true,
      },
      {
        key: "activeIngredient",
        label: ["Active ingredient", "Təsiredici maddə"],
      },
      {
        key: "doseAmount",
        label: ["Dose amount", "Doza miqdarı"],
        type: "number",
        min: 0,
        step: "any",
      },
      {
        key: "doseUnit",
        label: ["Dose unit (e.g. mg)", "Doza vahidi (məs. mg)"],
      },
      { key: "frequency", label: ["Frequency", "Qəbul tezliyi"] },
      {
        key: "route",
        label: ["Route", "Qəbul yolu"],
        type: "select",
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
        label: ["Start date", "Başlama tarixi"],
        type: "date",
      },
      { key: "endedOn", label: ["End date", "Bitmə tarixi"], type: "date" },
      { key: "prescriber", label: ["Prescriber", "Təyin edən həkim"] },
      { key: "reason", label: ["Reason", "Səbəb"] },
      {
        key: "active",
        label: ["Currently taking", "Hazırda qəbul edilir"],
        type: "checkbox",
        default: true,
      },
      notes,
    ],
  },
  immunizations: {
    label: ["Immunizations", "Peyvəndlər"],
    singular: ["immunization", "peyvənd"],
    titleKey: "vaccine",
    fields: [
      { key: "vaccine", label: ["Vaccine", "Peyvənd"], required: true },
      {
        key: "doseNumber",
        label: ["Dose number", "Doza nömrəsi"],
        type: "number",
        min: 1,
        step: "1",
      },
      {
        key: "administeredOn",
        label: ["Date administered", "Vurulma tarixi"],
        type: "date",
      },
      { key: "provider", label: ["Provider", "Tibb müəssisəsi"] },
      { key: "lotNumber", label: ["Lot number", "Seriya nömrəsi"] },
      {
        key: "nextDueOn",
        label: ["Next due date", "Növbəti peyvənd tarixi"],
        type: "date",
      },
      notes,
    ],
  },
};
export function formPayload(
  fields: Field[],
  values: Record<string, RecordValue>,
): Record<string, RecordValue> {
  return Object.fromEntries(
    fields.map((field) => {
      const value = values[field.key];
      return [
        field.key,
        field.type === "checkbox"
          ? Boolean(value)
          : value === "" || value == null
            ? null
            : field.type === "number"
              ? decimal(value)
              : String(value).trim(),
      ];
    }),
  );
}
export function dateLabel(value: string | null | undefined, locale: string) {
  if (!value) return "-";
  // Went through toLocaleDateString, which has no Azerbaijani month names in
  // the browser and printed "2026 M09 8".
  return shortDate(value, locale);
}
