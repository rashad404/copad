"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { healthApi, type Family } from "@/api/healthRecord";
export function useChatMember() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const account = !isLoading && isAuthenticated ? user?.id : null;
  const [retry, setRetry] = useState(0);
  const [state, setState] = useState<{
    account: string | null | undefined;
    families: Family[];
    selected: number | null;
    loading: boolean;
    error: boolean;
  }>({
    account: null,
    families: [],
    selected: null,
    loading: false,
    error: false,
  });
  useEffect(() => {
    if (!account) return;
    const controller = new AbortController();
    let active = true;
    setState({
      account,
      families: [],
      selected: null,
      loading: true,
      error: false,
    });
    healthApi
      .families(controller.signal)
      .then((families) => {
        if (!active) return;
        let saved: number | null = null;
        try {
          saved =
            Number(localStorage.getItem(`azdoc.member.${account}`)) || null;
        } catch {}
        const selected = families.some((f) =>
          f.members.some((m) => m.id === saved),
        )
          ? saved
          : null;
        setState({ account, families, selected, loading: false, error: false });
      })
      .catch(() => {
        if (active)
          setState({
            account,
            families: [],
            selected: null,
            loading: false,
            error: true,
          });
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [account, retry]);
  const current = account && state.account === account ? state : null;
  const member = current?.families
    .flatMap((f) => f.members)
    .find((m) => m.id === current.selected);
  function select(id: number | null) {
    if (!account || !current) return;
    if (
      id !== null &&
      !current.families.some((f) => f.members.some((m) => m.id === id))
    )
      return;
    setState((prev) => ({ ...prev, selected: id }));
    try {
      localStorage.setItem(
        `azdoc.member.${account}`,
        id === null ? "" : String(id),
      );
    } catch {}
  }
  return {
    signedIn: !!account,
    member,
    families: current?.families ?? [],
    loading: !!account && (!current || current.loading),
    error: current?.error ?? false,
    select,
    retry: () => setRetry((n) => n + 1),
  };
}
