import { medicineServerCopy } from "@/components/medicines/serverCopy";
import Link from "next/link";
import ProductLayout from "@/components/public/ProductLayout";
import styles from "@/components/medicines/medicines.module.css";
export default async function NotFound() {
  const { language, copy: mc } = await medicineServerCopy();
  return (
    <ProductLayout>
      <div lang={language} className={styles.page}>
        <h1> {mc("Dərman tapılmadı")} </h1>
        <p>
          {" "}
          {mc(
            "Bu ünvanda dərman məlumatı tapılmadı. Kataloqda adına görə axtara bilərsiniz.",
          )}{" "}
        </p>
        <Link href="/dermanlar">
          {" "}
          {mc("Kataloqda axtar")} {"->"}
        </Link>
      </div>
    </ProductLayout>
  );
}
