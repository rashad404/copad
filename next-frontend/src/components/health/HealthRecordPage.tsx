"use client";
import MemberSelect from "./MemberSelect";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Plus,
  ArrowUpRight,
  ShieldAlert,
  Pencil,
  Trash2,
  Users,
  Activity,
  History,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProductLayout, {
  usePublicCopy,
} from "@/components/public/ProductLayout";
import {
  healthApi,
  type Family,
  type Member,
  type RecordKind,
  type ClinicalEntry,
  type VitalType,
  type Revision,
} from "@/api/healthRecord";
import {
  canWrite,
  dateLabel,
  enteredReading,
  enumLabel,
  readableError,
  recordDefinitions,
  vitalDefinitions,
} from "./model";
import { useResource } from "./useResource";
import { ClinicalForm, DeleteDialog, MemberForm } from "./RecordForms";
import Vitals, { Flag } from "./Vitals";
import ClinicalTimeline from "./ClinicalTimeline";
import SummaryDownload from "./SummaryDownload";
import styles from "./health.module.css";

type Tab = "overview" | RecordKind | "vitals" | "timeline" | "history";
export default function HealthRecordPage() {
  return (
    <ProtectedRoute>
      <ProductLayout>
        <FamilyWorkspace />
      </ProductLayout>
    </ProtectedRoute>
  );
}
function FamilyWorkspace() {
  const c = usePublicCopy();
  const { user, isAuthenticated } = useAuth();
  const [families, setFamilies] = useState<Family[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [familyId, setFamilyId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [adding, setAdding] = useState(false);
  const preferred = useRef<number | null>(null);
  const fallback = c(
    "Could not load your family. Please try again.",
    "Ailə məlumatlarını yükləmək mümkün olmadı. Yenidən cəhd edin.",
  );
  const storageKey = `azdoc.member.${user?.id}`;
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;
    let active = true;
    const abort = new AbortController();
    setLoading(true);
    setError("");
    healthApi
      .families(abort.signal)
      .then((data) => {
        if (!active) return;
        setFamilies(data);
        let saved: number | null = preferred.current;
        try {
          saved ??= Number(localStorage.getItem(storageKey)) || null;
        } catch {}
        const chosen =
          data.flatMap((f) => f.members).find((m) => m.id === saved) ??
          data.flatMap((f) => f.members).find((m) => m.self) ??
          data.flatMap((f) => f.members)[0];
        setSelectedId(chosen?.id ?? null);
        try {
          if (chosen) localStorage.setItem(storageKey, String(chosen.id));
        } catch {}
        setFamilyId(chosen?.familyId ?? data[0]?.id ?? null);
      })
      .catch((err) => {
        if (active) setError(readableError(err, fallback));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      abort.abort();
    };
  }, [isAuthenticated, user?.id, retry, storageKey, fallback]);
  const family =
    families.find((f) => f.members.some((m) => m.id === selectedId)) ??
    families.find((f) => f.id === familyId);
  const member = family?.members.find((m) => m.id === selectedId);
  const writable = canWrite(family?.role);
  function select(id: number) {
    setSelectedId(id);
    preferred.current = id;
    const next = families.find((f) => f.members.some((m) => m.id === id));
    setFamilyId(next?.id ?? null);
    try {
      localStorage.setItem(storageKey, String(id));
    } catch {}
  }
  function saveMember(saved: Member) {
    setFamilies((old) =>
      old.map((f) =>
        f.id === saved.familyId
          ? {
              ...f,
              members: f.members.some((m) => m.id === saved.id)
                ? f.members.map((m) => (m.id === saved.id ? saved : m))
                : [...f.members, saved],
            }
          : f,
      ),
    );
    select(saved.id);
    setFamilyId(saved.familyId);
    setAdding(false);
  }
  function removeMember(id: number) {
    const updated = families.map((f) => ({
      ...f,
      members: f.members.filter((m) => m.id !== id),
    }));
    setFamilies(updated);
    const next = updated.flatMap((f) => f.members)[0];
    if (next) select(next.id);
    else {
      setSelectedId(null);
      preferred.current = null;
      try {
        localStorage.removeItem(storageKey);
      } catch {}
    }
  }
  return (
    <div className={styles.workspace}>
      <div className={styles.workspaceHeading}>
        <div>
          <p className={styles.eyebrow}>
            {c("Your family’s health", "Ailənizin sağlamlığı")}
          </p>
          <h1>{c("Health record", "Sağlamlıq qeydləri")}</h1>
        </div>
        <p>
          {c(
            "A clear picture. One person at a time.",
            "Aydın mənzərə. Hər insan üçün ayrıca.",
          )}
        </p>
      </div>
      {error && (
        <div role="alert" className={styles.error}>
          {error}
          <button onClick={() => setRetry((n) => n + 1)}>
            {c("Try again", "Yenidən cəhd et")}
          </button>
        </div>
      )}
      {loading ? (
        <div className={styles.loading} role="status">
          {c("Loading your family…", "Ailəniz yüklənir…")}
        </div>
      ) : (
        !error && (
          <>
            <div className={styles.memberBar}>
              <span className={styles.memberBarIcon}>
                <Users size={22} />
              </span>
              <label htmlFor="health-member">
                {c(
                  "Whose record are you viewing?",
                  "Kimin qeydlərinə baxırsınız?",
                )}
                <MemberSelect
                  id="health-member"
                  families={families}
                  value={selectedId}
                  onChange={(id) => {
                    if (id !== null) select(id);
                  }}
                  disabled={!families.some((f) => f.members.length)}
                />
              </label>
              <span className={styles.role}>{enumLabel(family?.role, c)}</span>
              {writable && (
                <button
                  className={styles.secondary}
                  onClick={() => setAdding(true)}
                >
                  <Plus size={17} />
                  {c("Add member", "Üzv əlavə et")}
                </button>
              )}
            </div>
            {member && family ? (
              <MemberRecord
                key={`${user?.id}:${member.id}:${family.role}`}
                member={member}
                family={family}
                onMemberSaved={saveMember}
                onMemberRemoved={removeMember}
              />
            ) : (
              <div className={styles.empty}>
                <Users size={30} />
                <h2>
                  {c(
                    "Your family record starts here",
                    "Ailənizin sağlamlıq qeydləri buradan başlayır",
                  )}
                </h2>
                <p>
                  {c(
                    "Choose a family and add its first member.",
                    "Ailə seçin və ilk üzvünü əlavə edin.",
                  )}
                </p>
                {families.length > 1 && (
                  <label htmlFor="empty-family">
                    {c("Family", "Ailə")}
                    <select
                      id="empty-family"
                      value={familyId ?? ""}
                      onChange={(e) => setFamilyId(Number(e.target.value))}
                    >
                      {families.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name} · {enumLabel(f.role, c)}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                {writable && (
                  <button
                    className="public-button"
                    onClick={() => setAdding(true)}
                  >
                    {c("Add member", "Üzv əlavə et")}
                  </button>
                )}
              </div>
            )}
            {adding && family && writable && (
              <MemberForm
                familyId={family.id}
                onClose={() => setAdding(false)}
                onSaved={saveMember}
              />
            )}
          </>
        )
      )}
    </div>
  );
}
function MemberRecord({
  member,
  family,
  onMemberSaved,
  onMemberRemoved,
}: {
  member: Member;
  family: Family;
  onMemberSaved: (m: Member) => void;
  onMemberRemoved: (id: number) => void;
}) {
  const c = usePublicCopy();
  const { i18n } = useTranslation();
  const write = canWrite(family.role);
  const [tab, setTab] = useState<Tab>("overview");
  const [version, setVersion] = useState(0);
  const [editingMember, setEditingMember] = useState(false);
  const [removingMember, setRemovingMember] = useState(false);
  const [recordForm, setRecordForm] = useState<{
    kind: RecordKind;
    entry?: ClinicalEntry;
  } | null>(null);
  const [deleteEntry, setDeleteEntry] = useState<{
    kind: RecordKind;
    entry: ClinicalEntry;
  } | null>(null);
  const [notice, setNotice] = useState("");
  const [vitalType, setVitalType] = useState<VitalType>("WEIGHT");
  const tabsRef = useRef<HTMLDivElement>(null);
  const fallback = c(
    "Could not load this part of the record. Please try again.",
    "Qeydin bu hissəsini yükləmək mümkün olmadı. Yenidən cəhd edin.",
  );
  const conditions = useResource(
    `${member.id}.conditions.${version}`,
    (signal) => healthApi.list(member.id, "conditions", signal),
    fallback,
  );
  const allergies = useResource(
    `${member.id}.allergies.${version}`,
    (signal) => healthApi.list(member.id, "allergies", signal),
    fallback,
  );
  const medications = useResource(
    `${member.id}.medications.${version}`,
    (signal) => healthApi.list(member.id, "medications", signal),
    fallback,
  );
  const immunizations = useResource(
    `${member.id}.immunizations.${version}`,
    (signal) => healthApi.list(member.id, "immunizations", signal),
    fallback,
  );
  const latest = useResource(
    `${member.id}.latest.${version}`,
    (signal) => healthApi.latest(member.id, signal),
    fallback,
  );
  const resources = { conditions, allergies, medications, immunizations };
  const critical = (allergies.data ?? []).filter((a) => a.critical === true);
  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: c("Overview", "İcmal") },
    ...Object.entries(recordDefinitions).map(([key, definition]) => ({
      key: key as RecordKind,
      label: c(...definition.label),
    })),
    { key: "vitals", label: c("Vitals", "Göstəricilər") },
    { key: "timeline", label: c("Timeline", "Xronologiya") },
    { key: "history", label: c("History", "Tarixçə") },
  ];
  function changed() {
    setVersion((n) => n + 1);
    setNotice(c("Record saved.", "Qeyd saxlanıldı."));
    setRecordForm(null);
    setDeleteEntry(null);
  }
  function retry() {
    setVersion((n) => n + 1);
  }
  const age =
    member.ageYears === null
      ? c("Age not recorded", "Yaş qeyd edilməyib")
      : member.ageYears < 2 && member.ageMonths !== null
        ? `${member.ageMonths} ${c("months", "ay")}`
        : `${member.ageYears} ${c("years", "yaş")}`;
  return (
    <>
      <div className={styles.personHeading}>
        <span className={styles.avatar}>
          {member.fullName?.charAt(0)?.toUpperCase() || <Users />}
        </span>
        <div>
          <p className={styles.eyebrow}>
            {enumLabel(member.relationship, c)} · {family.name}
          </p>
          <h2>{member.fullName}</h2>
          <div className={styles.personMeta}>
            <span>{age}</span>
            <span>
              {c("Blood type", "Qan qrupu")}:{" "}
              {member.bloodType || c("Not recorded", "Qeyd edilməyib")}
            </span>
            {member.minor &&
              member.gestationalAgeWeeks != null &&
              member.gestationalAgeWeeks < 37 &&
              member.correctedAgeMonths != null && (
                <strong>
                  {c("Corrected age", "Düzəldilmiş yaş")}:{" "}
                  {member.correctedAgeMonths} {c("months", "ay")}
                </strong>
              )}
          </div>
        </div>
        <div className={styles.personActions}>
          <SummaryDownload memberId={member.id} />
          {write && (
            <>
              <button
                className={styles.secondary}
                onClick={() => setEditingMember(true)}
              >
                <Pencil size={16} />
                {c("Edit member", "Üzvü redaktə et")}
              </button>
              {!member.self && member.relationship !== "SELF" && (
                <button
                  className={styles.iconButton}
                  aria-label={c("Remove member", "Üzvü sil")}
                  onClick={() => setRemovingMember(true)}
                >
                  <Trash2 size={17} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
      {allergies.error ? (
        <div className={styles.error} role="alert">
          {c(
            "Allergy information could not be loaded.",
            "Allergiya məlumatlarını yükləmək mümkün olmadı.",
          )}{" "}
          <button onClick={retry}>{c("Retry", "Yenidən cəhd et")}</button>
        </div>
      ) : critical.length > 0 ? (
        <aside
          className={styles.criticalBanner}
          aria-label={c("Critical allergies", "Kritik allergiyalar")}
        >
          <ShieldAlert size={25} />
          <div>
            <strong>{c("Critical allergies", "Kritik allergiyalar")}</strong>
            <ul>
              {critical.map((a) => (
                <li key={a.id}>
                  <b>{String(a.allergen)}</b> ·{" "}
                  {enumLabel(String(a.severity), c)}
                  {a.reaction ? ` · ${a.reaction}` : ""}
                </li>
              ))}
            </ul>
          </div>
          <button onClick={() => setTab("allergies")}>
            {c("View allergies", "Allergiyalara bax")} ↗
          </button>
        </aside>
      ) : allergies.loading ? (
        <p className={styles.helper} role="status">
          {c("Loading allergy information…", "Allergiya məlumatları yüklənir…")}
        </p>
      ) : null}
      <div
        ref={tabsRef}
        className={styles.tabs}
        role="tablist"
        aria-label={c("Member record sections", "Üzvün qeyd bölmələri")}
        onKeyDown={(e) => {
          const index = tabs.findIndex((item) => item.key === tab);
          let next = index;
          if (e.key === "ArrowRight") next = (index + 1) % tabs.length;
          else if (e.key === "ArrowLeft")
            next = (index - 1 + tabs.length) % tabs.length;
          else if (e.key === "Home") next = 0;
          else if (e.key === "End") next = tabs.length - 1;
          else return;
          e.preventDefault();
          setTab(tabs[next].key);
          tabsRef.current
            ?.querySelectorAll<HTMLButtonElement>("[role=tab]")
            [next]?.focus();
        }}
      >
        {tabs.map((item) => (
          <button
            role="tab"
            key={item.key}
            id={`tab-${item.key}`}
            aria-controls="record-panel"
            aria-selected={tab === item.key}
            tabIndex={tab === item.key ? 0 : -1}
            onClick={() => {
              setTab(item.key);
              setNotice("");
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {notice && (
        <p className={styles.notice} role="status">
          {notice}
        </p>
      )}
      <div
        id="record-panel"
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        className={styles.panel}
        tabIndex={0}
      >
        {tab === "overview" ? (
          <>
            <div className={styles.sectionToolbar}>
              <div>
                <h2>{c("The latest picture", "Son vəziyyət")}</h2>
                <p>
                  {c("Measurements and records for", "Ölçülər və qeydlər:")}{" "}
                  {member.fullName}.
                </p>
              </div>
              <button
                className={styles.textButton}
                onClick={() => setTab("vitals")}
              >
                {c("All measurements", "Bütün ölçülər")}
                <ArrowUpRight size={17} />
              </button>
            </div>
            {latest.error ? (
              <ErrorBlock error={latest.error} retry={retry} />
            ) : latest.loading ? (
              <p className={styles.loading} role="status">
                {c("Loading measurements…", "Ölçülər yüklənir…")}
              </p>
            ) : Object.values(latest.data ?? {}).length ? (
              <div className={styles.vitalSummary}>
                {Object.values(latest.data ?? {})
                  .filter(Boolean)
                  .map(
                    (reading) =>
                      reading && (
                        <button
                          key={reading.id}
                          onClick={() => {
                            setVitalType(reading.vitalType);
                            setTab("vitals");
                          }}
                        >
                          <span>
                            {c(...vitalDefinitions[reading.vitalType].label)}
                          </span>
                          <strong>
                            {enteredReading(reading).value}
                            <small>{enteredReading(reading).unit}</small>
                          </strong>
                          <Flag flag={reading.abnormalFlag} />
                          <time>
                            {dateLabel(reading.measuredAt, i18n.language)}
                          </time>
                        </button>
                      ),
                  )}
              </div>
            ) : (
              <div className={styles.overviewEmpty}>
                <Activity size={30} />
                <h3>{c("No measurements yet", "Hələ ölçü yoxdur")}</h3>
                <p>
                  {c(
                    "New measurements will appear here with their recorded units and status.",
                    "Yeni ölçülər daxil edilmiş vahidlər və statusla burada görünəcək.",
                  )}
                </p>
                {write && (
                  <button
                    className="public-button"
                    onClick={() => setTab("vitals")}
                  >
                    {c("Record a measurement", "Ölçü qeydə al")}
                  </button>
                )}
              </div>
            )}
            <div className={styles.recordOverview}>
              {Object.entries(resources).map(([key, resource]) => (
                <button key={key} onClick={() => setTab(key as RecordKind)}>
                  <span>
                    {c(...recordDefinitions[key as RecordKind].label)}
                  </span>
                  <strong>
                    {resource.loading
                      ? "…"
                      : resource.error
                        ? "—"
                        : (resource.data?.length ?? 0)}
                  </strong>
                  <span>
                    {resource.error
                      ? c("Unavailable", "Əlçatan deyil")
                      : c("View records", "Qeydlərə bax")}{" "}
                    <ArrowUpRight size={16} />
                  </span>
                </button>
              ))}
            </div>
            <section className={styles.detailsSection}>
              <h3>{c("Personal details", "Şəxsi məlumatlar")}</h3>
              <dl>
                <div>
                  <dt>{c("Date of birth", "Doğum tarixi")}</dt>
                  <dd>{dateLabel(member.dateOfBirth, i18n.language)}</dd>
                </div>
                <div>
                  <dt>
                    {c("Sex assigned at birth", "Doğumda təyin olunan cins")}
                  </dt>
                  <dd>{enumLabel(member.biologicalSex, c)}</dd>
                </div>
                {member.gestationalAgeWeeks != null && (
                  <div>
                    <dt>
                      {c("Gestational age at birth", "Doğumda hamiləlik yaşı")}
                    </dt>
                    <dd>
                      {member.gestationalAgeWeeks} {c("weeks", "həftə")}
                    </dd>
                  </div>
                )}
                {member.birthWeightGrams != null && (
                  <div>
                    <dt>{c("Birth weight", "Doğum çəkisi")}</dt>
                    <dd>{member.birthWeightGrams} g</dd>
                  </div>
                )}
                {member.birthLengthCm != null && (
                  <div>
                    <dt>{c("Birth length", "Doğum boyu")}</dt>
                    <dd>{member.birthLengthCm} cm</dd>
                  </div>
                )}
              </dl>
            </section>
          </>
        ) : tab === "vitals" ? (
          <Vitals
            member={member}
            write={write}
            version={version}
            onChanged={changed}
            initialType={vitalType}
          />
        ) : tab === "timeline" ? (
          <ClinicalTimeline
            memberId={member.id}
            version={version}
            onViewVitals={() => setTab("vitals")}
          />
        ) : tab === "history" ? (
          <AuditHistory memberId={member.id} version={version} />
        ) : (
          <>
            <div className={styles.sectionToolbar}>
              <div>
                <h2>{c(...recordDefinitions[tab].label)}</h2>
                <p>
                  {member.fullName} ·{" "}
                  {write
                    ? c(
                        "Manage recorded information",
                        "Qeydə alınmış məlumatları idarə edin",
                      )
                    : c("Read-only access", "Yalnız baxış hüququ")}
                </p>
              </div>
              {write && (
                <button
                  className="public-button"
                  onClick={() => setRecordForm({ kind: tab })}
                >
                  <Plus size={17} />
                  {c("Add record", "Qeyd əlavə et")}
                </button>
              )}
            </div>
            {resources[tab].loading ? (
              <p className={styles.loading} role="status">
                {c("Loading records…", "Qeydlər yüklənir…")}
              </p>
            ) : resources[tab].error ? (
              <ErrorBlock error={resources[tab].error} retry={retry} />
            ) : !resources[tab].data?.length ? (
              <div className={styles.empty}>
                <h3>{c("Nothing recorded yet", "Hələ qeyd yoxdur")}</h3>
                <p>
                  {c(
                    "An empty record means no information has been added here.",
                    "Boş qeyd burada məlumatın əlavə edilmədiyini bildirir.",
                  )}
                </p>
                {write && (
                  <button
                    className={styles.secondary}
                    onClick={() => setRecordForm({ kind: tab })}
                  >
                    {c("Add the first record", "İlk qeydi əlavə et")}
                  </button>
                )}
              </div>
            ) : (
              <div className={styles.recordList}>
                {[...(resources[tab].data ?? [])]
                  .sort(
                    (a, b) =>
                      Number(b.critical === true) - Number(a.critical === true),
                  )
                  .map((entry) => (
                    <article
                      key={entry.id}
                      className={
                        entry.critical === true
                          ? styles.criticalRecord
                          : undefined
                      }
                    >
                      <div className={styles.recordHeading}>
                        <div>
                          <h3>
                            {String(entry[recordDefinitions[tab].titleKey])}
                          </h3>
                          <div className={styles.badges}>
                            {entry.critical === true && (
                              <span
                                className={`${styles.flag} ${styles.critical}`}
                              >
                                {c("Critical allergy", "Kritik allergiya")}
                              </span>
                            )}
                            {entry.severity && (
                              <span className={styles.flag}>
                                {enumLabel(String(entry.severity), c)}
                              </span>
                            )}
                            {entry.status && (
                              <span className={styles.flag}>
                                {enumLabel(String(entry.status), c)}
                              </span>
                            )}
                            {typeof entry.active === "boolean" && (
                              <span className={styles.flag}>
                                {entry.active
                                  ? c("Active", "Aktiv")
                                  : c("Inactive", "Aktiv deyil")}
                              </span>
                            )}
                            {entry.overdue === true && (
                              <span
                                className={`${styles.flag} ${styles.abnormal}`}
                              >
                                {c(
                                  "Next dose overdue",
                                  "Növbəti dozanın vaxtı keçib",
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                        {write && (
                          <div className={styles.rowActions}>
                            <button
                              onClick={() =>
                                setRecordForm({ kind: tab, entry })
                              }
                              aria-label={`${c("Edit", "Redaktə et")}: ${entry[recordDefinitions[tab].titleKey]}`}
                            >
                              <Pencil size={16} />
                              <span>{c("Edit", "Redaktə et")}</span>
                            </button>
                            <button
                              onClick={() =>
                                setDeleteEntry({ kind: tab, entry })
                              }
                              aria-label={`${c("Remove", "Sil")}: ${entry[recordDefinitions[tab].titleKey]}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                      <dl className={styles.recordDetails}>
                        {recordDefinitions[tab].fields
                          .filter(
                            (field) =>
                              ![
                                recordDefinitions[tab].titleKey,
                                "active",
                                "severity",
                                "status",
                                "notes",
                              ].includes(field.key) &&
                              entry[field.key] != null &&
                              entry[field.key] !== "",
                          )
                          .map((field) => (
                            <div key={field.key}>
                              <dt>{c(...field.label)}</dt>
                              <dd>
                                {field.type === "date"
                                  ? dateLabel(
                                      String(entry[field.key]),
                                      i18n.language,
                                    )
                                  : field.type === "select"
                                    ? enumLabel(String(entry[field.key]), c)
                                    : String(entry[field.key])}
                              </dd>
                            </div>
                          ))}
                      </dl>
                      {entry.notes && (
                        <p className={styles.recordNotes}>
                          {String(entry.notes)}
                        </p>
                      )}
                    </article>
                  ))}
              </div>
            )}
          </>
        )}
      </div>
      {recordForm && write && (
        <ClinicalForm
          member={member}
          kind={recordForm.kind}
          entry={recordForm.entry}
          onClose={() => setRecordForm(null)}
          onSaved={changed}
        />
      )}
      {deleteEntry && write && (
        <DeleteDialog
          title={c("Remove this record?", "Bu qeyd silinsin?")}
          description={`${member.fullName} · ${deleteEntry.entry[recordDefinitions[deleteEntry.kind].titleKey]}`}
          onClose={() => setDeleteEntry(null)}
          onDelete={async () => {
            await healthApi.remove(
              member.id,
              deleteEntry.kind,
              deleteEntry.entry.id,
            );
            changed();
            setNotice(c("Record removed.", "Qeyd silindi."));
          }}
        />
      )}
      {editingMember && write && (
        <MemberForm
          familyId={family.id}
          member={member}
          onClose={() => setEditingMember(false)}
          onSaved={(saved) => {
            setEditingMember(false);
            onMemberSaved(saved);
            setNotice(c("Member updated.", "Üzv yeniləndi."));
          }}
        />
      )}
      {removingMember && write && (
        <DeleteDialog
          title={c("Remove family member?", "Ailə üzvü silinsin?")}
          description={`${member.fullName}. ${c("This member will no longer appear in your family list.", "Bu üzv artıq ailə siyahısında görünməyəcək.")}`}
          onClose={() => setRemovingMember(false)}
          onDelete={async () => {
            await healthApi.deleteMember(member.id);
            onMemberRemoved(member.id);
          }}
        />
      )}
    </>
  );
}
function ErrorBlock({ error, retry }: { error: string; retry: () => void }) {
  const c = usePublicCopy();
  return (
    <div role="alert" className={styles.error}>
      {error}
      <button onClick={retry}>{c("Retry", "Yenidən cəhd et")}</button>
    </div>
  );
}
function AuditHistory({
  memberId,
  version,
}: {
  memberId: number;
  version: number;
}) {
  const c = usePublicCopy();
  const { i18n } = useTranslation();
  const [retry, setRetry] = useState(0);
  const resource = useResource(
    `${memberId}.${version}.${retry}`,
    (signal) => healthApi.history(memberId, signal),
    c(
      "Could not load record history.",
      "Qeyd tarixçəsini yükləmək mümkün olmadı.",
    ),
  );
  return (
    <section>
      <div className={styles.sectionToolbar}>
        <div>
          <h2>{c("Record history", "Qeyd tarixçəsi")}</h2>
          <p>
            {c(
              "Who changed the clinical record, and when.",
              "Klinik qeydləri kim və nə vaxt dəyişib.",
            )}
          </p>
        </div>
        <History size={24} />
      </div>
      {resource.loading ? (
        <p role="status" className={styles.loading}>
          {c("Loading history…", "Tarixçə yüklənir…")}
        </p>
      ) : resource.error ? (
        <ErrorBlock
          error={resource.error}
          retry={() => setRetry((n) => n + 1)}
        />
      ) : !resource.data?.length ? (
        <div className={styles.empty}>
          {c(
            "No clinical changes recorded yet.",
            "Hələ klinik dəyişiklik qeydə alınmayıb.",
          )}
        </div>
      ) : (
        <ol className={styles.auditList}>
          {resource.data.map((revision) => (
            <li key={revision.id}>
              <span className={styles.auditDot} />
              <div>
                <h3>
                  {enumLabel(revision.recordType, c)} ·{" "}
                  {enumLabel(revision.action, c)}
                </h3>
                <p>
                  {revision.changedByName ||
                    c("Name not recorded", "Ad qeyd edilməyib")}{" "}
                  · {dateLabel(revision.createdAt, i18n.language)} ·{" "}
                  {new Date(revision.createdAt).toLocaleTimeString(
                    i18n.language,
                    { hour: "2-digit", minute: "2-digit" },
                  )}
                </p>
                <Snapshot revision={revision} />
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
function Snapshot({ revision }: { revision: Revision }) {
  const c = usePublicCopy();
  let snapshot: Record<string, unknown>;
  try {
    snapshot = JSON.parse(revision.snapshot);
    if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot))
      return null;
  } catch {
    return null;
  }
  return (
    <details className={styles.snapshot}>
      <summary>{c("Recorded details", "Qeyd edilmiş təfərrüatlar")}</summary>
      <dl>
        {Object.entries(snapshot)
          .filter(([, value]) => value !== null && typeof value !== "object")
          .map(([key, value]) => (
            <div key={key}>
              <dt>
                {Object.values(recordDefinitions)
                  .flatMap((d) => d.fields)
                  .find((f) => f.key === key)?.label
                  ? c(
                      ...Object.values(recordDefinitions)
                        .flatMap((d) => d.fields)
                        .find((f) => f.key === key)!.label,
                    )
                  : key}
              </dt>
              <dd>
                {typeof value === "boolean"
                  ? value
                    ? c("Yes", "Bəli")
                    : c("No", "Xeyr")
                  : String(value)}
              </dd>
            </div>
          ))}
      </dl>
    </details>
  );
}
