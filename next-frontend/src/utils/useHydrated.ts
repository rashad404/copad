"use client";
import { useSyncExternalStore } from "react";
const subscribe = () => () => {};
/** Keep account/language-dependent chrome stable while an SSR boundary hydrates. */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
