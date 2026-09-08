"use client";
import { dateAndTime } from "@/utils/dates";
import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProductLayout, { PageIntro } from "@/components/public/ProductLayout";
import { useAuth } from "@/context/AuthContext";
import {
  privacyApi,
  privacyError,
  type ConsentGrant,
  type ConsentType,
  type DeletionResult,
} from "@/api/privacy";
import { useResource } from "@/components/health/useResource";
import { useChatMember } from "@/components/health/useChatMember";
import MemberSelect from "@/components/health/MemberSelect";
import { RecordDialog } from "@/components/health/RecordForms";
import { canWrite } from "@/components/health/model";
import { usePrivacyCopy } from "./usePrivacyCopy";
import styles from "./privacy.module.css";
import healthStyles from "@/components/health/health.module.css";

type Action =
  | { kind: "consent"; type: ConsentType; grant: boolean; memberId?: number }
  | { kind: "member"; id: number; name: string }
  | { kind: "account" };
export function RemovalReceipt({ result }: { result: DeletionResult }) {
  const { p, language } = usePrivacyCopy();
  const counts = Object.entries(result.removed).filter(
    ([, value]) => typeof value === "number",
  );
  return (
    <section className={styles.receipt} aria-label={p.removed}>
      <h3>{p.removed}</h3>
      {counts.length ? (
        <dl className={styles.counts}>
          {counts.map(([key, value]) => (
            <Fragment key={key}>
              <dt>{(p as Record<string, string>)[key] || key}</dt>
              <dd>{value.toLocaleString(language)}</dd>
            </Fragment>
          ))}
        </dl>
      ) : (
        <p>{p.noCounts}</p>
      )}
    </section>
  );
}
export default function PrivacyPage() {
  const { p } = usePrivacyCopy();
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const [deleted, setDeleted] = useState<DeletionResult | null>(null);
  return (
    <ProductLayout>
      <div className="public-container">
        <PageIntro
          eyebrow={p.account}
          title={p.title}
          description={deleted ? undefined : p.intro}
        />
        {deleted ? (
          <>
            <p role="status">{p.accountDeleted}</p>
            <RemovalReceipt result={deleted} />
            <Link className="public-button" href="/">
              {p.home}
            </Link>
          </>
        ) : (
          <ProtectedRoute>
            {!isLoading && isAuthenticated && user && (
              <PrivacyContent
                key={user.id}
                onDeleted={async (result) => {
                  setDeleted(result);
                  await logout(true);
                }}
              />
            )}
          </ProtectedRoute>
        )}
      </div>
    </ProductLayout>
  );
}
function PrivacyContent({
  onDeleted,
}: {
  onDeleted: (result: DeletionResult) => Promise<void>;
}) {
  const { p, language } = usePrivacyCopy();
  const { user } = useAuth();
  const [version, setVersion] = useState(0);
  const consent = useResource(
    `privacy-${user?.id}-${version}`,
    (signal) => privacyApi.consents(signal),
    p.loadError,
  );
  const family = useChatMember();
  const selectedFamily = family.families.find((f) =>
    f.members.some((m) => m.id === family.member?.id),
  );
  const [action, setAction] = useState<Action | null>(null);
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const alive = useRef(true);
  const exportRequest = useRef<AbortController | null>(null);
  const downloads = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [dialogError, setDialogError] = useState("");
  const [notice, setNotice] = useState("");
  const [removed, setRemoved] = useState<DeletionResult | null>(null);
  const [password, setPassword] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  useEffect(() => {
    alive.current = true;
    const urls = downloads.current;
    return () => {
      alive.current = false;
      exportRequest.current?.abort();
      for (const [url, timer] of urls) {
        clearTimeout(timer);
        URL.revokeObjectURL(url);
      }
      urls.clear();
    };
  }, []);
  function date(value: string | null) {
    if (!value) return "";
    const parsed = new Date(value);
    return Number.isNaN(parsed.valueOf())
      ? value
      : dateAndTime(parsed, language);
  }
  function label(type: ConsentType) {
    return type === "CROSS_BORDER_AI"
      ? p.ai
      : type === "RECORD_STORAGE"
        ? p.storage
        : p.guardian;
  }
  function status(row?: ConsentGrant) {
    return !row
      ? p.unasked
      : row.active
        ? p.active
        : row.grantedAt
          ? p.withdrawn
          : p.declined;
  }
  function open(next: Action) {
    if (pending.current) return;
    setAction(next);
    setDialogError("");
    setPassword("");
    setAcknowledged(false);
  }
  function close() {
    if (!pending.current) {
      setAction(null);
      setPassword("");
      setDialogError("");
    }
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!action || pending.current) return;
    if (action.kind !== "consent" && !acknowledged) return;
    const submitted = action;
    pending.current = true;
    setBusy(true);
    setDialogError("");
    setNotice("");
    try {
      if (submitted.kind === "consent") {
        const result = submitted.grant
          ? await privacyApi.grant(submitted.type, submitted.memberId)
          : await privacyApi.withdraw(submitted.type, submitted.memberId);
        const rows = result.consents.filter(
          (r) =>
            r.type === submitted.type &&
            (submitted.memberId == null ||
              r.familyMemberId === submitted.memberId),
        );
        if (
          submitted.grant
            ? !rows.some((r) => r.active)
            : rows.some((r) => r.active) || !rows.some((r) => r.withdrawnAt)
        )
          throw new Error("Consent was not saved");
        if (!alive.current) return;
        setVersion((v) => v + 1);
        setNotice(p.updated);
      } else {
        const result =
          submitted.kind === "account"
            ? await privacyApi.deleteAccount(password)
            : await privacyApi.deleteMember(submitted.id);
        if (result.deleted !== true)
          throw new Error("Deletion was not confirmed");
        if (!alive.current) return;
        if (submitted.kind === "account") {
          await onDeleted(result);
          return;
        }
        setRemoved(result);
        setNotice(p.memberDeleted);
        family.select(null);
        family.retry();
      }
      if (alive.current) setAction(null);
    } catch (err) {
      const message = await privacyError(err, p.error);
      if (alive.current) {
        setDialogError(message);
        setPassword("");
      }
    } finally {
      pending.current = false;
      if (alive.current) {
        setBusy(false);
        setPassword("");
      }
    }
  }
  async function download() {
    if (!family.member || exportRequest.current) return;
    const id = family.member.id;
    const controller = new AbortController();
    exportRequest.current = controller;
    setExporting(true);
    setError("");
    setNotice("");
    try {
      const blob = await privacyApi.export(id, controller.signal);
      if (controller.signal.aborted) return;
      // ZIP local-file signature; reject HTML/JSON errors returned with HTTP 200.
      const bytes = new Uint8Array(await blob.slice(0, 4).arrayBuffer());
      if (
        bytes[0] !== 0x50 ||
        bytes[1] !== 0x4b ||
        ![3, 5, 7].includes(bytes[2])
      )
        throw new Error("Invalid archive");
      if (controller.signal.aborted) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `azdoc-record-${id}.zip`;
      link.hidden = true;
      document.body.appendChild(link);
      link.click();
      link.remove();
      downloads.current.set(
        url,
        setTimeout(() => {
          URL.revokeObjectURL(url);
          downloads.current.delete(url);
        }, 60000),
      );
      setNotice(p.downloaded);
    } catch (err) {
      const message = await privacyError(err, p.error);
      if (!controller.signal.aborted) setError(message);
    } finally {
      if (!controller.signal.aborted) {
        exportRequest.current = null;
        setExporting(false);
      }
    }
  }
  const history = [...(consent.data?.consents || [])].sort((a, b) =>
    (b.withdrawnAt || b.grantedAt || "").localeCompare(
      a.withdrawnAt || a.grantedAt || "",
    ),
  );
  const latest = (type: ConsentType, memberId?: number) => {
    const rows = history.filter(
      (row) =>
        row.type === type &&
        (memberId == null || row.familyMemberId === memberId),
    );
    return rows.find((row) => row.active) || rows[0];
  };
  const guardianIds = [
    ...new Set(
      history
        .filter((r) => r.type === "GUARDIAN" && r.familyMemberId != null)
        .map((r) => r.familyMemberId!),
    ),
  ];
  const namedMember = (id?: number) =>
    family.families.flatMap((f) => f.members).find((m) => m.id === id)
      ?.fullName;
  return (
    <div className={styles.sections}>
      <div className={styles.actions}>
        <Link href="/profile">{p.profile}</Link>
        <Link href="/privacy-policy">{p.policy}</Link>
      </div>
      {notice && (
        <p role="status" className={styles.status}>
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
      {removed && <RemovalReceipt result={removed} />}
      <section className={styles.section} aria-labelledby="consent-title">
        <h2 id="consent-title">{p.consentsTitle}</h2>
        <p>{p.separate}</p>
        {consent.loading ? (
          <p role="status">{p.loading}</p>
        ) : consent.error ? (
          <div role="alert" className={styles.error}>
            {consent.error}
            <button
              className={healthStyles.secondary}
              onClick={() => setVersion((v) => v + 1)}
            >
              {p.retry}
            </button>
          </div>
        ) : (
          <>
            <p className={styles.meta}>
              {p.version}: {consent.data?.policyVersion}
            </p>
            {(["RECORD_STORAGE", "CROSS_BORDER_AI"] as const).map((type) => {
              const row = latest(type);
              return (
                <div key={type} className={styles.row}>
                  <div>
                    <h3>{label(type)}</h3>
                    <p>
                      {type === "RECORD_STORAGE"
                        ? p.storageConsent
                        : p.aiConsent}
                    </p>
                    <p className={styles.status}>{status(row)}</p>
                    {row?.grantedAt && (
                      <p className={styles.meta}>
                        {p.givenAt}: {date(row.grantedAt)}
                      </p>
                    )}
                    {row?.withdrawnAt && (
                      <p className={styles.meta}>
                        {row.grantedAt ? p.withdrawnAt : p.declinedAt}:{" "}
                        {date(row.withdrawnAt)}
                      </p>
                    )}
                  </div>
                  <div className={styles.actions}>
                    <button
                      className={healthStyles.secondary}
                      disabled={busy}
                      onClick={() =>
                        open({ kind: "consent", type, grant: !row?.active })
                      }
                    >
                      {row?.active ? p.withdraw : p.grant}
                    </button>
                    {!row && (
                      <button
                        className={healthStyles.secondary}
                        disabled={busy}
                        onClick={() =>
                          open({ kind: "consent", type, grant: false })
                        }
                      >
                        {p.decline}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {guardianIds.map((id) => {
              const row = latest("GUARDIAN", id)!;
              const name = namedMember(id);
              return (
                <div key={id} className={styles.row}>
                  <div>
                    <h3>
                      {p.guardian}: {name || p.memberUnknown}
                    </h3>
                    <p>{p.guardianHelp}</p>
                    <p>{status(row)}</p>
                  </div>
                  {(row.active || name) && (
                    <button
                      className={healthStyles.secondary}
                      disabled={busy}
                      onClick={() =>
                        open({
                          kind: "consent",
                          type: "GUARDIAN",
                          memberId: id,
                          grant: !row.active,
                        })
                      }
                    >
                      {row.active ? p.guardianWithdraw : p.grant}
                    </button>
                  )}
                </div>
              );
            })}
            <details className={styles.history}>
              <summary>{p.history}</summary>
              {history.length ? (
                <ol>
                  {history.map((row, index) => (
                    <li key={index}>
                      <strong>{label(row.type)}</strong>
                      {row.familyMemberId != null && (
                        <p>
                          {p.member}:{" "}
                          {namedMember(row.familyMemberId) || p.memberUnknown}
                        </p>
                      )}
                      <p>{status(row)}</p>
                      <p className={styles.meta}>
                        {p.version}: {row.policyVersion}
                      </p>
                      {row.grantedAt && (
                        <p className={styles.meta}>
                          {p.givenAt}: {date(row.grantedAt)}
                        </p>
                      )}
                      {row.withdrawnAt && (
                        <p className={styles.meta}>
                          {row.grantedAt ? p.withdrawnAt : p.declinedAt}:{" "}
                          {date(row.withdrawnAt)}
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
              ) : (
                <p>{p.noHistory}</p>
              )}
            </details>
          </>
        )}
      </section>
      <section className={styles.section} aria-labelledby="records-title">
        <h2 id="records-title">{p.records}</h2>
        <p>{p.recordIntro}</p>
        {family.loading ? (
          <p role="status">{p.loading}</p>
        ) : family.error ? (
          <div role="alert" className={styles.error}>
            {p.loadError}
            <button className={healthStyles.secondary} onClick={family.retry}>
              {p.retry}
            </button>
          </div>
        ) : !family.families.some((f) => f.members.length) ? (
          <p>{p.emptyMembers}</p>
        ) : (
          <>
            <label className={styles.memberSelect} htmlFor="privacy-member">
              {p.member}
              <MemberSelect
                id="privacy-member"
                families={family.families}
                value={family.member?.id || null}
                onChange={(id) => {
                  family.select(id);
                  setRemoved(null);
                  setNotice("");
                  setError("");
                }}
                disabled={busy || exporting}
              />
            </label>
            {family.member ? (
              <div className={styles.actions}>
                <Link className={healthStyles.secondary} href="/health-record">
                  {p.view}
                </Link>
                <button
                  className={healthStyles.secondary}
                  disabled={exporting || busy}
                  onClick={() => void download()}
                >
                  {exporting ? p.exporting : p.export}
                </button>
              </div>
            ) : (
              <p>{p.chooseMember}</p>
            )}
          </>
        )}
      </section>
      <section className={styles.section} aria-labelledby="delete-title">
        <h2 id="delete-title">{p.deleteTitle}</h2>
        {family.member && (
          <>
            <h3>{family.member.fullName}</h3>
            {canWrite(selectedFamily?.role) ? (
              <>
                <p>{p.deleteMemberWarning}</p>
                <button
                  className={styles.danger}
                  disabled={busy || exporting}
                  onClick={() =>
                    open({
                      kind: "member",
                      id: family.member!.id,
                      name: family.member!.fullName,
                    })
                  }
                >
                  {p.deleteMember}
                </button>
              </>
            ) : (
              <p>{p.readOnly}</p>
            )}
          </>
        )}
        <div className={styles.section}>
          <h3>{p.deleteAccount}</h3>
          <p>{p.deleteAccountWarning}</p>
          <button
            className={styles.danger}
            disabled={busy || exporting}
            onClick={() => open({ kind: "account" })}
          >
            {p.deleteAccount}
          </button>
        </div>
      </section>
      {action && (
        <RecordDialog
          title={
            action.kind === "consent"
              ? action.grant
                ? p.grant
                : p.withdrawTitle
              : action.kind === "member"
                ? p.deleteMemberTitle
                : p.deleteAccountTitle
          }
          onClose={close}
          busy={busy}
        >
          <form onSubmit={submit}>
            {action.kind === "consent" ? (
              <>
                <h3>
                  {label(action.type)}
                  {action.memberId != null
                    ? `: ${namedMember(action.memberId) || p.memberUnknown}`
                    : ""}
                </h3>
                <p className={styles.dialogCopy}>
                  {action.grant
                    ? action.type === "CROSS_BORDER_AI"
                      ? p.aiConsent
                      : action.type === "RECORD_STORAGE"
                        ? p.storageConsent
                        : p.guardianConsent
                    : action.type === "CROSS_BORDER_AI"
                      ? p.aiWarning
                      : action.type === "RECORD_STORAGE"
                        ? p.storageWarning
                        : p.guardianHelp}
                </p>
              </>
            ) : (
              <>
                <h3>{action.kind === "member" ? action.name : user?.email}</h3>
                <p className={styles.dialogCopy}>
                  {action.kind === "member"
                    ? p.deleteMemberWarning
                    : p.deleteAccountWarning}
                </p>
                <label className={styles.check}>
                  <input
                    type="checkbox"
                    required
                    checked={acknowledged}
                    onChange={(e) => setAcknowledged(e.target.checked)}
                    disabled={busy}
                  />
                  <span>{p.acknowledge}</span>
                </label>
              </>
            )}
            {action.kind === "account" && (
              <>
                <label className={styles.password}>
                  {p.password}
                  <input
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={busy}
                  />
                </label>
                <p className={styles.meta}>
                  {p.passwordHelp}{" "}
                  <Link href="/privacy-policy">{p.policy}</Link>
                </p>
              </>
            )}
            {dialogError && (
              <p role="alert" className={styles.error}>
                {dialogError}
              </p>
            )}
            <div className={styles.actions}>
              <button
                type="button"
                className={healthStyles.secondary}
                onClick={close}
                disabled={busy}
              >
                {p.cancel}
              </button>
              <button
                type="submit"
                className={
                  action.kind === "consent" ? "public-button" : styles.danger
                }
                disabled={busy}
              >
                {busy
                  ? action.kind === "consent"
                    ? p.saving
                    : p.deleting
                  : action.kind === "consent"
                    ? p.confirm
                    : action.kind === "account"
                      ? p.deleteAccount
                      : p.deleteMember}
              </button>
            </div>
          </form>
        </RecordDialog>
      )}
    </div>
  );
}
