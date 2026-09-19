import api from "./axios";
export type Verification = "UNCLAIMED" | "PENDING" | "VERIFIED" | "REJECTED";
export interface Clinic {
  id: number;
  name: string;
  slug: string;
  address: string | null;
  district: string | null;
  city: string;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  active: boolean;
}
export interface Doctor {
  id: number;
  fullName: string;
  slug: string;
  specialtyCode: string | null;
  qualifications: string | null;
  licenseNumber: string | null;
  yearsExperience: number | null;
  bio: string | null;
  photoUrl: string | null;
  languages: string[];
  consultationFee: number | null;
  acceptsBookings: boolean;
  active: boolean;
  clinicIds: number[];
  source: string | null;
  verification: Verification;
  verifiedAt: string | null;
  /** Whether an account has taken this listing. */
  claimed: boolean;
  /** Who claimed it and what they sent to show it is theirs. Admin only. */
  claimedByName: string | null;
  claimedByEmail: string | null;
  claimedAt: string | null;
  claimEvidence: string | null;
}
export interface DirectoryPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
export type ClinicInput = Omit<Clinic, "id" | "slug">;
// The claim fields are the reviewer's view of a request somebody else made,
// so they are never part of what an edit sends back.
export type DoctorInput = Omit<
  Doctor,
  | "id"
  | "verification"
  | "verifiedAt"
  | "claimed"
  | "claimedByName"
  | "claimedByEmail"
  | "claimedAt"
  | "claimEvidence"
>;
export const clinicsApi = {
  list: (page = 0) =>
    api
      .get<DirectoryPage<Clinic>>("/admin/clinics", {
        params: { page, size: 25 },
      })
      .then((r) => r.data),
  save: (id: number | undefined, body: ClinicInput) =>
    id == null
      ? api.post("/admin/clinics", body)
      : api.put(`/admin/clinics/${id}`, body),
  remove: (id: number) => api.delete(`/admin/clinics/${id}`),
};
export const doctorsApi = {
  list: (page = 0, specialty = "", verification = "", claimed = "", q = "") =>
    api
      .get<DirectoryPage<Doctor>>("/admin/doctors", {
        params: {
          page,
          size: 25,
          ...(specialty ? { specialty } : {}),
          ...(verification ? { verification } : {}),
          ...(claimed ? { claimed: claimed === "yes" } : {}),
          ...(q.trim() ? { q: q.trim() } : {}),
        },
      })
      .then((r) => r.data),
  save: (id: number | undefined, body: DoctorInput) =>
    id == null
      ? api.post("/admin/doctors", body)
      : api.put(`/admin/doctors/${id}`, body),
  remove: (id: number) => api.delete(`/admin/doctors/${id}`),
  verify: (id: number, verification: Verification, note?: string) =>
    api.post(`/admin/doctors/${id}/verification`, {
      verification,
      ...(note?.trim() ? { note: note.trim() } : {}),
    }),
};
/** A selector must include clinics beyond the first list page. */
export async function allClinics() {
  const first = await clinicsApi.list();
  const rows = [...first.content];
  for (let page = 1; page < first.totalPages; page++)
    rows.push(...(await clinicsApi.list(page)).content);
  return rows;
}
