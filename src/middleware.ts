// @/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for route protection
 * Note: Simplified to avoid Prisma edge runtime issues
 * Auth protection is handled at page/component level using getServerSession
 */
export function middleware(request: NextRequest) {
  // Allow all requests - auth handled in pages/components
  // Debugging: log host + path for _next static files when DEBUG_ADMIN=true
  try {
    const url = request.nextUrl?.pathname || request.url || '';
    const host = request.headers.get('host') || '';
    const xfhost = request.headers.get('x-forwarded-host') || '';
    if (process.env.DEBUG_ADMIN === 'true' && (url.startsWith('/_next/static') || url.startsWith('/_next/image'))) {
      // Use console.log so pm2 logs will capture it
      // eslint-disable-next-line no-console
      console.log(`[admin-debug] ${request.method} ${url} host:${host} x-forwarded-host:${xfhost} headers:${JSON.stringify(Object.fromEntries(request.headers.entries()))}`);
    }
  } catch (e) {
    // ignore logging errors
  }
  return NextResponse.next();
}

export const config = {
  // NOTE: temporarily allowing _next paths to be matched so we can log host headers
  // for static assets — revert by adding _next/static/_next/image to the excluded matcher
  // Match all paths except those starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
