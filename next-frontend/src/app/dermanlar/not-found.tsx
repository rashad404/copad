import Link from "next/link";
import ProductLayout from "@/components/public/ProductLayout";
import styles from "@/components/medicines/medicines.module.css";
export default function NotFound() {
  return (
    <ProductLayout>
      <div lang="az" className={styles.page}>
        <h1>Dərman tapılmadı</h1>
        <p>Bu ünvanda dərman məlumatı tapılmadı. Kataloqda adına görə axtara bilərsiniz.</p>
        <Link href="/dermanlar">Kataloqda axtar {'->'}</Link>
      </div>
    </ProductLayout>
  );
}
