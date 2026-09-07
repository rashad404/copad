import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Same-origin bridge for isolated development previews. Never active in production. */
async function proxy(request: NextRequest) {
  if (
    process.env.NODE_ENV !== "development" ||
    !process.env.DEV_API_PROXY_TARGET
  ) {
    return new NextResponse(null, { status: 404 });
  }

  const base = new URL(process.env.DEV_API_PROXY_TARGET);
  const suffix = request.nextUrl.pathname.slice("/dev-api".length);
  const url = new URL(base);
  url.pathname = `${base.pathname.replace(/\/$/, "")}${suffix}`;
  url.search = request.nextUrl.search;
  const headers = new Headers();
  // Do not forward the preview Origin/Host: this is a server-to-server request.
  for (const name of [
    "content-type",
    "accept",
    "authorization",
    "cookie",
    "x-guest-session-id",
  ]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  try {
    const response = await fetch(url, {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method)
        ? undefined
        : await request.arrayBuffer(),
      redirect: "manual",
      cache: "no-store",
      signal: request.signal,
    });
    const outgoing = new Headers();
    for (const name of [
      "content-type",
      "content-disposition",
      "www-authenticate",
      "x-urgent",
      "x-urgent-categories",
      "x-emergency-number",
      "x-request-id",
    ]) {
      const value = response.headers.get(name);
      if (value) outgoing.set(name, value);
    }
    for (const cookie of response.headers.getSetCookie())
      outgoing.append("set-cookie", cookie);
    const location = response.headers.get("location");
    if (location) outgoing.set("location", new URL(location, url).toString());
    outgoing.set("cache-control", "no-store");
    // These statuses cannot carry a body, even an empty ReadableStream.
    const body =
      request.method === "HEAD" || [204, 205, 304].includes(response.status)
        ? null
        : response.body;
    if (response.status === 413 && !response.headers.get("content-type")) {
      return NextResponse.json(
        {
          message:
            "The upload exceeds the backend request limit. Please try a smaller file.",
        },
        { status: 413 },
      );
    }
    return new NextResponse(body, {
      status: response.status,
      headers: outgoing,
    });
  } catch (error) {
    // Log transport diagnostics, never the uploaded bytes or auth headers.
    const failure = error as Error & { cause?: { code?: string } };
    console.error("Development API proxy failed", {
      name: failure.name,
      message: failure.message,
      code: failure.cause?.code,
    });
    return NextResponse.json(
      { message: "The development API is unavailable." },
      { status: 502 },
    );
  }
}

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
  proxy as HEAD,
};
