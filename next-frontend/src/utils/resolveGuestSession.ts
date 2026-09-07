interface SessionDependencies<T> {
  load: (sessionId: string) => Promise<T>;
  start: () => Promise<string>;
  persist: (sessionId: string) => void;
  isMissing: (error: unknown) => boolean;
}

/** Replace a saved session only when the server confirms it no longer exists. */
export async function resolveGuestSession<T>(
  savedId: string | null,
  dependencies: SessionDependencies<T>,
): Promise<{ sessionId: string; data: T | null; isNew: boolean }> {
  if (savedId) {
    try {
      const data = await dependencies.load(savedId);
      return { sessionId: savedId, data, isNew: false };
    } catch (error) {
      if (!dependencies.isMissing(error)) throw error;
    }
  }

  const sessionId = await dependencies.start();
  if (!sessionId) throw new Error("Guest session could not be created");
  dependencies.persist(sessionId);
  return { sessionId, data: null, isNew: true };
}
