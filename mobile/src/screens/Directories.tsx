import React, { useState } from "react";
import { View, Image, Keyboard, Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "../core/api";
import { useCopy } from "../core/copy";
import { useResource } from "../core/useResource";
import {
  doctorCopy,
  specialtyName,
  experienceYears,
  defaultSpecialties,
} from "../copy/website/doctors";
import labs from "../copy/website/labs.json";
import { type PublicDoctor, type DoctorPage } from "../api/doctorTypes";
import { type Lab, type LabPage, money } from "../api/labModel";
import {
  Page,
  Title,
  Body,
  Heading,
  Input,
  Select,
  Toggle,
  Button,
  LoadState,
  styles,
  palette,
} from "../ui/kit";
const emptyFilters = {
  q: "",
  city: "",
  specialty: "",
  language: "",
  homeCollection: false,
  page: 0,
};
export function Portrait({ doctor }: { doctor: PublicDoctor }) {
  return doctor.photoUrl ? (
    <Image
      source={{ uri: doctor.photoUrl }}
      style={{ width: 72, height: 72, borderRadius: 18 }}
      accessibilityLabel={doctor.fullName}
    />
  ) : (
    <View
      style={{
        width: 64,
        height: 64,
        borderRadius: 18,
        backgroundColor: palette.sage,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Heading>
        {doctor.fullName
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((n) => n[0])
          .join("")}
      </Heading>
    </View>
  );
}
export function Verification({
  value,
  detail = false,
}: {
  value: string;
  detail?: boolean;
}) {
  const { language } = useCopy(),
    c = doctorCopy(language);
  return (
    <View style={{ gap: 8 }}>
      <Body small>
        {value === "VERIFIED"
          ? c.VERIFIED
          : value === "PENDING"
            ? c.PENDING
            : c.UNCLAIMED}
      </Body>
      {detail && (
        <Body>
          {value === "VERIFIED"
            ? c.verifiedNote
            : value === "PENDING"
              ? c.pendingNote
              : value === "UNCLAIMED"
                ? c.unclaimedNote
                : c.unknownNote}
        </Body>
      )}
    </View>
  );
}
export default function Directories({ kind }: { kind: "doctors" | "labs" }) {
  const { language } = useCopy(),
    nav = useNavigation<any>(),
    d = doctorCopy(language),
    l = labs[language],
    c = kind === "doctors" ? d : l;
  const [draft, setDraft] = useState(emptyFilters),
    [query, setQuery] = useState(emptyFilters);
  const filtered = !!(
    query.q ||
    query.city ||
    query.specialty ||
    query.language ||
    query.homeCollection
  );
  const specialties = useResource(
    kind === "doctors" ? `specialties:${language}` : null,
    async (signal) =>
      (
        await api.get<{ code: string; name: string }[]>(
          "/doctors/specialties",
          { params: { lang: language }, signal },
        )
      ).data,
  );
  const r = useResource(
    `${kind}:${language}:${JSON.stringify(query)}`,
    async (signal) =>
      (
        await api.get<DoctorPage | LabPage>(`/${kind}`, {
          params: {
            ...query,
            homeCollection: query.homeCollection ? true : undefined,
            lang: language,
            size: 20,
          },
          signal,
        })
      ).data,
  );
  const global = useResource(
    filtered && r.data?.totalElements === 0 ? `${kind}:global-empty` : null,
    async (signal) =>
      (
        await api.get<DoctorPage | LabPage>(`/${kind}`, {
          params: { size: 1, page: 0 },
          signal,
        })
      ).data.totalElements === 0,
  );
  const globallyEmpty = !filtered || global.data === true;
  const search = () => {
    setQuery({ ...draft, q: draft.q.trim(), city: draft.city.trim(), page: 0 });
    Keyboard.dismiss();
  };
  const update = (key: keyof typeof draft, value: string | boolean) =>
    setDraft((v) => ({ ...v, [key]: value }));
  return (
    <Page>
      <Title>{c.title}</Title>
      <Body>{c.description}</Body>
      <Input
        label={c.name}
        value={draft.q}
        maxLength={120}
        onChangeText={(v) => update("q", v)}
        returnKeyType="search"
        onSubmitEditing={search}
      />
      {kind === "doctors" && (
        <Select
          label={d.specialty}
          value={draft.specialty}
          options={[
            { value: "", label: d.all },
            ...(specialties.data || defaultSpecialties()).map((s) => ({
              value: s.code,
              label: specialtyName(s.code, language, s.name),
            })),
          ]}
          onChange={(v) => update("specialty", v)}
        />
      )}
      <Input
        label={c.city}
        value={draft.city}
        maxLength={120}
        onChangeText={(v) => update("city", v)}
      />
      {kind === "doctors" ? (
        <Select
          label={d.language}
          value={draft.language}
          options={[
            { value: "", label: d.all },
            ...(["az", "ru", "en"] as const).map((value) => ({
              value,
              label: d[value],
            })),
          ]}
          onChange={(v) => update("language", v)}
        />
      ) : (
        <Toggle
          label={l.homeOnly}
          value={draft.homeCollection}
          onChange={(v) => update("homeCollection", v)}
        />
      )}
      <Button label={c.search} onPress={search} />
      {(filtered || query.page > 0) && (
        <Button
          secondary
          label={c.clear}
          onPress={() => {
            setDraft(emptyFilters);
            setQuery(emptyFilters);
          }}
        />
      )}
      <LoadState resource={r} />
      {r.data?.content.length === 0 && (
        <View style={styles.line}>
          <Heading>
            {globallyEmpty && query.page === 0
              ? c.emptyTitle
              : kind === "doctors"
                ? d.noMatchTitle
                : l.noMatch}
          </Heading>
          <Body>
            {globallyEmpty && query.page === 0
              ? c.empty
              : kind === "doctors"
                ? d.noMatch
                : ""}
          </Body>
        </View>
      )}
      {!!r.data?.content.length && (
        <Heading>
          {c.results}: {r.data.totalElements}
        </Heading>
      )}
      {r.data?.content.map((item) =>
        kind === "doctors" ? (
          <View style={styles.line} key={item.slug}>
            <Portrait doctor={item as PublicDoctor} />
            <Heading>{(item as PublicDoctor).fullName}</Heading>
            <Body>
              {specialtyName(
                (item as PublicDoctor).specialtyCode,
                language,
                specialties.data?.find(
                  (s) => s.code === (item as PublicDoctor).specialtyCode,
                )?.name,
              )}
            </Body>
            <Verification value={(item as PublicDoctor).verification} />
            {(item as PublicDoctor).yearsExperience != null && (
              <Body small>
                {d.years}:{" "}
                {experienceYears(
                  (item as PublicDoctor).yearsExperience!,
                  language,
                )}
              </Body>
            )}
            {(item as PublicDoctor).clinics.map((clinic) => (
              <Body key={clinic.slug}>
                {[clinic.name, clinic.city].filter(Boolean).join(", ")}
              </Body>
            ))}
            <Body small>
              {d.languages}:{" "}
              {(item as PublicDoctor).languages
                .map((s) => d[s as "az" | "ru" | "en"] || s)
                .join(", ")}
            </Body>
            {(item as PublicDoctor).consultationFee != null && (
              <Heading>
                {d.fee}:{" "}
                {money((item as PublicDoctor).consultationFee!, language, "-")}
              </Heading>
            )}
            <Button
              secondary
              label={d.view}
              onPress={() => nav.push("Doctor", { slug: item.slug })}
            />
          </View>
        ) : (
          <View style={styles.line} key={item.slug}>
            <Heading>{(item as Lab).name}</Heading>
            <Body>
              {[(item as Lab).city, (item as Lab).district]
                .filter(Boolean)
                .join(", ")}
            </Body>
            <Body small>
              {(item as Lab).homeCollection ? l.homeYes : l.homeNo}
            </Body>
            {(item as Lab).phone ? (
              <Button
                secondary
                label={(item as Lab).phone!}
                onPress={() =>
                  Linking.openURL(
                    `tel:${(item as Lab).phone!.replace(/[^+\d]/g, "")}`,
                  )
                }
              />
            ) : (
              <Body small>{l.noPhone}</Body>
            )}
            <Body>
              {l.testCount}: {(item as Lab).testCount}
            </Body>
            <Button
              secondary
              label={l.view}
              onPress={() => nav.push("Laboratory", { slug: item.slug })}
            />
          </View>
        ),
      )}
      {r.data && (r.data.totalPages > 1 || query.page > 0) && (
        <View style={styles.spread}>
          <Button
            secondary
            label={c.previous}
            disabled={query.page === 0}
            onPress={() => setQuery((v) => ({ ...v, page: v.page - 1 }))}
          />
          <Body>
            {query.page + 1} / {Math.max(r.data.totalPages, 1)}
          </Body>
          <Button
            secondary
            label={c.next}
            disabled={query.page + 1 >= r.data.totalPages}
            onPress={() => setQuery((v) => ({ ...v, page: v.page + 1 }))}
          />
        </View>
      )}
      {kind === "doctors" && <Body small>{d.directoryNote}</Body>}
    </Page>
  );
}
