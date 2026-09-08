import React, { useState } from "react";
import { Linking, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import api from "../core/api";
import { useCopy } from "../core/copy";
import { useFamily, useSession } from "../core/Session";
import { useResource } from "../core/useResource";
import {
  type MedicineSummary,
  type MedicineDetail,
  type AllergyWarning,
  checkMedicineAllergies,
} from "../api/medicines";
import {
  type PublicDoctor,
  type DoctorPage,
  type Slot,
} from "../api/doctorTypes";
import { createBooking, fetchSlots } from "../api/booking";
import { canWrite } from "../api/recordModel";
import { money, type Lab, type LabPage } from "../api/labModel";
import { shortDate } from "../utils/dates";
import {
  Body,
  Heading,
  Title,
  Page,
  LinkRow,
  Input,
  Button,
  Select,
  Toggle,
  Notice,
  LoadState,
  MemberPicker,
  SignedIn,
  styles,
} from "../ui/kit";
export type DirectoryKind = "doctors" | "medicines" | "labs";
export function Services() {
  const nav = useNavigation<any>(),
    { c } = useCopy();
  return (
    <Page>
      <Title>{c("Services", "Xidmətlər", "Услуги")}</Title>
      <Body>
        {c(
          "Find a doctor, compare medicine prices, or choose a laboratory.",
          "Həkim tapın, dərman qiymətlərini müqayisə edin və laboratoriya seçin.",
          "Найдите врача, сравните цены на лекарства или выберите лабораторию.",
        )}
      </Body>
      <LinkRow
        title={c("Doctors", "Həkimlər", "Врачи")}
        detail={c(
          "Specialties, clinics and appointments",
          "İxtisaslar, klinikalar və randevular",
          "Специальности, клиники и приемы",
        )}
        onPress={() => nav.navigate("Directory", { kind: "doctors" })}
      />
      <LinkRow
        title={c("Medicines", "Dərmanlar", "Лекарства")}
        detail={c(
          "Ingredients, prices and alternatives",
          "Təsiredici maddələr, qiymətlər və alternativlər",
          "Действующие вещества, цены и аналоги",
        )}
        onPress={() => nav.navigate("Directory", { kind: "medicines" })}
      />
      <LinkRow
        title={c("Laboratories", "Laboratoriyalar", "Лаборатории")}
        detail={c(
          "Tests and home collection",
          "Analizlər və evdən nümunə götürülməsi",
          "Анализы и забор на дому",
        )}
        onPress={() => nav.navigate("Directory", { kind: "labs" })}
      />
    </Page>
  );
}
export function Directory() {
  const { kind } = useRoute<any>().params as { kind: DirectoryKind };
  return <DirectoryScope key={kind} kind={kind} />;
}
function DirectoryScope({ kind }: { kind: DirectoryKind }) {
  const { c, language } = useCopy(),
    nav = useNavigation<any>();
  const [q, setQ] = useState(""),
    [city, setCity] = useState(""),
    [home, setHome] = useState(false),
    [specialty, setSpecialty] = useState(""),
    [spoken, setSpoken] = useState(""),
    [query, setQuery] = useState({
      q: "",
      city: "",
      homeCollection: false,
      specialty: "",
      language: "",
      page: 0,
    });
  const specialties = useResource(
    kind === "doctors" ? `specialties:${language}` : null,
    async (s) =>
      (
        await api.get<{ code: string; name: string }[]>(
          "/doctors/specialties",
          { params: { lang: language }, signal: s },
        )
      ).data,
  );
  const r = useResource(
    `${kind}:${language}:${JSON.stringify(query)}`,
    async (s) =>
      (
        await api.get<DoctorPage | LabPage | MedicineSummary[]>(`/${kind}`, {
          params: { ...query, lang: language, size: 20, limit: 20 },
          signal: s,
        })
      ).data,
  );
  const rows = r.data ? (Array.isArray(r.data) ? r.data : r.data.content) : [];
  const page = r.data && !Array.isArray(r.data) ? r.data : null;
  return (
    <Page>
      <Title>
        {kind === "doctors"
          ? c("Doctors", "Həkimlər", "Врачи")
          : kind === "medicines"
            ? c("Medicines", "Dərmanlar", "Лекарства")
            : c("Laboratories", "Laboratoriyalar", "Лаборатории")}
      </Title>
      <Input
        label={c("Search by name", "Ada görə axtar", "Поиск по названию")}
        value={q}
        onChangeText={setQ}
        returnKeyType="search"
        onSubmitEditing={() =>
          setQuery({
            q: q.trim(),
            city: city.trim(),
            homeCollection: home,
            specialty,
            language: spoken,
            page: 0,
          })
        }
      />
      {kind !== "medicines" && (
        <Input
          label={c("City", "Şəhər", "Город")}
          value={city}
          onChangeText={setCity}
        />
      )}{" "}
      {kind === "doctors" && (
        <>
          <Select
            label={c("Specialty", "İxtisas", "Специальность")}
            value={specialty}
            options={[
              { value: "", label: c("All", "Hamısı", "Все") },
              ...(specialties.data || []).map((d) => ({
                value: d.code,
                label: d.name,
              })),
            ]}
            onChange={setSpecialty}
          />
          <Select
            label={c("Language", "Dil", "Язык")}
            value={spoken}
            options={[
              { value: "", label: c("All", "Hamısı", "Все") },
              { value: "az", label: "Azərbaycanca" },
              { value: "ru", label: "Русский" },
              { value: "en", label: "English" },
            ]}
            onChange={setSpoken}
          />
        </>
      )}
      {kind === "labs" && (
        <Toggle
          label={c(
            "Home collection available",
            "Evdən nümunə götürənlər",
            "Есть забор на дому",
          )}
          value={home}
          onChange={setHome}
        />
      )}
      <Button
        label={c("Search", "Axtar", "Найти")}
        onPress={() =>
          setQuery({
            q: q.trim(),
            city: city.trim(),
            homeCollection: home,
            specialty,
            language: spoken,
            page: 0,
          })
        }
      />
      <LoadState resource={r} />
      {r.data && rows.length === 0 && (
        <Notice>
          {query.q ||
          query.city ||
          query.specialty ||
          query.language ||
          query.homeCollection
            ? c(
                "No results for these filters. Try a different search.",
                "Bu filtrlərə uyğun nəticə yoxdur. Axtarışı dəyişin.",
                "По этим фильтрам ничего не найдено. Измените поиск.",
              )
            : kind === "doctors"
              ? c(
                  "We are adding doctors. Listings will appear here.",
                  "Həkimlər əlavə olunur. Siyahı burada təqdim ediləcək.",
                  "Мы добавляем врачей. Здесь появятся их анкеты.",
                )
              : kind === "labs"
                ? c(
                    "We are adding laboratories.",
                    "Laboratoriyalar əlavə olunur.",
                    "Мы добавляем лаборатории.",
                  )
                : c(
                    "No medicines found.",
                    "Dərman tapılmadı.",
                    "Лекарства не найдены.",
                  )}
        </Notice>
      )}
      {rows.map((item) => (
        <View style={styles.card} key={item.slug}>
          {kind === "doctors" ? (
            <>
              <Heading>{(item as PublicDoctor).fullName}</Heading>
              <Body>
                {specialties.data?.find(
                  (s) => s.code === (item as PublicDoctor).specialtyCode,
                )?.name || (item as PublicDoctor).specialtyCode}
              </Body>
              <Verification value={(item as PublicDoctor).verification} />
              <Body small>
                {(item as PublicDoctor).clinics.map((c) => c.name).join(", ")}
              </Body>
              <Body small>
                {(item as PublicDoctor).languages.join(", ")}
                {(item as PublicDoctor).yearsExperience != null
                  ? ` - ${(item as PublicDoctor).yearsExperience} ${c("years", "il", "лет")}`
                  : ""}
              </Body>
              {(item as PublicDoctor).consultationFee != null && (
                <Body>
                  {money(
                    (item as PublicDoctor).consultationFee!,
                    language,
                    "-",
                  )}
                </Body>
              )}
            </>
          ) : kind === "medicines" ? (
            <>
              <Heading>{(item as MedicineSummary).name}</Heading>
              <Body>{(item as MedicineSummary).activeIngredient || "-"}</Body>
              <Body>
                {money(
                  (item as MedicineSummary).lowestPrice,
                  language,
                  c("Price not listed", "Qiymət yoxdur", "Цена не указана"),
                )}
              </Body>
              <Body small>
                {c("Packs listed", "Qablaşdırma sayı", "Упаковок")}:{" "}
                {(item as MedicineSummary).priceCount}
              </Body>
            </>
          ) : (
            <>
              <Heading>{(item as Lab).name}</Heading>
              <Body>
                {[(item as Lab).city, (item as Lab).district]
                  .filter(Boolean)
                  .join(", ")}
              </Body>
              <Body small>
                {(item as Lab).homeCollection
                  ? c(
                      "Home collection available",
                      "Evdən nümunə götürülür",
                      "Есть забор на дому",
                    )
                  : c(
                      "Collection at the lab",
                      "Nümunə laboratoriyada götürülür",
                      "Забор в лаборатории",
                    )}
              </Body>
              <Body small>
                {c("Tests", "Analiz sayı", "Анализов")}:{" "}
                {(item as Lab).testCount}
              </Body>
              {(item as Lab).phone && <Body>{(item as Lab).phone}</Body>}
            </>
          )}
          <Button
            secondary
            label={c("View details", "Ətraflı bax", "Подробнее")}
            onPress={() =>
              nav.navigate(
                kind === "doctors"
                  ? "Doctor"
                  : kind === "medicines"
                    ? "Medicine"
                    : "Laboratory",
                { slug: item.slug },
              )
            }
          />
        </View>
      ))}
      {page && (
        <View style={styles.spread}>
          <Button
            secondary
            disabled={query.page === 0}
            label={c("Previous", "Əvvəlki", "Назад")}
            onPress={() => setQuery((v) => ({ ...v, page: v.page - 1 }))}
          />
          <Body>{query.page + 1}</Body>
          <Button
            secondary
            disabled={query.page + 1 >= page.totalPages}
            label={c("Next", "Növbəti", "Далее")}
            onPress={() => setQuery((v) => ({ ...v, page: v.page + 1 }))}
          />
        </View>
      )}
    </Page>
  );
}
export function Verification({ value }: { value: string }) {
  const { c } = useCopy();
  return (
    <Body small>
      {value === "VERIFIED"
        ? c(
            "Credentials checked",
            "Peşə sənədləri yoxlanılıb",
            "Документы об образовании проверены",
          )
        : value === "PENDING"
          ? c(
              "Claimed listing, under review",
              "Sahiblik müraciəti yoxlanılır",
              "Заявка на подтверждение анкеты рассматривается",
            )
          : c(
              "Listing unconfirmed. Information was added from a public source.",
              "Siyahıdakı məlumatlar həkim tərəfindən təsdiqlənməyib. Açıq mənbədən əlavə olunub.",
              "Анкета не подтверждена врачом. Данные добавлены из открытого источника.",
            )}
    </Body>
  );
}
export function Medicine() {
  const { slug } = useRoute<any>().params as { slug: string };
  return <MedicineScope key={slug} slug={slug} />;
}
function MedicineScope({ slug }: { slug: string }) {
  const { c, language } = useCopy(),
    nav = useNavigation<any>(),
    { user } = useSession(),
    f = useFamily();
  const r = useResource(
    `medicine:${slug}:${language}`,
    async (s) =>
      (
        await api.get<MedicineDetail>(
          `/medicines/${encodeURIComponent(slug)}`,
          { params: { lang: language }, signal: s },
        )
      ).data,
  );
  const warnings = useResource(
    user && f.member && r.data
      ? `allergy:${user.id}:${f.member.id}:${r.data.id}`
      : null,
    (s) => checkMedicineAllergies(r.data!.id, f.member!.id, s),
  );
  const med = r.data;
  const price = (v: number | null) =>
    money(
      v,
      language,
      c("Price not listed", "Qiymət yoxdur", "Цена не указана"),
    );
  const min =
    med?.prices.reduce<number | null>(
      (min, p) =>
        p.retailPrice == null ? min : Math.min(min ?? Infinity, p.retailPrice),
      null,
    ) ?? null;
  return (
    <Page>
      <LoadState resource={r} />
      {med && (
        <>
          <Title>{med.name}</Title>
          <Body>{med.active_ingredient || "-"}</Body>
          <Body small>
            {[med.manufacturer, med.prescription_status, med.release_form]
              .filter(Boolean)
              .join(", ")}
          </Body>
          <MemberPicker />
          <LoadState resource={warnings} />
          {warnings.data?.map((w, i) => (
            <Notice danger key={i}>
              {w.critical
                ? c(
                    "Life-threatening allergy risk",
                    "Həyati təhlükəli allergiya riski",
                    "Риск аллергии с угрозой для жизни",
                  )
                : c(
                    "Possible allergy conflict",
                    "Mümkün allergiya riski",
                    "Возможный риск аллергии",
                  )}
              : {w.allergen}.{" "}
              {c(
                "This is advisory and does not replace a doctor or pharmacist.",
                "Bu xəbərdarlıq məlumat üçündür, həkim və ya əczaçı məsləhətini əvəz etmir.",
                "Предупреждение носит справочный характер и не заменяет консультацию врача или фармацевта.",
              )}
            </Notice>
          ))}
          <Heading>{c("Prices", "Qiymətlər", "Цены")}</Heading>
          {[...med.prices]
            .sort(
              (a, b) =>
                (a.retailPrice ?? Infinity) - (b.retailPrice ?? Infinity),
            )
            .map((p, i) => (
              <View key={i} style={styles.line}>
                <Heading>{price(p.retailPrice)}</Heading>
                <Body>
                  {[p.tradeName, p.dosage, p.packaging, p.form]
                    .filter(Boolean)
                    .join(", ")}
                </Body>
              </View>
            ))}
          <Heading>
            {c(
              "Same ingredient, other brands",
              "Eyni maddə, başqa markalar",
              "То же вещество, другие марки",
            )}
          </Heading>
          {[...med.alternatives]
            .sort(
              (a, b) =>
                (a.lowestPrice ?? Infinity) - (b.lowestPrice ?? Infinity),
            )
            .map((a) => (
              <View style={styles.card} key={a.id}>
                <Heading>{a.name}</Heading>
                <Body>{price(a.lowestPrice)}</Body>
                {min != null &&
                  a.lowestPrice != null &&
                  min > a.lowestPrice && (
                    <Notice>
                      {c("Price difference", "Qiymət fərqi", "Разница в цене")}:{" "}
                      {price(Math.round((min - a.lowestPrice) * 100) / 100)}
                    </Notice>
                  )}
                <Button
                  secondary
                  label={c(
                    "View medicine",
                    "Dərmana bax",
                    "Посмотреть препарат",
                  )}
                  onPress={() => nav.push("Medicine", { slug: a.slug })}
                />
              </View>
            ))}
          {!med.alternatives.length && (
            <Body>
              {c(
                "No alternatives listed.",
                "Alternativ qeyd edilməyib.",
                "Аналоги не указаны.",
              )}
            </Body>
          )}
        </>
      )}
    </Page>
  );
}
export function Doctor() {
  const { slug } = useRoute<any>().params as { slug: string };
  return <DoctorScope key={slug} slug={slug} />;
}
function DoctorScope({ slug }: { slug: string }) {
  const { c, language } = useCopy();
  const r = useResource(
    `doctor:${slug}`,
    async (s) =>
      (
        await api.get<PublicDoctor>(`/doctors/${encodeURIComponent(slug)}`, {
          signal: s,
        })
      ).data,
  );
  const specialty = useResource(
    `doctor-specialties:${language}`,
    async (signal) =>
      (
        await api.get<{ code: string; name: string }[]>(
          "/doctors/specialties",
          { params: { lang: language }, signal },
        )
      ).data,
  );
  const doctor = r.data;
  return (
    <Page>
      <LoadState resource={r} />
      {doctor && (
        <>
          <Title>{doctor.fullName}</Title>
          <Body>
            {specialty.data?.find((s) => s.code === doctor.specialtyCode)
              ?.name || doctor.specialtyCode}
          </Body>
          <Verification value={doctor.verification} />
          {doctor.qualifications && <Body>{doctor.qualifications}</Body>}
          {doctor.bio && <Body>{doctor.bio}</Body>}
          <Body small>
            {doctor.languages.join(", ")}
            {doctor.yearsExperience != null
              ? ` - ${doctor.yearsExperience} ${c("years", "il", "лет")}`
              : ""}
          </Body>
          {doctor.consultationFee != null && (
            <Heading>{money(doctor.consultationFee, language, "-")}</Heading>
          )}
          {doctor.clinics.map((clinic) => (
            <View key={clinic.slug} style={styles.card}>
              <Heading>{clinic.name}</Heading>
              <Body>
                {[clinic.city, clinic.district, clinic.address]
                  .filter(Boolean)
                  .join(", ")}
              </Body>
              {clinic.phone && (
                <Button
                  secondary
                  label={clinic.phone}
                  onPress={() =>
                    Linking.openURL(
                      `tel:${clinic.phone!.replace(/[^+\d]/g, "")}`,
                    )
                  }
                />
              )}
            </View>
          ))}
          {doctor.acceptsBookings && doctor.id != null ? (
            <Booking doctor={doctor} />
          ) : (
            <Body small>
              {c(
                "Contact the clinic by phone for appointments.",
                "Randevu üçün klinikaya zəng edin.",
                "Для записи позвоните в клинику.",
              )}
            </Body>
          )}
        </>
      )}
    </Page>
  );
}
function Booking({ doctor }: { doctor: PublicDoctor }) {
  const { c, language } = useCopy(),
    { user } = useSession(),
    f = useFamily(),
    nav = useNavigation<any>();
  const today = () =>
    new Date(Date.now() + 4 * 3600000).toISOString().slice(0, 10);
  const [from, setFrom] = useState(today),
    [slot, setSlot] = useState<Slot | null>(null),
    [share, setShare] = useState(false),
    [reason, setReason] = useState(""),
    [done, setDone] = useState<{ name: string; startsAt: string } | null>(null);
  const to = new Date(new Date(from + "T12:00:00Z").getTime() + 14 * 86400000)
    .toISOString()
    .slice(0, 10);
  const slots = useResource(`slots:${doctor.id}:${from}`, () =>
    fetchSlots(doctor.id!, from, to),
  );
  return (
    <>
      <Heading>
        {c("Available appointments", "Boş vaxtlar", "Доступное время")}
      </Heading>
      <LoadState resource={slots} />
      {slots.data?.length === 0 && (
        <Body>
          {c(
            "No available times in this period.",
            "Bu müddətdə boş vaxt yoxdur.",
            "В этот период свободного времени нет.",
          )}
        </Body>
      )}
      {slots.data?.map((s, i) => (
        <Button
          key={`${s.startsAt}:${s.clinicId}:${i}`}
          secondary={
            slot?.startsAt !== s.startsAt || slot?.clinicId !== s.clinicId
          }
          label={`${shortDate(s.startsAt.slice(0, 10), language)}, ${s.startsAt.slice(11, 16)}${doctor.clinics.find((c) => c.id === s.clinicId)?.name ? " - " + doctor.clinics.find((c) => c.id === s.clinicId)?.name : ""}`}
          onPress={() => {
            setSlot(s);
            setDone(null);
          }}
        />
      ))}
      <View style={styles.row}>
        <Button
          secondary
          disabled={from <= today()}
          label={c("Previous", "Əvvəlki", "Назад")}
          onPress={() => {
            setFrom(
              new Date(new Date(from + "T12:00:00Z").getTime() - 14 * 86400000)
                .toISOString()
                .slice(0, 10),
            );
            setSlot(null);
          }}
        />
        <Button
          secondary
          label={c("Next 2 weeks", "Növbəti 2 həftə", "Следующие 2 недели")}
          onPress={() => {
            setFrom(to);
            setSlot(null);
          }}
        />
      </View>
      {slot && (
        <SignedIn>
          <MemberPicker allowNone={false} />
          {f.member && !canWrite(f.role) ? (
            <Notice>
              {c(
                "Read-only access. Booking requires write access.",
                "Yalnız baxış icazəniz var. Randevu üçün yazma icazəsi lazımdır.",
                "Доступ только для чтения. Для записи нужно право на изменение.",
              )}
            </Notice>
          ) : (
            <>
              <Input
                label={c(
                  "Reason (optional)",
                  "Müraciət səbəbi (istəyə bağlı)",
                  "Причина (необязательно)",
                )}
                value={reason}
                onChangeText={setReason}
              />
              <Toggle
                label={c(
                  "Share this member's record with the doctor for this appointment",
                  "Bu randevu üçün şəxsin qeydlərini həkimlə paylaş",
                  "Поделиться записями этого человека с врачом для этого приема",
                )}
                value={share}
                onChange={setShare}
              />
              <Body small>
                {c(
                  "Access is shared for this appointment. Cancelling the appointment ends the doctor's access.",
                  "Həkim qeydlərə bu randevu üçün baxa bilər. Randevunu ləğv etsəniz, bu icazə də ləğv olunur.",
                  "Доступ предоставляется для этого приема. При отмене записи доступ врача прекращается.",
                )}
              </Body>
              <Notice>
                {c(
                  "This is a request. The doctor still needs to confirm the appointment.",
                  "Bu, randevu sorğusudur. Həkim randevunu ayrıca təsdiqləməlidir.",
                  "Это заявка. Врач должен отдельно подтвердить прием.",
                )}
              </Notice>
              <Button
                disabled={!user || !f.member || !canWrite(f.role) || !!done}
                label={c(
                  "Request appointment",
                  "Randevu sorğusu göndər",
                  "Отправить заявку на прием",
                )}
                onPress={async () => {
                  if (!f.member || !canWrite(f.role)) return;
                  await createBooking(f.member.id, {
                    doctorId: doctor.id!,
                    clinicId: slot.clinicId === "" ? null : slot.clinicId,
                    startsAt: slot.startsAt,
                    shareRecord: share,
                    reason: reason.trim() || null,
                  });
                  setDone({ name: f.member.fullName, startsAt: slot.startsAt });
                  slots.retry();
                }}
              />
              {done && (
                <>
                  <Notice>
                    {done.name} -{" "}
                    {shortDate(done.startsAt.slice(0, 10), language)},{" "}
                    {done.startsAt.slice(11, 16)}.{" "}
                    {c(
                      "Request sent. Awaiting confirmation.",
                      "Sorğu göndərildi. Təsdiq gözlənilir.",
                      "Заявка отправлена. Ожидает подтверждения.",
                    )}
                  </Notice>
                  <Button
                    secondary
                    label={c("My appointments", "Randevularım", "Мои приемы")}
                    onPress={() => nav.navigate("Orders", { kind: "bookings" })}
                  />
                </>
              )}
            </>
          )}
        </SignedIn>
      )}
    </>
  );
}
