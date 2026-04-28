import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';

export async function proxy(request: NextRequest) {
  // ✅ Reliable IP extraction (Edge-safe)
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'anonymous';

  const key = `${ip}:${request.nextUrl.pathname}`;

  const { success, limit, remaining, reset } = checkRateLimit(key);

  if (!success) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
      },
    });
  }

  const response = NextResponse.next();

  response.headers.set('X-RateLimit-Limit', limit.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', reset.toString());

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/data (pre-fetched JSON)
     * - _next/font (font files)
     * - _next/image (image optimization files)
     * - favicon.ico, robots.txt (static assets)
     */
    '/((?!api|_next/static|_next/data|_next/font|_next/image|favicon.ico|robots.txt).*)',
  ],
};
