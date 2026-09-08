"use client";
import { useTranslation } from "react-i18next";
import ProductLayout from "@/components/public/ProductLayout";
import { labCopy } from "@/components/labs/copy";
import d from "@/components/doctors/directory.module.css";
export default function LabError({ reset }: { reset: () => void }) {
  const { i18n } = useTranslation();
  const c = labCopy(i18n.resolvedLanguage || i18n.language);
  return (
    <ProductLayout>
      <div className={d.page} role="alert">
        <h1>{c.unavailable}</h1>
        <button className={d.button} onClick={reset}>
          {c.retry}
        </button>
      </div>
    </ProductLayout>
  );
}
