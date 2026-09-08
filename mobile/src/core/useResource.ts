import { useEffect, useRef, useState } from "react";
import { readableError } from "../api/recordModel";
export function useResource<T>(
  key: string | null,
  load: (signal: AbortSignal) => Promise<T>,
) {
  const loader = useRef(load);
  loader.current = load;
  const [attempt, retry] = useState(0),
    [state, setState] = useState<{
      key: string | null;
      data: T | null;
      loading: boolean;
      error: string;
    }>({ key, data: null, loading: !!key, error: "" });
  useEffect(() => {
    if (!key) return;
    const controller = new AbortController();
    let active = true;
    setState({ key, data: null, loading: true, error: "" });
    loader
      .current(controller.signal)
      .then((data) => {
        if (active) setState({ key, data, loading: false, error: "" });
      })
      .catch((e) => {
        if (active)
          setState({
            key,
            data: null,
            loading: false,
            error: readableError(e, "REQUEST_FAILED"),
          });
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [key, attempt]);
  return {
    ...(key === state.key
      ? state
      : { key, data: null, loading: !!key, error: "" }),
    retry: () => retry((n) => n + 1),
  };
}
