import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductLayout from "@/components/public/ProductLayout";
import RecordView from "@/components/public/RecordView";
import { Star } from "lucide-react";
import { shortDate } from "@/utils/dates";
import {
  directoryCopy,
  getDoctor,
  getReviews,
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
import { experienceYears, formatRating } from "@/components/doctors/copy";
import {
  ClinicContact,
  Portrait,
  Prose,
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
  const reviews = await getReviews(doctor.slug).catch(() => null);
  const specialty = await getSpecialtyName(doctor.specialtyCode, language);
  const window = slotWindow();
  const slots =
    doctor.acceptsBookings && doctor.id != null
      ? await getSlots(doctor.id, window.from, window.to).catch(() => null)
      : null;
  return (
    <ProductLayout>
      <RecordView kind="doctors" slug={doctor.slug} />
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
            {doctor.viewCount != null && doctor.viewCount > 0 && (
              <p className={styles.views}>{c.views(doctor.viewCount)}</p>
            )}
            <Verification
              state={doctor.verification}
              language={language}
              expanded
              slug={doctor.slug}
            />
            {doctor.bio && (
              <section className={styles.section}>
                <h2>{c.about}</h2>
                <Prose text={doctor.bio} />
              </section>
            )}
            {doctor.qualifications && (
              <section className={styles.section}>
                <h2>{c.qualifications}</h2>
                {/*
                  Education arrives as one line with entries divided by pipes,
                  which is a list wearing a paragraph's clothes.
                */}
                <ul className={styles.proseList}>
                  {doctor.qualifications
                    .split("|")
                    .map((entry) => entry.trim())
                    .filter(Boolean)
                    .map((entry, index) => (
                      <li key={index}>{entry}</li>
                    ))}
                </ul>
              </section>
            )}
            {/*
              What patients said. The badge on each one is the point: a reader
              can tell an account that attended an appointment from somebody
              who typed a name into a box.
            */}
            <section className={styles.section} aria-labelledby="reviews">
              <h2 id="reviews">{c.reviewsTitle}</h2>
              {reviews && reviews.count > 0 && (
                <p className={styles.reviewSummary}>
                  <Star size={18} fill="currentColor" aria-hidden="true" />
                  <strong>{formatRating(reviews.average ?? 0, language)}</strong>
                  <span className={styles.muted}>
                    {c.reviewCount(reviews.count)}
                  </span>
                </p>
              )}
              {!reviews || reviews.reviews.length === 0 ? (
                <p className={styles.muted}>{c.noReviewsYet}</p>
              ) : (
                <ul className={styles.reviewList}>
                  {reviews.reviews.map((review) => (
                    <li key={review.id} className={styles.review}>
                      <div className={styles.reviewHead}>
                        <span className={styles.reviewStars} aria-label={`${review.rating}`}>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Star
                              key={n}
                              size={15}
                              fill={n <= review.rating ? "currentColor" : "none"}
                              className={n <= review.rating ? styles.starOn : styles.starOff}
                              aria-hidden="true"
                            />
                          ))}
                        </span>
                        <strong>{review.authorName}</strong>
                        <span
                          className={
                            review.trust === "VERIFIED"
                              ? styles.trustVerified
                              : styles.trustPlain
                          }
                          title={
                            review.trust === "VERIFIED"
                              ? c.trustNoteVerified
                              : undefined
                          }
                        >
                          {review.trust === "VERIFIED"
                            ? c.trustVERIFIED
                            : review.trust === "REGISTERED"
                              ? c.trustREGISTERED
                              : c.trustGUEST}
                        </span>
                      </div>
                      {review.comment && <p>{review.comment}</p>}
                      <p className={styles.muted}>
                        {shortDate(review.createdAt.slice(0, 10), language)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                className={styles.secondary}
                href={`/hekimler/${encodeURIComponent(doctor.slug)}/rey`}
              >
                {reviews && reviews.count > 0 ? c.writeReview : c.beFirst}
              </Link>
            </section>
            {doctor.clinics.length > 0 && (
              <section className={styles.section}>
                <h2>{c.clinics}</h2>
                {doctor.clinics.map((clinic) => (
                  <ClinicContact key={clinic.slug} clinic={clinic} />
                ))}
              </section>
            )}
          </div>
          {/*
            The booking column, on every profile. A listing that cannot take an
            appointment says so here in its own words rather than quietly
            dropping the section, because a visitor arriving from a search
            engine has no other way to learn that the site books appointments
            at all.
          */}
          <aside className={styles.sidebar} id="randevu">
            <h2>{doctor.acceptsBookings ? c.slots : c.book}</h2>
            {doctor.id != null && (
              <>
                {doctor.acceptsBookings && (
                  <p className={styles.muted}>{c.slotsNote}</p>
                )}
                {doctor.acceptsBookings && slots === null ? (
                  <p role="status">{c.slotsFailed}</p>
                ) : (
                  <BookingPanel
                    doctorId={doctor.id}
                    doctorName={doctor.fullName}
                    language={language}
                    initialSlots={slots ?? []}
                    initialFrom={window.from}
                    initialTo={window.to}
                    closed={!doctor.acceptsBookings}
                    closedNotice={
                      <div className={styles.closed}>
                        <p className={styles.closedTitle}>{c.noSlotsTitle}</p>
                        <p className={styles.muted}>{c.noSlotsBody}</p>
                        <a
                          className={styles.closedClaim}
                          href={`/hekim-panel?claim=${encodeURIComponent(doctor.slug)}`}
                        >
                          {c.noSlotsMine}
                        </a>
                      </div>
                    }
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
