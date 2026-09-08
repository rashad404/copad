"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import ProductLayout from "@/components/public/ProductLayout";
import { useAuth } from "@/context/AuthContext";
import { healthApi, type Member } from "@/api/healthRecord";
import {
  listBookings,
  cancelBooking,
  dayOf,
  timeOf,
  type Booking,
} from "@/api/booking";
import { supportedLanguage } from "@/utils/languages";
import type { DirectoryLanguage } from "@/components/doctors/copy";
import { bookingCopy, fullDate } from "@/components/booking/copy";
import styles from "@/components/booking/appointments.module.css";

/** An appointment with the person it belongs to, which the API does not repeat. */
type Row = Booking & { member: Member };

export default function MyAppointments() {
  const { i18n } = useTranslation();
  const language = (supportedLanguage(i18n.language) ||
    "az") as DirectoryLanguage;
  const c = bookingCopy(language);
  const { isAuthenticated } = useAuth();

  const [rows, setRows] = useState<Row[] | null>(null);
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const families = await healthApi.families().catch(() => []);
    const members = families.flatMap((f) => f.members);
    // Bookings hang off a family member, so the list is assembled per member
    // rather than fetched once - a parent booking for a child needs both.
    const perMember = await Promise.all(
      members.map((member) =>
        listBookings(member.id)
          .then((list) => list.map((b) => ({ ...b, member })))
          .catch(() => [] as Row[]),
      ),
    );
    setRows(perMember.flat().sort((a, b) => a.startsAt.localeCompare(b.startsAt)));
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    void load();
  }, [isAuthenticated, load]);

  const now = new Date().toISOString().slice(0, 19);
  const { upcoming, past } = useMemo(() => {
    const all = rows ?? [];
    return {
      upcoming: all.filter(
        (b) => b.startsAt >= now && b.status !== "CANCELLED",
      ),
      past: all
        .filter((b) => b.startsAt < now || b.status === "CANCELLED")
        .reverse(),
    };
  }, [rows, now]);

  async function cancel(row: Row) {
    if (!window.confirm(c.cancelConfirm)) return;
    setBusy(row.id);
    setError(null);
    try {
      await cancelBooking(row.member.id, row.id);
      await load();
    } catch {
      setError(c.cancelFailed);
    } finally {
      setBusy(null);
    }
  }

  const when = (value: string) =>
    `${fullDate(dayOf(value), language)}, ${timeOf(value)}`;

  const card = (row: Row, canCancel: boolean) => (
    <li key={row.id} className={styles.card}>
      <div className={styles.when}>{when(row.startsAt)}</div>
      <div className={styles.who}>
        {row.doctorSlug ? (
          <Link href={`/hekimler/${row.doctorSlug}`}>{row.doctorName}</Link>
        ) : (
          row.doctorName
        )}
      </div>
      <dl className={styles.meta}>
        <div>
          <dt>{c.forWhom}</dt>
          <dd>{row.member.fullName}</dd>
        </div>
        {row.clinicName && (
          <div>
            <dt>{c.at}</dt>
            <dd>
              {row.clinicName}
              {row.clinicAddress ? `, ${row.clinicAddress}` : ""}
            </dd>
          </div>
        )}
      </dl>
      {row.reason && <p className={styles.reason}>{row.reason}</p>}
      <div className={styles.footer}>
        <span className={`${styles.status} ${styles[row.status] || ""}`}>
          {c[row.status]}
        </span>
        {row.sharedRecord && <span className={styles.shared}>{c.shared}</span>}
        {canCancel && (
          <button
            type="button"
            className={styles.cancel}
            disabled={busy === row.id}
            onClick={() => cancel(row)}
          >
            {busy === row.id ? c.cancelling : c.cancel}
          </button>
        )}
      </div>
    </li>
  );

  return (
    <ProductLayout>
      <div className={styles.page} lang={language}>
        <h1>{c.pageTitle}</h1>

        {!isAuthenticated ? (
          <p>
            {c.signIn}{" "}
            <Link className={styles.link} href="/login">
              {c.signInLink}
            </Link>
          </p>
        ) : rows === null ? (
          <p className={styles.muted}>{c.loading}</p>
        ) : rows.length === 0 ? (
          <>
            <p className={styles.emptyTitle}>{c.empty}</p>
            <p className={styles.muted}>{c.emptyNote}</p>
            <Link className={styles.primary} href="/hekimler">
              {c.findDoctor}
            </Link>
          </>
        ) : (
          <>
            {error && (
              <p role="alert" className={styles.error}>
                {error}
              </p>
            )}
            {upcoming.length > 0 && (
              <section>
                <h2>{c.upcoming}</h2>
                <ul className={styles.list}>
                  {upcoming.map((row) => card(row, true))}
                </ul>
              </section>
            )}
            {past.length > 0 && (
              <section>
                <h2>{c.past}</h2>
                <ul className={styles.list}>
                  {past.map((row) => card(row, false))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </ProductLayout>
  );
}
