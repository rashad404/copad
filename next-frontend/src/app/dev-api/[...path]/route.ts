import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/** Same-origin bridge for isolated development previews. Never active in production. */
async function proxy(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development' || !process.env.DEV_API_PROXY_TARGET) {
    return new NextResponse(null, { status: 404 });
  }

  const base = new URL(process.env.DEV_API_PROXY_TARGET);
  const suffix = request.nextUrl.pathname.slice('/dev-api'.length);
  const url = new URL(base);
  url.pathname = `${base.pathname.replace(/\/$/, '')}${suffix}`;
  url.search = request.nextUrl.search;
  const headers = new Headers();
  // Do not forward the preview Origin/Host: this is a server-to-server request.
  for (const name of ['content-type', 'accept', 'authorization', 'cookie']) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  try {
    const response = await fetch(url, {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.arrayBuffer(),
      redirect: 'manual',
      cache: 'no-store',
      signal: request.signal,
    });
    const outgoing = new Headers();
    for (const name of ['content-type', 'content-disposition', 'www-authenticate']) {
      const value = response.headers.get(name);
      if (value) outgoing.set(name, value);
    }
    for (const cookie of response.headers.getSetCookie()) outgoing.append('set-cookie', cookie);
    const location = response.headers.get('location');
    if (location) outgoing.set('location', new URL(location, url).toString());
    outgoing.set('cache-control', 'no-store');
    return new NextResponse(response.body, { status: response.status, headers: outgoing });
  } catch {
    return NextResponse.json({ message: 'The development API is unavailable.' }, { status: 502 });
  }
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE, proxy as HEAD };
