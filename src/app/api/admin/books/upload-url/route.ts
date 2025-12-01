import { NextResponse } from 'next/server';

// Proxy POST /api/admin/books/upload-url to external backend

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Copy Authorization header if present (bearer token auth)
    const auth = request.headers.get('authorization');
    if (auth) headers['authorization'] = auth;

    // Copy cookies from incoming request, to support cookie-based session auth if backend expects it
    const cookie = request.headers.get('cookie');
    if (cookie) headers['cookie'] = cookie;

    // Also forward common custom headers if needed (x-)
    request.headers.forEach((value, key) => {
      if (key.startsWith('x-')) {
        headers[key] = value;
      }
    });

    // Use explicit backend URL to avoid relying on env vars
    const backendUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://www.pishrosarmaye.com/api') + '/admin/books/upload-url';

    const res = await fetch(backendUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const resText = await res.text();

    // Try to parse as JSON, otherwise return text
    let parsed: any = resText;
    try { parsed = JSON.parse(resText); } catch (e) { parsed = resText; }

    // Mirror status and body from backend
    return new NextResponse(JSON.stringify(parsed), { status: res.status, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Books upload-url proxy error:', error);
    return new NextResponse(JSON.stringify({ message: 'Proxy error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
