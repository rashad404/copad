import { URL } from "react-native-url-polyfill";

export type NativeAuthVariant = "preview" | "release";
export type GoogleCredentials = {
  token: string;
  fullName: string;
  email: string;
};
export type GoogleResult =
  | { status: "success"; credentials: GoogleCredentials }
  | { status: "cancelled" | "retry" };
type BrowserResult = { type: string; url?: string };
type Dependencies = {
  randomBytes: (count: number) => Promise<Uint8Array>;
  sha256Base64: (value: string) => Promise<string>;
  open: (url: string, callback: string) => Promise<BrowserResult>;
  dismiss: () => void;
  exchange: (
    body: { code: string; verifier: string },
    signal: AbortSignal,
  ) => Promise<unknown>;
};
export const AUTH_WINDOW_MS = 5 * 60 * 1000;
const START_URL = "https://azdoc.ai/api/auth/native/start";
export const base64url = (value: string) =>
  value.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

// Avoid Buffer/btoa dependencies in Hermes. 32 random bytes produce a 43
// character PKCE verifier. No Math.random fallback, storage or logging.
export function encodeVerifier(bytes: Uint8Array) {
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  let output = "",
    bits = 0,
    buffer = 0;
  for (const byte of bytes) {
    buffer = (buffer << 8) | byte;
    bits += 8;
    while (bits >= 6) {
      bits -= 6;
      output += alphabet[(buffer >>> bits) & 63];
    }
  }
  if (bits) output += alphabet[(buffer << (6 - bits)) & 63];
  return output;
}

export function authCallback(variant: NativeAuthVariant) {
  return `${variant === "preview" ? "azdoc-preview" : "azdoc"}://login/callback`;
}

function callbackCode(value: string, expected: string) {
  const url = new URL(value),
    target = new URL(expected);
  if (
    url.protocol !== target.protocol ||
    url.host !== target.host ||
    url.pathname !== target.pathname ||
    url.username ||
    url.password ||
    url.hash ||
    url.searchParams.has("error") ||
    url.searchParams.getAll("code").length !== 1
  )
    throw Error("Retry sign-in");
  const code = url.searchParams.get("code");
  if (!code?.trim()) throw Error("Retry sign-in");
  return code;
}

export function createGoogleSignIn(deps: Dependencies) {
  let running = false;
  return async function signIn(
    variant: NativeAuthVariant,
    signal: AbortSignal,
  ): Promise<GoogleResult> {
    if (signal.aborted) return { status: "cancelled" };
    if (running) return { status: "retry" };
    running = true;
    const attempt = new AbortController();
    let verifier = "",
      browserOpen = false;
    let finish: (result: GoogleResult) => void = () => {};
    const stopped = new Promise<GoogleResult>((resolve) => {
      finish = resolve;
    });
    const stop = (status: "cancelled" | "retry") => {
      attempt.abort();
      verifier = "";
      finish({ status });
    };
    const cancel = () => stop("cancelled");
    signal.addEventListener("abort", cancel, { once: true });
    const deadline = setTimeout(() => stop("retry"), AUTH_WINDOW_MS);
    const check = () => {
      if (attempt.signal.aborted) throw Error("Attempt ended");
    };
    try {
      const work = async (): Promise<GoogleResult> => {
        const random = await deps.randomBytes(32);
        check();
        if (random.length < 32) throw Error("Retry sign-in");
        verifier = encodeVerifier(random);
        const challenge = base64url(await deps.sha256Base64(verifier));
        check();
        const callback = authCallback(variant);
        browserOpen = true;
        const result = await deps.open(
          `${START_URL}?challenge=${encodeURIComponent(challenge)}&variant=${variant}`,
          callback,
        );
        browserOpen = false;
        check();
        if (["cancel", "dismiss"].includes(result.type))
          return { status: "cancelled" };
        if (result.type !== "success" || !result.url)
          throw Error("Retry sign-in");
        const code = callbackCode(result.url, callback);
        // Exactly one exchange. Any response failure requires a NEW start,
        // including network failures where the server may have consumed code.
        const data = await deps.exchange({ code, verifier }, attempt.signal);
        verifier = "";
        check();
        const credentials = data as GoogleCredentials | null;
        if (
          !credentials ||
          typeof credentials.token !== "string" ||
          !credentials.token ||
          typeof credentials.fullName !== "string" ||
          typeof credentials.email !== "string"
        )
          throw Error("Retry sign-in");
        return { status: "success", credentials };
      };
      return await Promise.race([work(), stopped]);
    } catch {
      // Intentionally never expose the server body, code, verifier or a reason
      // that distinguishes invalid, expired or already consumed credentials.
      return { status: signal.aborted ? "cancelled" : "retry" };
    } finally {
      clearTimeout(deadline);
      signal.removeEventListener("abort", cancel);
      attempt.abort();
      verifier = "";
      if (browserOpen) {
        try {
          deps.dismiss();
        } catch {
          /* Browser may already be closed. */
        }
      }
      running = false;
    }
  };
}
