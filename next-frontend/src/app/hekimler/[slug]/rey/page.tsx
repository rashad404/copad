import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductLayout from "@/components/public/ProductLayout";
import ReviewForm from "@/components/doctors/ReviewForm";
import {
  getDoctor,
  directoryCopy,
  getSpecialtyName,
} from "@/api/doctorServer";
import styles from "@/components/doctors/directory.module.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doctor = await getDoctor((await params).slug);
  if (!doctor) return { title: "azdoc" };
  return {
    title: { absolute: `${doctor.fullName} - rəy yazın | azdoc` },
    // A form is not a page to send a search engine to.
    robots: { index: false, follow: true },
  };
}

export default async function WriteReview({ params }: Props) {
  const doctor = await getDoctor((await params).slug);
  if (!doctor) notFound();
  const { language, c } = await directoryCopy();
  const specialty = await getSpecialtyName(doctor.specialtyCode, language);

  return (
    <ProductLayout>
      <div className={styles.page} lang={language}>
        <div className={styles.reviewPage}>
          {/*
            Where this page sits. It replaces the "back to profile" link that
            was under the form: a way out belongs before somebody starts
            writing, not after they have finished.
          */}
          <nav className={styles.crumbs} aria-label={c.reviewFor}>
            <Link href="/">{c.home}</Link>
            <span aria-hidden="true">/</span>
            <Link href="/hekimler">{c.title}</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/hekimler/${doctor.slug}`}>{doctor.fullName}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{c.reviewFor}</span>
          </nav>
          <h1>{c.reviewFor}</h1>
          <ReviewForm
            slug={doctor.slug}
            doctorName={doctor.fullName}
            specialty={specialty}
            photoUrl={doctor.photoUrl}
            language={language}
          />
        </div>
      </div>
    </ProductLayout>
  );
}
