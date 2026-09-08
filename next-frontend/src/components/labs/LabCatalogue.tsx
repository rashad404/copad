"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { useChatMember } from "@/components/health/useChatMember";
import { labApi } from "@/api/labs";
import { supportedLanguage, type SiteLanguage } from "@/utils/languages";
import { labCopy } from "./copy";
import {
  basketTotal,
  money,
  orderRequest,
  readableError,
  type Collection,
  type LabDetail,
  type LabTest,
  type LabOrder,
} from "./model";
import d from "@/components/doctors/directory.module.css";
import s from "./labs.module.css";

export default function LabCatalogue(props: {
  lab: LabDetail;
  initialLanguage: SiteLanguage;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  // Account changes discard private addresses and confirmations, including late responses.
  return (
    <Catalogue
      key={!isLoading && isAuthenticated ? user?.id : "public"}
      {...props}
      authLoading={isLoading}
    />
  );
}
function Catalogue({
  lab,
  initialLanguage,
  authLoading,
}: {
  lab: LabDetail;
  initialLanguage: SiteLanguage;
  authLoading: boolean;
}) {
  const { i18n } = useTranslation();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const language = hydrated
    ? supportedLanguage(i18n.resolvedLanguage || i18n.language) ||
      initialLanguage
    : initialLanguage;
  const c = labCopy(language);
  const member = useChatMember();
  const family = member.families.find((f) =>
    f.members.some((m) => m.id === member.member?.id),
  );
  const viewer = family?.role === "VIEWER";
  const [tests, setTests] = useState(lab.tests);
  const [selected, setSelected] = useState<LabTest[]>([]);
  const [q, setQ] = useState("");
  const [search, setSearch] = useState({ q: "", attempt: 0 });
  const [loadedLanguage, setLoadedLanguage] = useState(initialLanguage);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [collection, setCollection] = useState<Collection>("LAB");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{
    order: LabOrder;
    tests: LabTest[];
    member: string;
  } | null>(null);
  const lock = useRef(false);
  const alive = useRef(true);
  const confirmation = useRef<HTMLElement>(null);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  useEffect(() => {
    if (success) confirmation.current?.focus();
  }, [success]);
  useEffect(() => {
    if (!hydrated) return;
    const controller = new AbortController();
    let active = true;
    setLoading(true);
    setSearchError(false);
    labApi
      .tests(lab.slug, search.q, language, controller.signal)
      .then((rows) => {
        if (!active) return;
        setTests(rows);
        // Searches do not discard the basket. Refresh matching prices and instructions.
        setSelected((previous) =>
          previous.flatMap((t) => {
            const updated = rows.find((row) => row.id === t.id);
            return updated ? [updated] : search.q ? [t] : [];
          }),
        );
        setLoadedLanguage(language);
      })
      .catch(() => {
        if (active) setSearchError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [hydrated, lab.slug, search, language]);
  // Always refresh the entire selection when the reader changes language.
  useEffect(() => {
    setQ("");
    setSearch((previous) => ({ q: "", attempt: previous.attempt + 1 }));
  }, [language]);
  const price = (value: number | null) =>
    money(value, language, c.priceUnknown);
  const total = basketTotal(selected, collection, lab.homeCollectionFee);
  const unavailable =
    busy || loading || searchError || loadedLanguage !== language;
  function toggle(test: LabTest) {
    if (lock.current) return;
    setSelected((previous) =>
      previous.some((t) => t.id === test.id)
        ? previous.filter((t) => t.id !== test.id)
        : [...previous, test],
    );
    setError("");
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      lock.current ||
      unavailable ||
      !member.signedIn ||
      !member.member ||
      !family ||
      viewer ||
      !selected.length ||
      (collection === "HOME" &&
        (!lab.homeCollection || !address.trim() || !phone.trim()))
    )
      return;
    lock.current = true;
    setBusy(true);
    setError("");
    const snapshot = [...selected];
    const name = member.member.fullName;
    try {
      const order = await labApi.create(
        member.member.id,
        orderRequest(lab.id, snapshot, collection, address, phone),
      );
      if (alive.current) setSuccess({ order, tests: snapshot, member: name });
    } catch (e) {
      if (alive.current) setError(readableError(e, c.orderFailed));
    } finally {
      lock.current = false;
      if (alive.current) setBusy(false);
    }
  }
  if (success)
    return (
      <section
        className={s.success}
        ref={confirmation}
        tabIndex={-1}
        aria-labelledby="lab-confirmation"
        lang={language}
      >
        <h2 id="lab-confirmation">{c.received}</h2>
        <p>{c.requestNote}</p>
        <p>
          <span className={s.status}>{c[success.order.status]}</span>
        </p>
        <p>
          {c.orderNumber} #{success.order.id} - {success.member}
        </p>
        <p>
          {success.order.labName} - {c[success.order.collection]}
        </p>
        {success.order.address && <p>{success.order.address}</p>}
        {success.order.contactPhone && <p>{success.order.contactPhone}</p>}
        <ul className={s.items}>
          {success.order.items.map((item) => (
            <li key={item.id}>
              <span>{item.name}</span>
              <strong>{price(item.price)}</strong>
            </li>
          ))}
        </ul>
        <p className={s.total}>
          <span>{c.snapshotPrice}</span>
          <strong>{price(success.order.totalPrice)}</strong>
        </p>
        <p className={s.fine}>{c.priceNotice}</p>
        <h3>{c.confirmationPrep}</h3>
        {success.tests.map((test) => (
          <p className={s.preparation} key={test.id}>
            <strong>{test.name}</strong>
            {test.preparation || c.noPreparation}
          </p>
        ))}
        <div className={s.actions}>
          <Link className={d.button} href="/analizlerim">
            {c.myOrders}
          </Link>
          <button
            className={s.secondary}
            onClick={() => {
              setSuccess(null);
              setSelected([]);
              setAddress("");
              setPhone("");
            }}
          >
            {c.another}
          </button>
        </div>
      </section>
    );
  return (
    <div className={s.catalogue} lang={language}>
      <section aria-labelledby="catalogue-heading">
        <h2 id="catalogue-heading">{c.catalogue}</h2>
        <a className={s.basketJump} href="#lab-basket">
          {c.basket}: {selected.length}
        </a>
        <form
          className={s.search}
          onSubmit={(event) => {
            event.preventDefault();
            setSearch((previous) => ({
              q: q.trim(),
              attempt: previous.attempt + 1,
            }));
          }}
        >
          <label>
            {c.testSearch}
            <input
              type="search"
              value={q}
              maxLength={120}
              disabled={busy}
              onChange={(event) => setQ(event.target.value)}
            />
          </label>
          <button className={d.button} disabled={busy}>
            {c.search}
          </button>
        </form>
        {loading && (
          <p role="status" className={s.fine}>
            {c.loading}
          </p>
        )}
        {searchError && (
          <div role="alert">
            <p className={s.error}>{c.testsFailed}</p>
            <button
              className={s.secondary}
              onClick={() =>
                setSearch((previous) => ({
                  ...previous,
                  attempt: previous.attempt + 1,
                }))
              }
            >
              {c.retry}
            </button>
          </div>
        )}
        {!loading && !searchError && tests.length === 0 && (
          <p className={d.empty}>{search.q ? c.noTestMatch : c.noTests}</p>
        )}
        <ul className={s.tests} aria-busy={loading}>
          {tests.map((test) => {
            const chosen = selected.some((t) => t.id === test.id);
            return (
              <li key={test.id} className={s.test}>
                <div className={s.testTop}>
                  <h3>{test.name}</h3>
                  <span className={s.price}>{price(test.price)}</span>
                </div>
                <dl className={s.details}>
                  <div>
                    <dt>{c.sample}</dt>
                    <dd>{test.sampleType || c.notSpecified}</dd>
                  </div>
                  <div>
                    <dt>{c.turnaround}</dt>
                    <dd>
                      {test.turnaroundHours == null
                        ? c.notSpecified
                        : `${test.turnaroundHours} ${c.hours}`}
                    </dd>
                  </div>
                </dl>
                <p className={s.preparation}>
                  <strong>{c.preparation}</strong>
                  {test.preparation || c.noPreparation}
                </p>
                <button
                  className={s.secondary}
                  type="button"
                  aria-pressed={chosen}
                  aria-label={`${chosen ? c.remove : c.add}: ${test.name}`}
                  disabled={unavailable}
                  onClick={() => toggle(test)}
                >
                  {chosen ? c.selected : c.add}
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <aside
        className={s.basket}
        id="lab-basket"
        aria-labelledby="basket-heading"
      >
        <h2 id="basket-heading">
          {c.basket} ({selected.length})
        </h2>
        {!selected.length ? (
          <p className={s.fine}>{c.basketEmpty}</p>
        ) : (
          <>
            <ul className={s.basketList}>
              {selected.map((test) => (
                <li key={test.id}>
                  <strong>{test.name}</strong>
                  <span>{price(test.price)}</span>
                  <p className={s.preparation}>
                    <strong>{c.preparation}</strong>
                    {test.preparation || c.noPreparation}
                  </p>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => toggle(test)}
                    aria-label={`${c.remove}: ${test.name}`}
                  >
                    {c.remove}
                  </button>
                </li>
              ))}
            </ul>
            {collection === "HOME" && (
              <p className={s.total}>
                <span>{c.homeFee}</span>
                <strong>{price(lab.homeCollectionFee)}</strong>
              </p>
            )}
            <p className={s.total} aria-live="polite">
              <span>{total.complete ? c.total : c.knownTotal}</span>
              <strong>{price(total.known)}</strong>
            </p>
            {!total.complete && <p className={s.fine}>{c.unknownNotice}</p>}
          </>
        )}
        <p className={s.fine}>{c.priceNotice}</p>
        {authLoading ? (
          <p role="status">{c.loading}</p>
        ) : !member.signedIn ? (
          <>
            <p className={s.fine}>{c.signIn}</p>
            <Link
              className={d.clear}
              href={`/login?redirect=${encodeURIComponent(`/laboratoriyalar/${lab.slug}`)}`}
            >
              {c.login}
            </Link>
          </>
        ) : (
          <form className={s.form} onSubmit={submit}>
            {member.loading ? (
              <p role="status">{c.loading}</p>
            ) : member.error ? (
              <div role="alert">
                <p className={s.error}>{c.memberFailed}</p>
                <button
                  type="button"
                  className={s.secondary}
                  onClick={member.retry}
                >
                  {c.retry}
                </button>
              </div>
            ) : member.families.every((f) => !f.members.length) ? (
              <>
                <p>{c.noMembers}</p>
                <Link href="/health-record">{c.records}</Link>
              </>
            ) : (
              <label>
                {c.member}
                <select
                  required
                  value={member.member?.id ?? ""}
                  disabled={busy}
                  onChange={(event) => {
                    member.select(Number(event.target.value) || null);
                    setError("");
                  }}
                >
                  <option value="">{c.chooseMember}</option>
                  {member.families.map((f) => (
                    <optgroup key={f.id} label={f.name}>
                      {f.members.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.fullName}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </label>
            )}
            {viewer ? (
              <p className={s.fine}>{c.viewer}</p>
            ) : (
              member.member && (
                <>
                  <fieldset disabled={busy}>
                    <legend>{c.collection}</legend>
                    <label className={s.radio}>
                      <input
                        type="radio"
                        name="collection"
                        value="LAB"
                        checked={collection === "LAB"}
                        onChange={() => setCollection("LAB")}
                      />
                      {c.LAB}
                    </label>
                    {lab.homeCollection && (
                      <label className={s.radio}>
                        <input
                          type="radio"
                          name="collection"
                          value="HOME"
                          checked={collection === "HOME"}
                          onChange={() => setCollection("HOME")}
                        />
                        {c.HOME}
                      </label>
                    )}
                  </fieldset>
                  {collection === "HOME" && (
                    <>
                      <label>
                        {c.address}
                        <input
                          required
                          value={address}
                          disabled={busy}
                          pattern={".*\\S.*"}
                          autoComplete="street-address"
                          maxLength={500}
                          onChange={(event) => setAddress(event.target.value)}
                        />
                      </label>
                      <label>
                        {c.contactPhone}
                        <input
                          required
                          type="tel"
                          value={phone}
                          disabled={busy}
                          pattern={".*\\S.*"}
                          autoComplete="tel"
                          maxLength={80}
                          onChange={(event) => setPhone(event.target.value)}
                        />
                      </label>
                    </>
                  )}
                  <p className={s.fine}>{c.requestNote}</p>
                  {error && (
                    <p role="alert" className={s.error}>
                      {error}
                    </p>
                  )}
                  <button
                    className={d.button}
                    type="submit"
                    disabled={unavailable || !selected.length}
                  >
                    {busy ? c.submitting : c.submit}
                  </button>
                </>
              )
            )}
          </form>
        )}
      </aside>
    </div>
  );
}
