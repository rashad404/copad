/**
 * Storage key for the guest session id.
 *
 * Defined once because it was previously written as `guestSessionId190190` by
 * the chat context but read as `guestSessionId` by the upload component, so
 * uploads sent an empty X-Guest-Session-Id header and lost their session.
 */
export const GUEST_SESSION_STORAGE_KEY = 'guestSessionId190190';

/** Reads the current guest session id, or null when there is none. */
export function getGuestSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(GUEST_SESSION_STORAGE_KEY);
  } catch {
    // Private browsing or blocked storage.
    return null;
  }
}

/** Persists the guest session id. */
export function setGuestSessionId(sessionId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GUEST_SESSION_STORAGE_KEY, sessionId);
  } catch {
    /* non-fatal */
  }
}
