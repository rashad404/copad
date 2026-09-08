"use client";

import { useHydrated } from "@/utils/useHydrated";
import { Manrope } from "next/font/google";
import { useTranslation } from "react-i18next";
import SiteHeader from "@/components/navigation/SiteHeader";
import SiteFooter from "./SiteFooter";
import "./public.css";
import russian from "@/translations/public.ru.json";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--public-font",
});
export function usePublicCopy() {
  const { i18n } = useTranslation();
  const hydrated = useHydrated();
  const language = (
    hydrated ? i18n.resolvedLanguage || i18n.language || "en" : "en"
  ).split("-")[0];
  return (en: string, azerbaijani: string, ru?: string) =>
    language === "az"
      ? azerbaijani
      : language === "ru"
        ? (ru ?? (russian as Record<string, string>)[en] ?? en)
        : en;
}

export default function ProductLayout({
  children,
  viewport = false,
}: {
  children: React.ReactNode;
  viewport?: boolean;
}) {
  const c = usePublicCopy();
  return (
    <div
      className={`public-app ${manrope.variable} ${viewport ? "public-viewport" : ""}`}
    >
      <a className="public-skip" href="#page-content">
        {c("Skip to content", "Məzmuna keç")}
      </a>
      <SiteHeader />
      <main id="page-content" className="public-main">
        {children}
      </main>
      {!viewport && <SiteFooter />}
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="public-intro">
      {eyebrow && <p className="public-eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {description && <p className="public-lead">{description}</p>}
    </header>
  );
}
