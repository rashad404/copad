"use client";

import { useState } from "react";
import api from "@/api/axios";
import { claimListing, type MyListing } from "@/api/doctorSelf";
import type { DirectoryLanguage } from "@/components/doctors/copy";
import { portalCopy } from "./portalCopy";
import styles from "./portal.module.css";

type Match = {
  id: number;
  slug: string;
  fullName: string;
  specialtyCode: string | null;
  verification: string;
  clinics: { name: string; city: string | null }[];
};

/**
 * How a doctor gets hold of their own listing.
 *
 * Most entries in the directory were built from what a hospital publishes, so
 * the doctor they describe has never had an account here. Without this the
 * panel was unreachable for exactly the people it is for: the endpoint existed
 * and nothing called it.
 *
 * Claiming asserts nothing. It puts the listing under review and it still takes
 * no appointments until somebody has checked who this is.
 */
export default function ClaimListing({
  language,
  onClaimed,
}: {
  language: DirectoryLanguage;
  onClaimed: (listing: MyListing) => void;
}) {
  const c = portalCopy(language);
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [chosen, setChosen] = useState<Match | null>(null);
  const [evidence, setEvidence] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function search() {
    if (query.trim().length < 2) return;
    setBusy(true);
    setError(null);
    try {
      const { data } = await api.get<{ content: Match[] }>("/doctors", {
        params: { q: query.trim(), size: 20 },
      });
      setMatches(data.content ?? []);
    } catch {
      setError(c.claimFailed);
    } finally {
      setBusy(false);
    }
  }

  async function submit() {
    if (!chosen) return;
    setBusy(true);
    setError(null);
    try {
      const listing = await claimListing(chosen.id, evidence.trim());
      setDone(true);
      onClaimed(listing);
    } catch {
      setError(c.claimFailed);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <p className={styles.notice} role="status">
        {c.claimDone}
      </p>
    );
  }

  return (
    <section>
      <h2>{c.claimTitle}</h2>
      <p className={styles.muted}>{c.claimNote}</p>

      <div className={styles.addRow}>
        <label style={{ flex: "1 1 240px" }}>
          <span>{c.claimSearch}</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void search();
              }
            }}
          />
        </label>
        <button
          type="button"
          className={styles.primary}
          disabled={busy || query.trim().length < 2}
          onClick={search}
        >
          {c.claimFind}
        </button>
      </div>

      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}

      {matches !== null && matches.length === 0 && (
        <p className={styles.muted}>{c.claimNone}</p>
      )}

      {matches !== null && matches.length > 0 && (
        <ul className={styles.blocks}>
          {matches.map((match) => (
            <li key={match.id}>
              <span className={styles.day}>{match.fullName}</span>
              <span className={styles.muted}>
                {match.clinics.map((clinic) => clinic.name).join(", ")}
              </span>
              <button
                type="button"
                className={
                  chosen?.id === match.id ? styles.confirm : styles.remove
                }
                onClick={() => setChosen(match)}
              >
                {c.claimButton}
              </button>
            </li>
          ))}
        </ul>
      )}

      {chosen && (
        <div className={styles.addRow} style={{ flexDirection: "column" }}>
          <label style={{ width: "100%" }}>
            <span>
              {c.claimEvidence} <em>{c.claimEvidenceHint}</em>
            </span>
            <textarea
              rows={3}
              maxLength={1000}
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>
          <button
            type="button"
            className={styles.primary}
            disabled={busy}
            onClick={submit}
          >
            {busy ? c.claimSending : c.claimSubmit}
          </button>
        </div>
      )}
    </section>
  );
}
