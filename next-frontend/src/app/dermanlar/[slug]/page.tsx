import { prescriptionLabel } from "@/components/medicines/copy";
import { medicineServerCopy } from "@/components/medicines/serverCopy";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductLayout from "@/components/public/ProductLayout";
import AllergyCheck from "@/components/medicines/AllergyCheck";
import { getMedicine } from "@/api/medicineServer";
import {
  azCompare,
  price,
  priceOrder,
  lowestPrice,
  saving,
  drugSchema,
  safeJsonLd,
  medicineUrl,
} from "@/components/medicines/model";
import styles from "@/components/medicines/medicines.module.css";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { language, copy: mc } = await medicineServerCopy();
  const mp = (value: number | null) =>
    value == null ? mc("qiymət yoxdur") : price(value);
  const d = await getMedicine((await params).slug);
  if (!d)
    return {
      title: { absolute: mc("Dərman tapılmadı | AzDoc") },
      robots: { index: false },
    };
  const min = lowestPrice(d);
  const description = `${d.name}: ${d.active_ingredient || mc("dərman məlumatı")}. ${min == null ? mc("Qablaşdırma məlumatları") : `${mp(min)} - ${mc("ən aşağı qablaşdırma qiyməti")}`}, ${mc("istehsalçı və alternativlər")}.`;
  return {
    title: {
      absolute: `${d.name} - ${mc("qiymətlər və alternativlər")} | AzDoc`,
    },
    description,
    alternates: { canonical: medicineUrl(d.slug) },
    openGraph: {
      title: `${d.name} - ${mc("qiymətlər və alternativlər")}`,
      description,
      url: medicineUrl(d.slug),
      locale:
        language === "ru" ? "ru_RU" : language === "en" ? "en_US" : "az_AZ",
      type: "website",
    },
  };
}
export default async function MedicinePage({ params }: Props) {
  const { language, copy: mc } = await medicineServerCopy();
  const mp = (value: number | null) =>
    value == null ? mc("qiymət yoxdur") : price(value);
  const d = await getMedicine((await params).slug);
  if (!d) notFound();
  const min = lowestPrice(d);
  const prices = [...d.prices].sort((a, b) =>
    priceOrder(a.retailPrice, b.retailPrice),
  );
  const alternatives = [...d.alternatives].sort(
    (a, b) =>
      priceOrder(a.lowestPrice, b.lowestPrice) || azCompare(a.name, b.name),
  );
  const best = alternatives[0];
  const difference = best ? saving(min, best.lowestPrice) : null;
  return (
    <ProductLayout>
      <article lang={language} className={styles.page}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(drugSchema(d)) }}
        />
        <nav className={styles.breadcrumb} aria-label={mc("Səhifə yolu")}>
          <Link href="/dermanlar"> {mc("← Dərman kataloqu")} </Link>
          <span>/ {d.name}</span>
        </nav>
        <header className={styles.detailHero}>
          <div>
            <p className={styles.eyebrow}> {mc("DƏRMAN HAQQINDA")} </p>
            <h1>{d.name}</h1>
            <p className={styles.ingredient}>
              {d.active_ingredient || mc("Təsiredici maddə qeyd edilməyib")}
            </p>
            <p>{d.manufacturer || mc("İstehsalçı qeyd edilməyib")}</p>
            <span className={styles.status}>
              {prescriptionLabel(d.prescription_status, mc)}
            </span>
          </div>
          <aside className={styles.priceStage}>
            <p> {mc("Ən ucuz qablaşdırma")} </p>
            <strong>{mp(min)}</strong>
            <p>
              {prices.length} {mc("qablaşdırma variantı")}{" "}
            </p>
            <a href="#prices"> {mc("Qiymətlərə bax ↓")} </a>
          </aside>
        </header>
        <AllergyCheck medicineId={d.id} />
        <section className={styles.section} id="alternatives">
          <p className={styles.eyebrow}> {mc("DİGƏR DƏRMANLARLA MÜQAYİSƏ")} </p>
          <h2> {mc("Eyni maddəni ehtiva edən dərmanlar")} </h2>
          <p className={styles.muted}>
            {" "}
            {mc(
              "Ən ucuz qablaşdırmalar əvvəl göstərilir. Bu dərmanlarda ən azı bir təsiredici maddə eynidir, amma tam tərkib, doza və dərman forması fərqlənə bilər. Dərmanı dəyişməzdən əvvəl həkim və ya əczaçı ilə məsləhətləşin.",
            )}{" "}
          </p>
          {difference != null && (
            <div className={styles.saving}>
              <div>
                <span> {mc("Ən ucuz qablaşdırmaların qiymət fərqi")} </span>
                <strong>{mp(difference)}</strong>
                <p>
                  {d.name}: {mp(min)} · {best.name}: {mp(best.lowestPrice)}
                </p>
                <small>
                  {" "}
                  {mc(
                    "Qablaşdırma qiyməti fərqidir; eyni doza üzrə hesablanmış qənaət deyil.",
                  )}{" "}
                </small>
              </div>
              <Link href={`/dermanlar/${encodeURIComponent(best.slug)}`}>
                {best.name} {"->"}
              </Link>
            </div>
          )}
          {alternatives.length ? (
            <div className={styles.results}>
              {alternatives.map((a) => (
                <Link
                  className={styles.result}
                  key={a.id}
                  href={`/dermanlar/${encodeURIComponent(a.slug)}`}
                >
                  <div>
                    <h3>{a.name}</h3>
                    <p>
                      {a.activeIngredient ||
                        mc("Təsiredici maddə qeyd edilməyib")}
                    </p>
                    <small>
                      {a.manufacturer || mc("İstehsalçı qeyd edilməyib")} ·{" "}
                      {a.priceCount} {mc("qablaşdırma variantı")}{" "}
                    </small>
                  </div>
                  <div className={styles.resultPrice}>
                    <strong>{mp(a.lowestPrice)}</strong>
                    {saving(min, a.lowestPrice) != null && (
                      <small className={styles.difference}>
                        {mp(saving(min, a.lowestPrice))}{" "}
                        {mc("qiymət fərqi")}{" "}
                      </small>
                    )}
                    <span aria-hidden="true">^</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p> {mc("Bu dərman üçün alternativ məlumatı yoxdur.")} </p>
          )}
        </section>
        <section id="prices" className={styles.section}>
          <div className={styles.sectionHead}>
            <h2> {mc("Qablaşdırma və qiymətlər")} </h2>
            <span> {mc("AZN · ucuzdan bahaya")} </span>
          </div>
          {prices.length ? (
            <div
              className={styles.tableWrap}
              tabIndex={0}
              role="region"
              aria-label={mc("Qablaşdırma qiymətləri")}
            >
              <table>
                <caption>
                  {" "}
                  {mc(
                    "Doza, forma və qablaşdırma üzrə qeyd olunmuş qiymətlər",
                  )}{" "}
                </caption>
                <thead>
                  <tr>
                    <th scope="col"> {mc("Dərman / istehsalçı")} </th>
                    <th scope="col"> {mc("Doza və forma")} </th>
                    <th scope="col"> {mc("Qablaşdırma")} </th>
                    <th scope="col"> {mc("Qiymət")} </th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map((p, i) => (
                    <tr key={i}>
                      <td>
                        <strong>{p.tradeName}</strong>
                        <small>{p.manufacturer || mc("Qeyd edilməyib")}</small>
                      </td>
                      <td>
                        {p.dosage || mc("Qeyd edilməyib")}
                        <small>{p.form}</small>
                      </td>
                      <td>{p.packaging || mc("Qeyd edilməyib")}</td>
                      <td className={styles.money}>{mp(p.retailPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p> {mc("qiymət yoxdur")} </p>
          )}
          <p className={styles.muted}>
            {" "}
            {mc(
              "Qiymətlər aptekdə mövcudluq zəmanəti deyil. Qablaşdırmadakı vahid sayı bu məlumatda təqdim olunmur; alış zamanı dəqiqləşdirin.",
            )}{" "}
          </p>
        </section>
        {(d.release_form || d.description_az) && (
          <section className={styles.section}>
            <h2> {mc("Əlavə məlumat")} </h2>
            {d.release_form && (
              <p>
                <strong> {mc("Buraxılış forması:")} </strong> {d.release_form}
              </p>
            )}
            {d.description_az && <p>{d.description_az}</p>}
          </section>
        )}
        <p className={styles.disclaimer}>
          {" "}
          {mc(
            "Bu səhifə məlumat üçündür və fərdi tibbi məsləhət deyil. Dərmanı qəbul etməzdən və ya dəyişməzdən əvvəl həkim və ya əczaçı ilə məsləhətləşin.",
          )}{" "}
        </p>
      </article>
    </ProductLayout>
  );
}
