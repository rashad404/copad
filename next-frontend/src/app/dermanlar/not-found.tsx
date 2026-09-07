import Link from "next/link";
import ProductLayout from "@/components/public/ProductLayout";
import styles from "@/components/medicines/medicines.module.css";
export default function NotFound() {
  return (
    <ProductLayout>
      <div lang="az" className={styles.page}>
        <h1>Dərman tapılmadı</h1>
        <p>Adı dəyişmiş və ya kataloqda olmayan dərmanı axtarırsınız.</p>
        <Link href="/dermanlar">Kataloqda axtar {'->'}</Link>
      </div>
    </ProductLayout>
  );
}
