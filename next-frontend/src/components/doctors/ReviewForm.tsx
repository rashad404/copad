"use client";

import { useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import api from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import { doctorCopy, type DirectoryLanguage } from "./copy";
import styles from "./directory.module.css";

/**
 * Writing a review.
 *
 * Open to somebody with no account, because most people who have just been to
 * a clinic do not have one. What that costs is moderation: a guest review is
 * read by a person before it appears, and the form says so before anybody
 * spends time writing.
 */
export default function ReviewForm({
  slug,
  doctorName,
  specialty,
  photoUrl,
  language,
}: {
  slug: string;
  doctorName: string;
  specialty?: string | null;
  photoUrl?: string | null;
  language: DirectoryLanguage;
}) {
  const c = doctorCopy(language);
  const { isAuthenticated, user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<null | { published: boolean }>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    if (rating < 1) {
      setError(c.ratingRequired);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { data } = await api.post<{ published: boolean }>(
        `/doctors/${encodeURIComponent(slug)}/reviews`,
        {
          rating,
          comment: comment.trim() || null,
          authorName: name.trim() || user?.name || "",
        },
      );
      setDone({ published: !!data.published });
    } catch (failure: unknown) {
      // The two refusals a person can act on are told apart; everything else
      // is one message, because nothing else is their fault.
      const status = (failure as { response?: { status?: number } })?.response
        ?.status;
      const message = (
        failure as { response?: { data?: { error?: string } } }
      )?.response?.data?.error;
      if (status === 409 && message?.includes("already")) {
        setError(c.alreadyReviewed);
      } else if (status === 409) {
        setError(c.tooMany);
      } else {
        setError(c.reviewFailed);
      }
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className={styles.reviewDone} role="status">
        <p>{done.published ? c.thanksPublished : c.thanksPending}</p>
        <Link className={styles.secondary} href={`/hekimler/${slug}`}>
          {c.view}
        </Link>
      </div>
    );
  }

  return (
    <form className={styles.reviewForm} onSubmit={submit}>
      <div className={styles.reviewAbout}>
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt="" className={styles.reviewPortrait} />
        ) : (
          <span className={styles.reviewPortrait} aria-hidden="true">
            {doctorName.slice(0, 1)}
          </span>
        )}
        <span>
          <strong>{doctorName}</strong>
          {specialty && <span className={styles.muted}>{specialty}</span>}
        </span>
      </div>
      <fieldset className={styles.stars}>
        <legend>{c.yourRating}</legend>
        <div className={styles.starRow}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              className={styles.starButton}
              aria-label={c.ratingWords[value - 1]}
              aria-pressed={rating === value}
              onMouseEnter={() => setHover(value)}
              onMouseLeave={() => setHover(0)}
              onFocus={() => setHover(value)}
              onBlur={() => setHover(0)}
              onClick={() => {
                setRating(value);
                setError(null);
              }}
            >
              <Star
                size={34}
                strokeWidth={1.5}
                fill={(hover || rating) >= value ? "currentColor" : "none"}
                className={
                  (hover || rating) >= value ? styles.starOn : styles.starOff
                }
              />
            </button>
          ))}
          {/* The word, so a person is not counting stars to check themselves. */}
          <span className={styles.ratingWord}>
            {(hover || rating) > 0 ? c.ratingWords[(hover || rating) - 1] : ""}
          </span>
        </div>
      </fieldset>

      <label className={styles.reviewField}>
        <span>{c.yourName}</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={120}
          required={!isAuthenticated}
          placeholder={user?.name || ""}
        />
      </label>

      <label className={styles.reviewField}>
        <span>{c.yourComment}</span>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={5}
          maxLength={2000}
          placeholder={c.commentHint}
        />
      </label>

      {!isAuthenticated && (
        <p className={styles.muted}>
          {c.signedInHint}{" "}
          <Link className={styles.closedClaim} href="/login">
            {c.signInLink}
          </Link>
        </p>
      )}

      {error && (
        <p role="alert" className={styles.reviewError}>
          {error}
        </p>
      )}

      <button className={styles.book} type="submit" disabled={busy}>
        {busy ? c.sending : c.send}
      </button>
    </form>
  );
}
