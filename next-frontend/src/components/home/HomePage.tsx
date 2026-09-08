"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  CalendarDays,
  LockKeyhole,
  MoveDown,
  FileText,
  Pill,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useHydrated } from "@/utils/useHydrated";
import { supportedLanguage, type SiteLanguage } from "@/utils/languages";
import SiteHeader from "@/components/navigation/SiteHeader";
import SiteFooter from "@/components/public/SiteFooter";
import { getHomeCopy } from "./copy";
import JourneyExample, {
  sampleTimes,
  type JourneyStep,
} from "./JourneyExample";
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
  const [step, setStep] = useState<JourneyStep>(0);
  const [time, setTime] = useState(sampleTimes[0]);
  const [share, setShare] = useState(false);
  const [family, setFamily] = useState<"self" | "child" | "parent">("parent");
  function selectStep(value: JourneyStep) {
    setStep(value);
    if (window.matchMedia?.("(max-width: 800px)").matches) {
      document.getElementById("journey-panel")?.scrollIntoView({
        block: "nearest",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    }
  }
  function selectTime(value: string) {
    setTime(value);
    setShare(false);
  }
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
              {c.eyebrow}
            </p>
            <h1>
              {c.heroLine1}
              <br />
              {c.heroLine2}
              <br />
              <span>{c.heroLine3}</span>
            </h1>
            <p className={styles.heroBody}>{c.heroBody}</p>
            <div className={styles.actions}>
              <Link className={styles.primary} href="/chat">
                {c.ask}
                <ArrowUpRight size={19} aria-hidden="true" />
              </Link>
              <Link className={styles.textLink} href="#how">
                {c.seeHow}
                <MoveDown size={16} aria-hidden="true" />
              </Link>
            </div>
            <p className={styles.guestNote}>{c.guestNote}</p>
          </div>
          <figure className={styles.heroVisual}>
            <div className={styles.heroImage}>
              <Image
                src="/images/home/time-together.jpg"
                alt={c.heroAlt}
                fill
                priority
                sizes="(max-width: 800px) 100vw, 50vw"
                quality={85}
              />
            </div>
            <Link
              className={styles.visitNote}
              href="#how"
              onClick={() => setStep(2)}
            >
              <div className={styles.noteTop}>
                <span className={styles.noteIcon}>
                  <Check size={16} aria-hidden="true" />
                </span>
                <span>azdoc</span>
                <span className={styles.sample}>{c.sample}</span>
              </div>
              <strong>{c.appointmentConfirmed}</strong>
              <p>
                {c.appointmentDate}, {time}
              </p>
              <span className={styles.noteLink}>
                {c.seeJourney}
                <ArrowRight size={15} aria-hidden="true" />
              </span>
            </Link>
            <figcaption>
              {c.photoLabel} /{" "}
              <a
                href="https://www.pexels.com/photo/happy-mother-and-daughter-walking-in-the-park-17066530/"
                target="_blank"
                rel="noreferrer"
              >
                Danik Prihodko
              </a>
            </figcaption>
          </figure>
        </section>
        <section className={`${styles.wrap} ${styles.recognition}`}>
          <div>
            <p className={styles.eyebrow}>{c.recognitionLabel}</p>
            <h2>{c.recognitionTitle}</h2>
          </div>
          <div>
            <p>{c.recognitionBody}</p>
            <Link href="#how">
              {c.recognitionResolution}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>
        <section className={styles.journeyBand} id="how">
          <div className={`${styles.wrap} ${styles.journey}`}>
            <div className={styles.journeyIntro}>
              <p className={styles.eyebrow}>{c.journeyLabel}</p>
              <h2>{c.journeyTitle}</h2>
              <p className={styles.sectionBody}>{c.journeyBody}</p>
              <div
                className={styles.steps}
                role="group"
                aria-label={c.journeyGroup}
              >
                {([0, 1, 2] as const).map((value) => (
                  <button
                    key={value}
                    id={`journey-step-${value}`}
                    type="button"
                    aria-pressed={step === value}
                    aria-controls="journey-panel"
                    onClick={() => selectStep(value)}
                  >
                    <span className={styles.stepNumber}>0{value + 1}</span>
                    <span>
                      <strong>{c[`step${value}Title`]}</strong>
                      <span>{c[`step${value}Body`]}</span>
                    </span>
                    <ArrowRight size={18} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
            <JourneyExample
              copy={c}
              step={step}
              onStep={setStep}
              time={time}
              onTime={selectTime}
              share={share}
              onShare={setShare}
            />
          </div>
        </section>
        <section className={`${styles.wrap} ${styles.family}`} id="family">
          <figure className={styles.familyVisual}>
            <div className={styles.familyImage}>
              <Image
                src="/images/home/family-afternoon.jpg"
                alt={c.familyAlt}
                fill
                sizes="(max-width: 800px) 100vw, 45vw"
                quality={85}
              />
            </div>
            <figcaption>
              {c.photoLabel} /{" "}
              <a
                href="https://www.pexels.com/photo/smiling-mother-playing-with-daughter-at-park-20806575/"
                target="_blank"
                rel="noreferrer"
              >
                Anastasia Nagibina
              </a>
            </figcaption>
          </figure>
          <div className={styles.familyCopy}>
            <p className={styles.eyebrow}>{c.familyLabel}</p>
            <h2>{c.familyTitle}</h2>
            <p className={styles.sectionBody}>{c.familyBody}</p>
            <div
              className={styles.familyChoices}
              role="group"
              aria-label={c.familyGroup}
            >
              {(["self", "child", "parent"] as const).map((value) => (
                <button
                  key={value}
                  id={`family-${value}`}
                  type="button"
                  aria-pressed={family === value}
                  aria-controls="family-story"
                  onClick={() => setFamily(value)}
                >
                  {c[value]}
                </button>
              ))}
            </div>
            <div
              id="family-story"
              className={styles.familyStory}
              role="region"
              aria-labelledby={`family-${family}`}
              aria-live="polite"
            >
              <h3>{c[`${family}Title`]}</h3>
              <p>{c[`${family}Body`]}</p>
            </div>
            <Link
              className={styles.textLink}
              href={signedIn ? "/health-record" : "/register"}
            >
              {signedIn ? c.recordsAction : c.familyAction}
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </section>
        <section className={styles.followBand}>
          <div className={`${styles.wrap} ${styles.follow}`}>
            <div>
              <p className={styles.eyebrow}>{c.ongoingLabel}</p>
              <h2>{c.ongoingTitle}</h2>
              <p className={styles.sectionBody}>{c.ongoingBody}</p>
              <Link className={styles.textLink} href="/health-record">
                {c.recordsAction}
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <div className={styles.followSteps}>
              {([FileText, CalendarDays, Pill] as const).map((Icon, index) => (
                <article key={index}>
                  <span className={styles.followIcon}>
                    <Icon size={21} aria-hidden="true" />
                  </span>
                  <div>
                    <h3>{c[`follow${index as 0 | 1 | 2}Title`]}</h3>
                    <p>{c[`follow${index as 0 | 1 | 2}Body`]}</p>
                    {index === 2 && (
                      <Link href="/dermanlar">
                        {c.compareMedicines}
                        <ArrowRight size={15} aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className={`${styles.wrap} ${styles.privacy}`} id="questions">
          <div>
            <LockKeyhole className={styles.lock} size={27} aria-hidden="true" />
            <h2>{c.privacyTitle}</h2>
            <p className={styles.sectionBody}>{c.privacyBody}</p>
            <Link className={styles.textLink} href="/privacy-policy">
              {c.privacyAction}
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className={styles.faq}>
            <h3>{c.faqTitle}</h3>
            {([1, 2, 3, 4] as const).map((index) => (
              <details key={index}>
                <summary>
                  {c[`faq${index}q`]}
                  <ChevronDown size={17} aria-hidden="true" />
                </summary>
                <p>{c[`faq${index}a`]}</p>
              </details>
            ))}
          </div>
        </section>
        <section className={`${styles.wrap} ${styles.closing}`}>
          <div>
            <h2>{c.closingTitle}</h2>
            <p>{c.closingBody}</p>
          </div>
          <Link className={styles.primary} href="/chat">
            {c.ask}
            <ArrowUpRight size={19} aria-hidden="true" />
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
