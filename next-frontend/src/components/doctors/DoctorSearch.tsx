"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles } from "lucide-react";
import api from "@/api/axios";
import type { DirectoryLanguage } from "./copy";
import { doctorCopy } from "./copy";
import styles from "./directory.module.css";

type Option = { code: string; label: string };
type ClinicOption = { slug: string; name: string; doctors?: number };

/**
 * The two ways into the directory.
 *
 * Most people arriving from a search engine do not know which department
 * treats what they have. They know what hurts. So the first mode takes a
 * sentence and turns it into filters, and the second is the ordinary bar for
 * people who already know the specialty or the name.
 *
 * The assistant only ever picks filters. What it decided is shown on the
 * results as chips that can be removed, because a wrong guess has to be one
 * click from being corrected rather than a dead end.
 */
export default function DoctorSearch({
  language,
  specialties,
  clinics,
  initial,
}: {
  language: DirectoryLanguage;
  specialties: Option[];
  clinics: ClinicOption[];
  initial: { q: string; specialty: string; city: string; clinic: string; language: string };
}) {
  const c = doctorCopy(language);
  const router = useRouter();
  const [mode, setMode] = useState<"ai" | "classic">("ai");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  async function askAssistant(event: React.FormEvent) {
    event.preventDefault();
    const asked = text.trim();
    if (!asked || busy) return;
    setBusy(true);
    try {
      const { data } = await api.post<{
        specialty: string | null;
        city: string | null;
        query: string | null;
        urgent: boolean;
      }>("/doctors/search-intent", { text: asked });

      const params = new URLSearchParams();
      if (data.specialty) params.set("specialty", data.specialty);
      if (data.city) params.set("city", data.city);
      if (data.query) params.set("q", data.query);
      if (data.urgent) params.set("urgent", "1");
      params.set("asked", asked);
      router.push(`/hekimler?${params.toString()}`);
    } catch {
      // The assistant is unreachable. The words still work as a search.
      router.push(`/hekimler?q=${encodeURIComponent(asked)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.searchArea}>
      <div className={styles.modes} role="tablist" aria-label={c.searchModes}>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "ai"}
          className={mode === "ai" ? styles.modeOn : styles.mode}
          onClick={() => setMode("ai")}
        >
          <Sparkles size={16} aria-hidden="true" />
          {c.aiMode}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "classic"}
          className={mode === "classic" ? styles.modeOn : styles.mode}
          onClick={() => setMode("classic")}
        >
          {c.classicMode}
        </button>
      </div>

      {mode === "ai" ? (
        <form className={styles.searchBar} onSubmit={askAssistant}>
          <label className={`${styles.field} ${styles.fieldWide}`}>
            <span>{c.aiLabel}</span>
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              maxLength={240}
              placeholder={c.aiPlaceholder}
              autoComplete="off"
            />
          </label>
          <button className={styles.searchGo} type="submit" disabled={busy}>
            <Search size={18} aria-hidden="true" />
            {busy ? c.searching : c.search}
          </button>
        </form>
      ) : (
        <form action="/hekimler" method="get" className={styles.searchBar}>
          <label className={styles.field}>
            <span>{c.name}</span>
            <input
              name="q"
              defaultValue={initial.q}
              maxLength={120}
              type="search"
              placeholder={c.namePlaceholder}
            />
          </label>
          <label className={styles.field}>
            <span>{c.specialty}</span>
            <select name="specialty" defaultValue={initial.specialty}>
              <option value="">{c.all}</option>
              {specialties.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            <span>{c.city}</span>
            <input
              name="city"
              defaultValue={initial.city}
              maxLength={120}
              placeholder={c.cityPlaceholder}
            />
          </label>
          <button className={styles.searchGo} type="submit">
            <Search size={18} aria-hidden="true" />
            {c.search}
          </button>

          <div className={styles.refine}>
            {(clinics.length > 0 || initial.clinic) && (
              <label className={styles.pill}>
                <select name="clinic" defaultValue={initial.clinic}>
                  <option value="">{c.clinic}</option>
                  {clinics.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.name}
                      {item.doctors ? ` (${item.doctors})` : ""}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label className={styles.pill}>
              <select name="language" defaultValue={initial.language}>
                <option value="">{c.language}</option>
                {(["az", "ru", "en"] as const).map((value) => (
                  <option key={value} value={value}>
                    {c[value]}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </form>
      )}
    </div>
  );
}
