/**
 * Dates written the way each language writes them.
 *
 * Browsers ship incomplete Azerbaijani date data, so asking Intl for a month
 * name in az gives back "M09" instead of "sentyabr". Every screen that printed
 * a date hit this: the health record, the blog, the consent list, the booking
 * calendar. The names are given here instead.
 *
 * English and Russian are complete everywhere and still come from the platform.
 *
 * A second trap this closes: a date-only value like "2026-09-08" is a calendar
 * day, not an instant. Read as midnight UTC and formatted in a zone west of
 * Greenwich it lands on the day before, so day-only values are anchored at noon
 * and formatted as UTC.
 */

export const AZ_MONTHS = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avqust", "sentyabr", "oktyabr", "noyabr", "dekabr",
];

/** Azerbaijani has no shorter conventional month form, so these stand in. */
export const AZ_MONTHS_SHORT = [
  "yan", "fev", "mar", "apr", "may", "iyn",
  "iyl", "avq", "sen", "okt", "noy", "dek",
];

/** Monday first, which is how a calendar is read here. */
export const AZ_WEEKDAYS_SHORT = ["B.e", "Ç.a", "Ç", "C.a", "C", "Ş", "B"];

export const AZ_WEEKDAYS_LONG = [
  "bazar ertəsi", "çərşənbə axşamı", "çərşənbə", "cümə axşamı",
  "cümə", "şənbə", "bazar",
];

export type DateLanguage = "az" | "en" | "ru";

/** Accepts "az", "az-AZ" or anything else, and answers with a language. */
export function dateLanguage(locale?: string | null): DateLanguage {
  const base = (locale || "").split("-")[0].toLowerCase();
  return base === "az" ? "az" : base === "ru" ? "ru" : "en";
}

export const intlLocale = (language: DateLanguage) =>
  language === "az" ? "az-AZ" : language === "ru" ? "ru-RU" : "en-GB";

/** True when the value names a calendar day rather than an instant. */
const isDayOnly = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

function toDate(value: string | Date) {
  if (value instanceof Date) return value;
  return new Date(isDayOnly(value) ? `${value}T12:00:00Z` : value);
}

/** Parts of a date as the clinic reckons them, avoiding the zone trap. */
function partsOf(value: string | Date) {
  if (typeof value === "string" && isDayOnly(value)) {
    return {
      year: Number(value.slice(0, 4)),
      month: Number(value.slice(5, 7)) - 1,
      day: Number(value.slice(8, 10)),
      weekday: (new Date(`${value}T12:00:00Z`).getUTCDay() + 6) % 7,
    };
  }
  const at = toDate(value);
  return {
    year: at.getFullYear(),
    month: at.getMonth(),
    day: at.getDate(),
    weekday: (at.getDay() + 6) % 7,
  };
}

/** "8 sen 2026" in Azerbaijani, the platform's medium form elsewhere. */
export function shortDate(value: string | Date, locale?: string | null) {
  const language = dateLanguage(locale);
  const at = toDate(value);
  if (Number.isNaN(at.getTime())) return String(value);
  if (language === "az") {
    const p = partsOf(value);
    return `${p.day} ${AZ_MONTHS_SHORT[p.month]} ${p.year}`;
  }
  return new Intl.DateTimeFormat(intlLocale(language), {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(typeof value === "string" && isDayOnly(value)
      ? { timeZone: "UTC" }
      : {}),
  }).format(at);
}

/** "8 sentyabr 2026" in Azerbaijani. */
export function longDate(value: string | Date, locale?: string | null) {
  const language = dateLanguage(locale);
  const at = toDate(value);
  if (Number.isNaN(at.getTime())) return String(value);
  if (language === "az") {
    const p = partsOf(value);
    return `${p.day} ${AZ_MONTHS[p.month]} ${p.year}`;
  }
  return new Intl.DateTimeFormat(intlLocale(language), {
    dateStyle: "long",
    ...(typeof value === "string" && isDayOnly(value)
      ? { timeZone: "UTC" }
      : {}),
  }).format(at);
}

/** "8 sentyabr 2026, çərşənbə axşamı" - the day named as well as dated. */
export function fullDate(value: string | Date, locale?: string | null) {
  const language = dateLanguage(locale);
  const at = toDate(value);
  if (Number.isNaN(at.getTime())) return String(value);
  if (language === "az") {
    const p = partsOf(value);
    return `${p.day} ${AZ_MONTHS[p.month]} ${p.year}, ${
      AZ_WEEKDAYS_LONG[p.weekday]
    }`;
  }
  return new Intl.DateTimeFormat(intlLocale(language), {
    dateStyle: "full",
    ...(typeof value === "string" && isDayOnly(value)
      ? { timeZone: "UTC" }
      : {}),
  }).format(at);
}

/** A date with the time of day, for things that happened at a moment. */
export function dateAndTime(value: string | Date, locale?: string | null) {
  const language = dateLanguage(locale);
  const at = toDate(value);
  if (Number.isNaN(at.getTime())) return String(value);
  const time = new Intl.DateTimeFormat(intlLocale(language), {
    timeStyle: "short",
  }).format(at);
  return `${shortDate(at, locale)}, ${time}`;
}

/** The title over a calendar, e.g. "sentyabr 2026". */
export function monthTitle(
  year: number,
  month: number,
  locale?: string | null,
) {
  const language = dateLanguage(locale);
  if (language === "az") return `${AZ_MONTHS[month]} ${year}`;
  return new Intl.DateTimeFormat(intlLocale(language), {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month, 1)));
}

/** The seven column headings of a calendar, Monday first. */
export function weekdayHeadings(locale?: string | null) {
  const language = dateLanguage(locale);
  if (language === "az") return AZ_WEEKDAYS_SHORT;
  const format = new Intl.DateTimeFormat(intlLocale(language), {
    weekday: "short",
    timeZone: "UTC",
  });
  // 2024-01-01 was a Monday, so this walks Monday to Sunday.
  return Array.from({ length: 7 }, (_, i) =>
    format.format(new Date(Date.UTC(2024, 0, 1 + i))),
  );
}

/** Weekday names indexed the way the availability API numbers them, Sunday = 0. */
export function weekdayNames(locale?: string | null) {
  const language = dateLanguage(locale);
  if (language === "az") {
    return [AZ_WEEKDAYS_LONG[6], ...AZ_WEEKDAYS_LONG.slice(0, 6)];
  }
  const format = new Intl.DateTimeFormat(intlLocale(language), {
    weekday: "long",
    timeZone: "UTC",
  });
  // 2024-01-07 was a Sunday, so index 0 lands on Sunday.
  return Array.from({ length: 7 }, (_, i) =>
    format.format(new Date(Date.UTC(2024, 0, 7 + i))),
  );
}
