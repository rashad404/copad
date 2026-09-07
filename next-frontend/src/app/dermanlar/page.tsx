import type { Metadata } from "next";
import Link from "next/link";
import ProductLayout from "@/components/public/ProductLayout";
import Search from "@/components/medicines/Search";
import { searchMedicines } from "@/api/medicineServer";
import { price } from "@/components/medicines/model";
import styles from "@/components/medicines/medicines.module.css";
type Props = { searchParams: Promise<{ q?: string | string[] }> };
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: { absolute: "Dərmanlar - qiymətlər və alternativlər | AzDoc" },
    description:
      "Dərmanları adı və təsiredici maddəsi ilə axtarın. Qablaşdırma qiymətlərini və ortaq təsiredici maddəli alternativləri müqayisə edin.",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL || "https://azdoc.ai"}/dermanlar`,
    },
    ...(q ? { robots: { index: false, follow: true } } : {}),
  };
}
export default async function Catalogue({ searchParams }: Props) {
  const params = await searchParams;
  const q = (typeof params.q === "string" ? params.q : "").trim().slice(0, 120);
  let failed = false;
  const results =
    q.length >= 2
      ? await searchMedicines(q).catch(() => {
          failed = true;
          return null;
        })
      : null;
  return (
    <ProductLayout>
      <div className={styles.page} lang="az">
        <header className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>DƏRMAN BƏLƏDÇİSİ</p>
            <h1>
              Dərmanı tapın.
              <br />
              <span>Qiyməti müqayisə edin.</span>
            </h1>
            <p>
              Adına və ya təsiredici maddəsinə görə axtarın. Qiymətləri,
              qablaşdırmaları və alternativləri bir yerdə görün.
            </p>
          </div>
          <aside className={styles.note}>
            <span aria-hidden="true">^</span>
            <h2>
              Eyni maddə.
              <br />
              Fərqli qiymətlər.
            </h2>
            <p>
              Qiymətlə yanaşı dozanı, dərman formasını və qablaşdırmanı da
              müqayisə edin.
            </p>
          </aside>
        </header>
        <Search q={q} />
        {failed ? (
          <section className={styles.section} role="alert">
            <h2>Axtarış müvəqqəti əlçatan deyil</h2>
            <p>Bir az sonra yenidən cəhd edin.</p>
            <a href={`/dermanlar?q=${encodeURIComponent(q)}`}>
              Yenidən cəhd et
            </a>
          </section>
        ) : results ? (
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2>&quot;{q}&quot; üçün nəticələr</h2>
              <span>
                {results.length}
                {results.length === 50 ? "+" : ""} nəticə
              </span>
            </div>
            {results.length === 0 ? (
              <p>
                Nəticə tapılmadı. Dərmanın digər adını və ya təsiredici
                maddəsini yoxlayın.
              </p>
            ) : (
              <>
                <p className={styles.muted}>
                  Uyğunluğa görə sıralanıb · qiymətlər qablaşdırma variantlarına
                  aiddir.
                </p>
                <div className={styles.results}>
                  {results.map((m) => (
                    <Link
                      className={styles.result}
                      href={`/dermanlar/${encodeURIComponent(m.slug)}`}
                      key={m.id}
                    >
                      <div>
                        <h3>{m.name}</h3>
                        <p>
                          {m.activeIngredient ||
                            "Təsiredici maddə qeyd edilməyib"}
                        </p>
                        <small>{m.priceCount} qablaşdırma variantı</small>
                      </div>
                      <div className={styles.resultPrice}>
                        <strong>{price(m.lowestPrice)}</strong>
                        {m.lowestPrice != null && (
                          <small>başlayan qiymət</small>
                        )}
                        <span aria-hidden="true">^</span>
                      </div>
                    </Link>
                  ))}
                </div>
                {results.length === 50 && (
                  <p>Daha dəqiq nəticə üçün dərmanın tam adını yazın.</p>
                )}
              </>
            )}
          </section>
        ) : (
          <section className={styles.section}>
            <h2>Haradan başlamaq olar?</h2>
            <p>
              Dərmanın ticarət adını və ya qutuda yazılan təsiredici maddəni
              daxil edin. Axtarış üçün ən azı 2 hərf lazımdır.
            </p>
            <div className={styles.examples}>
              {["İbuprofen", "Parasetamol", "Amoksisillin"].map((name) => (
                <Link
                  key={name}
                  href={`/dermanlar?q=${encodeURIComponent(name)}`}
                >
                  {name} ^
                </Link>
              ))}
            </div>
          </section>
        )}
        <p className={styles.disclaimer}>
          Bu kataloq məlumat üçündür. Dərman seçimi və dəyişdirilməsi barədə
          həkim və ya əczaçı ilə məsləhətləşin. Qiymət məlumatı aptekdə
          mövcudluq zəmanəti deyil.
        </p>
      </div>
    </ProductLayout>
  );
}
