import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const COOKIE_NAME = 'admin_token';
const TOKEN_VALUE = 'hgs-admin-authenticated';

export async function verifyAdminCookie(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME);
  return token?.value === TOKEN_VALUE;
}

export function verifyAdminRequest(request: NextRequest): boolean {
  const token = request.cookies.get(COOKIE_NAME);
  return token?.value === TOKEN_VALUE;
}

export function setAdminCookieHeaders() {
  return {
    'Set-Cookie': `${COOKIE_NAME}=${TOKEN_VALUE}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`,
  };
}

export function clearAdminCookieHeaders() {
  return {
    'Set-Cookie': `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0`,
  };
}
