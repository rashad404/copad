import Directories, { Verification, Portrait } from "./Directories";
import {
  doctorCopy,
  specialtyName,
  experienceYears,
} from "../copy/website/doctors";
import React, { useState } from "react";
import { Linking, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import api from "../core/api";
import { useCopy } from "../core/copy";
import { useFamily, useSession } from "../core/Session";
import { useResource } from "../core/useResource";
import { type PublicDoctor, type Slot } from "../api/doctorTypes";
import { createBooking, fetchSlots } from "../api/booking";
import { canWrite } from "../api/recordModel";
import { money } from "../api/labModel";
import { shortDate } from "../utils/dates";
import {
  Body,
  Heading,
  Title,
  Page,
  LinkRow,
  Input,
  Button,
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
export { Medicine } from "./Medicines";
import { Medicines } from "./Medicines";
export function Directory() {
  const { kind } = useRoute<any>().params as { kind: DirectoryKind };
  return kind === "medicines" ? (
    <Medicines />
  ) : (
    <Directories key={kind} kind={kind} />
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
  const nav = useNavigation<any>();
  const d = doctorCopy(language);
  return (
    <Page>
      <LoadState resource={r} />
      {doctor && (
        <>
          <Portrait doctor={doctor} />
          <Title>{doctor.fullName}</Title>
          <Body>
            {specialty.data?.find((s) => s.code === doctor.specialtyCode)
              ?.name || specialtyName(doctor.specialtyCode, language)}
          </Body>
          <Verification value={doctor.verification} detail />
          {doctor.verification !== "VERIFIED" && (
            <LinkRow
              title={d.claim}
              onPress={() => nav.navigate("DoctorPortal")}
            />
          )}
          {doctor.qualifications && (
            <>
              <Heading>{d.qualifications}</Heading>
              <Body>{doctor.qualifications}</Body>
            </>
          )}
          {doctor.bio && (
            <>
              <Heading>{d.about}</Heading>
              <Body>{doctor.bio}</Body>
            </>
          )}
          <Body small>
            {doctor.languages
              .map((l) => d[l as "az" | "en" | "ru"] || l)
              .join(", ")}
            {doctor.yearsExperience != null
              ? ` - ${experienceYears(doctor.yearsExperience, language)}`
              : ""}
          </Body>
          {doctor.consultationFee != null && (
            <Heading>
              {d.fee}: {money(doctor.consultationFee, language, "-")}
            </Heading>
          )}
          <Heading>{d.clinics}</Heading>
          {doctor.clinics.map((clinic) => (
            <View key={clinic.slug} style={styles.card}>
              <Heading>{clinic.name}</Heading>
              <Body>
                {[clinic.city, clinic.district, clinic.address]
                  .filter(Boolean)
                  .join(", ")}
              </Body>
              {!clinic.phone && <Body small>{d.noPhone}</Body>}
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
      <Body small>
        {c(
          "Times are shown in Baku time.",
          "Vaxtlar Bakı vaxtı ilə göstərilir.",
          "Указано время Баку.",
        )}
      </Body>
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
