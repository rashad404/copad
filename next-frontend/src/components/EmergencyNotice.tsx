"use client";
import type { ChatUrgency } from "@/api/chatUrgency";
import { usePublicCopy } from "./public/ProductLayout";
export default function EmergencyNotice({
  urgency,
}: {
  urgency?: ChatUrgency;
}) {
  const c = usePublicCopy();
  if (!urgency) return null;
  return (
    <div className="public-emergency-notice" role="alert" aria-atomic="true">
      <div>
        <strong>
          {c(
            "You may need emergency help",
            "Təcili tibbi yardım lazım ola bilər",
          )}
        </strong>
        <p>
          {c(
            "Do not wait for chat replies. Call emergency services now.",
            "Söhbətdə cavab gözləməyin. İndi təcili yardıma zəng edin.",
          )}
        </p>
      </div>
      <a href={`tel:${urgency.number}`}>
        {c("Call", "Zəng et")}: {urgency.number}
      </a>
    </div>
  );
}
