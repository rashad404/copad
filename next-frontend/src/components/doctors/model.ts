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
export type Filters = {
  q: string;
  specialty: string;
  city: string;
  language: string;
  page: number;
};
export function parseFilters(
  params: Record<string, string | string[] | undefined>,
): Filters {
  const field = (key: string) =>
    typeof params[key] === "string" ? params[key].trim().slice(0, 120) : "";
  const rawPage = field("page");
  return {
    q: field("q"),
    specialty: field("specialty"),
    city: field("city"),
    language: ["az", "ru", "en"].includes(field("language"))
      ? field("language")
      : "",
    page: /^\d+$/.test(rawPage) ? Math.min(Number(rawPage), 100000) : 0,
  };
}
export function filterQuery(filters: Filters, page = filters.page) {
  const query = new URLSearchParams();
  for (const key of ["q", "specialty", "city", "language"] as const)
    if (filters[key]) query.set(key, filters[key]);
  if (page > 0) query.set("page", String(page));
  return query.toString();
}
export const isFiltered = (filters: Filters) =>
  Boolean(filters.q || filters.specialty || filters.city || filters.language);
export const directoryUrl = (path = "") =>
  `${(process.env.NEXT_PUBLIC_APP_URL || "https://azdoc.ai").replace(/\/$/, "")}/hekimler${path}`;
export const profileUrl = (slug: string) =>
  directoryUrl(`/${encodeURIComponent(slug)}`);
export const safeJsonLd = (value: unknown) =>
  JSON.stringify(value).replace(/</g, "\\u003c");
export function phoneHref(phone?: string | null) {
  const number = phone?.replace(/[^+\d]/g, "");
  return number && /^\+?\d{5,20}$/.test(number) ? `tel:${number}` : null;
}
export function photoSrc(photo?: string | null) {
  if (!photo) return null;
  try {
    const url = new URL(photo);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}
// Explicit allowlist: never spread a backend DTO into public structured data.
export function doctorSchema(doctor: PublicDoctor, specialty: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${profileUrl(doctor.slug)}#doctor`,
    name: doctor.fullName,
    url: profileUrl(doctor.slug),
    jobTitle: specialty,
    ...(photoSrc(doctor.photoUrl) ? { image: photoSrc(doctor.photoUrl) } : {}),
    worksFor: doctor.clinics.map((clinic) => ({
      "@type": "MedicalClinic",
      name: clinic.name,
      ...(clinic.phone ? { telephone: clinic.phone } : {}),
      address: {
        "@type": "PostalAddress",
        streetAddress: clinic.address || undefined,
        addressLocality: clinic.city || undefined,
        addressCountry: "AZ",
      },
    })),
  };
}
export function slotWindow(now = new Date()) {
  const from = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Baku",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const end = new Date(`${from}T12:00:00Z`);
  end.setUTCDate(end.getUTCDate() + 13);
  return { from, to: end.toISOString().slice(0, 10) };
}
