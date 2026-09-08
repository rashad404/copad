"use client";

import { useEffect, useState } from "react";
import {
  getNotificationPreferences,
  saveNotificationPreferences,
  type NotificationPreferences,
} from "@/api/notifications";
import { usePublicCopy } from "@/components/public/ProductLayout";
import styles from "@/components/privacy/privacy.module.css";

/**
 * Where messages about appointments go.
 *
 * The endpoint has existed since the notifications were built and nothing
 * called it, so the only way to stop being emailed was to ask us. It is here
 * rather than in the profile because turning messages off should not mean
 * editing anything else about yourself.
 *
 * The text option appears only when there is a gateway behind it. Offering a
 * channel that quietly falls back to email is worse than not offering it.
 */
export default function NotificationSettings() {
  const c = usePublicCopy();
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const control = new AbortController();
    getNotificationPreferences(control.signal)
      .then((data) => {
        setPrefs(data);
        setPhone(data.phone);
      })
      .catch(() => {
        // Signed out, or the endpoint is unreachable. Nothing to show.
      });
    return () => control.abort();
  }, []);

  async function save(change: Partial<NotificationPreferences>) {
    setBusy(true);
    setSaved(false);
    setFailed(false);
    try {
      const next = await saveNotificationPreferences({
        enabled: change.enabled,
        phone: change.phone,
        smsEnabled: change.smsEnabled,
      });
      setPrefs(next);
      setPhone(next.phone);
      setSaved(true);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  if (!prefs) return null;

  return (
    <section className={styles.section} aria-labelledby="messages-title">
      <h2 id="messages-title">
        {c("Messages", "Bildirişlər", "Уведомления")}
      </h2>
      <p>
        {c(
          "About your appointments only. Nothing about what you asked or what you were told.",
          "Yalnız randevularınızla bağlı. Nə soruşduğunuz və nə cavab aldığınız barədə heç nə göndərilmir.",
          "Только о ваших приёмах. Ничего о том, что вы спрашивали и что вам ответили.",
        )}
      </p>

      <label className={styles.check}>
        <input
          type="checkbox"
          checked={prefs.enabled}
          disabled={busy}
          onChange={(e) => save({ enabled: e.target.checked })}
        />
        <span>
          {c(
            "Tell me about my appointments",
            "Randevularım barədə məlumat göndərin",
            "Сообщать мне о моих приёмах",
          )}
        </span>
      </label>

      {prefs.enabled && prefs.smsAvailable && (
        <>
          <label className={styles.password}>
            <span>{c("Phone number", "Telefon nömrəsi", "Номер телефона")}</span>
            <input
              type="tel"
              value={phone}
              maxLength={32}
              disabled={busy}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={() => {
                if (phone !== prefs.phone) void save({ phone });
              }}
            />
          </label>
          <label className={styles.check}>
            <input
              type="checkbox"
              checked={prefs.smsEnabled}
              disabled={busy || !prefs.phone}
              onChange={(e) => save({ smsEnabled: e.target.checked })}
            />
            <span>
              {c(
                "Send it as a text instead of an email",
                "E-poçt yerinə SMS göndərin",
                "Отправлять SMS вместо письма",
              )}
            </span>
          </label>
        </>
      )}

      {prefs.enabled && !prefs.smsAvailable && (
        <p className={styles.meta}>
          {c(
            "Messages go to your email address.",
            "Bildirişlər e-poçt ünvanınıza gəlir.",
            "Уведомления приходят на вашу почту.",
          )}
        </p>
      )}

      {saved && <p role="status" className={styles.status}>{c("Saved", "Yadda saxlanıldı", "Сохранено")}</p>}
      {failed && (
        <p role="alert">
          {c(
            "Could not save that. Please try again.",
            "Yadda saxlamaq mümkün olmadı. Yenidən cəhd edin.",
            "Не удалось сохранить. Попробуйте снова.",
          )}
        </p>
      )}
    </section>
  );
}
