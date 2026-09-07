/** Keep post-auth navigation on this site and preserve a destination's query. */
export function authDestination(
  value: string | null,
  fallback: string,
): string {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    /[\\\u0000-\u0020]/.test(value)
  )
    return fallback;
  const url = new URL(value, "https://auth.invalid");
  if (
    url.origin !== "https://auth.invalid" ||
    /^\/(login|register|logout)(\/|$)/.test(url.pathname)
  )
    return fallback;
  url.searchParams.set("skip_redirect", "true");
  return `${url.pathname}${url.search}${url.hash}`;
}
