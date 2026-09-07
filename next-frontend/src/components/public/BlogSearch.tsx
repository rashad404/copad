"use client";
import { useState, useId } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
export default function BlogSearch({
  className = "",
  initialQuery = "",
}: {
  className?: string;
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  const { t } = useTranslation();
  const id = useId();
  return (
    <form
      role="search"
      className={`public-search ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        if (query.trim())
          router.push(`/blog/search?q=${encodeURIComponent(query.trim())}`);
      }}
    >
      <label htmlFor={id} className="sr-only">
        {t("blog.search.title")}
      </label>
      <Search size={18} aria-hidden="true" />
      <input
        id={id}
        type="search"
        value={query}
        placeholder={t("blog.search.placeholder")}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" aria-label={t("blog.search.button")}>
        <span>{t("blog.search.button")}</span> {'->'}
      </button>
    </form>
  );
}
