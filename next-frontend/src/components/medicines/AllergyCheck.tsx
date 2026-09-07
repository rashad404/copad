"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { healthApi } from "@/api/healthRecord";
import { checkMedicineAllergies } from "@/api/medicines";
import { useResource } from "@/components/health/useResource";
import styles from "./medicines.module.css";
export default function AllergyCheck({ medicineId }: { medicineId: number }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading)
    return <p className={styles.muted}>Allergiya yoxlaması hazırlanır...</p>;
  if (!isAuthenticated || !user)
    return (
      <aside className={styles.advisory}>
        <h2>Allergiya yoxlaması</h2>
        <p>
          Dərmanın qeydə alınmış allergiyalarla əlaqəsini
          yoxlamaq üçün <Link href="/login">daxil olun</Link>.
        </p>
      </aside>
    );
  return <MemberCheck key={user.id} userId={user.id} medicineId={medicineId} />;
}
function MemberCheck({
  userId,
  medicineId,
}: {
  userId: string;
  medicineId: number;
}) {
  const [retry, setRetry] = useState(0);
  const families = useResource(
    `medicine-families:${userId}:${retry}`,
    (signal) => healthApi.families(signal),
    "Ailə üzvlərini yükləmək mümkün olmadı.",
  );
  const [selected, setSelected] = useState("");
  const storageKey = `azdoc.member.${userId}`;
  useEffect(() => {
    try {
      setSelected(localStorage.getItem(storageKey) || "");
    } catch {
      /* Storage can be disabled. */
    }
    const sync = (e: StorageEvent) => {
      if (e.key === storageKey) setSelected(e.newValue || "");
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [storageKey]);
  const members = families.data?.flatMap((f) => f.members) || [];
  const member = members.find((m) => String(m.id) === selected);
  return (
    <section className={styles.allergy}>
      <h2>Sağlamlıq qeydləri üzrə allergiya yoxlaması</h2>
      {families.loading ? (
        <p role="status">Ailə üzvləri yüklənir...</p>
      ) : families.error ? (
        <div role="alert">
          <p>{families.error}</p>
          <button onClick={() => setRetry((n) => n + 1)}>
            Yenidən cəhd et
          </button>
        </div>
      ) : (
        <>
          <label htmlFor="allergy-member">Kimin üçün yoxlanılsın?</label>
          <select
            id="allergy-member"
            value={member ? selected : ""}
            onChange={(e) => {
              setSelected(e.target.value);
              try {
                localStorage.setItem(storageKey, e.target.value);
              } catch {
                /* Keep in-memory selection. */
              }
            }}
          >
            <option value="">Ailə üzvünü seçin</option>
            {families.data?.map((f) => (
              <optgroup key={f.id} label={f.name}>
                {f.members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {!members.length && (
            <p>
              <Link href="/health-record">
                Sağlamlıq qeydlərində ailə üzvü əlavə edin.
              </Link>
            </p>
          )}
          {member && (
            <Warnings
              key={`${medicineId}:${member.id}`}
              medicineId={medicineId}
              memberId={member.id}
              name={member.fullName}
            />
          )}
        </>
      )}
      <p className={styles.disclaimer}>
        Bu avtomatik yoxlama qeydə alınmış allergiyalarla mümkün uyğunluğu
        göstərir. Həkim və ya əczaçı qiymətləndirməsini əvəz etmir. Dərmanı
        qəbul etməzdən və ya dəyişməzdən əvvəl həkim və ya əczaçı ilə
        məsləhətləşin.
      </p>
    </section>
  );
}
function Warnings({
  medicineId,
  memberId,
  name,
}: {
  medicineId: number;
  memberId: number;
  name: string;
}) {
  const [retry, setRetry] = useState(0);
  const result = useResource(
    `allergies:${medicineId}:${memberId}:${retry}`,
    (signal) => checkMedicineAllergies(medicineId, memberId, signal),
    "Allergiya yoxlaması baş tutmadı.",
  );
  if (result.loading)
    return <p role="status">{name} üçün allergiyalar yoxlanılır...</p>;
  if (result.error)
    return (
      <div role="alert" className={styles.warning}>
        <p>{result.error} Allergiya riski qiymətləndirilə bilmədi.</p>
        <button onClick={() => setRetry((n) => n + 1)}>Yenidən cəhd et</button>
      </div>
    );
  if (!result.data?.length)
    return (
      <p>
        {name}: qeydə alınmış allergiyalarla uyğunluq tapılmadı. Bu, dərmanın
        təhlükəsizliyinə zəmanət deyil.
      </p>
    );
  return (
    <div
      role="alert"
      className={
        result.data.some((w) => w.critical) ? styles.critical : styles.warning
      }
    >
      <h3>{name} üçün allergiya xəbərdarlığı</h3>
      {[...result.data]
        .sort((a, b) => Number(b.critical) - Number(a.critical))
        .map((w, i) => (
          <div key={`${w.allergen}:${w.basis}:${i}`}>
            <strong>
              {w.critical
                ? "Ciddi allergiya - həyati təhlükə riski"
                : "Allergiya riski ola bilər"}
            </strong>
            <p>
              {w.medicineName} · {w.allergen}
            </p>
            <p>
              {w.basis === "CLASS"
                ? "Dərman qrupuna görə mümkün allergiya riski"
                : "Təsiredici maddənin adına görə mümkün allergiya riski"}
            </p>
            <small>
              Allergiyanın ağırlığı:{" "}
              {(
                {
                  MILD: "Yüngül",
                  MODERATE: "Orta",
                  SEVERE: "Ağır",
                  LIFE_THREATENING: "Həyati təhlükəli",
                } as Record<string, string>
              )[w.severity] || w.severity}
            </small>
          </div>
        ))}
    </div>
  );
}
