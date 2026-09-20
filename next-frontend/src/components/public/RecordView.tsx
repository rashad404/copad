"use client";

import { useEffect } from "react";
import api from "@/api/axios";

/**
 * Tells the server that somebody opened this page.
 *
 * From the browser rather than from the render, for two reasons. The page
 * itself is served from a five minute cache, so counting during the render
 * would count one visit however many people arrived in those minutes. And a
 * call made here carries the reader's own address and browser, which is what
 * the crawler and repeat-visit checks on the server actually need.
 *
 * It renders nothing and it never reports a failure: a counter is not worth a
 * message to somebody trying to read about their medicine.
 */
export default function RecordView({
  kind,
  slug,
}: {
  kind: "doctors" | "medicines";
  slug: string;
}) {
  useEffect(() => {
    // Strict mode runs effects twice in development; the server counts one
    // reader once per half hour anyway, so the second call is dropped there.
    let cancelled = false;
    const timer = setTimeout(() => {
      if (cancelled) return;
      void api.post(`/${kind}/${encodeURIComponent(slug)}/view`).catch(() => {});
    }, 800);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [kind, slug]);

  return null;
}
