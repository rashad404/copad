"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import ProductLayout from "@/components/public/ProductLayout";
import { useAuth } from "@/context/AuthContext";
import {
  getMyListing,
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
import { localeFor } from "@/components/booking/copy";
import { portalCopy } from "@/components/booking/portalCopy";
import styles from "@/components/booking/portal.module.css";

const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

export default function DoctorPortal() {
  const { i18n } = useTranslation();
  const language = (supportedLanguage(i18n.language) ||
    "az") as DirectoryLanguage;
  const c = portalCopy(language);
  const locale = localeFor(language);
  const { isAuthenticated } = useAuth();

  const [listing, setListing] = useState<MyListing | null | undefined>(
    undefined,
  );
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>([]);
  const [bookings, setBookings] = useState<DoctorBooking[]>([]);
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "13:00",
    slotMinutes: 20,
  });

  const loadSchedule = useCallback(async () => {
    const [a, b] = await Promise.all([
      getAvailability().catch(() => []),
      getMyBookings().catch(() => []),
    ]);
    setBlocks(a);
    setBookings(b);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const controller = new AbortController();
    getMyListing(controller.signal)
      .then((mine) => {
        setListing(mine);
        if (mine) void loadSchedule();
      })
      .catch(() => setListing(null));
    return () => controller.abort();
  }, [isAuthenticated, loadSchedule]);

  const dayNames = useMemo(() => {
    const format = new Intl.DateTimeFormat(locale, { weekday: "long" });
    // 2024-01-07 was a Sunday, so index 0 lands on Sunday as the API numbers it.
    return Array.from({ length: 7 }, (_, i) =>
      format.format(new Date(Date.UTC(2024, 0, 7 + i))),
    );
  }, [locale]);

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

  const when = (value: string) =>
    `${new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
      new Date(`${dayOf(value)}T12:00:00Z`),
    )}, ${timeOf(value)}`;

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
            <Link className={styles.primary} href="/hekimler">
              {c.findListing}
            </Link>
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
