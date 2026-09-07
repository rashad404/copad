import type {
  Clinic,
  ClinicInput,
  Doctor,
  DoctorInput,
  Verification,
} from "@/api/adminDirectory";
import type { MedicalSpecialty } from "@/api/admin";
import type { ResourceConfig } from "../types";
export const verificationStates: Verification[] = [
  "UNCLAIMED",
  "PENDING",
  "VERIFIED",
  "REJECTED",
];
export const verificationMeaning: Record<Verification, string> = {
  UNCLAIMED:
    "Public-source listing. This person has not claimed it. Credentials have not been checked.",
  PENDING: "Claimed and awaiting credential review.",
  VERIFIED: "Credentials have been checked.",
  REJECTED:
    "Verification was rejected. Do not present this listing as verified.",
};
export function VerificationState({ value }: { value: unknown }) {
  const state = verificationStates.includes(value as Verification)
    ? (value as Verification)
    : null;
  return (
    <span
      className={`inline-block rounded px-2 py-1 text-xs font-medium ${state === "VERIFIED" ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200" : state === "PENDING" ? "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200" : state === "REJECTED" ? "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200" : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"}`}
      title={
        state ? verificationMeaning[state] : "Verification status unavailable"
      }
    >
      {state ?? "Status unavailable"}
    </span>
  );
}
const text = (value: unknown) => String(value ?? "").trim();
const optional = (value: unknown) => text(value) || null;
const number = (value: unknown) =>
  value === "" || value == null ? null : Number(value);
const bounded =
  (min: number, max: number, integer = false) =>
  (value: unknown) =>
    value == null || value === ""
      ? null
      : !Number.isFinite(Number(value)) ||
          Number(value) < min ||
          Number(value) > max ||
          (integer && !Number.isInteger(Number(value)))
        ? `Enter ${integer ? "a whole number" : "a number"} from ${min} to ${max}.`
        : null;
