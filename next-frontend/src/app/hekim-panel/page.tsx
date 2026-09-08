"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import ProductLayout from "@/components/public/ProductLayout";
import { useAuth } from "@/context/AuthContext";
import {
  getMyListing,
  updateMyListing,
  getTimeOff,
  addTimeOff,
  removeTimeOff,
  type TimeOff,
  getAvailability,
  addAvailability,
  removeAvailability,
  getMyBookings,
  confirmBooking,
  declineBooking,
  type MyListing,
  type AvailabilityBlock,
  type DoctorBooking,
} from "@/api/doctorSelf";
import { dayOf, timeOf } from "@/api/booking";
import { supportedLanguage } from "@/utils/languages";
import type { DirectoryLanguage } from "@/components/doctors/copy";
import { shortDate, weekdayNames } from "@/components/booking/copy";
import { portalCopy } from "@/components/booking/portalCopy";
import ClaimListing from "@/components/booking/ClaimListing";
import styles from "@/components/booking/portal.module.css";

const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

export default function DoctorPortal() {
  const { i18n } = useTranslation();
  const language = (supportedLanguage(i18n.language) ||
    "az") as DirectoryLanguage;
  const c = portalCopy(language);
  const { isAuthenticated } = useAuth();

  const [listing, setListing] = useState<MyListing | null | undefined>(
    undefined,
  );
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>([]);
  const [bookings, setBookings] = useState<DoctorBooking[]>([]);
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [away, setAway] = useState<TimeOff[]>([]);
  const [savedNote, setSavedNote] = useState(false);
  const [profile, setProfile] = useState({
    bio: "",
    qualifications: "",
    consultationFee: "",
    languages: "",
  });
  const [awayForm, setAwayForm] = useState({ from: "", to: "", reason: "" });

  const [form, setForm] = useState({
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "13:00",
    slotMinutes: 20,
  });

  const loadSchedule = useCallback(async () => {
    const [a, b, t] = await Promise.all([
      getAvailability().catch(() => []),
      getMyBookings().catch(() => []),
      getTimeOff().catch(() => []),
    ]);
    setBlocks(a);
    setBookings(b);
    setAway(t);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const controller = new AbortController();
    getMyListing(controller.signal)
      .then((mine) => {
        setListing(mine);
        if (mine) {
          setProfile({
            bio: mine.bio ?? "",
            qualifications: mine.qualifications ?? "",
            consultationFee:
              mine.consultationFee == null ? "" : String(mine.consultationFee),
            languages: (mine.languages ?? []).join(", "),
          });
          void loadSchedule();
        }
      })
      .catch(() => setListing(null));
    return () => controller.abort();
  }, [isAuthenticated, loadSchedule]);

  const dayNames = useMemo(() => weekdayNames(language), [language]);

  async function add() {
    if (form.startTime >= form.endTime) {
      setError(c.badRange);
      return;
    }
    setError(null);
    setBusy(-1);
    try {
      await addAvailability({
        dayOfWeek: form.dayOfWeek,
        startTime: `${form.startTime}:00`,
        endTime: `${form.endTime}:00`,
        slotMinutes: form.slotMinutes,
      });
      await loadSchedule();
    } catch {
      setError(c.addFailed);
    } finally {
      setBusy(null);
    }
  }

  async function remove(id: number) {
    if (!window.confirm(c.removeConfirm)) return;
    setBusy(id);
    setError(null);
    try {
      await removeAvailability(id);
      await loadSchedule();
    } catch {
      setError(c.removeFailed);
    } finally {
      setBusy(null);
    }
  }

  async function decide(id: number, accept: boolean) {
    if (!accept && !window.confirm(c.declineConfirm)) return;
    setBusy(id);
    setError(null);
    try {
      if (accept) await confirmBooking(id);
      else await declineBooking(id);
      await loadSchedule();
    } catch {
      setError(c.decideFailed);
    } finally {
      setBusy(null);
    }
  }

  async function saveProfile() {
    setBusy(-2);
    setError(null);
    setSavedNote(false);
    try {
      const updated = await updateMyListing({
        bio: profile.bio.trim() || null,
        qualifications: profile.qualifications.trim() || null,
        consultationFee: profile.consultationFee
          ? Number(profile.consultationFee)
          : null,
        languages: profile.languages
          .split(",")
          .map((l) => l.trim().toLowerCase())
          .filter(Boolean),
      });
      setListing(updated);
      setSavedNote(true);
    } catch {
      setError(c.saveFailed);
    } finally {
      setBusy(null);
    }
  }

  async function blockTime() {
    if (!awayForm.from || !awayForm.to || awayForm.from >= awayForm.to) {
      setError(c.timeOffBadRange);
      return;
    }
    setBusy(-3);
    setError(null);
    try {
      await addTimeOff({
        startsAt: `${awayForm.from}:00`,
        endsAt: `${awayForm.to}:00`,
        reason: awayForm.reason.trim() || null,
      });
      setAwayForm({ from: "", to: "", reason: "" });
      await loadSchedule();
    } catch {
      setError(c.timeOffFailed);
    } finally {
      setBusy(null);
    }
  }

  async function unblockTime(id: number) {
    setBusy(id);
    try {
      await removeTimeOff(id);
      await loadSchedule();
    } catch {
      setError(c.timeOffFailed);
    } finally {
      setBusy(null);
    }
  }

  const when = (value: string) =>
    `${shortDate(dayOf(value), language)}, ${timeOf(value)}`;

  if (!isAuthenticated) {
    return (
      <ProductLayout>
        <div className={styles.page}>
          <h1>{c.title}</h1>
          <p>
            {c.signIn}{" "}
            <Link className={styles.link} href="/login">
              {c.signInLink}
            </Link>
          </p>
        </div>
      </ProductLayout>
    );
  }

  return (
    <ProductLayout>
      <div className={styles.page} lang={language}>
        <h1>{c.title}</h1>

        {listing === undefined ? (
          <p className={styles.muted}>{c.loading}</p>
        ) : listing === null ? (
          <>
            <p className={styles.emptyTitle}>{c.noListing}</p>
            <p className={styles.muted}>{c.noListingNote}</p>
            {/*
              The claim flow itself, rather than a link to the directory and a
              hope. Sending people to browse and work it out was the reason no
              doctor could reach this panel.
            */}
            <Suspense fallback={null}>
              <ClaimListing language={language} onClaimed={setListing} />
            </Suspense>
          </>
        ) : (
          <>
            <section className={styles.listing}>
              <div>
                <strong>{listing.fullName}</strong>
                <div className={styles.muted}>
                  {c[listing.verification] ?? listing.verification}
                </div>
              </div>
              <Link className={styles.link} href={`/hekimler/${listing.slug}`}>
                {c.viewProfile}
              </Link>
            </section>

            {/*
              Said plainly rather than hidden: availability can be filled in
              while a listing is under review, but nothing can be booked into
              it until somebody has checked who this is.
            */}
            {!listing.acceptsBookings && (
              <p className={styles.notice}>{c.notBookable}</p>
            )}

            {error && (
              <p role="alert" className={styles.error}>
                {error}
              </p>
            )}

            <h2>{c.profile}</h2>
            <div className={styles.addRow} style={{ flexDirection: "column" }}>
              <label style={{ width: "100%" }}>
                <span>{c.bio}</span>
                <textarea
                  rows={3}
                  maxLength={2000}
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  style={{ width: "100%" }}
                />
              </label>
              <label style={{ width: "100%" }}>
                <span>{c.qualifications}</span>
                <textarea
                  rows={2}
                  maxLength={1000}
                  value={profile.qualifications}
                  onChange={(e) =>
                    setProfile({ ...profile, qualifications: e.target.value })
                  }
                  style={{ width: "100%" }}
                />
              </label>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <label>
                  <span>{c.fee}</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={profile.consultationFee}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        consultationFee: e.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  <span>{c.languages}</span>
                  <input
                    placeholder="az, ru, en"
                    value={profile.languages}
                    onChange={(e) =>
                      setProfile({ ...profile, languages: e.target.value })
                    }
                  />
                </label>
              </div>
              <button
                type="button"
                className={styles.primary}
                disabled={busy === -2}
                onClick={saveProfile}
              >
                {busy === -2 ? c.saving : c.save}
              </button>
              {savedNote && (
                <span className={styles.muted} role="status">
                  {c.saved}
                </span>
              )}
            </div>

            <h2>{c.timeOff}</h2>
            <p className={styles.muted}>
              {c.timeOffNote} {c.existingKept}
            </p>
            {away.length === 0 ? (
              <p className={styles.muted}>{c.timeOffNone}</p>
            ) : (
              <ul className={styles.blocks}>
                {away.map((period) => (
                  <li key={period.id}>
                    <span className={styles.range}>
                      {when(period.startsAt)} - {when(period.endsAt)}
                    </span>
                    <span className={styles.muted}>{period.reason}</span>
                    <button
                      type="button"
                      className={styles.remove}
                      disabled={busy === period.id}
                      onClick={() => unblockTime(period.id)}
                    >
                      {c.timeOffRemove}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className={styles.addRow}>
              <label>
                <span>{c.timeOffFrom}</span>
                <input
                  type="datetime-local"
                  value={awayForm.from}
                  onChange={(e) =>
                    setAwayForm({ ...awayForm, from: e.target.value })
                  }
                />
              </label>
              <label>
                <span>{c.timeOffTo}</span>
                <input
                  type="datetime-local"
                  value={awayForm.to}
                  onChange={(e) =>
                    setAwayForm({ ...awayForm, to: e.target.value })
                  }
                />
              </label>
              <label>
                <span>{c.timeOffReason}</span>
                <input
                  value={awayForm.reason}
                  onChange={(e) =>
                    setAwayForm({ ...awayForm, reason: e.target.value })
                  }
                />
              </label>
              <button
                type="button"
                className={styles.primary}
                disabled={busy === -3}
                onClick={blockTime}
              >
                {busy === -3 ? c.adding : c.timeOffAdd}
              </button>
            </div>

            <h2>{c.hours}</h2>
            <p className={styles.muted}>{c.hoursNote}</p>

            {blocks.length === 0 ? (
              <p className={styles.muted}>{c.noHours}</p>
            ) : (
              <ul className={styles.blocks}>
                {[...blocks]
                  .sort(
                    (a, b) =>
                      DAY_ORDER.indexOf(a.dayOfWeek) -
                        DAY_ORDER.indexOf(b.dayOfWeek) ||
                      a.startTime.localeCompare(b.startTime),
                  )
                  .map((block) => (
                    <li key={block.id}>
                      <span className={styles.day}>
                        {dayNames[block.dayOfWeek]}
                      </span>
                      <span className={styles.range}>
                        {block.startTime.slice(0, 5)} -{" "}
                        {block.endTime.slice(0, 5)}
                      </span>
                      <span className={styles.muted}>
                        {block.slotMinutes} {c.minutes}
                      </span>
                      <button
                        type="button"
                        className={styles.remove}
                        disabled={busy === block.id}
                        onClick={() => remove(block.id)}
                      >
                        {c.remove}
                      </button>
                    </li>
                  ))}
              </ul>
            )}

            <div className={styles.addRow}>
              <label>
                <span>{c.day}</span>
                <select
                  value={form.dayOfWeek}
                  onChange={(e) =>
                    setForm({ ...form, dayOfWeek: Number(e.target.value) })
                  }
                >
                  {DAY_ORDER.map((d) => (
                    <option key={d} value={d}>
                      {dayNames[d]}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>{c.from}</span>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) =>
                    setForm({ ...form, startTime: e.target.value })
                  }
                />
              </label>
              <label>
                <span>{c.to}</span>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                />
              </label>
              <label>
                <span>{c.slotLength}</span>
                <select
                  value={form.slotMinutes}
                  onChange={(e) =>
                    setForm({ ...form, slotMinutes: Number(e.target.value) })
                  }
                >
                  {[10, 15, 20, 30, 45, 60].map((m) => (
                    <option key={m} value={m}>
                      {m} {c.minutes}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                className={styles.primary}
                disabled={busy === -1}
                onClick={add}
              >
                {busy === -1 ? c.adding : c.add}
              </button>
            </div>

            <h2>{c.appointments}</h2>
            {bookings.length === 0 ? (
              <p className={styles.muted}>{c.noAppointments}</p>
            ) : (
              <ul className={styles.bookings}>
                {bookings.map((b) => (
                  <li key={b.id}>
                    <div className={styles.when}>{when(b.startsAt)}</div>
                    <div>{b.patientName}</div>
                    {b.reason && <p className={styles.reason}>{b.reason}</p>}
                    <div className={styles.footer}>
                      <span
                        className={`${styles.status} ${styles[b.status] || ""}`}
                      >
                        {c[b.status] ?? b.status}
                      </span>
                      {b.recordShared && (
                        <span className={styles.muted}>{c.recordShared}</span>
                      )}
                      {b.status === "REQUESTED" && (
                        <button
                          type="button"
                          className={styles.confirm}
                          disabled={busy === b.id}
                          onClick={() => decide(b.id, true)}
                        >
                          {c.confirm}
                        </button>
                      )}
                      {(b.status === "REQUESTED" ||
                        b.status === "CONFIRMED") && (
                        <button
                          type="button"
                          className={styles.remove}
                          disabled={busy === b.id}
                          onClick={() => decide(b.id, false)}
                        >
                          {c.decline}
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </ProductLayout>
  );
}
