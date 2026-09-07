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
const key = (session: string, chat: string) =>
  `azdoc:urgent:${encodeURIComponent(session)}:${encodeURIComponent(chat)}`;
export function saveUrgency(
  session: string,
  chat: string,
  urgency: ChatUrgency,
) {
  try {
    sessionStorage.setItem(key(session, chat), JSON.stringify(urgency));
  } catch {
    /* The in-memory notice still persists for this chat. */
  }
}
export function readUrgency(
  session: string | null,
  chat: string,
): ChatUrgency | undefined {
  if (!session) return;
  try {
    const data = JSON.parse(
      sessionStorage.getItem(key(session, chat)) || "null",
    );
    if (
      data &&
      ["103", "112"].includes(data.number) &&
      Array.isArray(data.categories) &&
      data.categories.every((v: unknown) => typeof v === "string")
    )
      return data;
  } catch {
    /* Storage may be disabled or contain obsolete data. */
  }
}
