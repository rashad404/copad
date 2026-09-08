import React, { useState } from "react";
import { Linking, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSession, useFamily } from "../core/Session";
import { useCopy } from "../core/copy";
import { useResource } from "../core/useResource";
import {
  privacyApi,
  type ConsentType,
  type ConsentGrant,
  type DeletionResult,
} from "../api/privacy";
import { canWrite } from "../api/recordModel";
import { shortDate } from "../utils/dates";
import { openPrivateFile } from "../core/files";
import privacy from "../copy/privacy.json";
import {
  Body,
  Title,
  Heading,
  Page,
  Button,
  LinkRow,
  Select,
  MemberPicker,
  SignedIn,
  Notice,
  LoadState,
  Sheet,
  Toggle,
  Input,
  styles,
} from "../ui/kit";
export function Account() {
  const { c, language, setLanguage } = useCopy(),
    s = useSession(),
    nav = useNavigation<any>();
  return (
    <Page>
      <Title>{c("Account", "Hesab", "Аккаунт")}</Title>
      {s.user ? (
        <>
          <Heading>{s.user.name}</Heading>
          <Body>{s.user.email}</Body>
          <LinkRow
            title={c(
              "Personal information",
              "Şəxsi məlumatlar",
              "Личные данные",
            )}
            onPress={() => nav.navigate("Profile")}
          />
          <LinkRow
            title={c("My appointments", "Randevularım", "Мои приемы")}
            onPress={() => nav.navigate("Orders", { kind: "bookings" })}
          />
          <LinkRow
            title={c(
              "My lab orders",
              "Analiz sifarişlərim",
              "Мои заявки на анализы",
            )}
            onPress={() => nav.navigate("Orders", { kind: "labs" })}
          />
          <LinkRow
            title={c(
              "Privacy and consent",
              "Məxfilik və razılıqlar",
              "Конфиденциальность и согласия",
            )}
            onPress={() => nav.navigate("Privacy")}
          />
        </>
      ) : (
        <Button
          label={c(
            "Sign in / Create account",
            "Daxil ol / Hesab yarat",
            "Войти / Создать аккаунт",
          )}
          onPress={() => nav.navigate("Auth")}
        />
      )}
      <Select
        label={c("Language", "Dil", "Язык")}
        value={language}
        options={[
          { value: "az", label: "Azərbaycanca" },
          { value: "en", label: "English" },
          { value: "ru", label: "Русский" },
        ]}
        onChange={(v) => setLanguage(v as "az" | "en" | "ru")}
      />
      <LinkRow
        title={c(
          "Privacy policy",
          "Məxfilik siyasəti",
          "Политика конфиденциальности",
        )}
        onPress={() => void Linking.openURL("https://azdoc.ai/privacy-policy")}
      />
      <LinkRow
        title={c("Contact", "Əlaqə", "Контакты")}
        onPress={() => void Linking.openURL("https://azdoc.ai/contact")}
      />
      {s.user && (
        <Button
          secondary
          label={c("Sign out", "Çıxış", "Выйти")}
          onPress={s.logout}
        />
      )}
    </Page>
  );
}
export function Privacy() {
  const [deleted, setDeleted] = useState<DeletionResult | null>(null),
    { language } = useCopy(),
    p = privacy[language];
  return (
    <Page>
      {deleted ? (
        <>
          <Title>{p.accountDeleted}</Title>
          <Removed value={deleted} />
        </>
      ) : (
        <SignedIn>
          <PrivacyScope onDeleted={setDeleted} />
        </SignedIn>
      )}
    </Page>
  );
}
function Removed({ value }: { value: DeletionResult }) {
  const { c } = useCopy();
  const labels: Record<string, string> = {
    documents: c("Documents", "Sənədlər", "Документы"),
    labResults: c("Lab results", "Analiz nəticələri", "Результаты анализов"),
    conditions: c("Conditions", "Xəstəliklər", "Заболевания"),
    allergies: c("Allergies", "Allergiyalar", "Аллергии"),
    medications: c("Medications", "Dərmanlar", "Препараты"),
    vitals: c("Measurements", "Ölçmələr", "Показатели"),
  };
  return (
    <Notice>
      {Object.entries(value.removed || {})
        .map(([key, count]) => `${labels[key] || key}: ${count}`)
        .join("\n")}
    </Notice>
  );
}
function PrivacyScope({
  onDeleted,
}: {
  onDeleted: (r: DeletionResult) => void;
}) {
  const { language, c } = useCopy(),
    p = privacy[language],
    s = useSession(),
    f = useFamily();
  const r = useResource(`consent:${s.user!.id}`, (signal) =>
    privacyApi.consents(signal),
  );
  const [withdraw, setWithdraw] = useState<ConsentGrant | null>(null),
    [deleting, setDeleting] = useState<"member" | "account" | null>(null),
    [ack, setAck] = useState(false),
    [password, setPassword] = useState(""),
    [removed, setRemoved] = useState<DeletionResult | null>(null);
  const labels: Record<ConsentType, string> = {
    RECORD_STORAGE: p.storage,
    CROSS_BORDER_AI: p.ai,
    GUARDIAN: p.guardian,
  };
  const grants = r.data?.consents || [];
  return (
    <>
      <Title>{p.title}</Title>
      <Body>{p.intro}</Body>
      <LoadState resource={r} />
      {r.data && (
        <>
          <Body small>
            {p.version}: {r.data.policyVersion}
          </Body>
          {(["RECORD_STORAGE", "CROSS_BORDER_AI"] as const).map((type) => {
            const active = grants.find(
              (g) => g.type === type && g.familyMemberId == null && g.active,
            );
            return (
              <View key={type} style={styles.card}>
                <Heading>{labels[type]}</Heading>
                <Body>
                  {type === "RECORD_STORAGE" ? p.storageConsent : p.aiConsent}
                </Body>
                <Body>{active ? p.active : p.declined}</Body>
                {active?.grantedAt && (
                  <Body small>
                    {p.givenAt}: {shortDate(active.grantedAt, language)}
                  </Body>
                )}
                <Button
                  secondary
                  label={active ? p.withdraw : p.grant}
                  onPress={async () => {
                    if (active) setWithdraw(active);
                    else {
                      await privacyApi.grant(type);
                      r.retry();
                    }
                  }}
                />
              </View>
            );
          })}
          <Heading>{p.history}</Heading>
          {grants.map((g, i) => (
            <View
              key={`${g.type}:${g.familyMemberId}:${i}`}
              style={styles.line}
            >
              <Body>
                {labels[g.type]}
                {g.familyMemberId
                  ? ` - ${f.families.flatMap((f) => f.members).find((m) => m.id === g.familyMemberId)?.fullName || g.familyMemberId}`
                  : ""}
              </Body>
              <Body small>
                {p.version}: {g.policyVersion}
              </Body>
              {g.grantedAt && (
                <Body small>
                  {p.givenAt}: {shortDate(g.grantedAt, language)}
                </Body>
              )}
              {g.withdrawnAt && (
                <Body small>
                  {p.withdrawnAt}: {shortDate(g.withdrawnAt, language)}
                </Body>
              )}
              {g.type === "GUARDIAN" && g.active && (
                <Button
                  secondary
                  label={p.withdraw}
                  onPress={() => setWithdraw(g)}
                />
              )}
            </View>
          ))}
        </>
      )}
      <Heading>{p.records}</Heading>
      <MemberPicker allowNone={false} />
      {f.member && (
        <>
          <Button
            secondary
            label={p.export}
            onPress={() =>
              openPrivateFile(
                `/members/${f.member!.id}/export.zip`,
                "azdoc-record.zip",
              )
            }
          />
          {f.member.minor &&
            canWrite(f.role) &&
            !grants.some(
              (g) =>
                g.type === "GUARDIAN" &&
                g.familyMemberId === f.member!.id &&
                g.active,
            ) && (
              <Button
                secondary
                label={p.guardian}
                onPress={async () => {
                  await privacyApi.grant("GUARDIAN", f.member!.id);
                  r.retry();
                }}
              />
            )}
          {canWrite(f.role) ? (
            <Button
              secondary
              label={p.deleteMember}
              onPress={() => {
                setDeleting("member");
                setAck(false);
              }}
            />
          ) : (
            <Body small>{p.readOnly}</Body>
          )}
        </>
      )}
      {removed && (
        <>
          <Notice>{p.memberDeleted}</Notice>
          <Removed value={removed} />
        </>
      )}
      <Button
        secondary
        label={p.deleteAccount}
        onPress={() => {
          setDeleting("account");
          setAck(false);
          setPassword("");
        }}
      />
      <Button
        secondary
        label={p.policy}
        onPress={() => Linking.openURL("https://azdoc.ai/privacy-policy")}
      />
      {withdraw && (
        <Sheet title={p.withdrawTitle} onClose={() => setWithdraw(null)}>
          <Notice danger>
            {withdraw.type === "CROSS_BORDER_AI"
              ? p.aiWarning
              : p.storageWarning}
          </Notice>
          <Button
            label={p.confirm}
            onPress={async () => {
              await privacyApi.withdraw(
                withdraw.type,
                withdraw.familyMemberId ?? undefined,
              );
              setWithdraw(null);
              r.retry();
            }}
          />
        </Sheet>
      )}
      {deleting && (
        <Sheet
          title={
            deleting === "account" ? p.deleteAccountTitle : p.deleteMemberTitle
          }
          onClose={() => setDeleting(null)}
        >
          <Notice danger>
            {deleting === "account"
              ? p.deleteAccountWarning
              : p.deleteMemberWarning}
          </Notice>
          {deleting === "member" && <Heading>{f.member?.fullName}</Heading>}
          <Toggle label={p.acknowledge} value={ack} onChange={setAck} />
          {deleting === "account" && (
            <Input
              label={p.password}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="current-password"
            />
          )}
          <Button
            danger
            label={p.confirm}
            disabled={!ack || (deleting === "account" && !password)}
            onPress={async () => {
              if (deleting === "account") {
                const result = await privacyApi.deleteAccount(password);
                s.recordDeletion(result);
                await s.logout();
                onDeleted(result);
              } else if (f.member && canWrite(f.role)) {
                const result = await privacyApi.deleteMember(f.member.id);
                setRemoved(result);
                setDeleting(null);
                f.select(null);
                f.reload();
              }
            }}
          />
        </Sheet>
      )}
    </>
  );
}
