"use client";
import { useMedicineCopy } from "@/components/medicines/useMedicineCopy";
import ProductLayout from "@/components/public/ProductLayout";
import styles from "@/components/medicines/medicines.module.css";
export default function ErrorPage({ reset }: { reset: () => void }) {
  const { language, copy: mc } = useMedicineCopy();
  return (
    <ProductLayout>
      <div lang={language} className={styles.page} role="alert">
        <h1> {mc("Məlumat yüklənmədi")} </h1>
        <p> {mc("Dərman kataloqu ilə əlaqə qurmaq mümkün olmadı.")} </p>
        <button onClick={reset}> {mc("Yenidən cəhd et")} </button>
      </div>
    </ProductLayout>
  );
}
