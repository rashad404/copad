import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { environmentKey } from "./environment";
const KEY = environmentKey("auth_token");
// Web preview keeps the token in this tab only. Native uses the OS keychain.
export const tokenStore = {
  get: async (): Promise<string | null> =>
    Platform.OS === "web"
      ? sessionStorage.getItem(KEY)
      : SecureStore.getItemAsync(KEY),
  set: async (token: string) => {
    if (Platform.OS === "web") sessionStorage.setItem(KEY, token);
    else await SecureStore.setItemAsync(KEY, token);
  },
  clear: async () => {
    if (Platform.OS === "web") sessionStorage.removeItem(KEY);
    else await SecureStore.deleteItemAsync(KEY);
  },
};

export interface PendingConsentChoices {
  email: string;
  storage: boolean;
  ai: boolean;
}
const CONSENT_KEY = environmentKey("pending_registration_consents");
export const pendingConsentStore = {
  get: async (): Promise<PendingConsentChoices | null> => {
    const raw =
      Platform.OS === "web"
        ? sessionStorage.getItem(CONSENT_KEY)
        : await SecureStore.getItemAsync(CONSENT_KEY);
    if (!raw) return null;
    try {
      const value = JSON.parse(raw);
      return typeof value.email === "string" &&
        typeof value.storage === "boolean" &&
        typeof value.ai === "boolean"
        ? value
        : null;
    } catch {
      return null;
    }
  },
  set: async (value: PendingConsentChoices) => {
    const raw = JSON.stringify(value);
    if (Platform.OS === "web") sessionStorage.setItem(CONSENT_KEY, raw);
    else await SecureStore.setItemAsync(CONSENT_KEY, raw);
  },
  clear: async () => {
    if (Platform.OS === "web") sessionStorage.removeItem(CONSENT_KEY);
    else await SecureStore.deleteItemAsync(CONSENT_KEY);
  },
};
