import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductLayout from "@/components/public/ProductLayout";
import {
  directoryCopy,
  getDoctor,
  getSlots,
  getSpecialtyName,
} from "@/api/doctorServer";
import {
  profileUrl,
  doctorSchema,
  safeJsonLd,
  slotWindow,
  phoneHref,
} from "@/components/doctors/model";
import { experienceYears } from "@/components/doctors/copy";
import {
  ClinicContact,
  Portrait,
  Verification,
  spokenLanguages,
  formatFee,
} from "@/components/doctors/DoctorParts";
import BookingPanel from "@/components/booking/BookingPanel";
import styles from "@/components/doctors/directory.module.css";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { language, c } = await directoryCopy();
  const { slug } = await params;
  const doctor = await getDoctor(slug);
  if (!doctor) notFound();
  const specialty = await getSpecialtyName(doctor.specialtyCode, language);
  const title = `${doctor.fullName} - ${specialty} | azdoc`;
  const description = [
    doctor.fullName,
    specialty,
    doctor.clinics.map((clinic) => clinic.name).join(", "),
    c[
      doctor.verification === "VERIFIED"
        ? "VERIFIED"
        : doctor.verification === "PENDING"
          ? "PENDING"
          : "UNCLAIMED"
    ],
  ]
    .filter(Boolean)
    .join(". ")
    .slice(0, 300);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: profileUrl(doctor.slug) },
    openGraph: {
      title,
      description,
      url: profileUrl(doctor.slug),
      type: "profile",
    },
  };
}
export default async function DoctorProfile({ params }: Props) {
  const { language, c } = await directoryCopy();
  const doctor = await getDoctor((await params).slug);
  if (!doctor) notFound();
  const specialty = await getSpecialtyName(doctor.specialtyCode, language);
  const window = slotWindow();
  const slots =
    doctor.acceptsBookings && doctor.id != null
      ? await getSlots(doctor.id, window.from, window.to).catch(() => null)
      : null;
  return (
    <ProductLayout>
      <div className={styles.page} lang={language}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd(doctorSchema(doctor, specialty)),
          }}
        />
        <Link className={styles.clear} href="/hekimler">
          {c.back}
        </Link>
        <header className={styles.profileTop}>
          <Portrait doctor={doctor} />
          <div>
            <h1>{doctor.fullName}</h1>
            <p>{specialty}</p>
          </div>
        </header>
        <div className={styles.profile}>
          <div>
            <dl className={styles.facts}>
              {doctor.yearsExperience != null && (
                <div>
                  <dt>{c.years}</dt>
                  <dd>{experienceYears(doctor.yearsExperience, language)}</dd>
                </div>
              )}
              {doctor.languages.length > 0 && (
                <div>
                  <dt>{c.languages}</dt>
                  <dd>{spokenLanguages(doctor.languages, language)}</dd>
                </div>
              )}
              {doctor.consultationFee != null && (
                <div>
                  <dt>{c.fee}</dt>
                  <dd>{formatFee(doctor.consultationFee, language)}</dd>
                </div>
              )}
            </dl>
            <Verification
              state={doctor.verification}
              language={language}
              expanded
              name={doctor.fullName}
            />
            {doctor.bio && (
              <section className={styles.section}>
                <h2>{c.about}</h2>
                <p className={styles.prose}>{doctor.bio}</p>
              </section>
            )}
            {doctor.qualifications && (
              <section className={styles.section}>
                <h2>{c.qualifications}</h2>
                <p className={styles.prose}>{doctor.qualifications}</p>
              </section>
            )}
            {doctor.clinics.length > 0 && (
              <section className={styles.section}>
                <h2>{c.clinics}</h2>
                {doctor.clinics.map((clinic) => (
                  <ClinicContact key={clinic.slug} clinic={clinic} />
                ))}
              </section>
            )}
          </div>
          <aside className={styles.sidebar}>
            <h2>{doctor.acceptsBookings ? c.slots : c.contact}</h2>
            {doctor.acceptsBookings && doctor.id != null && (
              <>
                <p className={styles.muted}>{c.slotsNote}</p>
                {slots === null ? (
                  <p role="status">{c.slotsFailed}</p>
                ) : (
                  <BookingPanel
                    doctorId={doctor.id}
                    doctorName={doctor.fullName}
                    language={language}
                    initialSlots={slots}
                    initialFrom={window.from}
                    initialTo={window.to}
                  />
                )}
              </>
            )}
            {doctor.clinics
              .filter((clinic) => phoneHref(clinic.phone))
              .map((clinic) => (
                <ClinicContact key={clinic.slug} clinic={clinic} />
              ))}
            {!doctor.clinics.some((clinic) => phoneHref(clinic.phone)) && (
              <p className={styles.muted}>{c.noPhone}</p>
            )}
          </aside>
        </div>
      </div>
    </ProductLayout>
  );
}
