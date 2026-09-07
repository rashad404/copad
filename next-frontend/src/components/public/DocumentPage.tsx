"use client";
import { useTranslation } from "react-i18next";
import { useSiteContext } from "@/context/SiteContext";
import ProductLayout, { PageIntro, usePublicCopy } from "./ProductLayout";
export default function DocumentPage({
  namespace,
  sections,
}: {
  namespace: string;
  sections: string[];
}) {
  const { t } = useTranslation();
  const site = useSiteContext();
  const c = usePublicCopy();
  const options = { agentName: site.AGENT_NAME };
  return (
    <ProductLayout>
      <div className="public-container">
        <PageIntro
          eyebrow={c("Trust & transparency", "Etibar və şəffaflıq")}
          title={t(`${namespace}.title`)}
          description={t(`${namespace}.introduction`, options)}
        />
        <div className="public-document">
          <nav
            className="public-toc"
            aria-label={c("On this page", "Bu səhifədə")}
          >
            <p className="public-eyebrow">{c("On this page", "Bu səhifədə")}</p>
            {sections.map((key, i) => (
              <a href={`#${key}`} key={key}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {t(`${namespace}.${key}.title`)}
              </a>
            ))}
          </nav>
          <div className="public-document-body">
            {sections.map((key, i) => (
              <section id={key} key={key}>
                <span className="public-section-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2>{t(`${namespace}.${key}.title`)}</h2>
                <p>{t(`${namespace}.${key}.description`, options)}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </ProductLayout>
  );
}
