import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://www.pishrosarmaye.com/api';
const NEXT_PUBLIC_ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_BASE_URL || '*';

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': NEXT_PUBLIC_ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: Request) {
  try {
    const origin = request.headers.get('origin');
    // Build backend URL
    const backend = `${BACKEND_URL.replace(/\/$/, '')}/auth/session`;

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    // Forward authorization/cookie headers when present
    const auth = request.headers.get('authorization');
    if (auth) headers['Authorization'] = auth;
    const cookie = request.headers.get('cookie');
    if (cookie) headers['cookie'] = cookie;

    const res = await fetch(backend, { method: 'GET', headers, credentials: 'include' as RequestCredentials });
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      return new NextResponse(JSON.stringify(json), { status: res.status, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } });
    } catch (e) {
      return new NextResponse(text, { status: res.status, headers: { 'Content-Type': res.headers.get('content-type') || 'application/json', ...CORS_HEADERS } });
    }
  } catch (err) {
    console.error('[proxy session] Error while proxying auth/session:', err);
    return new NextResponse(JSON.stringify({ message: 'Failed to proxy auth session' }), { status: 502, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } });
  }
}
