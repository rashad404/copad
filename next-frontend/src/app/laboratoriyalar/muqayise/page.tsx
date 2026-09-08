import type { Metadata } from "next";
import Link from "next/link";
import ProductLayout from "@/components/public/ProductLayout";
import {
  getComparable,
  getComparison,
  laboratoryCopy,
} from "@/api/labServer";
import { money, isPrice } from "@/components/labs/model";
import d from "@/components/doctors/directory.module.css";
import s from "@/components/labs/labs.module.css";

/**
 * What the same test costs in one laboratory and another.
 *
 * The comparison was already computed on the server and nothing asked for it.
 * This is the page that makes a price list worth publishing: nobody can work
 * out from two pharmacy-style catalogues that one laboratory charges twice as
 * much for the same blood count.
 *
 * Rendered on the server without a filter box, so it is one URL per test and
 * it can be read, shared and indexed.
 */

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const chosen = (params: Record<string, string | string[] | undefined>) => {
  const value = params.test;
  return typeof value === "string" ? value : "";
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { c } = await laboratoryCopy();
  const test = chosen(await searchParams);
  return {
    title: { absolute: `${c.compareTitle} | azdoc` },
    description: c.compareDescription,
    alternates: { canonical: "/laboratoriyalar/muqayise" },
    ...(test ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function Compare({ searchParams }: Props) {
  const { language, c } = await laboratoryCopy();
  const key = chosen(await searchParams);
  const tests = await getComparable(language).catch(() => null);
  const offers = key ? await getComparison(key, language).catch(() => []) : [];
  const current = tests?.find((t) => t.key === key) ?? null;
  const cheapest = offers.find((o) => isPrice(o.price)) ?? null;

  return (
    <ProductLayout>
      <div className={d.page} lang={language}>
        <header className={d.hero}>
          <h1>{c.compareTitle}</h1>
          <p>{c.compareDescription}</p>
        </header>

        {!tests ? (
          <section className={d.empty} role="alert">
            <h2>{c.unavailable}</h2>
            <Link className={d.clear} href="/laboratoriyalar/muqayise">
              {c.retry}
            </Link>
          </section>
        ) : tests.length === 0 ? (
          <section className={d.empty}>
            <h2>{c.compareEmpty}</h2>
            <Link className={d.clear} href="/laboratoriyalar">
              {c.back}
            </Link>
          </section>
        ) : key && current ? (
          <section className={d.section} aria-labelledby="offers">
            <h2 id="offers">{current.name}</h2>
            <ul className={d.list}>
              {offers.map((offer) => (
                <li key={offer.labSlug} className={d.row}>
                  <div className={s.monogram} aria-hidden="true">
                    {offer.labName.slice(0, 1)}
                  </div>
                  <div>
                    <h3>
                      <Link
                        href={`/laboratoriyalar/${encodeURIComponent(offer.labSlug)}`}
                      >
                        {offer.labName}
                      </Link>
                    </h3>
                    <p>{offer.name}</p>
                    <p className={d.muted}>
                      {[
                        offer.labCity,
                        offer.homeCollection ? c.homeYes : null,
                        offer.turnaroundHours
                          ? `${offer.turnaroundHours} ${c.hours}`
                          : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <div className={d.fee}>
                    <strong>
                      {money(offer.price, language, c.compareNoPrice)}
                    </strong>
                    {cheapest &&
                      offer.labSlug === cheapest.labSlug &&
                      offers.filter((o) => isPrice(o.price)).length > 1 && (
                        <span className={d.muted}>{c.compareCheapest}</span>
                      )}
                  </div>
                </li>
              ))}
            </ul>
            <p className={d.muted}>{c.compareNote}</p>
            <Link className={d.clear} href="/laboratoriyalar/muqayise">
              {c.compareBack}
            </Link>
          </section>
        ) : (
          <section className={d.section} aria-labelledby="tests">
            <h2 id="tests">{c.compareChoose}</h2>
            <ul className={d.list}>
              {tests.map((test) => {
                const spread =
                  isPrice(test.lowest) && isPrice(test.highest)
                    ? test.highest - test.lowest
                    : 0;
                return (
                  <li key={test.key} className={d.row}>
                    <div>
                      <h3>
                        <Link
                          href={`/laboratoriyalar/muqayise?test=${encodeURIComponent(test.key)}`}
                        >
                          {test.name}
                        </Link>
                      </h3>
                      <p className={d.muted}>
                        {test.labCount} {c.compareLabs}
                      </p>
                    </div>
                    <div className={d.fee}>
                      <span className={d.muted}>{c.compareRange}</span>
                      <strong>
                        {isPrice(test.lowest) && isPrice(test.highest)
                          ? spread > 0
                            ? `${money(test.lowest, language, c.compareNoPrice)} - ${money(
                                test.highest,
                                language,
                                c.compareNoPrice,
                              )}`
                            : money(test.lowest, language, c.compareNoPrice)
                          : c.compareNoPrice}
                      </strong>
                      <span className={d.muted}>
                        {spread > 0
                          ? `${c.compareSaving}: ${money(spread, language, "")}`
                          : isPrice(test.lowest)
                            ? c.compareSame
                            : ""}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className={d.muted}>{c.compareNote}</p>
          </section>
        )}
      </div>
    </ProductLayout>
  );
}
