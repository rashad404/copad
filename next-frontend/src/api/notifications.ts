import api from "./axios";

export interface NotificationPreferences {
  enabled: boolean;
  language: string;
  phone: string;
  smsEnabled: boolean;
  /** Whether a text can go out at all yet. False until a provider is set up. */
  smsAvailable: boolean;
}

export const getNotificationPreferences = (signal?: AbortSignal) =>
  api
    .get<NotificationPreferences>("/user/notifications", { signal })
    .then((r) => r.data);

export const saveNotificationPreferences = (
  body: Partial<Pick<NotificationPreferences, "enabled" | "phone" | "smsEnabled">>,
) =>
  api.put<NotificationPreferences>("/user/notifications", body).then((r) => r.data);
