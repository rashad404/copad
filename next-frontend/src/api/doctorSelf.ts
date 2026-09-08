import api from "./axios";

export type VerificationStatus =
  | "UNCLAIMED"
  | "PENDING"
  | "VERIFIED"
  | "REJECTED";

export interface MyListing {
  id: number;
  slug: string;
  fullName: string;
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
  verification: VerificationStatus;
  verifiedAt: string | null;
}

export interface AvailabilityBlock {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotMinutes: number;
  clinicId: number | "";
  active: boolean;
}

export interface DoctorBooking {
  id: number;
  startsAt: string;
  endsAt: string;
  status: "REQUESTED" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
  reason: string | null;
  patientName: string | null;
  recordShared: boolean;
}

/** 204 when this account has no listing, which axios gives as empty data. */
export const getMyListing = (signal?: AbortSignal) =>
  api
    .get<MyListing | "">("/doctor/me", { signal })
    .then((r) => (r.data ? (r.data as MyListing) : null));

export const updateMyListing = (body: Partial<MyListing>) =>
  api.put<MyListing>("/doctor/me", body).then((r) => r.data);

export const getAvailability = (signal?: AbortSignal) =>
  api
    .get<AvailabilityBlock[]>("/doctor/me/availability", { signal })
    .then((r) => r.data);

export const addAvailability = (body: {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotMinutes: number;
  clinicId?: number | null;
}) => api.post("/doctor/me/availability", body).then((r) => r.data);

export const removeAvailability = (id: number) =>
  api.delete(`/doctor/me/availability/${id}`);

export const getMyBookings = (signal?: AbortSignal) =>
  api
    .get<DoctorBooking[]>("/doctor/me/bookings", { signal })
    .then((r) => r.data);

export const confirmBooking = (id: number) =>
  api.post(`/doctor/me/bookings/${id}/confirm`).then((r) => r.data);

export const declineBooking = (id: number, reason?: string) =>
  api
    .post(`/doctor/me/bookings/${id}/decline`, { reason: reason || null })
    .then((r) => r.data);
