"use client";
import { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { Download, LoaderCircle } from "lucide-react";
import { healthApi } from "@/api/healthRecord";
import { usePublicCopy } from "@/components/public/ProductLayout";
import { readableError } from "./model";
import styles from "./health.module.css";

async function pdfError(error: unknown, fallback: string): Promise<string> {
  if (isAxiosError(error) && error.response?.data instanceof Blob) {
    try {
      const text = await error.response.data.text();
      if (
        error.response.data.type.startsWith("text/plain") &&
        text.trim() &&
        !text.trim().startsWith("<")
      )
        return text;
      const parsed: unknown = JSON.parse(text);
      if (parsed && typeof parsed === "object")
        for (const key of ["message", "detail", "error"]) {
          const message = (parsed as Record<string, unknown>)[key];
          if (typeof message === "string" && message.trim()) return message;
        }
    } catch {
      /* Fall back to a safe message for non-JSON binary responses. */
    }
    return fallback;
  }
  return readableError(error, fallback);
}
export default function SummaryDownload({ memberId }: { memberId: number }) {
  const c = usePublicCopy();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const request = useRef<AbortController | null>(null);
  const downloads = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  useEffect(() => {
    const pendingDownloads = downloads.current;
    return () => {
      request.current?.abort();
      for (const [url, timer] of pendingDownloads) {
        clearTimeout(timer);
        URL.revokeObjectURL(url);
      }
      pendingDownloads.clear();
    };
  }, [memberId]);
  async function download() {
    if (request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setBusy(true);
    setError("");
    setReady(false);
    const fallback = c(
      "Could not download the summary. Please try again.",
      "Xülasəni endirmək mümkün olmadı. Yenidən cəhd edin.",
    );
    try {
      const blob = await healthApi.summaryPdf(memberId, controller.signal);
      if (controller.signal.aborted) return;
      if (!blob.size || !blob.type.toLowerCase().startsWith("application/pdf"))
        throw new Error("Invalid PDF response");
      // Keep the server PDF bytes and Unicode text exactly as returned.
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `azdoc-summary-${memberId}.pdf`;
      link.hidden = true;
      document.body.appendChild(link);
      try {
        link.click();
      } finally {
        link.remove();
        const timer = setTimeout(() => {
          URL.revokeObjectURL(url);
          downloads.current.delete(url);
        }, 60000);
        downloads.current.set(url, timer);
      }
      setReady(true);
    } catch (err) {
      const message = await pdfError(err, fallback);
      if (!controller.signal.aborted) setError(message);
    } finally {
      if (!controller.signal.aborted) {
        request.current = null;
        setBusy(false);
      }
    }
  }
  return (
    <div className={styles.summaryDownload}>
      <button
        type="button"
        className={styles.secondary}
        disabled={busy}
        onClick={() => void download()}
      >
        {busy ? (
          <LoaderCircle size={16} className={styles.summarySpinner} />
        ) : (
          <Download size={16} />
        )}
        {busy
          ? c("Preparing summary…", "Xülasə hazırlanır…")
          : c("Download summary", "Həkim üçün xülasə")}
      </button>
      {error && (
        <p role="alert" className={styles.summaryError}>
          {error}
        </p>
      )}
      {ready && (
        <span role="status" className={styles.summaryStatus}>
          {c("Download started.", "Endirmə başladı.")}
        </span>
      )}
    </div>
  );
}
