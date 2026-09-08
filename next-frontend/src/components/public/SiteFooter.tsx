"use client";

import Link from "next/link";
import BrandLogo from "@/components/brand/BrandLogo";
import { SLOGANS } from "@/components/brand/slogan";
import { useAuth } from "@/context/AuthContext";
import { useHydrated } from "@/utils/useHydrated";
import { usePublicCopy } from "./ProductLayout";
import "./public.css";

/**
 * The site footer, written once.
 *
 * The homepage used to carry its own: it linked to the blog but not to the
 * security page, and was styled a size smaller, so the footer changed as soon
 * as anybody left the front page. Both now render this.
 *
 * The blog link comes from the homepage version and is kept - unifying should
 * not quietly drop a way into a section of the site.
 */
export default function SiteFooter() {
  const c = usePublicCopy();
  const hydrated = useHydrated();
  const { isAuthenticated, logout } = useAuth();

  return (
    <footer className="public-footer">
      <div>
        <BrandLogo />
        <p>{c(SLOGANS.en, SLOGANS.az, SLOGANS.ru)}</p>
      </div>
      <nav aria-label={c("Footer", "Alt naviqasiya")}>
        {[
          ["/blog", c("Blog", "Bloq")],
          ["/contact", c("Contact", "Əlaqə")],
          ["/security", c("Security", "Təhlükəsizlik")],
          ["/privacy-policy", c("Privacy", "Məxfilik")],
          ["/terms-of-service", c("Terms", "Şərtlər")],
        ].map(([href, label]) => (
          <Link href={href} key={href}>
            {label}
          </Link>
        ))}
        {hydrated && isAuthenticated && (
          <button onClick={() => void logout()}>
            {c("Sign out", "Çıxış")}
          </button>
        )}
      </nav>
    </footer>
  );
}
