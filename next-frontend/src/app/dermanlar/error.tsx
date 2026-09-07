"use client";
import ProductLayout from "@/components/public/ProductLayout";
import styles from "@/components/medicines/medicines.module.css";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <ProductLayout>
      <div lang="az" className={styles.page} role="alert">
        <h1>Məlumat yüklənmədi</h1>
        <p>Dərman kataloqu ilə əlaqə qurmaq mümkün olmadı.</p>
        <button onClick={reset}>Yenidən cəhd et</button>
      </div>
    </ProductLayout>
  );
}