const activeCell = (value: unknown) => (
  <span className="text-gray-700 dark:text-gray-200">
    {value ? "Active listing" : "Inactive listing"}
  </span>
);
export const clinicDefaults: Partial<Clinic> = { city: "Baku", active: true };
export const clinicConfig: ResourceConfig<Clinic> = {
  title: "Clinics",
  singular: "clinic",
  idKey: "id",
  searchKeys: ["name", "slug", "district", "city"],
  emptyMessage: "No clinics yet. Add a clinic to start curating the directory.",
  fields: [
    { key: "name", label: "Name", type: "text", required: true },
    {
      key: "slug",
      label: "Slug",
      type: "text",
      readOnly: true,
      placeholder: "Generated from the name after saving",
      helpText: "Assigned by the backend. It cannot be edited here.",
    },
    { key: "address", label: "Address", type: "text" },
    { key: "district", label: "District", type: "text" },
    { key: "city", label: "City", type: "text" },
    { key: "phone", label: "Phone", type: "text" },
    {
      key: "latitude",
      label: "Latitude",
      type: "number",
      inTable: false,
      min: -90,
      max: 90,
      validate: bounded(-90, 90),
    },
    {
      key: "longitude",
      label: "Longitude",
      type: "number",
      inTable: false,
      min: -180,
      max: 180,
      validate: bounded(-180, 180),
    },
    {
      key: "description",
      label: "Description",
      type: "textarea",
      inTable: false,
    },
    {
      key: "active",
      label: "Active listing",
      type: "boolean",
      render: activeCell,
      helpText:
        "Makes this clinic eligible for the directory. This does not enable bookings.",
    },
  ],
};
export function clinicPayload(values: Partial<Clinic>): ClinicInput {
  return {
    name: text(values.name),
    address: optional(values.address),
    district: optional(values.district),
    city: text(values.city) || "Baku",
    phone: optional(values.phone),
    latitude: number(values.latitude),
    longitude: number(values.longitude),
    description: optional(values.description),
    active: !!values.active,
  };
}
export const doctorDefaults: Partial<Doctor> = {
  active: true,
  acceptsBookings: false,
  verification: "UNCLAIMED",
  languages: [],
  clinicIds: [],
};
export function doctorConfig(
  specialties: MedicalSpecialty[],
  clinics: Clinic[],
): ResourceConfig<Doctor> {
  return {
    title: "Doctors",
    singular: "doctor",
    idKey: "id",
    searchKeys: ["fullName", "slug", "licenseNumber"],
    emptyMessage:
      "No doctors match these filters. Seeded listings begin unclaimed, with bookings off.",
    fields: [
      { key: "fullName", label: "Full name", type: "text", required: true },
      { key: "slug", label: "Slug", type: "text", inTable: false },
      {
        key: "verification",
        label: "Verification",
        type: "badge",
        readOnly: true,
        render: (value) => <VerificationState value={value} />,
        helpText:
          "Change this separately using Review verification. Creating or editing a listing does not verify credentials.",
      },
      {
        key: "verifiedAt",
        label: "Verified at",
        type: "date",
        readOnly: true,
        inTable: false,
        render: (value) =>
          value
            ? new Date(String(value)).toLocaleString("en-GB")
            : "No verification date recorded",
      },
      {
        key: "specialtyCode",
        label: "Specialty",
        type: "select",
        options: specialties.map((s) => ({
          value: s.code,
          label: `${s.name} (${s.code})`,
        })),
        render: (value) =>
          specialties.find((s) => s.code === value)?.name ||
          String(value || "Not specified"),
      },
      {
        key: "qualifications",
        label: "Qualifications",
        type: "textarea",
        inTable: false,
      },
      {
        key: "licenseNumber",
        label: "License number",
        type: "text",
        inTable: false,
      },
      {
        key: "yearsExperience",
        label: "Years of experience",
        type: "number",
        inTable: false,
        min: 0,
        max: 100,
        step: 1,
        validate: bounded(0, 100, true),
      },
      { key: "bio", label: "Biography", type: "textarea", inTable: false },
      {
        key: "photoUrl",
        label: "Photo URL",
        type: "text",
        inTable: false,
        helpText: "Use an HTTPS image URL.",
        validate: (value) => {
          if (!text(value)) return null;
          try {
            return new URL(text(value)).protocol === "https:"
              ? null
              : "Use an HTTPS URL.";
          } catch {
            return "Enter a valid HTTPS URL.";
          }
        },
      },
      {
        key: "languages",
        label: "Languages",
        type: "multiselect",
        inTable: false,
        options: [
          { label: "Azerbaijani", value: "az" },
          { label: "Russian", value: "ru" },
          { label: "English", value: "en" },
        ],
        helpText:
          "Select one or more. Use Command on Mac or Ctrl on Windows to select multiple options.",
      },
      {
        key: "consultationFee",
        label: "Consultation fee (AZN)",
        type: "number",
        min: 0,
        step: "any",
        helpText:
          "Leave blank if the fee is unknown. Zero means a free consultation.",
        validate: (value) =>
          value == null || value === ""
            ? null
            : Number(value) >= 0
              ? null
              : "The fee cannot be negative.",
        render: (value) =>
          value == null ? "Not listed" : `${Number(value).toFixed(2)} AZN`,
      },
      {
        key: "clinicIds",
        label: "Clinics",
        type: "multiselect",
        inTable: false,
        options: clinics.map((c) => ({
          value: c.id,
          label: `${c.name}${c.active ? "" : " (inactive)"}`,
        })),
        helpText:
          "Select all relevant clinics. Use Command on Mac or Ctrl on Windows for multiple selections.",
      },
      {
        key: "source",
        label: "Source",
        type: "text",
        helpText:
          "Where this listing came from, such as a public registry or clinic website. This is not verification.",
      },
      {
        key: "active",
        label: "Active listing",
        type: "boolean",
        render: activeCell,
        helpText:
          "Eligible to appear in the directory. Independent of verification and bookings.",
      },
      {
        key: "acceptsBookings",
        label: "Accepts bookings",
        type: "boolean",
        render: (value) => (
          <span
            className={
              value
                ? "font-semibold text-amber-800 dark:text-amber-200"
                : "text-gray-600 dark:text-gray-300"
            }
          >
            {value ? "Accepting bookings" : "Not accepting bookings"}
          </span>
        ),
        helpText:
          "Off for seeded listings. Enable only when appointments made through azdoc can actually be fulfilled. Saving will ask you to confirm.",
      },
    ],
  };
}
export function doctorPayload(values: Partial<Doctor>): DoctorInput {
  return {
    fullName: text(values.fullName),
    slug: text(values.slug),
    specialtyCode: optional(values.specialtyCode),
    qualifications: optional(values.qualifications),
    licenseNumber: optional(values.licenseNumber),
    yearsExperience: number(values.yearsExperience),
    bio: optional(values.bio),
    photoUrl: optional(values.photoUrl),
    languages: values.languages ?? [],
    consultationFee: number(values.consultationFee),
    acceptsBookings: !!values.acceptsBookings,
    active: !!values.active,
    clinicIds: (values.clinicIds ?? []).map(Number),
    source: optional(values.source),
  };
}
