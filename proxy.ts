import createMiddleware from 'next-intl/middleware';
import { routing } from './routing';

export default createMiddleware(routing);

export const config = {
  // Exclude /admin, /api, /_next, /_vercel, and static files from locale routing
  matcher: ['/((?!admin|api|_next|_vercel|.*\\..*).*)'],
};
