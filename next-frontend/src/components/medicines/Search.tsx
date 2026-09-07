import styles from "./medicines.module.css";
export default function Search({ q = "" }: { q?: string }) {
  return (
    <form action="/dermanlar" role="search" className={styles.search}>
      <label htmlFor="medicine-query">Dərman və ya təsiredici maddə</label>
      <div>
        <input
          id="medicine-query"
          name="q"
          defaultValue={q}
          placeholder="Məsələn, İbuprofen"
          minLength={2}
          maxLength={120}
          required
          type="search"
        />
        <button type="submit">
          Axtar <span aria-hidden="true">^</span>
        </button>
      </div>
    </form>
  );
}
