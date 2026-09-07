"use client";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ProductLayout, {
  PageIntro,
  usePublicCopy,
} from "@/components/public/ProductLayout";
export default function AboutPage() {
  const { t } = useTranslation();
  const c = usePublicCopy();
  return (
    <ProductLayout>
      <div className="public-container">
        <PageIntro
          eyebrow={c("A clearer way forward", "İrəliyə daha aydın yol")}
          title={t("about.title")}
          description={t("about.introduction")}
        />
        <div className="public-about-statement">
          <span className="public-eyebrow">AZDOC</span>
          <p>
            {c(
              "Health questions deserve a thoughtful conversation.",
              "Sağlamlıq sualları diqqətli söhbətə layiqdir.",
            )}
          </p>
          <Link href="/chat" className="public-button">
            {c("Start a conversation", "Söhbətə başla")}
            <ArrowUpRight size={19} />
          </Link>
        </div>
        <div className="public-editorial-rows">
          {["mission", "vision"].map((key, i) => (
            <section key={key}>
              <span className="public-section-number">0{i + 1}</span>
              <h2>{t(`about.${key}.title`)}</h2>
              <p>{t(`about.${key}.description`)}</p>
            </section>
          ))}
        </div>
        <section className="public-values">
          <h2>{t("about.values.title")}</h2>
          <ul>
            {["innovation", "quality", "accessibility", "privacy"].map(
              (key, i) => (
                <li key={key}>
                  <span>0{i + 1}</span>
                  {t(`about.values.items.${key}`)}
                </li>
              ),
            )}
          </ul>
        </section>
      </div>
    </ProductLayout>
  );
}
