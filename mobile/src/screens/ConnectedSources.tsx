import React, { useState } from "react";
import { View, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCopy } from "../core/copy";
import { useFamily } from "../core/Session";
import { useResource } from "../core/useResource";
import { canWrite, readableError } from "../api/recordModel";
import { healthSyncApi } from "../api/healthSync";
import { useHealthSync } from "../health/HealthSyncContext";
import { syncInstant, type HealthProvider } from "../health/model";
import copy from "../copy/healthSync.json";
import { dateAndTime } from "../utils/dates";
import {
  Page,
  SignedIn,
  Title,
  Heading,
  Body,
  MemberPicker,
  LoadState,
  Notice,
  Button,
  Sheet,
  Input,
  Toggle,
  styles,
} from "../ui/kit";

export default function ConnectedSources() {
  return (
    <Page>
      <SignedIn>
        <Sources />
      </SignedIn>
    </Page>
  );
}
function Sources() {
  const f = useFamily();
  return (
    <>
      <MemberPicker allowNone={false} />
      {f.member && <SourceScope key={f.member.id} />}
    </>
  );
}
function SourceScope() {
  const { language } = useCopy(),
    t = copy[language],
    f = useFamily(),
    sync = useHealthSync();
  const member = f.member!,
    writable = canWrite(f.role);
  const [connecting, setConnecting] = useState(false),
    [disconnecting, setDisconnecting] = useState<HealthProvider | null>(null),
    [confirmed, setConfirmed] = useState(false),
    [label, setLabel] = useState(Platform.OS === "ios" ? "iPhone" : "Android"),
    [error, setError] = useState(""),
    [saving, setSaving] = useState(false),
    [settings, setSettings] = useState(false);
  const r = useResource(`sources:${member.id}:${sync.busy}`, (signal) =>
    healthSyncApi.list(member.id, signal),
  );
  const here = sync.binding?.memberId === member.id;
  const providerLabel = (provider: HealthProvider) =>
    provider === "APPLE_HEALTH"
      ? "Apple Health"
      : provider === "HEALTH_CONNECT"
        ? "Health Connect"
        : t.file;
  async function connect() {
    setError("");
    setSaving(true);
    try {
      await sync.connect(member.id, label);
      setConnecting(false);
      r.retry();
    } catch (e) {
      setError(
        e instanceof Error && e.message === "HEALTH_PERMISSION_DENIED"
          ? t.denied
          : readableError(e, t.error),
      );
    } finally {
      setSaving(false);
    }
  }
  return (
    <>
      <Title>{t.title}</Title>
      <Body>{t.intro}</Body>
      {!writable && <Notice>{t.readOnly}</Notice>}
      {writable && !member.self && <Notice>{t.ownOnly}</Notice>}
      {sync.available === false && <Body>{t.unavailable}</Body>}
      <LoadState resource={r} />
      {r.data?.length === 0 && <Body>{t.noSources}</Body>}
      {r.data?.map((source) => (
        <View style={styles.line} key={source.id}>
          <Heading>{providerLabel(source.provider)}</Heading>
          {!!source.deviceLabel && <Body>{source.deviceLabel}</Body>}
          <Body>{source.enabled ? t.connected : t.disconnected}</Body>
          <Body small>
            {t.lastSync}:{" "}
            {source.lastSyncAt
              ? dateAndTime(syncInstant(source.lastSyncAt), language)
              : t.never}
          </Body>
          {!!source.syncedThrough && (
            <Body small>
              {t.through}:{" "}
              {dateAndTime(syncInstant(source.syncedThrough), language)}
            </Body>
          )}
          {source.enabled && writable && (
            <Button
              secondary
              disabled={saving}
              label={t.disconnect}
              onPress={() => {
                setError("");
                setDisconnecting(source.provider);
              }}
            />
          )}
        </View>
      ))}
      {writable &&
        sync.available &&
        member.self &&
        (!here ? (
          <>
            <Body small>{t.thisPhone}</Body>
            <Button
              label={t.connect}
              onPress={() => {
                setConfirmed(false);
                setError("");
                setConnecting(true);
              }}
            />
          </>
        ) : (
          <Button
            label={sync.busy ? t.busy : t.sync}
            disabled={sync.busy}
            onPress={sync.syncNow}
          />
        ))}
      {here && (
        <>
          <Body small>{t.initialRange}</Body>
          <Body small>{t.permissionNote}</Body>
          {sync.provider === "HEALTH_CONNECT" && sync.limited && (
            <Notice>{t.limited}</Notice>
          )}
          <Body small>
            {sync.provider === "APPLE_HEALTH"
              ? t.unsupportedApple
              : t.unsupportedAndroid}
          </Body>
          <Button
            secondary
            label={t.settings}
            onPress={async () => {
              if (Platform.OS === "ios") setSettings(true);
              else await sync.settings();
            }}
          />
        </>
      )}
      <SyncResult />
      {connecting && (
        <Sheet
          title={t.connectTitle}
          onClose={() => {
            if (!saving) setConnecting(false);
          }}
        >
          <Heading>{member.fullName}</Heading>
          <Body>{t.permissionIntro}</Body>
          <Body small>{t.initialRange}</Body>
          <Input
            label={t.deviceLabel}
            value={label}
            maxLength={100}
            onChangeText={setLabel}
          />
          <Toggle
            label={t.confirmPerson}
            value={confirmed}
            onChange={setConfirmed}
            disabled={saving}
          />
          {!!error && <Notice danger>{error}</Notice>}
          <Button
            label={t.confirm}
            disabled={!confirmed || saving || !label.trim()}
            onPress={connect}
          />
        </Sheet>
      )}
      {disconnecting && (
        <Sheet
          title={t.disconnectTitle}
          onClose={() => {
            if (!saving) setDisconnecting(null);
          }}
        >
          <Body>{t.disconnectHelp}</Body>
          {!!error && <Notice danger>{error}</Notice>}
          <Button
            label={t.disconnect}
            disabled={saving}
            onPress={async () => {
              setSaving(true);
              setError("");
              try {
                await sync.disconnect(member.id, disconnecting);
                setDisconnecting(null);
                r.retry();
              } catch (e) {
                setError(readableError(e, t.error));
              } finally {
                setSaving(false);
              }
            }}
          />
        </Sheet>
      )}
      {settings && (
        <Sheet title={t.settings} onClose={() => setSettings(false)}>
          <Body>{t.healthKitSettings}</Body>
        </Sheet>
      )}
    </>
  );
}
export function SyncResult({ compact = false }: { compact?: boolean }) {
  const { language } = useCopy(),
    t = copy[language],
    sync = useHealthSync(),
    f = useFamily(),
    nav = useNavigation<any>();
  const r = sync.report;
  if (!r || r.memberId !== f.member?.id) return null;
  return (
    <View style={styles.card}>
      <Heading>{t.lastResult}</Heading>
      <Body small>{dateAndTime(r.finishedAt, language)}</Body>
      {!r.complete && !sync.busy && <Notice danger>{t.partial}</Notice>}
      {sync.busy && <Body>{t.busy}</Body>}
      <Body>
        {t.added}: {r.accepted}
        {"\n"}
        {t.duplicates}: {r.alreadyHad}
        {"\n"}
        {t.manual}: {r.skippedManual}
        {"\n"}
        {t.rejected}: {r.rejected}
        {"\n"}
        {t.notSent}: {r.notSent}
      </Body>
      {!!r.skippedManual && <Body small>{t.manualHelp}</Body>}
      {!!r.notSent && <Body small>{t.notSentHelp}</Body>}
      {r.complete &&
        r.accepted + r.alreadyHad + r.skippedManual + r.rejected + r.notSent ===
          0 && <Body small>{t.empty}</Body>}
      {!!r.error && (
        <Body>{r.error === "HEALTH_READ_ONLY" ? t.ownOnly : t.error}</Body>
      )}
      {compact && (
        <Button
          secondary
          label={t.title}
          onPress={() => nav.navigate("ConnectedSources")}
        />
      )}
    </View>
  );
}
