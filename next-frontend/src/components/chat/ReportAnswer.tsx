"use client";

import { useState } from "react";
import api from "@/api/axios";
import { usePublicCopy } from "@/components/public/ProductLayout";

type Reason = "WRONG" | "HARMFUL" | "OFFENSIVE" | "OTHER";

/**
 * Reporting an answer.
 *
 * Every answer here is written by a model, and a person who has just been told
 * something wrong needs somewhere to say so without leaving the conversation
 * and without an account. It is also what Google Play requires of an app whose
 * content is generated this way.
 *
 * Deliberately quiet: a small link under the answer, opening only when asked.
 * A prominent complaint button under every reply would make the assistant look
 * untrustworthy in the ordinary case, where it is not.
 */
export default function ReportAnswer({
  messageId,
  sessionId,
}: {
  messageId: number;
  sessionId: string | null;
}) {
  const c = usePublicCopy();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<Reason>("WRONG");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);

  const reasons: { value: Reason; label: string }[] = [
    {
      value: "WRONG",
      label: c("The information is wrong", "Məlumat yanlışdır", "Информация неверна"),
    },
    {
      value: "HARMFUL",
      label: c(
        "This advice could hurt someone",
        "Bu məsləhət zərər verə bilər",
        "Этот совет может навредить",
      ),
    },
    {
      value: "OFFENSIVE",
      label: c("It is offensive", "Təhqiredicidir", "Это оскорбительно"),
    },
    {
      value: "OTHER",
      label: c("Something else", "Başqa səbəb", "Другое"),
    },
  ];

  async function send() {
    setBusy(true);
    setFailed(false);
    try {
      await api.post(
        "/guest/answers/report",
        { messageId, reason, note: note.trim() || null },
        sessionId ? { headers: { "X-Guest-Session-Id": sessionId } } : undefined,
      );
      setDone(true);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <p className="mt-2 text-xs text-gray-500" role="status">
        {c(
          "Thank you. A person will read this answer.",
          "Təşəkkür edirik. Bu cavabı bir nəfər oxuyacaq.",
          "Спасибо. Этот ответ прочитает человек.",
        )}
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-2 text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2"
      >
        {c("Report this answer", "Bu cavabı bildir", "Пожаловаться на ответ")}
      </button>
    );
  }

  return (
    <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
      <p className="mb-2 text-xs text-gray-600">
        {c(
          "What was wrong with this answer?",
          "Bu cavabda nə səhv idi?",
          "Что не так с этим ответом?",
        )}
      </p>
      <div className="flex flex-col gap-1">
        {reasons.map((option) => (
          <label key={option.value} className="flex items-center gap-2 text-xs">
            <input
              type="radio"
              name={`report-${messageId}`}
              checked={reason === option.value}
              onChange={() => setReason(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      <textarea
        rows={2}
        maxLength={1000}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={c(
          "Anything you want to add (optional)",
          "Əlavə etmək istədiyiniz (istəyə bağlı)",
          "Что хотите добавить (необязательно)",
        )}
        className="mt-2 w-full rounded border border-gray-300 p-2 text-xs"
      />
      {failed && (
        <p role="alert" className="mt-1 text-xs text-red-600">
          {c(
            "Could not send the report. Please try again.",
            "Bildirişi göndərmək mümkün olmadı. Yenidən cəhd edin.",
            "Не удалось отправить. Попробуйте снова.",
          )}
        </p>
      )}
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={send}
          className="rounded bg-gray-900 px-3 py-1 text-xs text-white disabled:opacity-50"
        >
          {busy
            ? c("Sending...", "Göndərilir...", "Отправка...")
            : c("Send", "Göndər", "Отправить")}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded px-3 py-1 text-xs text-gray-600"
        >
          {c("Cancel", "İmtina", "Отмена")}
        </button>
      </div>
    </div>
  );
}
