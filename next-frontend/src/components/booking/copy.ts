import type { DirectoryLanguage } from "@/components/doctors/copy";

/**
 * Wording for the booking flow.
 *
 * Kept beside the flow rather than in the directory dictionary because these
 * are the only strings a person reads while committing to something: they are
 * worded to say plainly what will happen, and none of them tells anybody to go
 * and ask their doctor.
 */
const strings = {
  az: {
    heading: "Randevu al",
    pickDay: "Gün seçin",
    pickTime: "Vaxt seçin",
    noTimes: "Bu gün üçün boş vaxt yoxdur",
    loading: "Yüklənir...",
    loadFailed: "Vaxtları yükləmək mümkün olmadı",
    retry: "Yenidən cəhd et",
    prevMonth: "Əvvəlki ay",
    nextMonth: "Növbəti ay",
    forWhom: "Kim üçün",
    reason: "Müraciət səbəbi",
    reasonHint: "İstəyə bağlı",
    shareRecord: "Sağlamlıq qeydlərimi bu həkimlə paylaş",
    shareRecordHint:
      "Yalnız bu randevu üçün. İstənilən vaxt randevunu ləğv edərək dayandıra bilərsiniz.",
    confirm: "Randevunu təsdiqlə",
    booking: "Göndərilir...",
    signIn: "Randevu almaq üçün daxil olun",
    signInLink: "Daxil ol",
    noMembers: "Əvvəlcə ailə üzvü əlavə edin",
    addMember: "Profilə keç",
    taken: "Bu vaxt artıq tutulub. Başqa vaxt seçin.",
    failed: "Randevunu yaratmaq mümkün olmadı. Yenidən cəhd edin.",
    booked: "Randevunuz yaradıldı",
    bookedNote: "Təfərrüatları randevularım səhifəsində görə bilərsiniz.",
    myBookings: "Randevularım",
    close: "Bağla",
    // My appointments page
    pageTitle: "Randevularım",
    upcoming: "Gələcək randevular",
    past: "Keçmiş randevular",
    empty: "Hələ randevunuz yoxdur",
    emptyNote: "Həkim seçib randevu ala bilərsiniz.",
    findDoctor: "Həkimlərə bax",
    cancel: "Randevunu ləğv et",
    cancelling: "Ləğv edilir...",
    cancelConfirm: "Bu randevunu ləğv etmək istədiyinizə əminsiniz?",
    cancelFailed: "Randevunu ləğv etmək mümkün olmadı",
    shared: "Sağlamlıq qeydləri paylaşılıb",
    at: "Klinika",
    REQUESTED: "Gözləyir",
    CONFIRMED: "Təsdiqlənib",
    CANCELLED: "Ləğv edilib",
    COMPLETED: "Tamamlanıb",
    NO_SHOW: "Gəlmədi",
  },
  en: {
    heading: "Book an appointment",
    pickDay: "Choose a day",
    pickTime: "Choose a time",
    noTimes: "No free times on this day",
    loading: "Loading...",
    loadFailed: "Could not load available times",
    retry: "Try again",
    prevMonth: "Previous month",
    nextMonth: "Next month",
    forWhom: "Who is this for",
    reason: "Reason for the visit",
    reasonHint: "Optional",
    shareRecord: "Share my health record with this doctor",
    shareRecordHint:
      "For this appointment only. Cancelling the appointment stops it.",
    confirm: "Confirm appointment",
    booking: "Booking...",
    signIn: "Sign in to book an appointment",
    signInLink: "Sign in",
    noMembers: "Add a family member first",
    addMember: "Go to profile",
    taken: "That time has just been taken. Please choose another.",
    failed: "Could not create the appointment. Please try again.",
    booked: "Your appointment is booked",
    bookedNote: "You can see the details under my appointments.",
    myBookings: "My appointments",
    close: "Close",
    pageTitle: "My appointments",
    upcoming: "Upcoming",
    past: "Past appointments",
    empty: "You have no appointments yet",
    emptyNote: "Choose a doctor to book one.",
    findDoctor: "Browse doctors",
    cancel: "Cancel appointment",
    cancelling: "Cancelling...",
    cancelConfirm: "Are you sure you want to cancel this appointment?",
    cancelFailed: "Could not cancel the appointment",
    shared: "Health record shared",
    at: "Clinic",
    REQUESTED: "Requested",
    CONFIRMED: "Confirmed",
    CANCELLED: "Cancelled",
    COMPLETED: "Completed",
    NO_SHOW: "Did not attend",
  },
  ru: {
    heading: "Записаться на приём",
    pickDay: "Выберите день",
    pickTime: "Выберите время",
    noTimes: "На этот день нет свободного времени",
    loading: "Загрузка...",
    loadFailed: "Не удалось загрузить свободное время",
    retry: "Попробовать снова",
    prevMonth: "Предыдущий месяц",
    nextMonth: "Следующий месяц",
    forWhom: "Для кого",
    reason: "Причина обращения",
    reasonHint: "Необязательно",
    shareRecord: "Поделиться моей медицинской картой с этим врачом",
    shareRecordHint:
      "Только для этого приёма. Отмена приёма прекращает доступ.",
    confirm: "Подтвердить запись",
    booking: "Отправка...",
    signIn: "Войдите, чтобы записаться",
    signInLink: "Войти",
    noMembers: "Сначала добавьте члена семьи",
    addMember: "Перейти в профиль",
    taken: "Это время только что заняли. Выберите другое.",
    failed: "Не удалось создать запись. Попробуйте снова.",
    booked: "Вы записаны",
    bookedNote: "Подробности - в разделе мои записи.",
    myBookings: "Мои записи",
    close: "Закрыть",
    pageTitle: "Мои записи",
    upcoming: "Предстоящие",
    past: "Прошедшие",
    empty: "У вас пока нет записей",
    emptyNote: "Выберите врача, чтобы записаться.",
    findDoctor: "Смотреть врачей",
    cancel: "Отменить запись",
    cancelling: "Отмена...",
    cancelConfirm: "Отменить эту запись?",
    cancelFailed: "Не удалось отменить запись",
    shared: "Медицинская карта открыта",
    at: "Клиника",
    REQUESTED: "Ожидает",
    CONFIRMED: "Подтверждена",
    CANCELLED: "Отменена",
    COMPLETED: "Завершена",
    NO_SHOW: "Не пришёл",
  },
};

