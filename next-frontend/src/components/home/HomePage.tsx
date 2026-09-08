"use client";
import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  FileCheck2,
  FileText,
  LockKeyhole,
  Paperclip,
  Search,
  Stethoscope,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useHydrated } from "@/utils/useHydrated";
import { supportedLanguage, type SiteLanguage } from "@/utils/languages";
import SiteHeader from "@/components/navigation/SiteHeader";
import SiteFooter from "@/components/public/SiteFooter";
import { getHomeCopy } from "./copy";
import { exampleMembers, sampleTimes } from "./examples";
import ProductExample, { MemberChoices, SummarySheet } from "./ProductExample";
import styles from "./homepage.module.css";

export default function HomePage({
  initialLanguage = "az",
}: {
  initialLanguage?: SiteLanguage;
}) {
  const { i18n } = useTranslation();
  const hydrated = useHydrated();
  const language = hydrated
    ? supportedLanguage(i18n.resolvedLanguage || i18n.language) ||
      initialLanguage
    : initialLanguage;
  const c = getHomeCopy(language);
  const { isAuthenticated } = useAuth();
  const signedIn = hydrated && isAuthenticated;
  const [selectedId, setSelectedId] = useState(exampleMembers[0].id);
  const [time, setTime] = useState(sampleTimes[0]);
  const [shareExample, setShareExample] = useState(false);
  const member =
    exampleMembers.find((item) => item.id === selectedId) || exampleMembers[0];
  function selectMember(id: string) {
    setSelectedId(id);
    setShareExample(false);
    setTime(sampleTimes[0]);
  }
  // These illustrative prices need identical output across Node and browser ICU.
  const money = (value: number) =>
    value.toFixed(2).replace(".", language === "en" ? "." : ",");
  const chartPoints = member.results
    .map((value, index) => `${42 + index * 74},${126 - (value - 10) * 16}`)
    .join(" ");
  return (
    <div className={styles.home} lang={language}>
      <a className={styles.skip} href="#main">
        {c.skip}
      </a>
      <SiteHeader />
      <main id="main">
        {signedIn && (
          <nav
            className={`${styles.wrap} ${styles.returning}`}
            aria-label={c.welcome}
          >
            <span>{c.welcome}</span>
            <Link href="/chat">{c.continueChat}</Link>
            <Link href="/health-record">{c.recordsAction}</Link>
            <Link href="/randevularim">{c.appointmentsAction}</Link>
          </nav>
        )}
        <section className={`${styles.wrap} ${styles.hero}`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <span className={styles.dot} />
              azdoc
            </p>
            <h1>
              {c.heroLine1}
              <br />
              <span>{c.heroLine2}</span>
            </h1>
            <p className={styles.lead}>{c.heroBody}</p>
            <div className={styles.actions}>
              <Link className={styles.primary} href="/chat">
                {c.ask}
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <Link
                className={styles.textLink}
                href={signedIn ? "/health-record" : "/register"}
              >
                {c.recordsAction}
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <p className={styles.heroNote}>{c.guestNote}</p>
          </div>
          <ProductExample member={member} onSelect={selectMember} copy={c} />
        </section>
        <section className={`${styles.wrap} ${styles.flow}`} id="how">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{c.flowEyebrow}</p>
            <h2>{c.flowTitle}</h2>
            <p>{c.flowBody}</p>
            <Link className={styles.textLink} href="/health-record">
              {c.recordsAction}
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className={styles.steps}>
            {(["upload", "review", "use"] as const).map((step, index) => (
              <article key={step}>
                <span className={styles.stepNumber}>0{index + 1}</span>
                <div>
                  <h3>{c[`${step}Title`]}</h3>
                  <p>{c[`${step}Body`]}</p>
                </div>
                {index === 1 ? (
                  <FileCheck2 size={22} aria-hidden="true" />
                ) : index === 0 ? (
                  <Paperclip size={22} aria-hidden="true" />
                ) : (
                  <ArrowUpRight size={22} aria-hidden="true" />
                )}
              </article>
            ))}
            <p className={styles.reviewNote}>
              <Check size={16} aria-hidden="true" />
              {c.reviewNote}
            </p>
          </div>
        </section>
        <section className={styles.familyBand} id="family">
          <div className={`${styles.wrap} ${styles.family}`}>
            <div className={styles.familyRecord}>
              <div className={styles.cardHeader}>
                <h3>{c.recordsAction}</h3>
                <span className={styles.sampleTag}>{c.sample}</span>
              </div>
              <MemberChoices member={member} onSelect={selectMember} copy={c} />
              <div className={styles.familyIdentity}>
                <span className={styles.avatar} aria-hidden="true">
                  {member.name[0]}
                </span>
                <div>
                  <strong>{member.name}</strong>
                  <span>{c[member.relationship]}</span>
                </div>
              </div>
              <dl className={styles.familyFacts}>
                {(["condition", "allergy", "medication"] as const).map(
                  (key) => (
                    <div key={key}>
                      <dt>{c[key]}</dt>
                      <dd>{c[member[key]]}</dd>
                    </div>
                  ),
                )}
              </dl>
              <div className={styles.chartHeader}>
                <div>
                  <p>{c.recentResults}</p>
                  <strong>{c.hemoglobin}</strong>
                </div>
                <span>
                  {member.results.at(-1)?.toFixed(1)} <small>g/dL</small>
                </span>
              </div>
              <svg
                className={styles.chart}
                viewBox="0 0 300 158"
                role="img"
                aria-label={`${member.name}: ${c.chartLabel}: ${member.results.join(", ")}`}
              >
                {[10, 12, 14, 16].map((value) => (
                  <g key={value}>
                    <line
                      x1="34"
                      y1={126 - (value - 10) * 16}
                      x2="280"
                      y2={126 - (value - 10) * 16}
                      stroke="#dce1da"
                    />
                    <text x="5" y={130 - (value - 10) * 16}>
                      {value}
                    </text>
                  </g>
                ))}
                <polyline
                  points={chartPoints}
                  fill="none"
                  stroke="#214be2"
                  strokeWidth="2.5"
                />
                {member.results.map((value, index) => (
                  <circle
                    key={index}
                    cx={42 + index * 74}
                    cy={126 - (value - 10) * 16}
                    r="4"
                    fill="#214be2"
                  />
                ))}
                <text x="38" y="151">
                  {c.earlier}
                </text>
                <text x="266" y="151" textAnchor="end">
                  {c.latest}
                </text>
              </svg>
              <p className={styles.fileSource}>
                <Paperclip size={13} aria-hidden="true" />
                {c.sourceValue}
                <span>{c.checked}</span>
              </p>
            </div>
            <div className={styles.familyCopy}>
              <p className={styles.eyebrow}>{c.familyEyebrow}</p>
              <h2>{c.familyTitle}</h2>
              <p className={styles.sectionBody}>{c.familyBody}</p>
              <div className={styles.recordGroups}>
                {(["medical", "documents", "changes"] as const).map((key) => (
                  <article key={key}>
                    <h3>{c[`${key}Group`]}</h3>
                    <p>{c[`${key}Body`]}</p>
                  </article>
                ))}
              </div>
              <Link className={styles.textLink} href="/health-record">
                {c.recordsAction}
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
        <section className={`${styles.wrap} ${styles.care}`} id="care">
          <div className={styles.careIntro}>
            <p className={styles.eyebrow}>{c.careEyebrow}</p>
            <h2>{c.careTitle}</h2>
            <p>{c.careBody}</p>
            <ol>
              {[c.careStep1, c.careStep2, c.careStep3].map((text) => (
                <li key={text}>
                  <Check size={16} aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ol>
            <Link className={styles.primary} href="/hekimler">
              {c.findDoctor}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <p className={styles.finePrint}>{c.bookingNote}</p>
          </div>
          <div className={styles.visitExample}>
            <div className={styles.cardHeader}>
              <span>{c.visitExample}</span>
              <span className={styles.sampleTag}>{c.sample}</span>
            </div>
            <div className={styles.doctorRow}>
              <span className={styles.doctorIcon}>
                <Stethoscope size={25} aria-hidden="true" />
              </span>
              <div>
                <h3>{member.id === "ayan" ? c.pediatrician : c.specialist}</h3>
                <p>{c.clinicExample}</p>
              </div>
            </div>
            <div className={styles.visitPerson}>
              <span>{c.person}</span>
              <strong>{member.name}</strong>
            </div>
            <p className={styles.visitDate}>{c.visitDate}</p>
            <div
              className={styles.timeChoices}
              role="group"
              aria-label={c.chooseTime}
            >
              {sampleTimes.map((value) => (
                <button
                  type="button"
                  key={value}
                  aria-pressed={time === value}
                  onClick={() => setTime(value)}
                >
                  {value}
                </button>
              ))}
            </div>
            <p className={styles.selectedTime} role="status">
              {c.selectedTime}: {time}
            </p>
            <label className={styles.shareChoice}>
              <input
                type="checkbox"
                checked={shareExample}
                onChange={(event) => setShareExample(event.target.checked)}
              />
              <span>{c.shareChoice}</span>
            </label>
            <p className={styles.finePrint}>{c.sampleCaption}</p>
          </div>
          <div className={styles.pdfFeature}>
            <div className={styles.pdfStage}>
              <SummarySheet member={member} copy={c} />
            </div>
            <div>
              <FileText size={25} aria-hidden="true" />
              <h3>{c.summary}</h3>
              <p>{c.pdfBody}</p>
              <Link className={styles.textLink} href="/health-record">
                {c.pdfAction}
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
        <section className={styles.medicineBand}>
          <div className={`${styles.wrap} ${styles.medicines}`}>
            <div>
              <p className={styles.eyebrow}>{c.medicinesEyebrow}</p>
              <h2>{c.medicinesTitle}</h2>
              <p>{c.medicinesBody}</p>
              <form
                action="/dermanlar"
                method="get"
                className={styles.medicineSearch}
              >
                <label htmlFor="homepage-medicine">{c.medicineLabel}</label>
                <div>
                  <input
                    id="homepage-medicine"
                    name="q"
                    type="search"
                    placeholder="Parasetamol"
                    minLength={2}
                    maxLength={120}
                    required
                  />
                  <button type="submit" aria-label={c.medicineSearch}>
                    <Search size={20} aria-hidden="true" />
                  </button>
                </div>
              </form>
            </div>
            <div className={styles.priceExample}>
              <div className={styles.cardHeader}>
                <h3>{c.compareExample}</h3>
                <span className={styles.sampleTag}>{c.sample}</span>
              </div>
              <p>{c.samePack}</p>
              <div className={styles.priceRow}>
                <span>{c.packA}</span>
                <strong>
                  {money(6)} <small>AZN</small>
                </strong>
              </div>
              <div className={styles.priceRow}>
                <span>{c.packB}</span>
                <strong>
                  {money(1.1)} <small>AZN</small>
                </strong>
              </div>
              <div className={styles.saving}>
                <span>{c.difference}</span>
                <strong>
                  {money(4.9)} <small>AZN</small>
                </strong>
              </div>
              <p className={styles.finePrint}>{c.priceNote}</p>
            </div>
          </div>
        </section>
        <section className={`${styles.wrap} ${styles.privacy}`} id="questions">
          <div className={styles.sectionIntro}>
            <LockKeyhole size={28} aria-hidden="true" />
            <h2>{c.privacyTitle}</h2>
            <p>{c.privacyBody}</p>
            <Link className={styles.textLink} href="/privacy-policy">
              {c.privacyAction}
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className={styles.faq}>
            <h3>{c.faqTitle}</h3>
            {([1, 2, 3, 4, 5] as const).map((index) => (
              <details key={index}>
                <summary>
                  {c[`faq${index}q`]}
                  <ChevronDown size={18} aria-hidden="true" />
                </summary>
                <p>{c[`faq${index}a`]}</p>
              </details>
            ))}
          </div>
        </section>
        <section className={`${styles.wrap} ${styles.closing}`}>
          <div>
            <h2>{signedIn ? c.closingSignedIn : c.closingTitle}</h2>
            <p>{signedIn ? c.closingSignedBody : c.closingBody}</p>
          </div>
          <Link
            className={styles.primary}
            href={signedIn ? "/health-record" : "/register"}
          >
            {signedIn ? c.recordsAction : c.createAccount}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
