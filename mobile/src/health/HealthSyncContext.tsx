import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSession, useFamily } from "../core/Session";
import { tokenStore } from "../core/storage";
import { environmentKey } from "../core/environment";
import { healthApi } from "../api/healthRecord";
import { canWrite } from "../api/recordModel";
import { healthSyncApi } from "../api/healthSync";
import deviceHealth from "./deviceHealth";
import { syncReadings, InterruptedSync } from "./sync";
import { canSyncBinding, type HealthProvider, type SyncOutcome } from "./model";
interface Binding {
  memberId: number;
  provider: HealthProvider;
  deviceLabel: string;
}
export interface SyncReport extends SyncOutcome {
  memberId: number;
}
interface Context {
  available: boolean | null;
  provider: HealthProvider | null;
  binding: Binding | null;
  busy: boolean;
  report: SyncReport | null;
  limited: boolean;
  connect: (memberId: number, deviceLabel: string) => Promise<void>;
  disconnect: (memberId: number, provider: HealthProvider) => Promise<void>;
  syncNow: () => Promise<void>;
  settings: () => Promise<void>;
}
const Context = createContext<Context>(null!);
export const useHealthSync = () => useContext(Context);
export function useHealthSyncRevision(memberId: number) {
  const { report, busy } = useHealthSync();
  const revision = useRef("");
  if (!busy && report?.memberId === memberId && report.accepted > 0)
    revision.current = report.finishedAt;
  return revision.current;
}
export function HealthSyncProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession(),
    family = useFamily();
  const [available, setAvailable] = useState<boolean | null>(null),
    [binding, setBinding] = useState<Binding | null>(null),
    [report, setReport] = useState<SyncReport | null>(null),
    [ready, setReady] = useState(false),
    [busy, setBusy] = useState(false),
    [limited, setLimited] = useState(false);
  const current = useRef({ session, family, binding });
  current.current = { session, family, binding };
  const running = useRef<AbortController | null>(null),
    alive = useRef(true),
    lastAttempt = useRef(0);
  const account = session.user?.id;
  const bindingKey = environmentKey(`azdoc.health.binding.${account}`),
    reportKey = environmentKey(`azdoc.health.report.${account}`);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      running.current?.abort();
    };
  }, []);
  useEffect(() => {
    let active = true;
    const check = () =>
      deviceHealth
        .available()
        .then((value) => {
          if (active) setAvailable(value);
        })
        .catch(() => {
          if (active) setAvailable(false);
        });
    void check();
    const listener = AppState.addEventListener("change", (state) => {
      if (state === "active") void check();
    });
    return () => {
      active = false;
      listener.remove();
    };
  }, []);
  useEffect(() => {
    let active = true;
    setReady(false);
    setBinding(null);
    setReport(null);
    if (!account) {
      setReady(true);
      return;
    }
    Promise.all([
      AsyncStorage.getItem(bindingKey),
      AsyncStorage.getItem(reportKey),
    ])
      .then(([raw, saved]) => {
        if (!active) return;
        try {
          const b = raw ? JSON.parse(raw) : null;
          if (
            b &&
            Number.isSafeInteger(b.memberId) &&
            b.provider === deviceHealth.provider &&
            typeof b.deviceLabel === "string"
          )
            setBinding(b);
        } catch {}
        try {
          const r = saved ? JSON.parse(saved) : null;
          if (
            r &&
            Number.isSafeInteger(r.memberId) &&
            [
              "accepted",
              "alreadyHad",
              "skippedManual",
              "rejected",
              "notSent",
            ].every((k) => Number.isInteger(r[k]) && r[k] >= 0) &&
            typeof r.finishedAt === "string"
          )
            setReport(r);
        } catch {}
      })
      .catch(() => {})
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
      running.current?.abort();
    };
  }, [account]);
  async function saveReport(value: SyncReport) {
    if (!alive.current) return;
    setReport(value);
    await AsyncStorage.setItem(reportKey, JSON.stringify(value));
  }
  async function syncNow() {
    const snapshot = current.current,
      b = snapshot.binding;
    if (
      running.current ||
      !b ||
      !snapshot.session.user ||
      snapshot.session.loading
    )
      return;
    const controller = new AbortController();
    running.current = controller;
    setBusy(true);
    lastAttempt.current = Date.now();
    try {
      const token = await tokenStore.get();
      if (!token) throw Error("AUTH_REQUIRED");
      const families = await healthApi.families(controller.signal);
      const owner = families.find((f) =>
        f.members.some((m) => m.id === b.memberId),
      );
      const member = owner?.members.find((m) => m.id === b.memberId);
      if (
        !canSyncBinding(
          b.memberId,
          owner?.members.map((m) => m.id) || [],
          canWrite(owner?.role),
          !!member?.self,
        )
      )
        throw Error("HEALTH_READ_ONLY");
      const connections = await healthSyncApi.list(
        b.memberId,
        controller.signal,
      );
      if (!connections.some((c) => c.provider === b.provider && c.enabled)) {
        await AsyncStorage.removeItem(bindingKey);
        if (alive.current) setBinding(null);
        return;
      }
      const connection = connections.find((c) => c.provider === b.provider)!;
      const result = await syncReadings({
        source: deviceHealth,
        cursor: connection.syncedThrough,
        signal: controller.signal,
        send: async (samples) => {
          if (controller.signal.aborted || (await tokenStore.get()) !== token)
            throw Error("SYNC_CANCELLED");
          return healthSyncApi.send(
            b.memberId,
            b.provider,
            samples.map((s) => ({
              ...s,
              deviceLabel: s.deviceLabel || b.deviceLabel,
            })),
            controller.signal,
            token,
          );
        },
        onProgress: (counts) => saveReport({ ...counts, memberId: b.memberId }),
      });
      if (!controller.signal.aborted)
        await saveReport({ ...result, memberId: b.memberId });
    } catch (error) {
      if (!controller.signal.aborted && alive.current) {
        const partial =
          error instanceof InterruptedSync
            ? error.outcome
            : {
                accepted: 0,
                alreadyHad: 0,
                skippedManual: 0,
                rejected: 0,
                notSent: 0,
                finishedAt: new Date().toISOString(),
                complete: false,
              };
        const cause = error instanceof InterruptedSync ? error.cause : error;
        // Store only a generic state and counts, never raw native errors or readings.
        await saveReport({
          ...partial,
          memberId: b.memberId,
          error:
            cause instanceof Error && cause.message === "HEALTH_READ_ONLY"
              ? cause.message
              : "SYNC_FAILED",
        }).catch(() => {});
      }
    } finally {
      if (running.current === controller) running.current = null;
      if (alive.current) setBusy(false);
    }
  }
  useEffect(() => {
    if (!account || !ready || !available || !binding || session.loading) return;
    const attempt = () => {
      if (!running.current && Date.now() - lastAttempt.current > 60000)
        void syncNow();
    };
    attempt();
    const listener = AppState.addEventListener("change", (state) => {
      if (state === "active") attempt();
    });
    return () => listener.remove();
  }, [account, ready, available, binding, session.loading]);
  async function connect(memberId: number, deviceLabel: string) {
    const f = current.current.family.families.find((f) =>
      f.members.some((m) => m.id === memberId),
    );
    if (!f?.members.find((m) => m.id === memberId)?.self || !canWrite(f.role))
      throw Error("HEALTH_READ_ONLY");
    if (!deviceHealth.provider || !(await deviceHealth.available()))
      throw Error("HEALTH_UNAVAILABLE");
    const accountId = current.current.session.user?.id,
      token = await tokenStore.get();
    if (!token || !accountId) throw Error("AUTH_REQUIRED");
    const permissions = await deviceHealth.request();
    if (
      !alive.current ||
      current.current.session.user?.id !== accountId ||
      (await tokenStore.get()) !== token
    )
      throw Error("SYNC_CANCELLED");
    if (!permissions.requested) throw Error("HEALTH_PERMISSION_DENIED");
    const next = {
      memberId,
      provider: deviceHealth.provider,
      deviceLabel: deviceLabel.trim() || deviceHealth.provider,
    };
    await healthSyncApi.connect(
      memberId,
      next.provider,
      next.deviceLabel,
      token,
    );
    if (
      !alive.current ||
      current.current.session.user?.id !== accountId ||
      (await tokenStore.get()) !== token
    )
      return;
    await AsyncStorage.setItem(bindingKey, JSON.stringify(next));
    lastAttempt.current = 0;
    if (alive.current) {
      setLimited(permissions.limited);
      setBinding(next);
    }
  }
  async function disconnect(memberId: number, provider: HealthProvider) {
    if (
      current.current.binding?.memberId === memberId &&
      current.current.binding.provider === provider
    ) {
      running.current?.abort();
      await AsyncStorage.removeItem(bindingKey);
      setBinding(null);
    }
    await healthSyncApi.disconnect(memberId, provider);
  }
  return (
    <Context.Provider
      value={{
        available,
        provider: deviceHealth.provider,
        binding,
        busy,
        report,
        limited,
        connect,
        disconnect,
        syncNow,
        settings: deviceHealth.settings,
      }}
    >
      {children}
    </Context.Provider>
  );
}
