import "server-only";
import { cookies, headers } from "next/headers";
import { supportedLanguage, type SiteLanguage } from "@/utils/languages";
import ranges from "./azRanges.json";

/**
 * The language a page is rendered in, decided once, on the server.
 *
 * 1. A language the visitor picked. Always wins, wherever they are.
 * 2. Otherwise, where they are: Azerbaijan gets Azerbaijani, everywhere else
 *    English. Not the phone's language setting - plenty of people in Baku run
 *    their phone in English or Russian and still expect an Azerbaijani site.
 * 3. Search engines get Azerbaijani. Googlebot crawls from the United States,
 *    so by location it would index the English version of a site whose readers
 *    search in Azerbaijani.
 *
 * Pages are served private and uncached, so one visitor's language cannot leak
 * into another's page.
 */
export async function siteLanguage(): Promise<SiteLanguage> {
  const chosen = supportedLanguage((await cookies()).get("i18nextLng")?.value);
  if (chosen) return chosen;

  const h = await headers();
  if (CRAWLER.test(h.get("user-agent") || "")) return "az";

  // nginx sets X-Real-IP from the connection itself, so it cannot be supplied
  // by the visitor. Forwarded-For is the fallback, and spoofing it only changes
  // the spoofer's own language.
  const ip =
    h.get("x-real-ip")?.trim() ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "";
  // No address, or a local one, is development or a health check.
  if (!ip || isLocal(ip)) return "az";
  return isAzerbaijan(ip) ? "az" : "en";
}

const CRAWLER =
  /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegram|yandex|baidu|duckduck|applebot|lighthouse|pagespeed/i;

function isLocal(ip: string) {
  return (
    ip === "::1" ||
    ip.startsWith("127.") ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
    /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(ip) || // CGNAT, Tailscale
    ip.toLowerCase().startsWith("fe80:") ||
    ip.toLowerCase().startsWith("fd")
  );
}

// ---- Range lookup ----------------------------------------------------------

function v4(ip: string): number | null {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  let n = 0;
  for (const part of parts) {
    const octet = Number(part);
    if (!Number.isInteger(octet) || octet < 0 || octet > 255) return null;
    n = n * 256 + octet;
  }
  return n;
}

function v6(ip: string): bigint | null {
  const [head, tail] = ip.toLowerCase().split("::");
  if (ip.split("::").length > 2) return null;
  const left = head ? head.split(":") : [];
  const right = tail !== undefined && tail ? tail.split(":") : [];
  const missing = 8 - left.length - right.length;
  if (tail === undefined ? missing !== 0 : missing < 0) return null;
  const groups = [...left, ...Array(tail === undefined ? 0 : missing).fill("0"), ...right];
  let n = BigInt(0);
  for (const group of groups) {
    if (!/^[0-9a-f]{1,4}$/.test(group)) return null;
    n = (n << BigInt(16)) + BigInt(parseInt(group, 16));
  }
  return n;
}

// Built once per server process. DB-IP lists ranges in order and without
// overlap, which is what makes a binary search correct.
const V4: [number, number][] = ranges.v4.map(([a, b]) => [v4(a)!, v4(b)!]);
const V6: [bigint, bigint][] = ranges.v6.map(([a, b]) => [v6(a)!, v6(b)!]);

function within<T extends number | bigint>(value: T, list: [T, T][]) {
  let low = 0;
  let high = list.length - 1;
  while (low <= high) {
    const mid = (low + high) >> 1;
    const [start, end] = list[mid];
    if (value < start) high = mid - 1;
    else if (value > end) low = mid + 1;
    else return true;
  }
  return false;
}

export function isAzerbaijan(ip: string): boolean {
  // An IPv4 address carried inside IPv6, as some proxies report it.
  const mapped = ip.toLowerCase().match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  const address = mapped ? mapped[1] : ip;
  if (address.includes(".")) {
    const n = v4(address);
    return n !== null && within(n, V4);
  }
  const n = v6(address);
  return n !== null && within(n, V6);
}
