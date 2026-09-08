import { longDate, dateAndTime } from "@/utils/dates";
import type { SiteLanguage } from "@/utils/languages";
export interface LabTest {
  id: number;
  code: string | null;
  name: string;
  analyteKey: string | null;
  sampleType: string | null;
  price: number | null;
  turnaroundHours: number | null;
  preparation: string | null;
}
export interface Lab {
  id: number;
  slug: string;
  name: string;
  city: string | null;
  district: string | null;
  address: string | null;
  phone: string | null;
  homeCollection: boolean;
  homeCollectionFee: number | null;
  testCount: number;
}
export interface LabDetail extends Lab {
  tests: LabTest[];
}
export interface LabPage {
  content: Lab[];
  totalElements: number;
  totalPages: number;
  number: number;
}
export type Collection = "HOME" | "LAB";
export type OrderStatus =
  "REQUESTED" | "CONFIRMED" | "SAMPLE_COLLECTED" | "COMPLETED" | "CANCELLED";
export interface LabOrder {
  id: number;
  labId: number;
  labName: string;
  labPhone: string | null;
  status: OrderStatus;
  collection: Collection;
  address: string | null;
  contactPhone: string | null;
  preferredAt: string | null;
  totalPrice: number | null;
  note: string | null;
  cancelledAt: string | null;
  completedAt: string | null;
  items: {
    id: number;
    name: string;
    price: number | null;
    resultReady: boolean;
  }[];
}
export interface OrderRequest {
  labId: number;
  testIds: number[];
  collection: Collection;
  address?: string;
  contactPhone?: string;
}
export type LabFilters = {
  q: string;
  city: string;
  homeCollection: boolean;
  page: number;
};
export function parseFilters(
  params: Record<string, string | string[] | undefined>,
): LabFilters {
  const value = (key: string) =>
    typeof params[key] === "string"
      ? (params[key] as string).trim().slice(0, 120)
      : "";
  const page = Number(value("page"));
  return {
    q: value("q"),
    city: value("city"),
    homeCollection: value("homeCollection") === "true",
    page: Number.isSafeInteger(page) && page >= 0 ? page : 0,
  };
}
export const filtered = (f: LabFilters) =>
  !!(f.q || f.city || f.homeCollection);
export function filterQuery(f: LabFilters, page = f.page) {
  const q = new URLSearchParams();
  if (f.q) q.set("q", f.q);
  if (f.city) q.set("city", f.city);
  if (f.homeCollection) q.set("homeCollection", "true");
  if (page) q.set("page", String(page));
  return q.toString();
}
export const labUrl = (slug?: string) =>
  `${(process.env.NEXT_PUBLIC_APP_URL || "https://azdoc.ai").replace(/\/$/, "")}/laboratoriyalar${slug ? "/" + encodeURIComponent(slug) : ""}`;
export const isPrice = (value: number | null | undefined): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;
export function money(
  value: number | null,
  lang: SiteLanguage,
  unknown: string,
) {
  return isPrice(value)
    ? `${value.toFixed(2).replace(".", lang === "en" ? "." : ",")} AZN`
    : unknown;
}
export function basketTotal(
  tests: LabTest[],
  collection: Collection,
  fee: number | null,
) {
  const prices = tests.map((t) => t.price);
  if (collection === "HOME") prices.push(fee);
  return {
    known:
      prices.reduce<number>(
        (sum, p) => sum + (isPrice(p) ? Math.round(p * 100) : 0),
        0,
      ) / 100,
    complete: prices.every(isPrice),
  };
}
export const cancellable = (status: OrderStatus) =>
  status === "REQUESTED" || status === "CONFIRMED";
export const terminal = (status: OrderStatus) =>
  status === "COMPLETED" || status === "CANCELLED";
export function orderRequest(
  labId: number,
  tests: LabTest[],
  collection: Collection,
  address: string,
  phone: string,
): OrderRequest {
  return {
    labId,
    testIds: [...new Set(tests.map((t) => t.id))],
    collection,
    ...(collection === "HOME"
      ? { address: address.trim(), contactPhone: phone.trim() }
      : {}),
  };
}
/** Preferred times are laboratory wall-clock times, not the browser's zone. */
export function preferredTime(value: string, lang: SiteLanguage) {
  return `${longDate(value.slice(0, 10), lang)}, ${value.slice(11, 16)}`;
}
export const eventTime = (value: string, lang: SiteLanguage) =>
  dateAndTime(value, lang);
export function readableError(error: unknown, fallback: string) {
  const e = error as { response?: { data?: { message?: unknown } | string } };
  const body = e?.response?.data;
  return typeof body === "string" && !body.startsWith("<")
    ? body
    : typeof body === "object" && typeof body?.message === "string"
      ? body.message
      : fallback;
}
