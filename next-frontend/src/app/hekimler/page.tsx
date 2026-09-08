import type { Metadata } from "next";
import Link from "next/link";
import ProductLayout from "@/components/public/ProductLayout";
import { directoryCopy, getDoctors, getSpecialties } from "@/api/doctorServer";
import {
  directoryUrl,
  filterQuery,
  isFiltered,
  parseFilters,
} from "@/components/doctors/model";
import { specialtyName, experienceYears } from "@/components/doctors/copy";
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
  const [result, specialties] = await Promise.all([
    getDoctors(filters).catch(() => null),
    getSpecialties(language).catch(() => []),
  ]);
  // An empty directory and an empty filtered search are different states.
  const globallyEmpty =
    result?.totalElements === 0 && isFiltered(filters)
      ? (
          await getDoctors({
            q: "",
            specialty: "",
            city: "",
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
        <form action="/hekimler" method="get" className={styles.filters}>
          <label>
            {c.name}
            <input
              name="q"
              defaultValue={filters.q}
              maxLength={120}
              type="search"
            />
          </label>
          <label>
            {c.specialty}
            <select name="specialty" defaultValue={filters.specialty}>
              <option value="">{c.all}</option>
              {options.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            {c.city}
            <input name="city" defaultValue={filters.city} maxLength={120} />
          </label>
          <label>
            {c.language}
            <select name="language" defaultValue={filters.language}>
              <option value="">{c.all}</option>
              {(["az", "ru", "en"] as const).map((value) => (
                <option key={value} value={value}>
                  {c[value]}
                </option>
              ))}
            </select>
          </label>
          <button className={styles.button} type="submit">
            {c.search}
          </button>
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
                  <Portrait doctor={doctor} />
                  <div>
                    <h2>
                      <Link
                        href={`/hekimler/${encodeURIComponent(doctor.slug)}`}
                      >
                        {doctor.fullName}
                      </Link>
                    </h2>
                    <p>
                      {specialtyName(
                        doctor.specialtyCode,
                        language,
                        specialties.find(
                          (item) => item.code === doctor.specialtyCode,
                        )?.name,
                      )}
                    </p>
                    <Verification
                      state={doctor.verification}
                      language={language}
                    />
                    {doctor.yearsExperience != null && (
                      <p className={styles.muted}>
                        {c.years}:{" "}
                        {experienceYears(doctor.yearsExperience, language)}
                      </p>
                    )}
                    {doctor.clinics.map((clinic) => (
                      <p key={clinic.slug}>
                        {[clinic.name, clinic.city].filter(Boolean).join(", ")}
                      </p>
                    ))}
                    {doctor.languages.length > 0 && (
                      <p className={styles.muted}>
                        {c.languages}:{" "}
                        {spokenLanguages(doctor.languages, language)}
                      </p>
                    )}
                  </div>
                  <div className={styles.fee}>
                    {doctor.consultationFee != null && (
                      <>
                        <span className={styles.muted}>{c.fee}</span>
                        <strong>
                          {formatFee(doctor.consultationFee, language)}
                        </strong>
                      </>
                    )}
                    <Link href={`/hekimler/${encodeURIComponent(doctor.slug)}`}>
                      {c.view}
                    </Link>
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
