import { medicineServerCopy } from "@/components/medicines/serverCopy";
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
  const { copy: mc } = await medicineServerCopy();
  const { q } = await searchParams;
  return {
    title: { absolute: mc("Dərmanlar - qiymətlər və alternativlər | AzDoc") },
    description: mc(
      "Dərmanları adına və ya təsiredici maddəsinə görə axtarın. Qablaşdırma qiymətlərinə və oxşar tərkibli dərmanlara baxın.",
    ),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL || "https://azdoc.ai"}/dermanlar`,
    },
    ...(q ? { robots: { index: false, follow: true } } : {}),
  };
}
export default async function Catalogue({ searchParams }: Props) {
  const { language, copy: mc } = await medicineServerCopy();
  const mp = (value: number | null) =>
    value == null ? mc("qiymət yoxdur") : price(value);
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
      <div className={styles.page} lang={language}>
        <header className={styles.hero}>
          <div>
            <p className={styles.eyebrow}> {mc("DƏRMAN KATALOQU")} </p>
            <h1>
              {" "}
              {mc("Dərmanı tapın.")} <br />
              <span> {mc("Qiyməti müqayisə edin.")} </span>
            </h1>
            <p>
              {" "}
              {mc(
                "Adına və ya təsiredici maddəsinə görə axtarın. Müxtəlif qablaşdırmaların qiymətinə və oxşar tərkibli dərmanlara baxın.",
              )}{" "}
            </p>
          </div>
          <aside className={styles.note}>
            <span aria-hidden="true">^</span>
            <h2>
              {" "}
              {mc("Eyni maddə.")} <br /> {mc("Fərqli qiymətlər.")}{" "}
            </h2>
            <p>
              {" "}
              {mc(
                "Qiymətlə yanaşı dozanı, dərman formasını və qablaşdırmanı da müqayisə edin.",
              )}{" "}
            </p>
          </aside>
        </header>
        <Search language={language} q={q} />
        {failed ? (
          <section className={styles.section} role="alert">
            <h2> {mc("Axtarış müvəqqəti əlçatan deyil")} </h2>
            <p> {mc("Bir az sonra yenidən cəhd edin.")} </p>
            <a href={`/dermanlar?q=${encodeURIComponent(q)}`}>
              {" "}
              {mc("Yenidən cəhd et")}{" "}
            </a>
          </section>
        ) : results ? (
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2>
                {" "}
                {mc("&quot;")} {q} {mc("&quot; üçün nəticələr")}{" "}
              </h2>
              <span>
                {results.length}
                {results.length === 50 ? "+" : ""} {mc("nəticə")}{" "}
              </span>
            </div>
            {results.length === 0 ? (
              <p>
                {" "}
                {mc(
                  "Nəticə tapılmadı. Dərmanın digər adını və ya təsiredici maddəsini yoxlayın.",
                )}{" "}
              </p>
            ) : (
              <>
                <p className={styles.muted}>
                  {" "}
                  {mc(
                    "Axtarışa uyğunluğa görə sıralanıb. Qiymətlər qablaşdırmalara aiddir.",
                  )}{" "}
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
                            mc("Təsiredici maddə qeyd edilməyib")}
                        </p>
                        <small>
                          {m.priceCount} {mc("qablaşdırma variantı")}{" "}
                        </small>
                      </div>
                      <div className={styles.resultPrice}>
                        <strong>{mp(m.lowestPrice)}</strong>
                        {m.lowestPrice != null && (
                          <small> {mc("ən aşağı qiymət")} </small>
                        )}
                        <span aria-hidden="true">^</span>
                      </div>
                    </Link>
                  ))}
                </div>
                {results.length === 50 && (
                  <p>
                    {" "}
                    {mc(
                      "Daha dəqiq nəticə üçün dərmanın tam adını yazın.",
                    )}{" "}
                  </p>
                )}
              </>
            )}
          </section>
        ) : (
          <section className={styles.section}>
            <h2> {mc("Axtarış nümunələri")} </h2>
            <p>
              {" "}
              {mc(
                "Dərmanın ticarət adını və ya qutuda yazılan təsiredici maddəni daxil edin. Axtarış üçün ən azı 2 hərf lazımdır.",
              )}{" "}
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
          {" "}
          {mc(
            "Bu kataloq məlumat üçündür. Dərman seçimi və dəyişdirilməsi barədə həkim və ya əczaçı ilə məsləhətləşin. Qiymət məlumatı aptekdə mövcudluq zəmanəti deyil.",
          )}{" "}
        </p>
      </div>
    </ProductLayout>
  );
}
