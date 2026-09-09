import { Platform } from "react-native";

export const PRODUCTION_API = "https://azdoc.ai/api";
export const API_URL: string =
  __DEV__ && Platform.OS === "web"
    ? "/dev-api"
    : (
        process.env.EXPO_PUBLIC_API_URL ||
        (__DEV__ ? "http://100.89.150.50:8002/api" : PRODUCTION_API)
      ).replace(/\/$/, "");

// A preview installed over a dev build must not reuse its credentials, chat
// sessions, member selection or permission to sync phone data into a record.
// Hex preserves the full origin without characters forbidden by SecureStore.
export function environmentKey(key: string) {
  if (Platform.OS === "web") return key;
  const origin = Array.from(API_URL)
    .map((letter) => letter.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("");
  return `${key}.v2.${origin}`;
}
