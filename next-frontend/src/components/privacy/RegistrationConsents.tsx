"use client";
import { usePrivacyCopy } from "./usePrivacyCopy";
import styles from "./privacy.module.css";
export default function RegistrationConsents({
  storage,
  ai,
  onChange,
}: {
  storage: boolean;
  ai: boolean;
  onChange: (key: "storage" | "ai", value: boolean) => void;
}) {
  const { p } = usePrivacyCopy();
  return (
    <fieldset className={styles.choices}>
      <legend>{p.title}</legend>
      <label className={styles.check}>
        <input
          type="checkbox"
          checked={storage}
          onChange={(e) => onChange("storage", e.target.checked)}
        />
        <span>{p.storageConsent}</span>
      </label>
      <label className={styles.check}>
        <input
          type="checkbox"
          checked={ai}
          onChange={(e) => onChange("ai", e.target.checked)}
        />
        <span>{p.aiConsent}</span>
      </label>
      <p>
        {p.separate} {!ai && p.noAi}
      </p>
    </fieldset>
  );
}
