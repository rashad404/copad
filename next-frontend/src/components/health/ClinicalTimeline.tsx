"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ShieldAlert, ArrowUpRight } from "lucide-react";
import { healthApi, type TimelineType } from "@/api/healthRecord";
import { usePublicCopy } from "@/components/public/ProductLayout";
import { dateLabel, enumLabel } from "./model";
import { useResource } from "./useResource";
import styles from "./health.module.css";
const labels: Record<TimelineType, [string, string]> = {
  CONDITION: ["Condition", "Xəstəlik"],
  ALLERGY: ["Allergy", "Allergiya"],
  MEDICATION_STARTED: ["Medication started", "Dərman qəbuluna başlanıb"],
  MEDICATION_STOPPED: ["Medication stopped", "Dərman qəbulu dayandırılıb"],
  IMMUNIZATION: ["Immunization", "Peyvənd"],
  VITAL: ["Abnormal vital", "Normadan kənar göstərici"],
};
export default function ClinicalTimeline({
  memberId,
  version,
  onViewVitals,
}: {
  memberId: number;
  version: number;
  onViewVitals: () => void;
}) {
  const c = usePublicCopy();
  const { i18n } = useTranslation();
  const [retry, setRetry] = useState(0);
  const resource = useResource(
    `${memberId}.timeline.${version}.${retry}`,
    (signal) => healthApi.timeline(memberId, signal),
    c(
      "Could not load the timeline. Please try again.",
      "Xronologiyanı yükləmək mümkün olmadı. Yenidən cəhd edin.",
    ),
  );
  return (
    <section>
      <div className={styles.sectionToolbar}>
        <div>
          <h2>{c("Clinical timeline", "Klinik xronologiya")}</h2>
          <p>
            {c(
              "Newest events first, by the date they happened-not when they were entered.",
              "Hadisələr daxil edilmə tarixinə deyil, baş verdiyi tarixə görə yenidən köhnəyə sıralanır.",
            )}
          </p>
        </div>
      </div>
      <div className={styles.timelineNote}>
        <p>
          {c(
            "Only abnormal vital readings appear here. The complete measurement history is in Vitals.",
            "Burada yalnız normadan kənar göstəricilər görünür. Bütün ölçülərin tarixçəsi Göstəricilər bölməsindədir.",
          )}
        </p>
        <button className={styles.textButton} onClick={onViewVitals}>
          {c("View all vitals", "Bütün göstəricilərə bax")}
          <ArrowUpRight size={16} />
        </button>
      </div>
      {resource.loading ? (
        <p className={styles.loading} role="status">
          {c("Loading timeline...", "Xronologiya yüklənir...")}
        </p>
      ) : resource.error ? (
        <div role="alert" className={styles.error}>
          {resource.error}
          <button onClick={() => setRetry((n) => n + 1)}>
            {c("Retry", "Yenidən cəhd et")}
          </button>
        </div>
      ) : !resource.data?.length ? (
        <div className={styles.empty}>
          <h3>{c("No clinical events yet", "Hələ klinik hadisə yoxdur")}</h3>
          <p>
            {c(
              "Recorded clinical events will appear here. Normal vital readings remain on the Vitals screen.",
              "Qeydə alınmış klinik hadisələr burada görünəcək. Normal göstəricilər Göstəricilər bölməsində qalır.",
            )}
          </p>
        </div>
      ) : (
        <>
          <ol
            className={styles.timelineList}
            aria-label={c("Clinical events", "Klinik hadisələr")}
          >
            {resource.data.map((entry, index) => (
              <li
                key={`${entry.type}:${entry.recordId}:${entry.occurredAt}:${index}`}
                className={entry.notable ? styles.notableEvent : undefined}
              >
                <div className={styles.timelineDate}>
                  {entry.occurredAt ? (
                    <time dateTime={entry.occurredAt}>
                      {dateLabel(entry.occurredAt, i18n.language)}
                    </time>
                  ) : (
                    c("Date not recorded", "Tarix qeyd edilməyib")
                  )}
                </div>
                <div className={styles.timelineEvent}>
                  <div className={styles.badges}>
                    <span className={styles.flag}>
                      {labels[entry.type]
                        ? c(...labels[entry.type])
                        : entry.type}
                    </span>
                    {entry.notable && (
                      <span className={`${styles.flag} ${styles.critical}`}>
                        <ShieldAlert size={14} aria-hidden="true" />
                        {c("Notable event", "Diqqət tələb edən hadisə")}
                      </span>
                    )}
                    {entry.severity && (
                      <span className={styles.flag}>
                        {enumLabel(entry.severity, c)}
                      </span>
                    )}
                  </div>
                  <h3>{entry.title}</h3>
                  {entry.detail && <p>{entry.detail}</p>}
                </div>
              </li>
            ))}
          </ol>
          {resource.data.length >= 100 && (
            <p className={styles.helper}>
              {c(
                "Showing the latest 100 clinical events.",
                "Ən son 100 klinik hadisə göstərilir.",
              )}
            </p>
          )}
        </>
      )}
    </section>
  );
}
