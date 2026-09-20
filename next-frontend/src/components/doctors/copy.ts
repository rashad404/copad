export type DirectoryLanguage = "az" | "en" | "ru";
const az = {
  title: "Həkimlər",
  description:
    "Həkimlərin ixtisası, iş təcrübəsi və qəbul etdiyi klinikalar haqqında məlumat.",
  name: "Həkimin adı",
  specialty: "İxtisas",
  city: "Şəhər",
  clinic: "Klinika",
  language: "Danışdığı dil",
  all: "Hamısı",
  search: "Axtar",
  clear: "Seçimləri təmizlə",
  emptyTitle: "Həkimlər siyahıya əlavə olunur",
  empty:
    "Hələ həkim profili dərc edilməyib. Profillər əlavə olunduqca burada görünəcək.",
  noMatchTitle: "Bu seçimlərə uyğun həkim yoxdur",
  noMatch:
    "Siyahı hələ tamamlanır. Digər ixtisas və ya şəhər seçin, yaxud bütün həkimlərə baxın.",
  unavailable: "Həkim siyahısını yükləmək mümkün olmadı",
  retryText: "Bir az sonra yenidən cəhd edin.",
  retry: "Yenidən cəhd et",
  results: "Həkim sayı",
  previous: "Əvvəlki",
  next: "Növbəti",
  page: "Səhifə",
  view: "Profilə bax",
  book: "Onlayn randevu",
  reviewCount: (n: number) => `${n} rəy`,
  namePlaceholder: "Ad, soyad",
  heroTitle: "Həkimi tapın, randevunu saytdan alın",
  heroSub: "Nə narahat edir? Aşağıda yazın",
  searchModes: "Axtarış üsulu",
  aiMode: "AI köməkçi",
  classicMode: "Adi axtarış",
  aiLabel: "Şikayətiniz və ya həkim adı",
  aiPlaceholder: "6 yaşlı uşağımın qulağı ağrıyır, Gəncədəyik",
  searching: "Axtarılır...",
  understood: "Axtarış:",
  removeFilter: "Bu filtri götür",
  urgentTitle: "Təcili tibbi yardım lazım ola bilər",
  urgentBody: "Yazdıqlarınız təcili ola bilər. Həkim axtarmağı gözləmədən 103-ə zəng edin.",
  cityPlaceholder: "Bakı, Gəncə...",
  bookableNote: "Boş vaxtları görün və randevu alın",
  notBookable: "Onlayn randevu hələ aktiv deyil",
  noSlotsTitle: "Bu həkim hələ onlayn randevu qəbul etmir",
  noSlotsBody:
    "Həkim azdoc-da öz profilini təsdiqləyəndə boş vaxtları burada görünəcək və randevunu birbaşa saytdan ala biləcəksiniz. Hələlik klinikaya zəng edin.",
  noSlotsMine: "Bu profil sizindir? Sahiblik tələb edin.",
  years: "İş təcrübəsi",
  yearUnit: "il",
  fee: "Qəbul haqqı",
  clinics: "Qəbul etdiyi klinikalar",
  about: "Həkim haqqında",
  qualifications: "Təhsil və ixtisaslaşma",
  languages: "Danışdığı dillər",
  back: "Bütün həkimlər",
  UNCLAIMED: "Profil təsdiqlənməyib",
  PENDING: "Profil yoxlanılır",
  VERIFIED: "Peşə sənədləri yoxlanılıb",
  REJECTED: "Profil təsdiqlənməyib",
  unclaimedNote:
    "Bu profil açıq mənbələrdən hazırlanıb. Həkim məlumatları təsdiqləməyib. Profilin olması azdoc tərəfindən tövsiyə demək deyil.",
  pendingNote:
    "Profilə sahiblik müraciəti daxil olub və yoxlanılır. Yoxlama hələ tamamlanmayıb. Bu profil azdoc tərəfindən tövsiyə demək deyil.",
  verifiedNote:
    "Bu həkimin peşə sənədləri yoxlanılıb. Bu, müalicənin nəticəsinə zəmanət deyil.",
  unknownNote:
    "Bu profil üzrə təsdiqlənmiş peşə məlumatı yoxdur. Profilin olması azdoc tərəfindən tövsiyə demək deyil.",
  claim: "Bu profil sizindir? Sahiblik tələb edin.",
  claimSubject: "Həkim profilinə sahiblik müraciəti",
  contact: "Qəbul üçün klinika ilə əlaqə saxlayın",
  noPhone: "Klinikanın əlaqə nömrəsi hələ əlavə edilməyib.",
  slots: "Boş qəbul vaxtları",
  slotsNote:
    "Vaxtlar Bakı vaxtı ilə göstərilir. Siyahıya baxmaq qəbul üçün qeydiyyat sayılmır. Vaxtı klinika ilə dəqiqləşdirin.",
  noSlots: "Növbəti 14 gün üçün boş qəbul vaxtı göstərilmir.",
  slotsFailed:
    "Qəbul vaxtlarını yükləmək mümkün olmadı. Klinika ilə əlaqə saxlayın.",
  slotClinic: "Klinikanı telefonla dəqiqləşdirin",
  directoryNote:
    "Profilin təsdiq statusuna diqqət edin. Siyahıda olmaq tövsiyə demək deyil.",
  az: "Azərbaycan dili",
  en: "İngilis dili",
  ru: "Rus dili",
};
type Copy = typeof az;
const en: Copy = {
  title: "Doctors",
  description:
    "Find information about doctors, their specialties, experience and clinics.",
  name: "Doctor name",
  specialty: "Specialty",
  city: "City",
  clinic: "Clinic",
  language: "Language spoken",
  all: "All",
  search: "Search",
  clear: "Clear filters",
  emptyTitle: "We are adding doctors",
  empty:
    "No doctor profiles have been published yet. They will appear here as they are added.",
  noMatchTitle: "No doctors match these filters",
  noMatch:
    "The directory is still growing. Try another specialty or city, or browse all doctors.",
  unavailable: "The doctor directory could not be loaded",
  retryText: "Please try again shortly.",
  retry: "Try again",
  results: "Doctors found",
  previous: "Previous",
  next: "Next",
  page: "Page",
  view: "View profile",
  book: "Book online",
  reviewCount: (n: number) => (n === 1 ? "1 review" : `${n} reviews`),
  namePlaceholder: "Name or surname",
  heroTitle: "Find a doctor, book straight from the site",
  heroSub: "What is bothering you? Write it below",
  searchModes: "Search mode",
  aiMode: "AI assistant",
  classicMode: "Classic search",
  aiLabel: "Your complaint, or a doctor's name",
  aiPlaceholder: "My 6 year old has ear pain, we are in Ganja",
  searching: "Searching...",
  understood: "Search:",
  removeFilter: "Remove this filter",
  urgentTitle: "You may need emergency care",
  urgentBody: "What you wrote may be urgent. Call 103 now rather than looking for a doctor.",
  cityPlaceholder: "Baku, Ganja...",
  bookableNote: "See free times and book",
  notBookable: "Online booking is not active yet",
  noSlotsTitle: "This doctor does not take online appointments yet",
  noSlotsBody:
    "Once the doctor claims this listing on azdoc, their free times appear here and you can book straight from the site. For now, call the clinic.",
  noSlotsMine: "Is this your profile? Claim it.",
  years: "Experience",
  yearUnit: "years",
  fee: "Consultation fee",
  clinics: "Clinics",
  about: "About the doctor",
  qualifications: "Education and qualifications",
  languages: "Languages spoken",
  back: "All doctors",
  UNCLAIMED: "Unconfirmed listing",
  PENDING: "Claim under review",
  VERIFIED: "Credentials checked",
  REJECTED: "Unconfirmed listing",
  unclaimedNote:
    "We created this listing from public sources. The doctor has not confirmed its information. Inclusion is not an endorsement by azdoc.",
  pendingNote:
    "A claim for this profile has been submitted and is under review. Checks are not complete. This listing is not an endorsement by azdoc.",
  verifiedNote:
    "This doctor's professional credentials have been checked. This does not guarantee treatment outcomes.",
  unknownNote:
    "There are no confirmed professional credentials for this listing. Inclusion is not an endorsement by azdoc.",
  claim: "Is this your profile? Claim it.",
  claimSubject: "Doctor profile claim",
  contact: "Contact the clinic about an appointment",
  noPhone: "The clinic phone number has not been added yet.",
  slots: "Available appointment times",
  slotsNote:
    "Times are shown in Baku time. Viewing availability does not reserve an appointment. Confirm the time with the clinic.",
  noSlots: "No available times are listed for the next 14 days.",
  slotsFailed:
    "Appointment times could not be loaded. Please contact the clinic.",
  slotClinic: "Confirm the clinic by phone",
  directoryNote:
    "Check the status of each profile. Inclusion in the directory is not an endorsement.",
  az: "Azerbaijani",
  en: "English",
  ru: "Russian",
};
const ru: Copy = {
  title: "Врачи",
  description:
    "Специальности врачей, опыт работы и клиники, в которых они принимают.",
  name: "Имя врача",
  specialty: "Специальность",
  city: "Город",
  clinic: "Клиника",
  language: "Язык общения",
  all: "Все",
  search: "Найти",
  clear: "Сбросить фильтры",
  emptyTitle: "Мы добавляем врачей в каталог",
  empty:
    "Профили врачей пока не опубликованы. Они появятся здесь по мере добавления.",
  noMatchTitle: "По этим фильтрам врачей пока нет",
  noMatch:
    "Каталог еще пополняется. Выберите другую специальность или город либо посмотрите всех врачей.",
  unavailable: "Не удалось загрузить каталог врачей",
  retryText: "Попробуйте еще раз чуть позже.",
  retry: "Повторить",
  results: "Найдено врачей",
  previous: "Назад",
  next: "Далее",
  page: "Страница",
  view: "Открыть профиль",
  book: "Запись онлайн",
  reviewCount: (n: number) => `${n} отзыв${n === 1 ? "" : n < 5 ? "а" : "ов"}`,
  namePlaceholder: "Имя или фамилия",
  heroTitle: "Найдите врача и запишитесь прямо на сайте",
  heroSub: "Что вас беспокоит? Напишите ниже",
  searchModes: "Способ поиска",
  aiMode: "AI помощник",
  classicMode: "Обычный поиск",
  aiLabel: "Жалоба или имя врача",
  aiPlaceholder: "У ребенка 6 лет болит ухо, мы в Гяндже",
  searching: "Идет поиск...",
  understood: "Поиск:",
  removeFilter: "Убрать этот фильтр",
  urgentTitle: "Может потребоваться неотложная помощь",
  urgentBody: "То, что вы описали, может быть неотложным. Позвоните 103, не тратя время на поиск врача.",
  cityPlaceholder: "Баку, Гянджа...",
  bookableNote: "Посмотрите свободное время и запишитесь",
  notBookable: "Онлайн-запись пока не активна",
  noSlotsTitle: "Этот врач пока не принимает записи онлайн",
  noSlotsBody:
    "Когда врач подтвердит профиль на azdoc, свободное время появится здесь и записаться можно будет прямо на сайте. Пока позвоните в клинику.",
  noSlotsMine: "Это ваш профиль? Заявите на него права.",
  years: "Опыт работы",
  yearUnit: "лет",
  fee: "Стоимость приема",
  clinics: "Где принимает",
  about: "О враче",
  qualifications: "Образование и квалификация",
  languages: "Языки общения",
  back: "Все врачи",
  UNCLAIMED: "Профиль не подтвержден",
  PENDING: "Заявка на рассмотрении",
  VERIFIED: "Документы проверены",
  REJECTED: "Профиль не подтвержден",
  unclaimedNote:
    "Мы создали этот профиль по открытым источникам. Врач не подтверждал указанные сведения. Наличие профиля не означает рекомендацию azdoc.",
  pendingNote:
    "Подана заявка на управление профилем. Проверка еще не завершена. Наличие профиля не означает рекомендацию azdoc.",
  verifiedNote:
    "Документы о профессиональной квалификации врача проверены. Это не гарантирует результат лечения.",
  unknownNote:
    "Для этого профиля нет подтвержденных сведений о квалификации. Наличие профиля не означает рекомендацию azdoc.",
  claim: "Это ваш профиль? Заявите на него права.",
  claimSubject: "Заявка на управление профилем врача",
  contact: "Свяжитесь с клиникой для записи",
  noPhone: "Телефон клиники пока не указан.",
  slots: "Свободное время приема",
  slotsNote:
    "Указано время Баку. Просмотр свободного времени не означает запись на прием. Подтвердите время в клинике.",
  noSlots: "На ближайшие 14 дней свободное время не указано.",
  slotsFailed: "Не удалось загрузить время приема. Свяжитесь с клиникой.",
  slotClinic: "Уточните клинику по телефону",
  directoryNote:
    "Обращайте внимание на статус профиля. Наличие в каталоге не означает рекомендацию.",
  az: "Азербайджанский",
  en: "Английский",
  ru: "Русский",
};
export const doctorCopy = (language: DirectoryLanguage) =>
  ({ az, en, ru })[language];
