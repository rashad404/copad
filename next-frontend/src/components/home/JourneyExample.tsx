"use client";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CalendarDays,
  FileText,
  MapPin,
  Paperclip,
  Stethoscope,
} from "lucide-react";
import type { HomeCopy } from "./copy";
import styles from "./homepage.module.css";
export const sampleTimes = ["10:00", "11:30", "14:00"];
export type JourneyStep = 0 | 1 | 2;
export default function JourneyExample({
  copy: c,
  step,
  onStep,
  time,
  onTime,
  share,
  onShare,
}: {
  copy: HomeCopy;
  step: JourneyStep;
  onStep: (step: JourneyStep) => void;
  time: string;
  onTime: (value: string) => void;
  share: boolean;
  onShare: (value: boolean) => void;
}) {
  return (
    <div className={styles.demo} id="care-example">
      <div className={styles.demoTop}>
        <span className={styles.demoBrand}>azdoc</span>
        <span>{c.demoPerson}</span>
        <span className={styles.sample}>{c.sample}</span>
      </div>
      <div
        className={styles.demoScreen}
        id="journey-panel"
        role="region"
        aria-labelledby={`journey-step-${step}`}
      >
        {step === 0 ? (
          <>
            <div className={styles.context}>
              <p>{c.contextLabel}</p>
              <div>
                <span>{c.lab}</span>
                <span>{c.medication}</span>
              </div>
            </div>
            <p className={styles.question}>{c.question}</p>
            <div className={styles.answer}>
              <span aria-hidden="true">a</span>
              <p>{c.answer}</p>
            </div>
            <p className={styles.source}>
              <Paperclip size={14} aria-hidden="true" />
              {c.answerSource}
            </p>
            <button
              className={styles.demoAction}
              type="button"
              onClick={() => onStep(1)}
            >
              {c.showTimes}
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </>
        ) : step === 1 ? (
          <>
            <div className={styles.doctor}>
              <span>
                <Stethoscope size={26} aria-hidden="true" />
              </span>
              <div>
                <h3>{c.doctorType}</h3>
                <p>
                  <MapPin size={13} aria-hidden="true" />
                  {c.clinic}
                </p>
              </div>
            </div>
            <div className={styles.visitDate}>
              <CalendarDays size={18} aria-hidden="true" />
              <strong>{c.appointmentDate}</strong>
              <span>{c.demoPerson}</span>
            </div>
            <div
              className={styles.times}
              role="group"
              aria-label={c.chooseTime}
            >
              {sampleTimes.map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={time === value}
                  onClick={() => onTime(value)}
                >
                  {value}
                </button>
              ))}
            </div>
            <p className={styles.timeStatus} role="status">
              {c.timeSelected}: {time}
            </p>
            <p className={styles.requestNote}>{c.requestNote}</p>
            <button
              className={styles.demoAction}
              type="button"
              onClick={() => onStep(2)}
            >
              {c.nextExample}
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </>
        ) : (
          <>
            <div className={styles.confirmation}>
              <span>
                <Check size={17} aria-hidden="true" />
                {c.confirmedByDoctor}
              </span>
              <strong>
                {c.appointmentDate}, {time}
              </strong>
              <p>
                {c.doctorType} / {c.demoPerson}
              </p>
            </div>
            <div className={styles.summary}>
              <h3>
                <FileText size={17} aria-hidden="true" />
                {c.summary}
              </h3>
              {[c.lab, c.medication, c.measurements].map((label) => (
                <div key={label}>
                  <span>{label}</span>
                  <span>
                    <Check size={13} aria-hidden="true" />
                    {c.inSummary}
                  </span>
                </div>
              ))}
            </div>
            <label className={styles.share}>
              <input
                type="checkbox"
                checked={share}
                onChange={(e) => onShare(e.target.checked)}
              />
              <span>{c.share}</span>
            </label>
            <p className={styles.shareStatus} role="status">
              {share ? c.sharedExample : c.privateExample}
            </p>
            <Link className={styles.demoAction} href="/hekimler">
              {c.findDoctor}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </>
        )}
      </div>
      <p className={styles.demoCaption}>{c.demoCaption}</p>
    </div>
  );
}
