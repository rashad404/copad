import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductLayout from "@/components/public/ProductLayout";
import { getLab, laboratoryCopy } from "@/api/labServer";
import { labUrl } from "@/components/labs/model";
import { phoneHref } from "@/components/doctors/model";
import LabCatalogue from "@/components/labs/LabCatalogue";
import d from "@/components/doctors/directory.module.css";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { language, c } = await laboratoryCopy();
  const lab = await getLab((await params).slug, language);
  if (!lab) notFound();
  const title = `${lab.name} - ${c.catalogue} | azdoc`;
  const description = [lab.name, lab.city, lab.district, c.description]
    .filter(Boolean)
    .join(". ");
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: labUrl(lab.slug) },
    openGraph: { title, description, url: labUrl(lab.slug) },
  };
}
export default async function Laboratory({ params }: Props) {
  const { language, c } = await laboratoryCopy();
  const lab = await getLab((await params).slug, language);
  if (!lab) notFound();
  return (
    <ProductLayout>
      <div className={d.page} lang={language}>
        <Link className={d.clear} href="/laboratoriyalar">
          {c.back}
        </Link>
        <header className={d.hero}>
          <h1>{lab.name}</h1>
          <p>
            {[lab.city, lab.district, lab.address].filter(Boolean).join(", ")}
          </p>
          <p>
            {phoneHref(lab.phone) ? (
              <a href={phoneHref(lab.phone)!}>{lab.phone}</a>
            ) : (
              c.noPhone
            )}
          </p>
          <p className={d.muted}>{lab.homeCollection ? c.homeYes : c.homeNo}</p>
        </header>
        <LabCatalogue key={lab.id} lab={lab} initialLanguage={language} />
      </div>
    </ProductLayout>
  );
}
