"use client";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import ProductLayout, {
  PageIntro,
  usePublicCopy,
} from "@/components/public/ProductLayout";
export default function ContactPage() {
  const { t } = useTranslation();
  const c = usePublicCopy();
  return (
    <ProductLayout>
      <div className="public-container">
        <PageIntro
          eyebrow={c("We're here to help", "Kömək etməyə hazırıq")}
          title={t("contact.title")}
          description={t("contact.subtitle")}
        />
        <div className="public-contact-grid">
          <section className="public-contact-main">
            <Mail size={32} />
            <h2>{t("contact.email.title")}</h2>
            <p>{t("contact.email.description")}</p>
            <a className="public-email" href="mailto:info@azdoc.ai">
              info@azdoc.ai <ArrowUpRight />
            </a>
            <div className="public-divider" />
            <h3>{t("contact.support.title")}</h3>
            <p>{t("contact.support.description")}</p>
          </section>
          <aside className="public-sage-panel">
            <span className="public-eyebrow">
              {c("For health questions", "Sağlamlıq sualları üçün")}
            </span>
            <h2>{t("contact.medicalNote.title")}</h2>
            <p>{t("contact.medicalNote.description")}</p>
            <Link href="/chat" className="public-button">
              {c("Ask AzDoc", "AzDoc-dan soruş")}
              <ArrowUpRight size={18} />
            </Link>
            <Link href="/faq" className="public-text-link">
              {c("Browse common questions", "Tez-tez verilən suallar")} {'->'}
            </Link>
          </aside>
        </div>
        <p className="public-note">{t("contact.note")}</p>
      </div>
    </ProductLayout>
  );
}
