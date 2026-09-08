import api from "../core/api";
import type { Slot } from "./doctorTypes";

export type BookingStatus =
  "REQUESTED" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";

export interface Booking {
  id: number;
  doctorId: number | null;
  doctorName: string | null;
  doctorSlug: string | null;
  clinicName: string | null;
  clinicAddress: string | null;
  clinicPhone: string | null;
  startsAt: string;
  endsAt: string;
  status: BookingStatus;
  reason: string | null;
  sharedRecord: boolean;
  cancelledAt: string | null;
  cancellationReason: string | null;
}

export interface BookRequest {
  doctorId: number;
  clinicId?: number | null;
  startsAt: string;
  reason?: string | null;
  shareRecord: boolean;
}

/**
 * Times a doctor is free, between two dates.
 *
 * Never cached: a slot that was free when the page was built is the one thing
 * this request must not be wrong about.
 */
export const fetchSlots = (doctorId: number, from: string, to: string) =>
  api
    .get<Slot[]>(`/doctors/${doctorId}/slots`, { params: { from, to } })
    .then((r) => r.data);

export const createBooking = (memberId: number, body: BookRequest) =>
  api.post<Booking>(`/members/${memberId}/bookings`, body).then((r) => r.data);

export const listBookings = (memberId: number, signal?: AbortSignal) =>
  api
    .get<Booking[]>(`/members/${memberId}/bookings`, { signal })
    .then((r) => r.data);

export const cancelBooking = (
  memberId: number,
  bookingId: number,
  reason?: string,
) =>
  api
    .post<Booking>(`/members/${memberId}/bookings/${bookingId}/cancel`, {
      reason: reason || null,
    })
    .then((r) => r.data);

/**
 * The clinic times come back without an offset because they are already local
 * to the clinic. Reading them with the browser's zone would shift every
 * appointment for anybody travelling, so the offset is stated rather than
 * inferred.
 */
export const BAKU_OFFSET = "+04:00";

export const withOffset = (value: string) =>
  /[Zz]|[+-]\d\d:\d\d$/.test(value) ? value : `${value}${BAKU_OFFSET}`;

/** The calendar day a slot belongs to, as the clinic would name it. */
export const dayOf = (value: string) => value.slice(0, 10);

/** The time of day a slot starts, as the clinic would name it. */
export const timeOf = (value: string) => value.slice(11, 16);
