'use client';

import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/layouts/MainLayout';
import { useSiteContext } from '@/context/SiteContext';

export default function FAQPage() {
  const { t } = useTranslation();
  const { AGENT_NAME } = useSiteContext();

  const getFaqs = (agentName: string) => [
    {
      question: `What is ${agentName}?`,
      answer: `${agentName} is an AI-powered medical assistant that provides instant, confidential health advice. Our platform uses advanced artificial intelligence to offer personalized medical guidance 24/7.`
    },
    {
      question: `How does ${agentName} work?`,
      answer: `Simply describe your symptoms or health concerns, and our AI doctor will provide immediate, professional medical advice. The system analyzes your input and generates responses based on medical knowledge and best practices.`
    },
    {
      question: `Is ${agentName} a replacement for real doctors?`,
      answer: `No, ${agentName} is not a replacement for professional medical care. It's designed to provide initial guidance and information. Always consult with a healthcare professional for serious medical conditions or emergencies.`
    },
    {
      question: "Is my information secure?",
      answer: "Yes, we take your privacy seriously. All conversations are encrypted and confidential. We follow strict data protection protocols to ensure your health information remains secure."
    },
    {
      question: "Do I need to create an account?",
      answer: `No, you can use ${agentName} without creating an account. However, creating an account allows you to save your consultations and track your health history.`
    },
    {
      question: "What kind of medical advice can I get?",
      answer: `You can ask about symptoms, general health concerns, medication information, and lifestyle advice. However, ${agentName} cannot diagnose serious conditions or prescribe medications.`
    },
    {
      question: "Is the service available 24/7?",
      answer: `Yes, ${agentName} is available around the clock. You can get medical advice whenever you need it, without waiting for office hours.`
    },
    {
      question: "How accurate is the medical advice?",
      answer: `While ${agentName} provides information based on medical knowledge and best practices, it's important to remember that it's not a substitute for professional medical advice. Always consult with a healthcare provider for serious concerns.`
    }
  ];
  
  const faqs = getFaqs(AGENT_NAME);

  return (
    <MainLayout>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t("faq.title", "Frequently Asked Questions")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t("faq.subtitle", "Find answers to common questions about our service")}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t(`faq.questions.${index}.question`, faq.question, { agentName: AGENT_NAME })}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t(`faq.questions.${index}.answer`, faq.answer, { agentName: AGENT_NAME })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </MainLayout>
  );
}