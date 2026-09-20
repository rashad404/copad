"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/api/axios";

type PendingReview = {
  id: number;
  rating: number;
  comment: string | null;
  authorName: string;
  trust: "GUEST" | "REGISTERED" | "VERIFIED";
  createdAt: string;
  doctorSlug: string;
  doctorName: string;
};

/**
 * The moderation queue.
 *
 * Guest reviews wait here, because anybody can type a name and a paragraph
 * about a named doctor, and what gets published under their photograph is our
 * responsibility. Reviews from accounts and from patients who attended an
 * appointment do not appear here: they are published as they are written.
 */
export default function ReviewModeration() {
  const [reviews, setReviews] = useState<PendingReview[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get<{ reviews: PendingReview[] }>(
        "/admin/reviews?size=50",
      );
      setReviews(data.reviews);
      setError(null);
    } catch {
      setError("Rəyləri yükləmək mümkün olmadı.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function decide(id: number, publish: boolean) {
    // A refusal asks for a reason. It is never shown to the person who wrote
    // the review; it is so the next moderator can see why this one went.
    const note = publish ? "" : window.prompt("Səbəb (yalnız daxili qeyd):") ?? "";
    if (!publish && note === null) return;
    setBusy(id);
    try {
      await api.post(`/admin/reviews/${id}`, { publish, note });
      setReviews((current) => (current ?? []).filter((r) => r.id !== id));
    } catch {
      setError("Əməliyyat alınmadı.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="text-gray-900 dark:text-gray-100">
      <h1 className="mb-2 text-2xl font-semibold">Gözləyən rəylər</h1>
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
        Qonaq rəyləri burada gözləyir. Qeydiyyatlı istifadəçilərin və randevuda
        olmuş xəstələrin rəyləri birbaşa dərc olunur.
      </p>

      {error && (
        <p role="alert" className="mb-4 text-red-700 dark:text-red-300">
          {error}{" "}
          <button className="underline" onClick={() => void load()}>
            Yenidən cəhd et
          </button>
        </p>
      )}

      {reviews === null ? (
        <p role="status">Yüklənir...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          Gözləyən rəy yoxdur.
        </p>
      ) : (
        <ul className="grid gap-4">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
            >
              <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <strong>{"★".repeat(review.rating)}</strong>
                <span>{review.authorName}</span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800">
                  {review.trust}
                </span>
                <a
                  className="underline"
                  href={`/hekimler/${review.doctorSlug}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {review.doctorName}
                </a>
                <span className="text-gray-500">
                  {new Date(review.createdAt).toLocaleString("en-GB")}
                </span>
              </div>
              {review.comment && (
                <p className="mb-3 whitespace-pre-line">{review.comment}</p>
              )}
              <div className="flex gap-2">
                <button
                  className="rounded bg-gray-900 px-3 py-1.5 text-sm text-white disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900"
                  disabled={busy === review.id}
                  onClick={() => decide(review.id, true)}
                >
                  Dərc et
                </button>
                <button
                  className="rounded border px-3 py-1.5 text-sm disabled:opacity-50"
                  disabled={busy === review.id}
                  onClick={() => decide(review.id, false)}
                >
                  Rədd et
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
