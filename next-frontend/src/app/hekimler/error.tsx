"use client";
import { useTranslation } from "react-i18next";
import ProductLayout from "@/components/public/ProductLayout";
import { supportedLanguage } from "@/utils/languages";
import { doctorCopy } from "@/components/doctors/copy";
import styles from "@/components/doctors/directory.module.css";
export default function DirectoryError({ reset }: { reset: () => void }) {
  const { i18n } = useTranslation();
  const c = doctorCopy(supportedLanguage(i18n.language) || "az");
  return (
    <ProductLayout>
      <div className={styles.page}>
        <section className={styles.empty} role="alert">
          <h1>{c.unavailable}</h1>
          <p>{c.retryText}</p>
          <button className={styles.button} onClick={reset}>
            {c.retry}
          </button>
        </section>
      </div>
    </ProductLayout>
  );
}
