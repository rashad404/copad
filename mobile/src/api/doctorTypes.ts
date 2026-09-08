export type PublicClinic = {
  id?: number;
  slug: string;
  name: string;
  district?: string | null;
  city?: string | null;
  address?: string | null;
  phone?: string | null;
};
export type PublicDoctor = {
  id?: number;
  slug: string;
  fullName: string;
  specialtyCode: string;
  qualifications?: string | null;
  yearsExperience?: number | null;
  bio?: string | null;
  photoUrl?: string | null;
  languages: string[];
  consultationFee?: number | null;
  verification: string;
  acceptsBookings: boolean;
  clinics: PublicClinic[];
};
export type DoctorPage = {
  content: PublicDoctor[];
  totalElements: number;
  totalPages: number;
  number: number;
};
export type Slot = {
  startsAt: string;
  endsAt: string;
  clinicId: number | "" | null;
};