export type BookingCopy = typeof strings.az;

export const bookingCopy = (language: DirectoryLanguage): BookingCopy =>
  strings[language] ?? strings.az;

/** Month and weekday names come from the platform rather than a table here. */
export const localeFor = (language: DirectoryLanguage) =>
  language === "az" ? "az-AZ" : language === "ru" ? "ru-RU" : "en-GB";

/*
 * Dates are named here rather than left to the platform.
 *
 * Two things went wrong relying on Intl alone. Browsers ship incomplete
 * Azerbaijani data, so a month came out as "M08" instead of its name. And
 * these are synthetic UTC dates, so formatting them without saying UTC moved
 * them a day west of Greenwich - the Monday-first weekday row was rendering
 * Sunday-first, and the month title showed the month before.
 *
 * English and Russian are complete everywhere, so they still come from Intl.
 */
const AZ_MONTHS = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avqust", "sentyabr", "oktyabr", "noyabr", "dekabr",
];

/** Monday first, which is how a calendar is read here. */
const AZ_WEEKDAYS_SHORT = ["B.e", "Ç.a", "Ç", "C.a", "C", "Ş", "B"];

const AZ_WEEKDAYS_LONG = [
  "bazar ertəsi", "çərşənbə axşamı", "çərşənbə", "cümə axşamı",
  "cümə", "şənbə", "bazar",
];

/** The title over the calendar, e.g. "sentyabr 2026". */
export function monthTitle(
  year: number,
  month: number,
  language: DirectoryLanguage,
) {
  if (language === "az") return `${AZ_MONTHS[month]} ${year}`;
  return new Intl.DateTimeFormat(localeFor(language), {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month, 1)));
}

/** The seven column headings, Monday first. */
export function weekdayHeadings(language: DirectoryLanguage) {
  if (language === "az") return AZ_WEEKDAYS_SHORT;
  const format = new Intl.DateTimeFormat(localeFor(language), {
    weekday: "short",
    timeZone: "UTC",
  });
  // 2024-01-01 was a Monday, so this walks Monday to Sunday.
  return Array.from({ length: 7 }, (_, i) =>
    format.format(new Date(Date.UTC(2024, 0, 1 + i))),
  );
}

/** A whole date spelled out, e.g. "8 sentyabr 2026, çərşənbə axşamı". */
export function fullDate(isoDay: string, language: DirectoryLanguage) {
  const at = new Date(`${isoDay}T12:00:00Z`);
  if (language === "az") {
    const day = Number(isoDay.slice(8, 10));
    const month = AZ_MONTHS[Number(isoDay.slice(5, 7)) - 1];
    const weekday = AZ_WEEKDAYS_LONG[(at.getUTCDay() + 6) % 7];
    return `${day} ${month} ${isoDay.slice(0, 4)}, ${weekday}`;
  }
  return new Intl.DateTimeFormat(localeFor(language), {
    dateStyle: "full",
    timeZone: "UTC",
  }).format(at);
}

/** The shorter form used in lists, e.g. "8 sentyabr 2026". */
export function shortDate(isoDay: string, language: DirectoryLanguage) {
  if (language === "az") {
    return `${Number(isoDay.slice(8, 10))} ${
      AZ_MONTHS[Number(isoDay.slice(5, 7)) - 1]
    } ${isoDay.slice(0, 4)}`;
  }
  return new Intl.DateTimeFormat(localeFor(language), {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${isoDay}T12:00:00Z`));
}

/** Weekday names indexed as the availability API numbers them, Sunday = 0. */
export function weekdayNames(language: DirectoryLanguage) {
  if (language === "az") {
    return [
      AZ_WEEKDAYS_LONG[6], ...AZ_WEEKDAYS_LONG.slice(0, 6),
    ];
  }
  const format = new Intl.DateTimeFormat(localeFor(language), {
    weekday: "long",
    timeZone: "UTC",
  });
  // 2024-01-07 was a Sunday, so index 0 lands on Sunday.
  return Array.from({ length: 7 }, (_, i) =>
    format.format(new Date(Date.UTC(2024, 0, 7 + i))),
  );
}
