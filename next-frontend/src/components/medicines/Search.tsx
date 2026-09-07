import { medicineCopy } from "./copy";
import type { SiteLanguage } from "@/utils/languages";
import styles from "./medicines.module.css";
export default function Search({
  q = "",
  language = "az",
}: {
  q?: string;
  language?: SiteLanguage;
}) {
  const mc = medicineCopy(language);
  return (
    <form action="/dermanlar" role="search" className={styles.search}>
      <label htmlFor="medicine-query">
        {" "}
        {mc("Dərman və ya təsiredici maddə")}{" "}
      </label>
      <div>
        <input
          id="medicine-query"
          name="q"
          defaultValue={q}
          placeholder={mc("Məsələn, İbuprofen")}
          minLength={2}
          maxLength={120}
          required
          type="search"
        />
        <button type="submit">
          {" "}
          {mc("Axtar")} <span aria-hidden="true">^</span>
        </button>
      </div>
    </form>
  );
}
