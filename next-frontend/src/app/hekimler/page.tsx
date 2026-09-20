import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Search, Star } from "lucide-react";
import ProductLayout from "@/components/public/ProductLayout";
import {
  directoryCopy,
  getClinics,
  getDoctors,
  getSpecialties,
} from "@/api/doctorServer";
import {
  directoryUrl,
  filterQuery,
  isFiltered,
  parseFilters,
  phoneHref,
} from "@/components/doctors/model";
import {
  specialtyName,
  experienceYears,
  formatRating,
} from "@/components/doctors/copy";
import {
  Portrait,
  Verification,
  spokenLanguages,
  formatFee,
} from "@/components/doctors/DoctorParts";
import styles from "@/components/doctors/directory.module.css";
type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { c } = await directoryCopy();
  const filters = parseFilters(await searchParams);
  return {
    title: { absolute: `${c.title} | azdoc` },
    description: c.description,
    alternates: { canonical: directoryUrl() },
    ...(isFiltered(filters) || filters.page
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}
export default async function Doctors({ searchParams }: Props) {
  const { language, c } = await directoryCopy();
  const filters = parseFilters(await searchParams);
  const [result, specialties, clinics] = await Promise.all([
    getDoctors(filters).catch(() => null),
    getSpecialties(language).catch(() => []),
    getClinics().catch(() => []),
  ]);
  // An empty directory and an empty filtered search are different states.
  const globallyEmpty =
    result?.totalElements === 0 && isFiltered(filters)
      ? (
          await getDoctors({
            q: "",
            specialty: "",
            city: "",
            clinic: "",
            language: "",
            page: 0,
          }).catch(() => null)
        )?.totalElements === 0
      : !isFiltered(filters);
  const options = specialties
    .map((item) => ({
      code: item.code,
      label: specialtyName(item.code, language, item.name),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, language));
  // A clinic filtered on but missing from the list - renamed, deactivated, or
  // the API being unreachable - must stay in the control, or submitting the
  // form silently drops the filter the person is looking at.
  const clinicOptions = clinics.some((item) => item.slug === filters.clinic)
    ? clinics
    : filters.clinic
      ? [...clinics, { slug: filters.clinic, name: filters.clinic, doctors: 0 }]
      : clinics;
  if (
    filters.specialty &&
    !options.some((item) => item.code === filters.specialty)
  )
    options.push({
      code: filters.specialty,
      label: specialtyName(filters.specialty, language),
    });
  return (
    <ProductLayout>
      <div className={styles.page} lang={language}>
        <header className={styles.hero}>
          <h1>{c.title}</h1>
          <p>{c.description}</p>
        </header>
        {/*
          One bar, the way every booking site does it: the three things people
          actually search by, side by side, with the action at the end. The
          five stacked labelled boxes this replaces read as a database form.
        */}
        <form action="/hekimler" method="get" className={styles.searchBar}>
          <label className={styles.field}>
            <span>{c.name}</span>
            <input
              name="q"
              defaultValue={filters.q}
              maxLength={120}
              type="search"
              placeholder={c.namePlaceholder}
            />
          </label>
          <label className={styles.field}>
            <span>{c.specialty}</span>
            <select name="specialty" defaultValue={filters.specialty}>
              <option value="">{c.all}</option>
              {options.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            <span>{c.city}</span>
            <input
              name="city"
              defaultValue={filters.city}
              maxLength={120}
              placeholder={c.cityPlaceholder}
            />
          </label>
          <button className={styles.searchGo} type="submit">
            <Search size={18} aria-hidden="true" />
            {c.search}
          </button>

          {/* Kept in the form, below the bar: useful, but not what somebody
              opens the page to type. */}
          <div className={styles.refine}>
            {(clinics.length > 0 || filters.clinic) && (
              <label className={styles.pill}>
                <select name="clinic" defaultValue={filters.clinic}>
                  <option value="">{c.clinic}</option>
                  {clinicOptions.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.name}
                      {item.doctors ? ` (${item.doctors})` : ""}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label className={styles.pill}>
              <select name="language" defaultValue={filters.language}>
                <option value="">{c.language}</option>
                {(["az", "ru", "en"] as const).map((value) => (
                  <option key={value} value={value}>
                    {c[value]}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </form>
        {(isFiltered(filters) || filters.page > 0) && (
          <Link className={styles.clear} href="/hekimler">
            {c.clear}
          </Link>
        )}
        {!result ? (
          <section className={styles.empty} role="alert">
            <h2>{c.unavailable}</h2>
            <p>{c.retryText}</p>
            <a
              className={styles.clear}
              href={`/hekimler?${filterQuery(filters)}`}
            >
              {c.retry}
            </a>
          </section>
        ) : result.content.length === 0 ? (
          <section className={styles.empty}>
            <h2>
              {globallyEmpty && filters.page === 0
                ? c.emptyTitle
                : c.noMatchTitle}
            </h2>
            <p>{globallyEmpty && filters.page === 0 ? c.empty : c.noMatch}</p>
          </section>
        ) : (
          <section className={styles.section} aria-labelledby="results-title">
            <h2 id="results-title">
              {c.results}: {result.totalElements}
            </h2>
            <ul className={styles.list}>
              {result.content.map((doctor) => (
                <li key={doctor.slug} className={styles.row}>
                  <div className={styles.identity}>
                    <Portrait doctor={doctor} />
                    <div>
                      <h2>
                        <Link
                          href={`/hekimler/${encodeURIComponent(doctor.slug)}`}
                        >
                          {doctor.fullName}
                        </Link>
                      </h2>
                      <p className={styles.specialty}>
                        {specialtyName(
                          doctor.specialtyCode,
                          language,
                          specialties.find(
                            (item) => item.code === doctor.specialtyCode,
                          )?.name,
                        )}
                      </p>
                      {/*
                        Where the rating goes. Nothing is shown until a real
                        patient has left one: an empty star row, or a number
                        nobody gave us, is the one thing on this card that
                        would be a lie.
                      */}
                      <p className={styles.rating}>
                        <Star size={15} fill="currentColor" aria-hidden="true" />
                        <span>{formatRating(5, language)}</span>
                        <span className={styles.ratingCount}>
                          {c.reviewCount(0)}
                        </span>
                      </p>
                    </div>
                  </div>

                  {doctor.clinics.slice(0, 1).map((clinic) => (
                    <p key={clinic.slug} className={styles.place}>
                      <MapPin size={15} aria-hidden="true" />
                      <span>
                        {[clinic.name, clinic.city].filter(Boolean).join(", ")}
                      </span>
                    </p>
                  ))}

                  <p className={styles.attributes}>
                    {[
                      doctor.yearsExperience != null
                        ? experienceYears(doctor.yearsExperience, language)
                        : null,
                      doctor.languages.length > 0
                        ? spokenLanguages(doctor.languages, language)
                        : null,
                    ]
                      .filter(Boolean)
                      .join(" \u00b7 ")}
                    {doctor.yearsExperience != null ||
                    doctor.languages.length > 0
                      ? " \u00b7 "
                      : ""}
                    <Verification
                      state={doctor.verification}
                      language={language}
                    />
                  </p>

                  <div className={styles.fee}>
                    {doctor.consultationFee != null && (
                      <span className={styles.feeAmount}>
                        <span className={styles.muted}>{c.fee}</span>
                        <strong>
                          {formatFee(doctor.consultationFee, language)}
                        </strong>
                      </span>
                    )}
                    {/*
                      What Zocdoc puts here is the next free time. Ours says
                      which of the two states the listing is in, because most
                      of the directory has no times yet and pretending
                      otherwise is worse than saying so.
                    */}
                    <p className={styles.availability}>
                      {doctor.acceptsBookings ? c.bookableNote : c.notBookable}
                    </p>
                    <Link
                      className={styles.book}
                      href={`/hekimler/${encodeURIComponent(doctor.slug)}#randevu`}
                    >
                      {c.book}
                    </Link>
                    {doctor.clinics.map((clinic) =>
                      phoneHref(clinic.phone) ? (
                        <a
                          key={clinic.slug}
                          className={styles.phone}
                          href={phoneHref(clinic.phone)!}
                        >
                          {clinic.phone}
                        </a>
                      ) : null,
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
        {result && (result.totalPages > 1 || filters.page > 0) && (
          <nav className={styles.pagination} aria-label={c.page}>
            {filters.page > 0 ? (
              <Link
                href={`/hekimler?${filterQuery(filters, filters.page - 1)}`}
              >
                {c.previous}
              </Link>
            ) : (
              <span />
            )}
            <span>
              {c.page} {filters.page + 1}
            </span>
            {filters.page + 1 < result.totalPages ? (
              <Link
                href={`/hekimler?${filterQuery(filters, filters.page + 1)}`}
              >
                {c.next}
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
        <p className={styles.muted}>{c.directoryNote}</p>
      </div>
    </ProductLayout>
  );
}
