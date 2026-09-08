import React from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFamily } from "../core/Session";
import { useCopy } from "../core/copy";
import { useResource } from "../core/useResource";
import { recordAccess } from "../api/booking";
import { dateAndTime } from "../utils/dates";
import {
  Page,
  Title,
  Body,
  Heading,
  SignedIn,
  MemberPicker,
  LoadState,
  Button,
  styles,
} from "../ui/kit";

export default function RecordAccess() {
  return (
    <Page>
      <SignedIn>
        <AccessList />
      </SignedIn>
    </Page>
  );
}
function AccessList() {
  const { c, language } = useCopy(),
    f = useFamily(),
    nav = useNavigation<any>();
  const r = useResource(
    f.member ? `record-access:${f.member.id}` : null,
    (signal) => recordAccess(f.member!.id, signal),
  );
  const rows = [...(r.data || [])].sort(
    (a, b) => b.accessedAt.localeCompare(a.accessedAt) || b.id - a.id,
  );
  return (
    <>
      <Title>
        {c(
          "Who viewed the record",
          "Qeydlərə kim baxıb?",
          "Кто просматривал записи",
        )}
      </Title>
      <MemberPicker allowNone={false} />
      <Body>
        {c(
          "Doctors who opened this person's record shared for an appointment.",
          "Bu siyahıda randevu üçün paylaşılan qeydləri açmış həkimlər göstərilir.",
          "Здесь указаны врачи, открывавшие записи этого человека, предоставленные для приема.",
        )}
      </Body>
      <LoadState resource={r} />
      {r.data && !rows.length && (
        <Body>
          {c(
            "No doctor has opened this person's shared record.",
            "Hələ heç bir həkim bu şəxsin paylaşılan qeydlərini açmayıb.",
            "Ни один врач пока не открывал предоставленные записи этого человека.",
          )}
        </Body>
      )}
      {rows.map((row) => (
        <View key={row.id} style={styles.line}>
          <Heading>{row.doctorName || c("Doctor", "Həkim", "Врач")}</Heading>
          <Body>
            {row.bookingId == null
              ? c(
                  "Appointment no longer available",
                  "Randevu artıq mövcud deyil",
                  "Запись на прием больше недоступна",
                )
              : `${c("Appointment", "Randevu", "Прием")} #${row.bookingId}`}
          </Body>
          <Body small>{dateAndTime(row.accessedAt, language)}</Body>
          {row.doctorSlug && (
            <Button
              secondary
              label={c("Doctor profile", "Həkimin profili", "Профиль врача")}
              onPress={() => nav.navigate("Doctor", { slug: row.doctorSlug })}
            />
          )}
        </View>
      ))}
    </>
  );
}
