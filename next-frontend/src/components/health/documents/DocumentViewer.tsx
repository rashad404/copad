"use client";
import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { documentsApi, type MemberDocument } from "@/api/documents";
import { usePublicCopy } from "@/components/public/ProductLayout";
import { RecordDialog } from "../RecordForms";
import { readableError } from "../model";
import health from "../health.module.css";
import styles from "./documents.module.css";
export default function DocumentViewer({
  memberId,
  document,
  onClose,
}: {
  memberId: number;
  document: Pick<MemberDocument, "id" | "title">;
  onClose: () => void;
}) {
  const c = usePublicCopy();
  const [retry, setRetry] = useState(0);
  const [file, setFile] = useState<{
    url: string;
    type: string;
    text?: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [imageFailed, setImageFailed] = useState(false);
  const fallback = c(
    "Could not open the document. Please try again.",
    "Sənədi açmaq mümkün olmadı. Yenidən cəhd edin.",
  );
  useEffect(() => {
    const controller = new AbortController();
    let url: string | undefined;
    setFile(null);
    setError("");
    setImageFailed(false);
    documentsApi
      .content(memberId, document.id, controller.signal)
      .then(async (blob) => {
        const text = blob.type.startsWith("text/plain")
          ? await blob.text()
          : undefined;
        if (controller.signal.aborted) return;
        url = URL.createObjectURL(blob);
        setFile({ url, type: blob.type.split(";")[0].toLowerCase(), text });
      })
      .catch(async (err) => {
        let message = readableError(err, fallback);
        if (isAxiosError(err) && err.response?.data instanceof Blob) {
          try {
            const body = JSON.parse(await err.response.data.text());
            if (typeof body.message === "string") message = body.message;
          } catch {
            /* Keep the safe fallback. */
          }
        }
        if (!controller.signal.aborted) setError(message);
      });
    return () => {
      controller.abort();
      if (url) URL.revokeObjectURL(url);
    };
  }, [memberId, document.id, retry, fallback]);
  return (
    <RecordDialog
      title={document.title || c("Original document", "Sənədin əsli")}
      onClose={onClose}
    >
      <div className={styles.viewer}>
        {error ? (
          <div role="alert" className={health.error}>
            {error}
            <button onClick={() => setRetry((n) => n + 1)}>
              {c("Retry", "Yenidən cəhd et")}
            </button>
          </div>
        ) : !file ? (
          <p role="status">{c("Opening document...", "Sənəd açılır...")}</p>
        ) : (
          <>
            {file.type === "application/pdf" ? (
              <iframe
                title={c("Original PDF", "PDF sənədin əsli")}
                src={file.url}
              />
            ) : file.type.startsWith("image/") && !imageFailed ? (
              // The authenticated blob is local and must not pass through an image proxy.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={file.url}
                alt={document.title || c("Original document", "Sənədin əsli")}
                onError={() => setImageFailed(true)}
              />
            ) : file.text !== undefined ? (
              <pre>{file.text}</pre>
            ) : (
              <p>
                {c(
                  "Your browser cannot preview this format. Download the saved file to open it.",
                  "Brauzer bu faylı göstərə bilmir. Açmaq üçün faylı yükləyin.",
                )}
              </p>
            )}
            <a
              className={health.secondary}
              href={file.url}
              download={document.title || "document"}
            >
              {c("Download original", "Sənədin əslini yüklə")}
            </a>
          </>
        )}
      </div>
    </RecordDialog>
  );
}
