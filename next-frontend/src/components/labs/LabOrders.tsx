"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import ProductLayout from "@/components/public/ProductLayout";
import { useAuth } from "@/context/AuthContext";
import { healthApi, type FamilyRole, type Member } from "@/api/healthRecord";
import { labApi } from "@/api/labs";
import { supportedLanguage, type SiteLanguage } from "@/utils/languages";
import { phoneHref } from "@/components/doctors/model";
import { labCopy } from "./copy";
import {
  cancellable,
  terminal,
  money,
  preferredTime,
  eventTime,
  readableError,
  type LabOrder,
} from "./model";
import a from "@/components/booking/appointments.module.css";
import s from "./labs.module.css";
type Row = { order: LabOrder; member: Member; role: FamilyRole };
export default function LabOrders() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { i18n } = useTranslation();
  const language =
    supportedLanguage(i18n.resolvedLanguage || i18n.language) || "az";
  const c = labCopy(language);
  return (
    <ProductLayout>
      <div className={`${a.page} ${s.orders}`} lang={language}>
        <h1>{c.myOrders}</h1>
        {isLoading ? (
          <p role="status">{c.loading}</p>
        ) : !isAuthenticated || !user ? (
          <p>
            {c.signIn}{" "}
            <Link className={a.link} href="/login?redirect=%2Fanalizlerim">
              {c.login}
            </Link>
          </p>
        ) : (
          <OrderList key={user.id} language={language} />
        )}
      </div>
    </ProductLayout>
  );
}
function OrderList({ language }: { language: SiteLanguage }) {
  const c = labCopy(language);
  const [state, setState] = useState<{
    rows: Row[];
    loading: boolean;
    error: boolean;
    partial: boolean;
  }>({ rows: [], loading: true, error: false, partial: false });
  const [attempt, setAttempt] = useState(0);
  const [confirm, setConfirm] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<{ key: string; message: string } | null>(
    null,
  );
  const lock = useRef(false);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setState({ rows: [], loading: true, error: false, partial: false });
    healthApi
      .families(controller.signal)
      .then(async (families) => {
        const members = families.flatMap((f) =>
          f.members.map((member) => ({ member, role: f.role })),
        );
        const results = await Promise.allSettled(
          members.map(async ({ member, role }) =>
            (await labApi.orders(member.id, controller.signal)).map(
              (order) => ({ order, member, role }),
            ),
          ),
        );
        if (!active) return;
        const failures = results.filter((r) => r.status === "rejected").length;
        setState({
          rows: results.flatMap((r) =>
            r.status === "fulfilled" ? r.value : [],
          ),
          loading: false,
          error: failures > 0 && failures === results.length,
          partial: failures > 0 && failures < results.length,
        });
      })
      .catch(() => {
        if (active)
          setState({ rows: [], loading: false, error: true, partial: false });
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [attempt]);
  const keyOf = (row: Row) => `${row.member.id}:${row.order.id}`;
  const price = (value: number | null) =>
    money(value, language, c.priceUnknown);
  async function cancel(row: Row) {
    if (lock.current || row.role === "VIEWER" || !cancellable(row.order.status))
      return;
    lock.current = true;
    const key = keyOf(row);
    setBusy(key);
    setError(null);
    try {
      const order = await labApi.cancel(row.member.id, row.order.id);
      if (alive.current) {
        setState((previous) => ({
          ...previous,
          rows: previous.rows.map((r) =>
            keyOf(r) === key ? { ...r, order } : r,
          ),
        }));
        setConfirm(null);
      }
    } catch (e) {
      if (alive.current)
        setError({ key, message: readableError(e, c.cancelFailed) });
    } finally {
      lock.current = false;
      if (alive.current) setBusy(null);
    }
  }
  function card(row: Row) {
    const { order, member, role } = row;
    const key = keyOf(row);
    return (
      <li className={a.card} key={key}>
        <article aria-labelledby={`order-${key}`}>
          <span className={s.status}>{c[order.status]}</span>
          <h3 id={`order-${key}`}>{order.labName}</h3>
          <p className={s.fine}>
            {c.orderNumber} #{order.id}
          </p>
          <dl className={s.details}>
            <div>
              <dt>{c.forWhom}</dt>
              <dd>{member.fullName}</dd>
            </div>
            <div>
              <dt>{c.collection}</dt>
              <dd>{c[order.collection]}</dd>
            </div>
            {order.address && (
              <div>
                <dt>{c.address}</dt>
                <dd>{order.address}</dd>
              </div>
            )}
            {order.contactPhone && (
              <div>
                <dt>{c.contactPhone}</dt>
                <dd>{order.contactPhone}</dd>
              </div>
            )}
            {order.preferredAt && (
              <div>
                <dt>{c.preferred}</dt>
                <dd>{preferredTime(order.preferredAt, language)}</dd>
              </div>
            )}
            {order.cancelledAt && (
              <div>
                <dt>{c.cancelledAt}</dt>
                <dd>{eventTime(order.cancelledAt, language)}</dd>
              </div>
            )}
            {order.completedAt && (
              <div>
                <dt>{c.completedAt}</dt>
                <dd>{eventTime(order.completedAt, language)}</dd>
              </div>
            )}
          </dl>
          {!order.preferredAt && !terminal(order.status) && (
            <p className={s.fine}>{c.timePending}</p>
          )}
          {order.status === "REQUESTED" && (
            <p className={s.fine}>{c.requestNote}</p>
          )}
          <ul className={s.items}>
            {order.items.map((item) => (
              <li key={item.id}>
                <span>{item.name}</span>
                <strong>{price(item.price)}</strong>
                {order.status !== "CANCELLED" && (
                  <small>
                    {item.resultReady ? c.resultReady : c.resultPending}
                  </small>
                )}
              </li>
            ))}
          </ul>
          <p className={s.total}>
            <span>{c.snapshotPrice}</span>
            <strong>{price(order.totalPrice)}</strong>
          </p>
          <p className={s.fine}>{c.priceNotice}</p>
          {phoneHref(order.labPhone) && (
            <p>
              <a className={a.link} href={phoneHref(order.labPhone)!}>
                {order.labPhone}
              </a>
            </p>
          )}
          {role === "VIEWER" && <p className={s.fine}>{c.viewer}</p>}
          {role !== "VIEWER" &&
            cancellable(order.status) &&
            (confirm === key ? (
              <div>
                <p>{c.cancelQuestion}</p>
                <div className={s.actions}>
                  <button
                    className={a.cancel}
                    disabled={busy !== null}
                    onClick={() => cancel(row)}
                  >
                    {busy === key ? c.cancelling : c.cancel}
                  </button>
                  <button
                    className={s.secondary}
                    disabled={busy !== null}
                    onClick={() => setConfirm(null)}
                  >
                    {c.keep}
                  </button>
                </div>
              </div>
            ) : (
              <button
                className={a.cancel}
                disabled={busy !== null}
                onClick={() => {
                  setConfirm(key);
                  setError(null);
                }}
              >
                {c.cancel}
              </button>
            ))}
          {error?.key === key && (
            <p className={s.error} role="alert">
              {error.message}
            </p>
          )}
        </article>
      </li>
    );
  }
  return (
    <>
      <Link className={a.link} href="/laboratoriyalar">
        {c.title}
      </Link>
      {state.loading ? (
        <p role="status">{c.loading}</p>
      ) : (
        <>
          {(state.error || state.partial) && (
            <div role="alert">
              <p className={s.error}>
                {state.error ? c.ordersFailed : c.partialFailure}
              </p>
              <button
                className={s.secondary}
                disabled={busy !== null}
                onClick={() => setAttempt((n) => n + 1)}
              >
                {c.retry}
              </button>
            </div>
          )}
          {!state.error && !state.partial && !state.rows.length && (
            <p>{c.noOrders}</p>
          )}
          {[false, true].map((past) => {
            const rows = state.rows.filter(
              (row) => terminal(row.order.status) === past,
            );
            return (
              rows.length > 0 && (
                <section key={String(past)}>
                  <h2>{past ? c.past : c.upcoming}</h2>
                  <ul className={a.list}>{rows.map(card)}</ul>
                </section>
              )
            );
          })}
        </>
      )}
    </>
  );
}
