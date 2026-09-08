import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { isAxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import {
  tokenStore,
  pendingConsentStore,
  type PendingConsentChoices,
} from "./storage";
import { healthApi, type Family } from "../api/healthRecord";
import { type DeletionResult, saveRegistrationConsents } from "../api/privacy";
export interface User {
  id: string;
  name: string;
  email: string;
}
type Context = {
  user: User | null;
  deletionReceipt: DeletionResult | null;
  recordDeletion: (result: DeletionResult) => void;
  loading: boolean;
  authError: boolean;
  consentPending: boolean;
  pendingChoices: PendingConsentChoices | null;
  authenticate: (
    email: string,
    password: string,
    name?: string,
    storage?: boolean,
    ai?: boolean,
  ) => Promise<void>;
  retryConsents: (storage: boolean, ai: boolean) => Promise<void>;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};
const Context = createContext<Context>(null!);
export const useSession = () => useContext(Context);
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null),
    [loading, setLoading] = useState(true),
    [authError, setError] = useState(false),
    [consentPending, setPending] = useState(false);
  const [deletionReceipt, recordDeletion] = useState<DeletionResult | null>(
    null,
  );
  const [pendingChoices, setChoices] = useState<PendingConsentChoices | null>(
    null,
  );
  const generation = useRef(0);
  async function refresh() {
    const stamp = ++generation.current;
    setLoading(true);
    setError(false);
    try {
      const token = await tokenStore.get();
      if (!token) {
        setUser(null);
        return;
      }
      const { data } = await api.get<User>("/user/me");
      const pending = await pendingConsentStore.get();
      if (stamp === generation.current) {
        const matching =
          pending?.email.toLowerCase() === data.email.toLowerCase()
            ? pending
            : null;
        setChoices(matching);
        setPending(!!matching);
        setUser(data);
      }
    } catch (e) {
      if (stamp !== generation.current) return;
      if (isAxiosError(e) && [401, 403].includes(e.response?.status || 0)) {
        await tokenStore.clear();
        setUser(null);
      } else setError(true);
    } finally {
      if (stamp === generation.current) setLoading(false);
    }
  }
  useEffect(() => {
    void refresh();
  }, []);
  async function retryConsents(storage: boolean, ai: boolean) {
    const previous = pendingChoices || (await pendingConsentStore.get());
    if (previous) await pendingConsentStore.set({ ...previous, storage, ai });
    await saveRegistrationConsents(storage, ai);
    await pendingConsentStore.clear();
    setChoices(null);
    setPending(false);
    await refresh();
  }
  async function authenticate(
    email: string,
    password: string,
    name?: string,
    storage = false,
    ai = false,
  ) {
    const response = await api.post(
      name === undefined ? "/auth/login" : "/auth/register",
      name === undefined ? { email, password } : { email, password, name },
    );
    const token =
      typeof response.data === "string" ? response.data : response.data?.token;
    if (!token) throw Error("The server did not return a session");
    if (name !== undefined) {
      const choices = { email, storage, ai };
      await pendingConsentStore.set(choices);
      setChoices(choices);
    }
    await tokenStore.set(token);
    if (name !== undefined) {
      setPending(true);
      await retryConsents(storage, ai);
    } else await refresh();
  }
  async function logout() {
    generation.current++;
    await tokenStore.clear();
    setUser(null);
    setChoices(null);
    setPending(false);
    setError(false);
    setLoading(false);
  }
  return (
    <Context.Provider
      value={{
        user,
        deletionReceipt,
        recordDeletion,
        loading,
        authError,
        consentPending,
        pendingChoices,
        authenticate,
        retryConsents,
        refresh,
        logout,
      }}
    >
      {children}
    </Context.Provider>
  );
}
type FamilyContext = {
  families: Family[];
  member: Family["members"][number] | undefined;
  role: Family["role"] | undefined;
  loading: boolean;
  error: boolean;
  select: (id: number | null) => void;
  reload: () => void;
};
const Families = createContext<FamilyContext>(null!);
export const useFamily = () => useContext(Families);
export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useSession();
  return (
    <FamilyScope key={user?.id || "guest"} account={user?.id}>
      {children}
    </FamilyScope>
  );
}
function FamilyScope({
  children,
  account,
}: {
  children: React.ReactNode;
  account?: string;
}) {
  const [families, setFamilies] = useState<Family[]>([]),
    [selected, setSelected] = useState<number | null>(null),
    [loading, setLoading] = useState(!!account),
    [error, setError] = useState(false),
    [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!account) return;
    const controller = new AbortController();
    let active = true;
    setLoading(true);
    setError(false);
    Promise.all([
      healthApi.families(controller.signal),
      AsyncStorage.getItem(`azdoc.member.${account}`),
    ])
      .then(([rows, saved]) => {
        if (!active) return;
        setFamilies(rows);
        setSelected((previous) => {
          const candidate = previous || Number(saved);
          return rows.some((f) => f.members.some((m) => m.id === candidate))
            ? candidate
            : null;
        });
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [account, attempt]);
  const family = families.find((f) => f.members.some((m) => m.id === selected));
  function select(id: number | null) {
    if (
      id !== null &&
      !families.some((f) => f.members.some((m) => m.id === id))
    )
      return;
    setSelected(id);
    if (account)
      void AsyncStorage.setItem(
        `azdoc.member.${account}`,
        id === null ? "" : String(id),
      );
  }
  return (
    <Families.Provider
      value={{
        families,
        member: family?.members.find((m) => m.id === selected),
        role: family?.role,
        loading,
        error,
        select,
        reload: () => setAttempt((n) => n + 1),
      }}
    >
      {children}
    </Families.Provider>
  );
}
