"use client";

import { useTranslation } from "react-i18next";
import ProductLayout, {
  PageIntro,
  usePublicCopy,
} from "@/components/public/ProductLayout";
import Link from "next/link";
import { useSiteContext } from "@/context/SiteContext";

export default function FAQPage() {
  const { t } = useTranslation();
  const { AGENT_NAME } = useSiteContext();

  const getFaqs = (agentName: string) => [
    {
      question: `What is ${agentName}?`,
      answer: `${agentName} is an AI-powered medical assistant that provides instant, confidential health advice. Our platform uses advanced artificial intelligence to offer personalized medical guidance 24/7.`,
    },
    {
      question: `How does ${agentName} work?`,
      answer: `Simply describe your symptoms or health concerns, and our AI doctor will provide immediate, professional medical advice. The system analyzes your input and generates responses based on medical knowledge and best practices.`,
    },
    {
      question: `Is ${agentName} a replacement for real doctors?`,
      answer: `No, ${agentName} is not a replacement for professional medical care. It's designed to provide initial guidance and information. Always consult with a healthcare professional for serious medical conditions or emergencies.`,
    },
    {
      question: "Is my information secure?",
      answer:
        "Yes, we take your privacy seriously. All conversations are encrypted and confidential. We follow strict data protection protocols to ensure your health information remains secure.",
    },
    {
      question: "Do I need to create an account?",
      answer: `No, you can use ${agentName} without creating an account. However, creating an account allows you to save your consultations and track your health history.`,
    },
    {
      question: "What kind of medical advice can I get?",
      answer: `You can ask about symptoms, general health concerns, medication information, and lifestyle advice. However, ${agentName} cannot diagnose serious conditions or prescribe medications.`,
    },
    {
      question: "Is the service available 24/7?",
      answer: `Yes, ${agentName} is available around the clock. You can get medical advice whenever you need it, without waiting for office hours.`,
    },
    {
      question: "How accurate is the medical advice?",
      answer: `While ${agentName} provides information based on medical knowledge and best practices, it's important to remember that it's not a substitute for professional medical advice. Always consult with a healthcare provider for serious concerns.`,
    },
  ];

  const faqs = getFaqs(AGENT_NAME);

  const c = usePublicCopy();
  return (
    <ProductLayout>
      <div className="public-container">
        <PageIntro
          eyebrow={c(
            "Good questions. Clear answers.",
            "Yaxşı suallar. Aydın cavablar.",
          )}
          title={t("faq.title")}
          description={t("faq.subtitle")}
        />
        <div className="public-faq-grid">
          <aside className="public-faq-aside">
            <p>
              {c(
                "A few things to know before your first conversation.",
                "İlk söhbətdən əvvəl bilməli olduğunuz bir neçə məqam.",
              )}
            </p>
            <Link href="/contact" className="public-text-link">
              {c("Still have a question?", "Başqa sualınız var?")} ↗
            </Link>
          </aside>
          <div className="public-faq-list">
            {faqs.map((faq, index) => (
              <details key={index}>
                <summary>
                  <span className="public-section-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {t(`faq.questions.${index}.question`, {
                    defaultValue: faq.question,
                    agentName: AGENT_NAME,
                  })}
                  <span className="public-faq-plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p>
                  {t(`faq.questions.${index}.answer`, {
                    defaultValue: faq.answer,
                    agentName: AGENT_NAME,
                  })}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </ProductLayout>
  );
}