const specialties: Record<string, [string, string, string]> = {
  general: ["Terapevt", "General medicine", "Терапевт"],
  cardiology: ["Kardioloq", "Cardiology", "Кардиолог"],
  pediatrics: ["Pediatr", "Pediatrics", "Педиатр"],
  dermatology: ["Dermatoloq", "Dermatology", "Дерматолог"],
  neurology: ["Nevroloq", "Neurology", "Невролог"],
  gynecology: ["Ginekoloq", "Gynecology", "Гинеколог"],
  endocrinology: ["Endokrinoloq", "Endocrinology", "Эндокринолог"],
  gastroenterology: ["Qastroenteroloq", "Gastroenterology", "Гастроэнтеролог"],
  psychiatry: ["Psixiatr", "Psychiatry", "Психиатр"],
  orthopedics: ["Ortoped", "Orthopedics", "Ортопед"],
  urology: ["Uroloq", "Urology", "Уролог"],
  ophthalmology: ["Oftalmoloq", "Ophthalmology", "Офтальмолог"],
  ent: ["Qulaq, burun, boğaz həkimi", "Ear, nose and throat", "ЛОР"],
  dentistry: ["Stomatoloq", "Dentistry", "Стоматолог"],
};
export function specialtyName(
  code: string,
  language: DirectoryLanguage,
  fallback?: string,
) {
  return (
    specialties[code]?.[{ az: 0, en: 1, ru: 2 }[language]] || fallback || code
  );
}

export function defaultSpecialties() {
  return Object.keys(specialties).map((code) => ({
    code,
    name: specialties[code][0],
  }));
}
export function experienceYears(value: number, language: DirectoryLanguage) {
  if (language === "az") return `${value} il`;
  if (language === "en") return `${value} ${value === 1 ? "year" : "years"}`;
  const category = new Intl.PluralRules("ru").select(value);
  return `${value} ${category === "one" ? "год" : category === "few" ? "года" : "лет"}`;
}

/** One decimal, with the separator the language actually uses. */
export const formatRating = (value: number, language: DirectoryLanguage) =>
  value.toFixed(1).replace(".", language === "en" ? "." : ",");
