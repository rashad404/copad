import Image from "next/image";
import { Check } from "lucide-react";
import { doctorCopy, type DirectoryLanguage } from "./copy";
import {
  photoSrc,
  phoneHref,
  type PublicClinic,
  type PublicDoctor,
} from "./model";
import styles from "./directory.module.css";
export function Portrait({ doctor }: { doctor: PublicDoctor }) {
  const src = photoSrc(doctor.photoUrl);
  return (
    <div className={styles.portrait}>
      {src ? (
        <Image src={src} alt="" width={112} height={112} unoptimized />
      ) : (
        <span aria-hidden="true">
          {doctor.fullName
            .replace(/^Dr\.?\s+/i, "")
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => Array.from(part)[0])
            .join("")}
        </span>
      )}
    </div>
  );
}
export function Verification({
  state,
  language,
  expanded = false,
  slug = "",
}: {
  state: string;
  language: DirectoryLanguage;
  expanded?: boolean;
  slug?: string;
}) {
  const c = doctorCopy(language);
  const checked = state === "VERIFIED";
  const label = checked
    ? c.VERIFIED
    : state === "PENDING"
      ? c.PENDING
      : c.UNCLAIMED;
  const note = checked
    ? c.verifiedNote
    : state === "UNCLAIMED"
      ? c.unclaimedNote
      : state === "PENDING"
        ? c.pendingNote
        : c.unknownNote;
  const status = (
    <span className={`${styles.status} ${checked ? styles.checked : ""}`}>
      {checked && <Check size={15} aria-hidden="true" />}
      {label}
    </span>
  );
  if (!expanded) return status;
  return (
    <aside className={styles.notice}>
      {status}
      <p>{note}</p>
      {/*
        The claim flow exists and this was a mailto, so the only doctors who
        ever reached it were the ones who wrote an email and waited. The link
        carries the slug, which lets the panel open on this listing rather than
        asking the doctor to search for their own name.
      */}
      {state === "UNCLAIMED" && slug && (
        <a href={`/hekim-panel?claim=${encodeURIComponent(slug)}`}>{c.claim}</a>
      )}
    </aside>
  );
}
export function ClinicContact({ clinic }: { clinic: PublicClinic }) {
  const href = phoneHref(clinic.phone);
  return (
    <div className={styles.clinic}>
      <h3>{clinic.name}</h3>
      <p>
        {[clinic.city, clinic.district, clinic.address]
          .filter(Boolean)
          .join(", ")}
      </p>
      {href ? (
        <a href={href}>{clinic.phone}</a>
      ) : clinic.phone ? (
        <p>{clinic.phone}</p>
      ) : null}
    </div>
  );
}
export function spokenLanguages(
  languages: string[],
  language: DirectoryLanguage,
) {
  const c = doctorCopy(language);
  return languages
    .map((value) =>
      value === "az" || value === "en" || value === "ru" ? c[value] : value,
    )
    .join(", ");
}
export const formatFee = (fee: number, language: DirectoryLanguage) =>
  new Intl.NumberFormat(
    language === "az" ? "az-AZ" : language === "ru" ? "ru-RU" : "en-US",
    { style: "currency", currency: "AZN" },
  ).format(fee);
