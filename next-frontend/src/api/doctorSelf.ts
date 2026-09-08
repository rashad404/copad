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

export interface TimeOff {
  id: number;
  startsAt: string;
  endsAt: string;
  reason: string;
}

export const getTimeOff = (signal?: AbortSignal) =>
  api.get<TimeOff[]>("/doctor/me/time-off", { signal }).then((r) => r.data);

export const addTimeOff = (body: {
  startsAt: string;
  endsAt: string;
  reason?: string | null;
}) => api.post("/doctor/me/time-off", body).then((r) => r.data);

export const removeTimeOff = (id: number) =>
  api.delete(`/doctor/me/time-off/${id}`);

/**
 * Claims a listing somebody else created.
 *
 * Puts it under review; it verifies nobody and takes no appointments until a
 * person has checked who this is.
 */
export const claimListing = (doctorId: number, evidence: string) =>
  api
    .post<MyListing>("/doctor/claim", { doctorId, evidence })
    .then((r) => r.data);

export const registerListing = (body: Partial<MyListing>) =>
  api.post<MyListing>("/doctor/register", body).then((r) => r.data);
