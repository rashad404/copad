export interface ChatUrgency {
  number: string;
  categories: string[];
}
type Headers = { get?: (name: string) => unknown; [key: string]: unknown };
export function urgencyFromHeaders(
  headers: Headers | undefined,
): ChatUrgency | null {
  const read = (name: string) => {
    if (!headers) return "";
    const value =
      typeof headers.get === "function"
        ? headers.get(name)
        : Object.entries(headers).find(
            ([key]) => key.toLowerCase() === name,
          )?.[1];
    return value == null ? "" : String(value);
  };
  if (read("x-urgent").trim().toLowerCase() !== "true") return null;
  // The server may send "103 or 112". Only known emergency numbers become tel links.
  const numbers = read("x-emergency-number").match(/\b(?:103|112)\b/g);
  return {
    number: numbers?.[0] || "103",
    categories: read("x-urgent-categories")
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

export function savedUrgency(raw: string | null): ChatUrgency | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    if (!value || !Array.isArray(value.categories)) return null;
    return urgencyFromHeaders({
      "x-urgent": "true",
      "x-emergency-number": value.number,
      "x-urgent-categories": value.categories
        .filter((v: unknown) => typeof v === "string")
        .join(";"),
    });
  } catch {
    return null;
  }
}
