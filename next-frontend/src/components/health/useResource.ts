"use client";
import { useEffect, useRef, useState } from "react";
import { readableError } from "./model";
export function useResource<T>(
  key: string,
  load: (signal: AbortSignal) => Promise<T>,
  fallback: string,
) {
  const loader = useRef(load);
  loader.current = load;
  const [state, setState] = useState<{
    key: string;
    data: T | null;
    loading: boolean;
    error: string;
  }>({ key, data: null, loading: true, error: "" });
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setState((previous) => ({
      key,
      data: previous.key === key ? previous.data : null,
      loading: true,
      error: "",
    }));
    loader
      .current(controller.signal)
      .then((data) => {
        if (active) setState({ key, data, loading: false, error: "" });
      })
      .catch((error) => {
        if (active)
          setState({
            key,
            data: null,
            loading: false,
            error: readableError(error, fallback),
          });
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [key, fallback]);
  return state.key === key
    ? state
    : { key, data: null, loading: true, error: "" };
}
