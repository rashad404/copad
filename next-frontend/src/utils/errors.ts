import axios from 'axios';

/**
 * Extracts a human-readable message from an unknown thrown value.
 *
 * Catch clauses are typed `unknown`, not `any`: a thrown value is genuinely
 * unknown at runtime and may not be an Error at all. Reading `.message`
 * straight off it - as this codebase did in 20 places - yields `undefined`
 * whenever something other than an Error is thrown, and shows the user an
 * empty error.
 *
 * API errors from axios carry the useful text in the response body, so those
 * are preferred over the generic "Request failed with status code 500".
 */
export function getErrorMessage(error: unknown, fallback = ''): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; error?: string } | undefined;
    return data?.message || data?.error || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (typeof error === 'string') {
    return error || fallback;
  }

  return fallback;
}
