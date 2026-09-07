"use client";
import { documentDateLabel as dateLabel } from "./model";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  documentsApi,
  type DocumentType,
  type MemberDocument,
} from "@/api/documents";
import type { RecordKind } from "@/api/healthRecord";
import { usePublicCopy } from "@/components/public/ProductLayout";
import { useResource } from "../useResource";
import { readableError } from "../model";
import { RecordDialog } from "../RecordForms";
import { Flag } from "../Vitals";
import {
  confirmedLabs,
  documentTypes,
  extracting,
  sortedDocuments,
} from "./model";
import UploadDocument from "./UploadDocument";
import DocumentViewer from "./DocumentViewer";
import ProposalReview, { ProposalCard, type Proposal } from "./ProposalReview";
import LabTrend from "./LabTrend";
import styles from "./documents.module.css";
import health from "../health.module.css";
export type DocumentTab = "documents" | "labs" | "prescription-review";
export default function DocumentWorkspace({
  memberId,
  tab,
  write,
  onChanged,
  onManual,
}: {
  memberId: number;
  tab: DocumentTab;
  write: boolean;
  onChanged: () => void;
  onManual: (kind: RecordKind) => void;
}) {
  const c = usePublicCopy();
  const { i18n } = useTranslation();
  const [docs, setDocs] = useState<MemberDocument[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const [reload, setReload] = useState(0),
    [version, setVersion] = useState(0),
    [oldest, setOldest] = useState(false);
  const [upload, setUpload] = useState<DocumentType | null>(null),
    [viewer, setViewer] = useState<Pick<MemberDocument, "id" | "title"> | null>(
      null,
    );
  const [review, setReview] = useState<{
    proposal: Proposal;
    action: "accept" | "edit" | "reject";
  } | null>(null);
  const [deleting, setDeleting] = useState<MemberDocument | null>(null),
    [notice, setNotice] = useState("");
  const [manual, setManual] = useState(false);
  const [analyte, setAnalyte] = useState("");
  const prior = useRef(new Map<number, string>());
  const loadError = c(
    "Could not load documents. Retry to resume status updates.",
    "Sənədləri yükləmək mümkün olmadı. Vəziyyəti yeniləmək üçün təkrar cəhd edin.",
  );
  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    async function poll() {
      try {
        const rows = await documentsApi.list(memberId, controller.signal);
        if (controller.signal.aborted) return;
        if (
          rows.some(
            (d) =>
              prior.current.has(d.id) &&
              prior.current.get(d.id) !== d.extractionStatus &&
              !extracting(d),
          )
        )
          setVersion((n) => n + 1);
        prior.current = new Map(rows.map((d) => [d.id, d.extractionStatus]));
        setDocs(rows);
        setError("");
        setLoading(false);
        if (rows.some(extracting)) timer = setTimeout(poll, 4000);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(readableError(err, loadError));
          setLoading(false);
        }
      }
    }
    void poll();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [memberId, reload, loadError]);
  const fallback = c(
    "Could not load results. Please try again.",
    "Nəticələri yükləmək mümkün olmadı. Yenidən cəhd edin.",
  );
  const labs = useResource(
    `${memberId}.labs.${version}.${reload}.${tab}`,
    (signal) =>
      tab === "labs"
        ? documentsApi.labs(memberId, signal)
        : Promise.resolve([]),
    fallback,
  );
  const pendingLabs = useResource(
    `${memberId}.pending.${version}.${reload}.${tab}`,
    (signal) =>
      tab === "labs"
        ? documentsApi.pendingLabs(memberId, signal)
        : Promise.resolve([]),
    fallback,
  );
  const prescriptions = useResource(
    `${memberId}.prescriptions.${version}.${reload}.${tab}`,
    (signal) =>
      tab === "prescription-review"
        ? documentsApi.pendingMedications(memberId, signal)
        : Promise.resolve([]),
    fallback,
  );
  const confirmed = confirmedLabs(labs.data || []);
  const analytes = [
    ...new Map(confirmed.map((r) => [r.analyteKey, r.analyte])).entries(),
  ].sort((a, b) =>
    a[1].localeCompare(b[1], i18n.language.startsWith("az") ? "az" : "en"),
  );
  const selectedAnalyte = analytes.some(([key]) => key === analyte)
    ? analyte
    : analytes[0]?.[0];
  const openSource = (id: number) =>
    setViewer(docs.find((d) => d.id === id) || { id, title: null });
  const pending = tab === "labs" ? pendingLabs : prescriptions;
  function reviewed() {
    setReview(null);
    setVersion((n) => n + 1);
    setNotice(c("Review saved.", "Yoxlamanın nəticəsi saxlanıldı."));
    onChanged();
  }
  const heading =
    tab === "documents"
      ? c("Documents", "Sənədlər")
      : tab === "labs"
        ? c("Lab results", "Analiz nəticələri")
        : c("Prescription review", "Reseptin yoxlanması");
  function status(doc: MemberDocument) {
    switch (doc.extractionStatus) {
      case "PENDING":
      case "PROCESSING":
        return c(
          "File saved. Reading the document... You can upload another file.",
          "Fayl saxlanıldı. Sənəd oxunur... Başqa fayl da əlavə edə bilərsiniz.",
        );
      case "COMPLETED":
        return c(
          "File read. Any extracted results still need confirmation in Lab results or Prescription review.",
          "Sənəd oxundu. Tapılan məlumatları Analiz nəticələri və ya Reseptin yoxlanması bölməsində təsdiqləyin.",
        );
      case "SKIPPED":
        return c(
          "File saved, but no readable text was found. This is common with photos.",
          "Fayl saxlanıldı, amma oxuna bilən mətn tapılmadı. Şəkillərdə bu hal ola bilər.",
        );
      case "FAILED":
        return c(
          "File saved, but reading failed. You can enter a health record manually.",
          "Fayl saxlanıldı, amma onu oxumaq mümkün olmadı. Sağlamlıq qeydini özünüz əlavə edə bilərsiniz.",
        );
      default:
        return c(
          "File saved. Extraction status unavailable.",
          "Fayl saxlanıldı. Oxunma vəziyyəti məlum deyil.",
        );
    }
  }
  return (
    <div className={styles.stack}>
      <div className={styles.toolbar}>
        <div>
          <h2>{heading}</h2>
          <p>
            {tab === "documents"
              ? c(
                  "Reports, images and prescriptions for the selected person.",
                  "Seçilmiş şəxsə aid analiz cavabları, görüntülər və reseptlər.",
                )
              : c(
                  "Extracted information is a proposal, not record data. Check every value against the original before confirming.",
                  "Sənəddən oxunan məlumat hələ sağlamlıq qeydi deyil. Təsdiqləməzdən əvvəl hər nəticəni sənədin əsli ilə tutuşdurun.",
                )}
          </p>
        </div>
        {write ? (
          <button
            className={styles.primary}
            onClick={() =>
              setUpload(
                tab === "labs"
                  ? "LAB_RESULT"
                  : tab === "prescription-review"
                    ? "PRESCRIPTION"
                    : "OTHER",
              )
            }
          >
            {c("Upload document", "Sənəd əlavə et")}
          </button>
        ) : (
          <span className={styles.muted}>
            {c("Read-only access", "Yalnız baxış hüququ")}
          </span>
        )}
      </div>
      {notice && (
        <p role="status" className={health.notice}>
          {notice}
        </p>
      )}
      {error && (
        <div role="alert" className={health.error}>
          {error}
          <button onClick={() => setReload((n) => n + 1)}>
            {c("Retry", "Yenidən cəhd et")}
          </button>
        </div>
      )}
      {tab !== "documents" && docs.some(extracting) && (
        <p role="status" className={styles.status}>
          {c(
            "Documents are still being read. New proposals will appear when extraction finishes.",
            "Sənədlər hələ oxunur. Oxunma bitdikdə tapılan məlumatlar burada görünəcək.",
          )}
        </p>
      )}
      {tab === "documents" ? (
        <>
          <label className={styles.field}>
            {c("Sort by document date", "Sənədin tarixinə görə sırala")}
            <select
              value={oldest ? "oldest" : "newest"}
              onChange={(e) => setOldest(e.target.value === "oldest")}
            >
              <option value="newest">
                {c("Newest first", "Ən yeni əvvəl")}
              </option>
              <option value="oldest">
                {c("Oldest first", "Ən köhnə əvvəl")}
              </option>
            </select>
          </label>
          {loading ? (
            <p role="status">
              {c("Loading documents...", "Sənədlər yüklənir...")}
            </p>
          ) : !docs.length && !error ? (
            <div className={styles.empty}>
              <h3>{c("No documents yet", "Hələ sənəd yoxdur")}</h3>
              <p>
                {c(
                  "Uploaded files will appear here. Extracted values remain unconfirmed until reviewed.",
                  "Əlavə edilmiş sənədlər burada görünəcək. Oxunan məlumatlar yoxlanana qədər təsdiqlənməmiş qalır.",
                )}
              </p>
            </div>
          ) : (
            <div className={styles.list}>
              {sortedDocuments(docs, oldest).map((doc) => (
                <article key={doc.id} className={styles.document}>
                  <div className={styles.toolbar}>
                    <div>
                      <h3>
                        {doc.title || c("Untitled document", "Adsız sənəd")}
                      </h3>
                      <p>
                        {doc.documentDate
                          ? dateLabel(doc.documentDate, i18n.language)
                          : c(
                              "Document date not provided",
                              "Sənədin tarixi göstərilməyib",
                            )}{" "}
                        -{" "}
                        {documentTypes[doc.documentType]
                          ? c(...documentTypes[doc.documentType])
                          : doc.documentType}
                      </p>
                      <p>
                        {doc.provider ||
                          c(
                            "Provider not provided",
                            "Tibb müəssisəsi göstərilməyib",
                          )}
                        {doc.sizeBytes != null &&
                          ` - ${(doc.sizeBytes / 1024 / 1024).toFixed(2)} MB`}
                      </p>
                    </div>
                    <div className={styles.actions}>
                      <button
                        className={health.secondary}
                        onClick={() => setViewer(doc)}
                      >
                        {c("Open", "Aç")}
                      </button>
                      {write && (
                        <button
                          className={styles.danger}
                          onClick={() => setDeleting(doc)}
                        >
                          {c("Delete", "Sil")}
                        </button>
                      )}
                    </div>
                  </div>
                  <p
                    className={styles.status}
                    role={extracting(doc) ? "status" : undefined}
                  >
                    {status(doc)}
                  </p>
                  {write &&
                    (doc.extractionStatus === "FAILED" ||
                      doc.extractionStatus === "SKIPPED") && (
                      <button
                        className={health.textButton}
                        onClick={() =>
                          doc.documentType === "PRESCRIPTION"
                            ? onManual("medications")
                            : setManual(true)
                        }
                      >
                        {c(
                          "Add a record manually",
                          "Sağlamlıq qeydini özüm əlavə edim",
                        )}
                      </button>
                    )}
                </article>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <section className={styles.section}>
            <h2>{c("Awaiting review", "Yoxlanılmalıdır")}</h2>
            {pending.loading ? (
              <p role="status">
                {c("Loading proposals...", "Oxunan məlumatlar yüklənir...")}
              </p>
            ) : pending.error ? (
              <div role="alert" className={health.error}>
                {pending.error}
                <button onClick={() => setReload((n) => n + 1)}>
                  {c("Retry", "Yenidən cəhd et")}
                </button>
              </div>
            ) : (
              <div className={styles.list}>
                {tab === "labs"
                  ? (pendingLabs.data || [])
                      .filter((r) => r.confirmed !== true)
                      .map((row) => (
                        <ProposalCard
                          key={row.id}
                          proposal={{ kind: "lab", row }}
                          write={write}
                          onSource={openSource}
                          onReview={(action) =>
                            setReview({
                              proposal: { kind: "lab", row },
                              action,
                            })
                          }
                        />
                      ))
                  : (prescriptions.data || [])
                      .filter((r) => r.confirmed !== true)
                      .map((row) => (
                        <ProposalCard
                          key={row.id}
                          proposal={{ kind: "medication", row }}
                          write={write}
                          onSource={openSource}
                          onReview={(action) =>
                            setReview({
                              proposal: { kind: "medication", row },
                              action,
                            })
                          }
                        />
                      ))}
                {!(pending.data || []).some((r) => r.confirmed !== true) && (
                  <p className={styles.empty}>
                    {c(
                      "No proposals awaiting review. This does not mean the person has no results or medications.",
                      "Yoxlanılmalı məlumat yoxdur. Bu, şəxsin analiz nəticəsi və ya qəbul etdiyi dərmanı olmadığı demək deyil.",
                    )}
                  </p>
                )}
              </div>
            )}
          </section>
          {tab === "labs" && (
            <section className={styles.section}>
              <h2>{c("Confirmed results", "Təsdiqlənmiş nəticələr")}</h2>
              <p className={styles.confirmed}>
                {c(
                  "Only confirmed values appear below and in charts.",
                  "Aşağıda və qrafiklərdə yalnız təsdiqlənmiş nəticələr göstərilir.",
                )}
              </p>
              {labs.loading ? (
                <p role="status">
                  {c("Loading results...", "Nəticələr yüklənir...")}
                </p>
              ) : labs.error ? (
                <div role="alert" className={health.error}>
                  {labs.error}
                  <button onClick={() => setReload((n) => n + 1)}>
                    {c("Retry", "Yenidən cəhd et")}
                  </button>
                </div>
              ) : !confirmed.length ? (
                <p className={styles.empty}>
                  {c(
                    "No confirmed lab results yet.",
                    "Hələ təsdiqlənmiş analiz nəticəsi yoxdur.",
                  )}
                </p>
              ) : (
                <>
                  <label className={styles.field}>
                    {c("Analyte history", "Analiz üzrə tarixçə")}
                    <select
                      value={selectedAnalyte}
                      onChange={(e) => setAnalyte(e.target.value)}
                    >
                      {analytes.map(([key, name]) => (
                        <option key={key} value={key}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </label>
                  {selectedAnalyte && (
                    <LabTrend
                      key={selectedAnalyte}
                      memberId={memberId}
                      analyteKey={selectedAnalyte}
                      version={version + reload}
                    />
                  )}
                  <div className={styles.table}>
                    <table>
                      <caption>
                        {c(
                          "All confirmed results",
                          "Bütün təsdiqlənmiş nəticələr",
                        )}
                      </caption>
                      <thead>
                        <tr>
                          <th>{c("Analyte", "Analiz")}</th>
                          <th>{c("Result", "Nəticə")}</th>
                          <th>{c("Reference", "Norma aralığı")}</th>
                          <th>{c("Flag", "Qiymətləndirmə")}</th>
                          <th>{c("Source", "Sənəd")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {confirmed.map((row) => (
                          <tr key={row.id}>
                            <td>{row.analyte}</td>
                            <td>
                              {row.displayValue ??
                                c("Not provided", "Göstərilməyib")}
                            </td>
                            <td>
                              {row.referenceLabel ??
                                c("Not provided", "Göstərilməyib")}
                            </td>
                            <td>
                              <Flag flag={row.abnormalFlag} />
                            </td>
                            <td>
                              {row.documentId != null ? (
                                <button
                                  className={health.textButton}
                                  onClick={() => openSource(row.documentId!)}
                                >
                                  {c("Original", "Sənədin əsli")}
                                </button>
                              ) : (
                                c("Not provided", "Göstərilməyib")
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </section>
          )}
        </>
      )}
      {write && upload && (
        <UploadDocument
          memberId={memberId}
          initialType={upload}
          onClose={() => setUpload(null)}
          onSaved={(doc) => {
            const duplicate = docs.some((d) => d.id === doc.id);
            prior.current.set(doc.id, doc.extractionStatus);
            setDocs((rows) => [doc, ...rows.filter((d) => d.id !== doc.id)]);
            setUpload(null);
            setReload((n) => n + 1);
            setVersion((n) => n + 1);
            setNotice(
              duplicate
                ? c(
                    "This file is already saved. Open the existing document below.",
                    "Bu fayl artıq saxlanılıb. Mövcud sənədə aşağıda baxa bilərsiniz.",
                  )
                : c(
                    "File saved. You can continue while it is being read.",
                    "Fayl saxlanıldı. Sənəd oxunana qədər başqa işə davam edə bilərsiniz.",
                  ),
            );
          }}
        />
      )}
      {viewer && (
        <DocumentViewer
          key={`${memberId}.${viewer.id}`}
          memberId={memberId}
          document={viewer}
          onClose={() => setViewer(null)}
        />
      )}
      {write && review && (
        <ProposalReview
          key={`${review.proposal.kind}.${review.proposal.row.id}.${review.action}`}
          memberId={memberId}
          {...review}
          onClose={() => setReview(null)}
          onSaved={reviewed}
        />
      )}
      {write && deleting && (
        <DeleteDocument
          memberId={memberId}
          document={deleting}
          onClose={() => setDeleting(null)}
          onDeleted={() => {
            setDocs((rows) => rows.filter((d) => d.id !== deleting.id));
            setDeleting(null);
            setReload((n) => n + 1);
            setVersion((n) => n + 1);
            onChanged();
          }}
        />
      )}
      {write && manual && (
        <RecordDialog
          title={c("Add a health record", "Sağlamlıq qeydi əlavə et")}
          onClose={() => setManual(false)}
        >
          <p className={styles.muted}>
            {c(
              "Choose what to record. Manual lab-result entry is not available yet; keep the original report saved.",
              "Əlavə etmək istədiyiniz qeydi seçin. Analiz nəticəsini əl ilə əlavə etmək hələ mümkün deyil; sənədin əsli saxlanır.",
            )}
          </p>
          <div className={styles.actions}>
            {(
              [
                ["conditions", c("Condition", "Xəstəlik")],
                ["allergies", c("Allergy", "Allergiya")],
                ["medications", c("Medication", "Dərman")],
                ["immunizations", c("Immunization", "Peyvənd")],
              ] as [RecordKind, string][]
            ).map(([kind, label]) => (
              <button
                key={kind}
                className={health.secondary}
                onClick={() => {
                  setManual(false);
                  onManual(kind);
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </RecordDialog>
      )}
    </div>
  );
}
function DeleteDocument({
  memberId,
  document,
  onClose,
  onDeleted,
}: {
  memberId: number;
  document: MemberDocument;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const c = usePublicCopy();
  const controller = useRef<AbortController | null>(null);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  useEffect(() => () => controller.current?.abort(), []);
  return (
    <RecordDialog
      title={c("Delete document?", "Sənəd silinsin?")}
      onClose={onClose}
      busy={busy}
    >
      <p>{document.title}</p>
      <p>
        {c(
          "The document will be removed from this member's documents.",
          "Sənəd bu şəxsin sənədləri siyahısından silinəcək.",
        )}
      </p>
      {error && (
        <p role="alert" className={health.error}>
          {error}
        </p>
      )}
      <div className={styles.actions}>
        <button className={health.secondary} onClick={onClose} disabled={busy}>
          {c("Cancel", "Ləğv et")}
        </button>
        <button
          className={styles.danger}
          disabled={busy}
          onClick={async () => {
            if (controller.current) return;
            const request = new AbortController();
            controller.current = request;
            setBusy(true);
            setError("");
            try {
              await documentsApi.remove(memberId, document.id, request.signal);
              if (!request.signal.aborted) onDeleted();
            } catch (err) {
              if (!request.signal.aborted)
                setError(
                  readableError(
                    err,
                    c(
                      "Could not delete document.",
                      "Sənədi silmək mümkün olmadı.",
                    ),
                  ),
                );
            } finally {
              if (!request.signal.aborted) {
                controller.current = null;
                setBusy(false);
              }
            }
          }}
        >
          {c("Delete", "Sil")}
        </button>
      </div>
    </RecordDialog>
  );
}
