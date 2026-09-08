"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  FileText,
  MessageSquare,
  Paperclip,
} from "lucide-react";
import type { HomeCopy } from "./copy";
import { exampleMembers, type ExampleMember } from "./examples";
import styles from "./homepage.module.css";
export function MemberChoices({
  member,
  onSelect,
  copy,
  label,
}: {
  member: ExampleMember;
  onSelect: (id: string) => void;
  copy: HomeCopy;
  label?: string;
}) {
  return (
    <div
      className={styles.members}
      role="group"
      aria-label={label || copy.memberLabel}
    >
      {exampleMembers.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-pressed={item.id === member.id}
          onClick={() => onSelect(item.id)}
        >
          <span className={styles.smallAvatar} aria-hidden="true">
            {item.name[0]}
          </span>
          {item.name}
          <span className={styles.relationship}>{copy[item.relationship]}</span>
        </button>
      ))}
    </div>
  );
}
export function SummarySheet({
  member,
  copy,
  compact = false,
}: {
  member: ExampleMember;
  copy: HomeCopy;
  compact?: boolean;
}) {
  return (
    <div
      className={`${styles.summarySheet} ${compact ? styles.compactSheet : ""}`}
    >
      <div className={styles.sheetTop}>
        <span>azdoc</span>
        <span>{copy.sample} / PDF</span>
      </div>
      <h3>{copy.summary}</h3>
      <p className={styles.sheetPerson}>
        {member.name}
        <span>{copy.sampleDate}</span>
      </p>
      <dl>
        {(["allergy", "medication"] as const).map((key) => (
          <div key={key}>
            <dt>{copy[key]}</dt>
            <dd>{copy[member[key]]}</dd>
          </div>
        ))}
        <div>
          <dt>{copy.hemoglobin}</dt>
          <dd>{member.results.at(-1)?.toFixed(1)} g/dL</dd>
        </div>
      </dl>
      <div className={styles.sheetSource}>
        <Paperclip size={13} aria-hidden="true" />
        {copy.sourceValue}
      </div>
    </div>
  );
}
export default function ProductExample({
  member,
  onSelect,
  copy,
}: {
  member: ExampleMember;
  onSelect: (id: string) => void;
  copy: HomeCopy;
}) {
  const [step, setStep] = useState<"record" | "answer" | "visit">("answer");
  return (
    <div className={styles.stage} id="demo">
      <div className={styles.stageHeading}>
        <span>{copy.demoTitle}</span>
        <span className={styles.sampleTag}>{copy.sample}</span>
      </div>
      <div className={styles.productWindow}>
        <div className={styles.productIdentity}>
          <span className={styles.avatar} aria-hidden="true">
            {member.name[0]}
          </span>
          <div>
            <strong>{member.name}</strong>
            <span>{copy[member.relationship]}</span>
          </div>
          <span className={styles.productWordmark}>azdoc</span>
        </div>
        <MemberChoices member={member} onSelect={onSelect} copy={copy} />
        <div
          className={styles.demoSteps}
          role="group"
          aria-label={copy.demoTitle}
        >
          {(["record", "answer", "visit"] as const).map((value, index) => (
            <button
              type="button"
              key={value}
              aria-pressed={step === value}
              onClick={() => setStep(value)}
            >
              <span>0{index + 1}</span>
              {copy[`${value}Tab`]}
            </button>
          ))}
        </div>
        <div
          className={styles.demoContent}
          aria-live="polite"
          aria-atomic="true"
        >
          {step === "record" ? (
            <>
              <div className={styles.recordLabel}>
                <FileText size={18} aria-hidden="true" />
                <strong>{copy.labTitle}</strong>
                <span className={styles.reviewed}>
                  <Check size={12} aria-hidden="true" />
                  {copy.checked}
                </span>
              </div>
              <div className={styles.labValue}>
                <span>
                  {copy.hemoglobin}
                  <small>{copy.sampleDate}</small>
                </span>
                <strong>
                  {member.results.at(-1)?.toFixed(1)} <small>g/dL</small>
                </strong>
              </div>
              <p className={styles.fileSource}>
                <Paperclip size={13} aria-hidden="true" />
                {copy.sourceValue}
              </p>
              <dl className={styles.recordFacts}>
                <div>
                  <dt>{copy.allergy}</dt>
                  <dd>{copy[member.allergy]}</dd>
                </div>
                <div>
                  <dt>{copy.medication}</dt>
                  <dd>{copy[member.medication]}</dd>
                </div>
              </dl>
              <button
                className={styles.demoAction}
                type="button"
                onClick={() => setStep("answer")}
              >
                {copy.askResult}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </>
          ) : step === "answer" ? (
            <>
              <p className={styles.contextLabel}>{copy.contextLabel}</p>
              <div className={styles.contextTags}>
                <span>
                  <FileText size={12} aria-hidden="true" />
                  {copy.labTitle}
                </span>
                <span>{copy.allergy}</span>
                <span>{copy.medication}</span>
              </div>
              <div className={styles.questionBubble}>{copy.question}</div>
              <div className={styles.answer}>
                <span className={styles.answerMark} aria-hidden="true">
                  a
                </span>
                <p>{copy[member.answer]}</p>
              </div>
              <div className={styles.answerSource}>
                <Check size={12} aria-hidden="true" />
                {copy.checked}: {copy.sourceValue}
              </div>
              <button
                className={styles.demoAction}
                type="button"
                onClick={() => setStep("visit")}
              >
                {copy.prepareVisit}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </>
          ) : (
            <>
              <SummarySheet member={member} copy={copy} compact />
              <p className={styles.visitHint}>{copy.summaryHint}</p>
              <Link className={styles.demoAction} href="#care">
                {copy.prepareVisit}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </>
          )}
        </div>
      </div>
      <div className={styles.stageFoot}>
        <MessageSquare size={16} aria-hidden="true" />
        <span>{copy.sampleCaption}</span>
      </div>
    </div>
  );
}
