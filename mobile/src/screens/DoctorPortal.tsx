import React, { useState } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSession } from "../core/Session";
import { useCopy } from "../core/copy";
import { useResource } from "../core/useResource";
import api from "../core/api";
import * as doctor from "../api/doctorSelf";
import { type PublicDoctor, type DoctorPage } from "../api/doctorTypes";
import { portalCopy } from "../copy/website/portal";
import { shortDate, weekdayNames } from "../utils/dates";
import { decimal, calendarDate } from "../core/validation";
import { Verification } from "./Directories";
import {
  Page,
  Title,
  Heading,
  Body,
  SignedIn,
  LoadState,
  Button,
  LinkRow,
  Notice,
  Input,
  Select,
  Toggle,
  Confirm,
  styles,
} from "../ui/kit";
import { DateField } from "../ui/DateField";
import TimeField, { validTime } from "../ui/TimeField";
export default function DoctorPortal() {
  return (
    <Page>
      <SignedIn>
        <Portal />
      </SignedIn>
    </Page>
  );
}
function Portal() {
  const { user } = useSession(),
    { language } = useCopy(),
    c = portalCopy(language),
    nav = useNavigation<any>();
  const listing = useResource(`doctor-self:${user!.id}`, (s) =>
    doctor.getMyListing(s),
  );
  return (
    <>
      <Title>{c.title}</Title>
      <LoadState resource={listing} />
      {listing.data === null && !listing.loading && !listing.error && (
        <>
          <Heading>{c.noListing}</Heading>
          <Body>{c.noListingNote}</Body>
          <Claim onClaimed={listing.retry} />
        </>
      )}
      {listing.data && (
        <>
          <Heading>{listing.data.fullName}</Heading>
          <Verification value={listing.data.verification} detail />
          <LinkRow
            title={c.viewProfile}
            onPress={() => nav.navigate("Doctor", { slug: listing.data!.slug })}
          />
          {!listing.data.acceptsBookings && <Notice>{c.notBookable}</Notice>}
          <Profile key={`${listing.data.id}`} listing={listing.data} />
          <Schedule />
          <Appointments />
        </>
      )}
    </>
  );
}
function Claim({ onClaimed }: { onClaimed: () => void }) {
  const { language } = useCopy(),
    c = portalCopy(language);
  const [q, setQ] = useState(""),
    [query, setQuery] = useState(""),
    [chosen, setChosen] = useState<PublicDoctor | null>(null),
    [evidence, setEvidence] = useState(""),
    [done, setDone] = useState(false);
  const matches = useResource(
    query.length >= 2 ? `claim-search:${query}` : null,
    async (signal) =>
      (
        await api.get<DoctorPage>("/doctors", {
          params: { q: query, size: 20 },
          signal,
        })
      ).data,
  );
  return (
    <>
      <Heading>{c.claimTitle}</Heading>
      <Body>{c.claimNote}</Body>
      <Input
        label={c.claimSearch}
        value={q}
        onChangeText={setQ}
        returnKeyType="search"
        onSubmitEditing={() => {
          setQuery(q.trim());
          setChosen(null);
        }}
      />
      <Button
        label={c.claimFind}
        disabled={q.trim().length < 2}
        onPress={() => {
          setQuery(q.trim());
          setChosen(null);
        }}
      />
      <LoadState resource={matches} />
      {matches.data?.content.length === 0 && <Body>{c.claimNone}</Body>}
      {matches.data?.content.map((m) => (
        <View key={m.slug} style={styles.line}>
          <Heading>{m.fullName}</Heading>
          <Body>{m.clinics.map((c) => c.name).join(", ")}</Body>
          <Verification value={m.verification} />
          <Button
            label={c.claimButton}
            secondary={chosen?.id !== m.id}
            disabled={m.id == null}
            onPress={() => setChosen(m)}
          />
        </View>
      ))}
      {chosen && (
        <>
          <Heading>{chosen.fullName}</Heading>
          <Input
            label={c.claimEvidence}
            value={evidence}
            onChangeText={setEvidence}
            multiline
            maxLength={1000}
          />
          <Body small>{c.claimEvidenceHint}</Body>
          <Notice>{c.noListingNote}</Notice>
          <Button
            label={c.claimSubmit}
            disabled={done}
            onPress={async () => {
              await doctor.claimListing(chosen.id!, evidence.trim());
              setDone(true);
              onClaimed();
            }}
          />
        </>
      )}
      {done && <Notice>{c.claimDone}</Notice>}
    </>
  );
}
function Profile({ listing }: { listing: doctor.MyListing }) {
  const { language } = useCopy(),
    c = portalCopy(language);
  const [bio, setBio] = useState(listing.bio || ""),
    [qual, setQual] = useState(listing.qualifications || ""),
    [fee, setFee] = useState(
      listing.consultationFee == null ? "" : String(listing.consultationFee),
    ),
    [languages, setLanguages] = useState(listing.languages),
    [saved, setSaved] = useState(false);
  return (
    <View style={styles.line}>
      <Heading>{c.profile}</Heading>
      <Input label={c.bio} value={bio} onChangeText={setBio} multiline />
      <Input
        label={c.qualifications}
        value={qual}
        onChangeText={setQual}
        multiline
      />
      <Input
        label={c.fee}
        value={fee}
        onChangeText={setFee}
        keyboardType="decimal-pad"
      />
      <Body>{c.languages}</Body>
      {[
        ["az", "Azərbaycanca"],
        ["ru", "Русский"],
        ["en", "English"],
      ].map(([v, l]) => (
        <Toggle
          key={v}
          label={l}
          value={languages.includes(v)}
          onChange={(on) =>
            setLanguages((old) =>
              on ? [...old, v] : old.filter((l) => l !== v),
            )
          }
        />
      ))}
      <Button
        label={c.save}
        onPress={async () => {
          if (fee && (!Number.isFinite(decimal(fee)) || decimal(fee) < 0))
            throw Error(c.saveFailed);
          await doctor.updateMyListing({
            bio: bio.trim() || null,
            qualifications: qual.trim() || null,
            consultationFee: fee ? decimal(fee) : null,
            languages,
          });
          setSaved(true);
        }}
      />
      {saved && <Notice>{c.saved}</Notice>}
    </View>
  );
}
function Schedule() {
  const { language, c: copy } = useCopy(),
    c = portalCopy(language),
    { user } = useSession(),
    names = weekdayNames(language);
  const hours = useResource(`doctor-hours:${user!.id}`, (s) =>
      doctor.getAvailability(s),
    ),
    away = useResource(`doctor-away:${user!.id}`, (s) => doctor.getTimeOff(s));
  const [day, setDay] = useState("1"),
    [from, setFrom] = useState("09:00"),
    [to, setTo] = useState("13:00"),
    [minutes, setMinutes] = useState("20"),
    [dateFrom, setDateFrom] = useState(""),
    [dateTo, setDateTo] = useState(""),
    [timeFrom, setTimeFrom] = useState("09:00"),
    [timeTo, setTimeTo] = useState("18:00"),
    [reason, setReason] = useState("");
  const [remove, setRemove] = useState<{
    id: number;
    kind: "hours" | "away";
  } | null>(null);
  const when = (value: string) =>
    `${shortDate(value.slice(0, 10), language)}, ${value.slice(11, 16)}`;
  return (
    <>
      <Heading>{c.hours}</Heading>
      <Body>{c.hoursNote}</Body>
      <Body small>
        {copy(
          "Times are shown in Baku time.",
          "Vaxtlar Bakı vaxtı ilə göstərilir.",
          "Указано время Баку.",
        )}
      </Body>
      <LoadState resource={hours} />
      {hours.data?.length === 0 && <Body>{c.noHours}</Body>}
      {hours.data?.map((b) => (
        <View style={styles.line} key={b.id}>
          <Heading>{names[b.dayOfWeek]}</Heading>
          <Body>
            {b.startTime.slice(0, 5)} - {b.endTime.slice(0, 5)}, {b.slotMinutes}{" "}
            {c.minutes}
          </Body>
          <Button
            secondary
            label={c.remove}
            onPress={() => setRemove({ id: b.id, kind: "hours" })}
          />
        </View>
      ))}
      <View style={styles.card}>
        <Select
          label={c.day}
          value={day}
          options={[1, 2, 3, 4, 5, 6, 0].map((v) => ({
            value: String(v),
            label: names[v],
          }))}
          onChange={setDay}
        />
        <TimeField label={c.from} value={from} onChange={setFrom} />
        <TimeField label={c.to} value={to} onChange={setTo} />
        <Select
          label={c.slotLength}
          value={minutes}
          options={[10, 15, 20, 30, 45, 60].map((v) => ({
            value: String(v),
            label: `${v} ${c.minutes}`,
          }))}
          onChange={setMinutes}
        />
        <Button
          label={c.add}
          onPress={async () => {
            if (!validTime(from) || !validTime(to) || from >= to)
              throw Error(c.badRange);
            await doctor.addAvailability({
              dayOfWeek: Number(day),
              startTime: `${from}:00`,
              endTime: `${to}:00`,
              slotMinutes: Number(minutes),
            });
            hours.retry();
          }}
        />
      </View>
      <Heading>{c.timeOff}</Heading>
      <Body>{c.timeOffNote}</Body>
      <Body small>{c.existingKept}</Body>
      <LoadState resource={away} />
      {away.data?.length === 0 && <Body>{c.timeOffNone}</Body>}
      {away.data?.map((t) => (
        <View style={styles.line} key={t.id}>
          <Body>
            {when(t.startsAt)} - {when(t.endsAt)}
          </Body>
          {!!t.reason && <Body>{t.reason}</Body>}
          <Button
            secondary
            label={c.timeOffRemove}
            onPress={() => setRemove({ id: t.id, kind: "away" })}
          />
        </View>
      ))}
      <View style={styles.card}>
        <DateField
          label={c.timeOffFrom}
          value={dateFrom}
          onChange={setDateFrom}
        />
        <TimeField label={c.from} value={timeFrom} onChange={setTimeFrom} />
        <DateField label={c.timeOffTo} value={dateTo} onChange={setDateTo} />
        <TimeField label={c.to} value={timeTo} onChange={setTimeTo} />
        <Input
          label={c.timeOffReason}
          value={reason}
          onChangeText={setReason}
        />
        <Button
          label={c.timeOffAdd}
          onPress={async () => {
            const startsAt = `${dateFrom}T${timeFrom}:00`,
              endsAt = `${dateTo}T${timeTo}:00`;
            if (
              !calendarDate(dateFrom) ||
              !calendarDate(dateTo) ||
              !validTime(timeFrom) ||
              !validTime(timeTo) ||
              startsAt >= endsAt
            )
              throw Error(c.timeOffBadRange);
            await doctor.addTimeOff({
              startsAt,
              endsAt,
              reason: reason.trim() || null,
            });
            setDateFrom("");
            setDateTo("");
            setReason("");
            away.retry();
          }}
        />
      </View>
      {remove && (
        <Confirm
          title={c.remove}
          message={
            remove.kind === "hours"
              ? c.removeConfirm
              : copy(
                  "Remove this time off period?",
                  "Bu qeyri-iş müddəti silinsin?",
                  "Удалить этот период отсутствия?",
                )
          }
          onClose={() => setRemove(null)}
          onConfirm={async () => {
            if (remove.kind === "hours") {
              await doctor.removeAvailability(remove.id);
              hours.retry();
            } else {
              await doctor.removeTimeOff(remove.id);
              away.retry();
            }
            setRemove(null);
          }}
        />
      )}
    </>
  );
}
function Appointments() {
  const { language } = useCopy(),
    c = portalCopy(language),
    { user } = useSession();
  const r = useResource(`doctor-bookings:${user!.id}`, (s) =>
    doctor.getMyBookings(s),
  );
  const [decline, setDecline] = useState<number | null>(null);
  return (
    <>
      <Heading>{c.appointments}</Heading>
      <LoadState resource={r} />
      {r.data?.length === 0 && <Body>{c.noAppointments}</Body>}
      {r.data?.map((b) => (
        <View style={styles.card} key={b.id}>
          <Heading>{b.patientName || "-"}</Heading>
          <Body>
            {shortDate(b.startsAt.slice(0, 10), language)},{" "}
            {b.startsAt.slice(11, 16)}
          </Body>
          <Body>{c[b.status]}</Body>
          {b.reason && <Body>{b.reason}</Body>}
          {b.recordShared && <Body small>{c.recordShared}</Body>}
          {b.status === "REQUESTED" && (
            <>
              <Button
                label={c.confirm}
                onPress={async () => {
                  await doctor.confirmBooking(b.id);
                  r.retry();
                }}
              />
              <Button
                secondary
                label={c.decline}
                onPress={() => setDecline(b.id)}
              />
            </>
          )}
        </View>
      ))}
      {decline != null && (
        <Confirm
          title={c.decline}
          message={c.declineConfirm}
          onClose={() => setDecline(null)}
          onConfirm={async () => {
            await doctor.declineBooking(decline);
            setDecline(null);
            r.retry();
          }}
        />
      )}
    </>
  );
}
