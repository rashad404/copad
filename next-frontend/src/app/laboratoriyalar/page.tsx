import type { Metadata } from "next";
import Link from "next/link";
import ProductLayout from "@/components/public/ProductLayout";
import { getLabs, laboratoryCopy } from "@/api/labServer";
import {
  parseFilters,
  filtered,
  filterQuery,
  labUrl,
} from "@/components/labs/model";
import { phoneHref } from "@/components/doctors/model";
import d from "@/components/doctors/directory.module.css";
import s from "@/components/labs/labs.module.css";
type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { c } = await laboratoryCopy();
  const filters = parseFilters(await searchParams);
  return {
    title: { absolute: `${c.title} | azdoc` },
    description: c.description,
    alternates: { canonical: labUrl() },
    ...(filtered(filters) || filters.page
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}
export default async function Laboratories({ searchParams }: Props) {
  const { language, c } = await laboratoryCopy();
  const filters = parseFilters(await searchParams);
  const result = await getLabs(filters).catch(() => null);
  const globallyEmpty =
    result?.totalElements === 0 && filtered(filters)
      ? (
          await getLabs({
            q: "",
            city: "",
            homeCollection: false,
            page: 0,
          }).catch(() => null)
        )?.totalElements === 0
      : !filtered(filters);
  return (
    <ProductLayout>
      <div className={d.page} lang={language}>
        <header className={d.hero}>
          <h1>{c.title}</h1>
          <p>{c.description}</p>
          <p>
            <Link className={d.clear} href="/laboratoriyalar/muqayise">
              {c.compareLink}
            </Link>
          </p>
        </header>
        <form
          action="/laboratoriyalar"
          method="get"
          className={`${d.filters} ${s.filters}`}
        >
          <label>
            {c.name}
            <input
              name="q"
              type="search"
              defaultValue={filters.q}
              maxLength={120}
            />
          </label>
          <label>
            {c.city}
            <input name="city" defaultValue={filters.city} maxLength={120} />
          </label>
          <label>
            {c.homeFilter}
            <select
              name="homeCollection"
              defaultValue={filters.homeCollection ? "true" : ""}
            >
              <option value="">{c.all}</option>
              <option value="true">{c.homeOnly}</option>
            </select>
          </label>
          <button className={d.button}>{c.search}</button>
        </form>
        {(filtered(filters) || filters.page > 0) && (
          <Link className={d.clear} href="/laboratoriyalar">
            {c.clear}
          </Link>
        )}
        {!result ? (
          <section className={d.empty} role="alert">
            <h2>{c.unavailable}</h2>
            <a
              className={d.clear}
              href={`/laboratoriyalar?${filterQuery(filters)}`}
            >
              {c.retry}
            </a>
          </section>
        ) : result.content.length === 0 ? (
          <section className={d.empty}>
            <h2>{globallyEmpty && !filters.page ? c.emptyTitle : c.noMatch}</h2>
            {globallyEmpty && !filters.page && <p>{c.empty}</p>}
          </section>
        ) : (
          <section className={d.section} aria-labelledby="lab-results">
            <h2 id="lab-results">
              {c.results}: {result.totalElements}
            </h2>
            <ul className={d.list}>
              {result.content.map((lab) => (
                <li key={lab.id} className={d.row}>
                  <div className={s.monogram} aria-hidden="true">
                    {lab.name.slice(0, 1)}
                  </div>
                  <div>
                    <h2>
                      <Link
                        href={`/laboratoriyalar/${encodeURIComponent(lab.slug)}`}
                      >
                        {lab.name}
                      </Link>
                    </h2>
                    <p>{[lab.city, lab.district].filter(Boolean).join(", ")}</p>
                    <p className={d.muted}>
                      {lab.homeCollection ? c.homeYes : c.homeNo}
                    </p>
                    <p>
                      {phoneHref(lab.phone) ? (
                        <a href={phoneHref(lab.phone)!}>{lab.phone}</a>
                      ) : (
                        c.noPhone
                      )}
                    </p>
                  </div>
                  <div className={d.fee}>
                    <span className={d.muted}>{c.testCount}</span>
                    <strong>{lab.testCount}</strong>
                    <Link
                      href={`/laboratoriyalar/${encodeURIComponent(lab.slug)}`}
                    >
                      {c.view}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
        {result && (result.totalPages > 1 || filters.page > 0) && (
          <nav className={d.pagination} aria-label={c.page}>
            {filters.page > 0 ? (
              <Link
                href={`/laboratoriyalar?${filterQuery(filters, filters.page - 1)}`}
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
                href={`/laboratoriyalar?${filterQuery(filters, filters.page + 1)}`}
              >
                {c.next}
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </div>
    </ProductLayout>
  );
}
