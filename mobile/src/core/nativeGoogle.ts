import axios from "axios";
import Constants from "expo-constants";
import * as Crypto from "expo-crypto";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import { API_URL, PRODUCTION_API } from "./environment";
import {
  createGoogleSignIn,
  type NativeAuthVariant,
  type GoogleResult,
} from "./googleProtocol";

const variant = Constants.expoConfig?.extra?.nativeAuthVariant;
export const googleSignInAvailable =
  Platform.OS !== "web" &&
  API_URL === PRODUCTION_API &&
  ["preview", "release"].includes(variant);

// Separate unauthenticated client: never attach an existing JWT or use the
// HTTP development proxy. The challenge cookie requires HTTPS throughout.
const exchangeApi = axios.create({ baseURL: PRODUCTION_API, timeout: 20000 });
const signIn = createGoogleSignIn({
  randomBytes: Crypto.getRandomBytesAsync,
  sha256Base64: (value) =>
    Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, value, {
      encoding: Crypto.CryptoEncoding.BASE64,
    }),
  open: (url, callback) => WebBrowser.openAuthSessionAsync(url, callback),
  dismiss: () => WebBrowser.dismissAuthSession(),
  exchange: async (body, signal) =>
    (await exchangeApi.post("/auth/native/exchange", body, { signal })).data,
});

export async function nativeGoogleSignIn(
  signal: AbortSignal,
): Promise<GoogleResult> {
  if (!googleSignInAvailable) return { status: "retry" };
  return signIn(variant as NativeAuthVariant, signal);
}
