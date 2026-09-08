"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { healthApi, type Member } from "@/api/healthRecord";
import {
  fetchSlots,
  createBooking,
  dayOf,
  timeOf,
  type BookRequest,
} from "@/api/booking";
import type { Slot } from "@/components/doctors/model";
import type { DirectoryLanguage } from "@/components/doctors/copy";
import { bookingCopy, localeFor } from "./copy";
import styles from "./booking.module.css";

/** How far ahead the backend will generate slots. Mirrors MAX_DAYS_AHEAD. */
const MAX_DAYS_AHEAD = 60;

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

/**
 * Today, as the clinic reckons it.
 *
 * Built from the Baku calendar rather than the browser's, so somebody booking
 * from another country is offered the clinic's days and not their own.
 */
function bakuToday() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Baku",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const [y, m, d] = parts.split("-").map(Number);
  return { y, m: m - 1, d, iso: parts };
}

function addDays(isoDate: string, days: number) {
  const at = new Date(`${isoDate}T12:00:00Z`);
  at.setUTCDate(at.getUTCDate() + days);
  return at.toISOString().slice(0, 10);
}

/** Monday-first weekday index, which is how a calendar is read here. */
function mondayIndex(y: number, m: number, d: number) {
  return (new Date(Date.UTC(y, m, d)).getUTCDay() + 6) % 7;
}

const daysInMonth = (y: number, m: number) =>
  new Date(Date.UTC(y, m + 1, 0)).getUTCDate();

type Props = {
  doctorId: number;
  doctorName: string;
  language: DirectoryLanguage;
  initialSlots: Slot[];
  /** The window initialSlots covers, so the first month need not be refetched. */
  initialFrom: string;
  initialTo: string;
};

