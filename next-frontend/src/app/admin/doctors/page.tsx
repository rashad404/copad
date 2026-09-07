"use client";
import { useCallback, useState } from "react";
import { getSpecialties } from "@/api/admin";
import {
  allClinics,
  doctorsApi,
  type Doctor,
  type Verification,
} from "@/api/adminDirectory";
import DirectoryResource from "@/components/admin/directory/DirectoryResource";
import {
  doctorConfig,
  doctorDefaults,
  doctorPayload,
  verificationStates,
  verificationMeaning,
  VerificationState,
} from "@/components/admin/directory/config";
import ResourceForm from "@/components/admin/ResourceForm";
import { useResource } from "@/components/admin/useResource";
import type { ResourceConfig } from "@/components/admin/types";
const lookups = async () => {
  const [specialties, clinics] = await Promise.all([
    getSpecialties(),
    allClinics(),
  ]);
  return { specialties: specialties.data, clinics };
};
interface Decision {
  id: number;
  fullName: string;
  current: Verification;
  verification: Verification | "";
  note: string;
  acknowledged: boolean;
}
export default function DoctorsPage() {
  const options = useResource(lookups);
  const [specialty, setSpecialty] = useState(""),
    [verification, setVerification] = useState("");
  const [revision, setRevision] = useState(0),
    [review, setReview] = useState<Doctor | null>(null);
  const list = useCallback(
    (page: number) => doctorsApi.list(page, specialty, verification),
    [specialty, verification],
  );
  const config = doctorConfig(
    options.data?.specialties ?? [],
    options.data?.clinics ?? [],
  );
  const decision: ResourceConfig<Decision> = {
    title: "Verification review",
    singular: "verification decision",
    idKey: "id",
    fields: [
      { key: "fullName", label: "Doctor", type: "text", readOnly: true },
      {
        key: "current",
        label: "Current state",
        type: "badge",
        readOnly: true,
        render: (value) => (
          <>
            <VerificationState value={value} />
            <p className="mt-2">
              {verificationMeaning[value as Verification] ||
                "Status unavailable"}
            </p>
          </>
        ),
      },
      {
        key: "verification",
        label: "New state",
        type: "select",
        required: true,
        options: verificationStates.map((value) => ({
          value,
          label: `${value} - ${verificationMeaning[value]}`,
        })),
        validate: (value) =>
          value === review?.verification ? "Choose a different state." : null,
      },
      {
        key: "note",
        label: "Review note",
        type: "textarea",
        helpText:
          "Record the evidence checked or the reason for this decision. Do not paste sensitive documents.",
      },
      {
        key: "acknowledged",
        label:
          "I confirm this decision is supported by the review. VERIFIED means credentials were actually checked.",
        type: "boolean",
        validate: (value) =>
          value === true
            ? null
            : "Confirm that this decision is supported by your review.",
      },
    ],
  };
  return (
    <>
      <p className="mb-5 text-sm text-gray-600 dark:text-gray-300">
        Seeded doctors are unclaimed listings, not endorsements. Verification,
        directory visibility and booking availability are separate decisions.
      </p>
      <div className="mb-5 flex flex-wrap gap-4 text-sm text-gray-900 dark:text-gray-100">
        <label>
          Specialty
          <select
            className="ml-2 rounded border bg-white p-2 dark:bg-gray-800"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            disabled={options.loading}
          >
            <option value="">All specialties</option>
            {options.data?.specialties.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Verification
          <select
            className="ml-2 rounded border bg-white p-2 dark:bg-gray-800"
            value={verification}
            onChange={(e) => setVerification(e.target.value)}
          >
            <option value="">All states</option>
            {verificationStates.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
      </div>
      {options.loading && (
        <p role="status" className="mb-4 text-gray-600 dark:text-gray-300">
          Loading specialty and clinic options...
        </p>
      )}
      {options.error && (
        <p role="alert" className="mb-4 text-red-700 dark:text-red-300">
          {options.error} Creation and editing need these options.{" "}
          <button className="underline" onClick={() => void options.reload()}>
            Retry options
          </button>
        </p>
      )}
      <DirectoryResource
        key={`${specialty}:${verification}:${revision}`}
        config={config}
        defaults={doctorDefaults}
        list={list}
        canEdit={!options.loading && !options.error}
        remove={doctorsApi.remove}
        name={(row) => row.fullName}
        save={async (id, values, original) => {
          // The form is a record snapshot: neither verification nor its timestamp enters CRUD payloads.
          if (
            values.acceptsBookings &&
            !original.acceptsBookings &&
            !window.confirm(
              `Enable bookings for "${values.fullName}"? Confirm that appointments made through azdoc can actually be fulfilled. An active listing alone does not establish this.`,
            )
          )
            throw new Error(
              "Bookings were not enabled. Turn off Accepts bookings or confirm availability before saving.",
            );
          await doctorsApi.save(id, doctorPayload(values));
        }}
        actions={[
          { label: "Review verification", onClick: (row) => setReview(row) },
        ]}
      />
      {review && (
        <ResourceForm
          config={decision}
          title={`Review verification: ${review.fullName}`}
          submitLabel="Apply verification decision"
          initial={{
            id: review.id,
            fullName: review.fullName,
            current: review.verification,
            verification: "",
            note: "",
            acknowledged: false,
          }}
          onCancel={() => setReview(null)}
          onSubmit={async (values) => {
            await doctorsApi.verify(
              review.id,
              values.verification as Verification,
              values.note,
            );
            setReview(null);
            setRevision((n) => n + 1);
          }}
        />
      )}
    </>
  );
}
