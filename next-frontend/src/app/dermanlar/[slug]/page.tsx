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
  const d = await getMedicine((await params).slug);
  if (!d)
    return {
      title: { absolute: "Dərman tapılmadı | AzDoc" },
      robots: { index: false },
    };
  const min = lowestPrice(d);
  const description = `${d.name}: ${d.active_ingredient || "dərman məlumatı"}. ${min == null ? "Qablaşdırma məlumatları" : `${price(min)} başlayan qablaşdırma qiymətləri`}, istehsalçı və alternativlər.`;
  return {
    title: { absolute: `${d.name} — qiymətlər və alternativlər | AzDoc` },
    description,
    alternates: { canonical: medicineUrl(d.slug) },
    openGraph: {
      title: `${d.name} — qiymətlər və alternativlər`,
      description,
      url: medicineUrl(d.slug),
      locale: "az_AZ",
      type: "website",
    },
  };
}
export default async function MedicinePage({ params }: Props) {
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
      <article lang="az" className={styles.page}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(drugSchema(d)) }}
        />
        <nav className={styles.breadcrumb} aria-label="Səhifə yolu">
          <Link href="/dermanlar">← Dərman kataloqu</Link>
          <span>/ {d.name}</span>
        </nav>
        <header className={styles.detailHero}>
          <div>
            <p className={styles.eyebrow}>DƏRMAN HAQQINDA</p>
            <h1>{d.name}</h1>
            <p className={styles.ingredient}>
              {d.active_ingredient || "Təsiredici maddə qeyd edilməyib"}
            </p>
            <p>{d.manufacturer || "İstehsalçı qeyd edilməyib"}</p>
            <span className={styles.status}>
              {d.prescription_status || "Resept statusu qeyd edilməyib"}
            </span>
          </div>
          <aside className={styles.priceStage}>
            <p>Başlayan qablaşdırma qiyməti</p>
            <strong>{price(min)}</strong>
            <p>{prices.length} qablaşdırma variantı</p>
            <a href="#prices">Qiymətlərə bax ↓</a>
          </aside>
        </header>
        <AllergyCheck medicineId={d.id} />
        <section className={styles.section} id="alternatives">
          <p className={styles.eyebrow}>QİYMƏTİ NƏ DƏYİŞİR?</p>
          <h2>Ortaq təsiredici maddəli alternativlər</h2>
          <p className={styles.muted}>
            Ən ucuz qablaşdırmadan başlayaraq. Ortaq maddə eyni tərkib, doza və
            ya dərman forması demək deyil; kombinasiya preparatları da göstərilə
            bilər. Əvəzləməni həkim və ya əczaçı ilə dəqiqləşdirin.
          </p>
          {difference != null && (
            <div className={styles.saving}>
              <div>
                <span>Ən aşağı qeyd olunmuş qiymətlər arasında fərq</span>
                <strong>{price(difference)}</strong>
                <p>
                  {d.name}: {price(min)} · {best.name}:{" "}
                  {price(best.lowestPrice)}
                </p>
                <small>
                  Qablaşdırma qiyməti fərqidir; eyni doza üzrə hesablanmış
                  qənaət deyil.
                </small>
              </div>
              <Link href={`/dermanlar/${encodeURIComponent(best.slug)}`}>
                {best.name} →
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
                      {a.activeIngredient || "Təsiredici maddə qeyd edilməyib"}
                    </p>
                    <small>
                      {a.manufacturer || "İstehsalçı qeyd edilməyib"} ·{" "}
                      {a.priceCount} qablaşdırma variantı
                    </small>
                  </div>
                  <div className={styles.resultPrice}>
                    <strong>{price(a.lowestPrice)}</strong>
                    {saving(min, a.lowestPrice) != null && (
                      <small className={styles.difference}>
                        {price(saving(min, a.lowestPrice))} qiymət fərqi
                      </small>
                    )}
                    <span aria-hidden="true">↗</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p>Bu dərman üçün alternativ məlumatı yoxdur.</p>
          )}
        </section>
        <section id="prices" className={styles.section}>
          <div className={styles.sectionHead}>
            <h2>Qablaşdırma və qiymətlər</h2>
            <span>AZN · ucuzdan bahaya</span>
          </div>
          {prices.length ? (
            <div
              className={styles.tableWrap}
              tabIndex={0}
              role="region"
              aria-label="Qablaşdırma qiymətləri"
            >
              <table>
                <caption>
                  Doza, forma və qablaşdırma üzrə qeyd olunmuş qiymətlər
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Dərman / istehsalçı</th>
                    <th scope="col">Doza və forma</th>
                    <th scope="col">Qablaşdırma</th>
                    <th scope="col">Qiymət</th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map((p, i) => (
                    <tr key={i}>
                      <td>
                        <strong>{p.tradeName}</strong>
                        <small>{p.manufacturer || "Qeyd edilməyib"}</small>
                      </td>
                      <td>
                        {p.dosage || "Qeyd edilməyib"}
                        <small>{p.form}</small>
                      </td>
                      <td>{p.packaging || "Qeyd edilməyib"}</td>
                      <td className={styles.money}>{price(p.retailPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>qiymət yoxdur</p>
          )}
          <p className={styles.muted}>
            Qiymətlər aptekdə mövcudluq zəmanəti deyil. Qablaşdırmadakı vahid
            sayı bu məlumatda təqdim olunmur; alış zamanı dəqiqləşdirin.
          </p>
        </section>
        {(d.release_form || d.description_az) && (
          <section className={styles.section}>
            <h2>Əlavə məlumat</h2>
            {d.release_form && (
              <p>
                <strong>Buraxılış forması:</strong> {d.release_form}
              </p>
            )}
            {d.description_az && <p>{d.description_az}</p>}
          </section>
        )}
        <p className={styles.disclaimer}>
          Bu səhifə məlumat üçündür və fərdi tibbi məsləhət deyil. Dərmanı qəbul
          etməzdən və ya dəyişməzdən əvvəl həkim və ya əczaçı ilə məsləhətləşin.
        </p>
      </article>
    </ProductLayout>
  );
}
