"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getErrorMessage } from "@/utils/errors";

/** Ignore obsolete requests when changing pages or leaving a resource. */
export function useResource<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const request = useRef({ generation: 0 });
  const reload = useCallback(async () => {
    const current = ++request.current.generation;
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      if (current === request.current.generation) setData(result);
    } catch (err) {
      if (current === request.current.generation)
        setError(
          getErrorMessage(err, "Could not load data. Please try again."),
        );
    } finally {
      if (current === request.current.generation) setLoading(false);
    }
  }, [fetcher]);
  useEffect(() => {
    const state = request.current;
    void reload();
    return () => {
      state.generation++;
    };
  }, [reload]);
  return { data, loading, error, reload };
}
