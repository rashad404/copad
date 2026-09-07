"use client";
import { useEffect, useRef, useState } from "react";
import {
  documentsApi,
  type DocumentType,
  type MemberDocument,
} from "@/api/documents";
import { usePublicCopy } from "@/components/public/ProductLayout";
import { RecordDialog } from "../RecordForms";
import { readableError } from "../model";
import { documentTypes } from "./model";
import health from "../health.module.css";
import styles from "./documents.module.css";
export default function UploadDocument({
  memberId,
  initialType,
  onClose,
  onSaved,
}: {
  memberId: number;
  initialType: DocumentType;
  onClose: () => void;
  onSaved: (document: MemberDocument) => void;
}) {
  const c = usePublicCopy();
  const request = useRef<AbortController | null>(null);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [progress, setProgress] = useState(0);
  useEffect(() => () => request.current?.abort(), []);
  return (
    <RecordDialog
      title={c("Upload document", "Sənəd əlavə et")}
      onClose={onClose}
      busy={busy}
    >
      <p className={styles.muted}>
        {c(
          "The file is saved first. Reading it continues in the background; extracted values need your review.",
          "Fayl əvvəlcə saxlanır, sonra oxunur. Oxunan məlumatlar yalnız yoxlayıb təsdiqlədikdən sonra sağlamlıq qeydinə əlavə olunur.",
        )}
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (request.current) return;
          const form = new FormData(e.currentTarget),
            file = form.get("file");
          if (!(file instanceof File) || !file.size) {
            setError(c("Choose a file.", "Fayl seçin."));
            return;
          }
          if (file.size > 25 * 1024 * 1024) {
            setError(
              c(
                "The file exceeds 25 MB. Choose a smaller file.",
                "Fayl 25 MB-dan böyükdür. Daha kiçik fayl seçin.",
              ),
            );
            return;
          }
          for (const name of ["title", "documentDate", "provider"])
            if (!String(form.get(name) || "").trim()) form.delete(name);
          const controller = new AbortController();
          request.current = controller;
          setBusy(true);
          setError("");
          setProgress(0);
          try {
            const doc = await documentsApi.upload(
              memberId,
              form,
              controller.signal,
              setProgress,
            );
            if (!controller.signal.aborted) onSaved(doc);
          } catch (err) {
            if (!controller.signal.aborted)
              setError(
                readableError(
                  err,
                  c(
                    "Upload failed. Please try again.",
                    "Faylı əlavə etmək mümkün olmadı. Yenidən cəhd edin.",
                  ),
                ),
              );
          } finally {
            if (!controller.signal.aborted) {
              request.current = null;
              setBusy(false);
            }
          }
        }}
      >
        <fieldset disabled={busy} className={styles.form}>
          <label className={`${styles.field} ${styles.wide}`}>
            {c("File", "Fayl")}
            <input
              type="file"
              name="file"
              required
              accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.tif,.tiff,.txt,.doc,.docx"
            />
          </label>
          <p className={`${styles.muted} ${styles.wide}`}>
            PDF, JPEG, PNG, WebP, HEIC, TIFF, TXT, DOC, DOCX.{" "}
            {c("Maximum 25 MB.", "Ən çox 25 MB.")}
          </p>
          <label className={styles.field}>
            {c("Document type", "Sənədin növü")}
            <select name="documentType" defaultValue={initialType}>
              {Object.entries(documentTypes).map(([value, label]) => (
                <option key={value} value={value}>
                  {c(...label)}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            {c("Title (optional)", "Başlıq (istəyə bağlı)")}
            <input name="title" maxLength={512} />
          </label>
          <label className={styles.field}>
            {c("Document date (optional)", "Sənədin tarixi (istəyə bağlı)")}
            <input name="documentDate" type="date" />
          </label>
          <label className={styles.field}>
            {c("Provider (optional)", "Tibb müəssisəsi (istəyə bağlı)")}
            <input name="provider" maxLength={255} />
          </label>
        </fieldset>
        {busy && (
          <div role="status">
            <progress className={styles.progress} max={100} value={progress} />
            {progress}% - {c("Uploading...", "Fayl göndərilir...")}
          </div>
        )}
        {error && (
          <p className={health.error} role="alert">
            {error}
          </p>
        )}
        <div className={styles.actions}>
          <button
            type="button"
            className={health.secondary}
            disabled={busy}
            onClick={onClose}
          >
            {c("Cancel", "Ləğv et")}
          </button>
          <button className={styles.primary} disabled={busy}>
            {c("Upload", "Əlavə et")}
          </button>
        </div>
      </form>
    </RecordDialog>
  );
}