export default function BookingPanel({
  doctorId,
  doctorName,
  language,
  initialSlots,
  initialFrom,
  initialTo,
}: Props) {
  const c = bookingCopy(language);
  const locale = localeFor(language);
  const { isAuthenticated } = useAuth();
  const today = useMemo(bakuToday, []);
  const lastBookable = useMemo(
    () => addDays(today.iso, MAX_DAYS_AHEAD),
    [today.iso],
  );

  const [month, setMonth] = useState({ y: today.y, m: today.m });
  const [slots, setSlots] = useState<Slot[]>(initialSlots);
  const [covered, setCovered] = useState<{ from: string; to: string }>({
    from: initialFrom,
    to: initialTo,
  });
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);

  const [members, setMembers] = useState<Member[] | null>(null);
  const [memberId, setMemberId] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [share, setShare] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // The window the visible month needs, clipped to what can actually be booked.
  const need = useMemo(() => {
    const first = iso(month.y, month.m, 1);
    const last = iso(month.y, month.m, daysInMonth(month.y, month.m));
    const from = first < today.iso ? today.iso : first;
    const to = last > lastBookable ? lastBookable : last;
    return from > to ? null : { from, to };
  }, [month, today.iso, lastBookable]);

  const load = useCallback(
    async (window: { from: string; to: string }) => {
      setLoading(true);
      setLoadError(false);
      try {
        const found = await fetchSlots(doctorId, window.from, window.to);
        setSlots(found);
        setCovered(window);
      } catch {
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    },
    [doctorId],
  );

  useEffect(() => {
    if (!need) return;
    // The server already fetched the opening window; do not repeat it.
    if (need.from >= covered.from && need.to <= covered.to) return;
    void load(need);
  }, [need, covered.from, covered.to, load]);

  useEffect(() => {
    if (!isAuthenticated || members) return;
    const controller = new AbortController();
    healthApi
      .families(controller.signal)
      .then((families) => {
        const all = families.flatMap((f) => f.members);
        setMembers(all);
        setMemberId(all.find((m) => m.self)?.id ?? all[0]?.id ?? null);
      })
      .catch(() => setMembers([]));
    return () => controller.abort();
  }, [isAuthenticated, members]);

  const byDay = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const s of slots) {
      const key = dayOf(s.startsAt);
      const list = map.get(key);
      if (list) list.push(s);
      else map.set(key, [s]);
    }
    return map;
  }, [slots]);

  const monthLabel = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(month.y, month.m, 1)));

  const weekdays = useMemo(() => {
    const format = new Intl.DateTimeFormat(locale, { weekday: "short" });
    // 2024-01-01 was a Monday, so this walks Monday to Sunday.
    return Array.from({ length: 7 }, (_, i) =>
      format.format(new Date(Date.UTC(2024, 0, 1 + i))),
    );
  }, [locale]);

  const canGoBack = month.y > today.y || (month.y === today.y && month.m > today.m);
  const lastMonth = new Date(`${lastBookable}T12:00:00Z`);
  const canGoForward =
    month.y < lastMonth.getUTCFullYear() ||
    (month.y === lastMonth.getUTCFullYear() && month.m < lastMonth.getUTCMonth());

  const step = (by: number) =>
    setMonth((prev) => {
      const next = new Date(Date.UTC(prev.y, prev.m + by, 1));
      return { y: next.getUTCFullYear(), m: next.getUTCMonth() };
    });

  async function submit() {
    if (!slot || !memberId) return;
    setSubmitting(true);
    setError(null);
    const body: BookRequest = {
      doctorId,
      clinicId: typeof slot.clinicId === "number" ? slot.clinicId : null,
      startsAt: slot.startsAt,
      reason: reason.trim() || null,
      shareRecord: share,
    };
    try {
      await createBooking(memberId, body);
      setDone(true);
      setSlot(null);
    } catch (e: unknown) {
      const status = (e as { response?: { status?: number } })?.response?.status;
      // 409 is somebody else getting there first, which is a normal race and
      // not a failure to apologise for - reload so the taken time disappears.
      setError(status === 409 ? c.taken : c.failed);
      if (status === 409 && need) void load(need);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className={styles.panel}>
        <p className={styles.success} role="status">
          {c.booked}
        </p>
        <p className={styles.muted}>{c.bookedNote}</p>
        <Link className={styles.primary} href="/randevularim">
          {c.myBookings}
        </Link>
      </div>
    );
  }

  const cells: (number | null)[] = [
    ...Array.from({ length: mondayIndex(month.y, month.m, 1) }, () => null),
    ...Array.from({ length: daysInMonth(month.y, month.m) }, (_, i) => i + 1),
  ];

  return (
    <div className={styles.panel}>
      <div className={styles.monthBar}>
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={!canGoBack}
          aria-label={c.prevMonth}
        >
          &lsaquo;
        </button>
        <strong aria-live="polite">{monthLabel}</strong>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={!canGoForward}
          aria-label={c.nextMonth}
        >
          &rsaquo;
        </button>
      </div>

      <div className={styles.weekdays} aria-hidden="true">
        {weekdays.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className={styles.grid} role="group" aria-label={c.pickDay}>
        {cells.map((n, i) => {
          if (n === null) return <span key={`pad-${i}`} />;
          const date = iso(month.y, month.m, n);
          const free = (byDay.get(date)?.length ?? 0) > 0;
          return (
            <button
              key={date}
              type="button"
              className={[
                styles.day,
                free ? styles.free : "",
                day === date ? styles.selected : "",
              ]
                .filter(Boolean)
                .join(" ")}
              disabled={!free}
              aria-pressed={day === date}
              onClick={() => {
                setDay(date);
                setSlot(null);
                setError(null);
              }}
            >
              {n}
            </button>
          );
        })}
      </div>

      {loading && <p className={styles.muted}>{c.loading}</p>}
      {loadError && (
        <p role="alert" className={styles.error}>
          {c.loadFailed}{" "}
          <button
            type="button"
            className={styles.link}
            onClick={() => need && load(need)}
          >
            {c.retry}
          </button>
        </p>
      )}

      {day && (
        <div className={styles.times}>
          <h4>{c.pickTime}</h4>
          {(byDay.get(day)?.length ?? 0) === 0 ? (
            <p className={styles.muted}>{c.noTimes}</p>
          ) : (
            <div className={styles.timeGrid}>
              {byDay.get(day)!.map((s) => (
                <button
                  key={s.startsAt}
                  type="button"
                  className={[
                    styles.time,
                    slot?.startsAt === s.startsAt ? styles.selected : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-pressed={slot?.startsAt === s.startsAt}
                  onClick={() => {
                    setSlot(s);
                    setError(null);
                  }}
                >
                  {timeOf(s.startsAt)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {slot && (
        <div className={styles.form}>
          <p className={styles.chosen}>
            <strong>{doctorName}</strong>
            <span>
              {new Intl.DateTimeFormat(locale, {
                dateStyle: "full",
              }).format(new Date(`${dayOf(slot.startsAt)}T12:00:00Z`))}
              {", "}
              {timeOf(slot.startsAt)}
            </span>
          </p>

          {!isAuthenticated ? (
            <p>
              {c.signIn}{" "}
              <Link className={styles.link} href="/login">
                {c.signInLink}
              </Link>
            </p>
          ) : members && members.length === 0 ? (
            <p>
              {c.noMembers}{" "}
              <Link className={styles.link} href="/profile">
                {c.addMember}
              </Link>
            </p>
          ) : (
            <>
              <label className={styles.field}>
                <span>{c.forWhom}</span>
                <select
                  value={memberId ?? ""}
                  onChange={(e) => setMemberId(Number(e.target.value))}
                >
                  {(members ?? []).map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.field}>
                <span>
                  {c.reason} <em>{c.reasonHint}</em>
                </span>
                <textarea
                  rows={3}
                  maxLength={512}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </label>

              <label className={styles.check}>
                <input
                  type="checkbox"
                  checked={share}
                  onChange={(e) => setShare(e.target.checked)}
                />
                <span>
                  {c.shareRecord}
                  <em>{c.shareRecordHint}</em>
                </span>
              </label>

              {error && (
                <p role="alert" className={styles.error}>
                  {error}
                </p>
              )}

              <button
                type="button"
                className={styles.primary}
                disabled={submitting || !memberId}
                onClick={submit}
              >
                {submitting ? c.booking : c.confirm}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
