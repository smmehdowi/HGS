import { NextRequest, NextResponse } from 'next/server';
import { setAdminCookieHeaders, clearAdminCookieHeaders } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  return NextResponse.json({ ok: true }, { headers: setAdminCookieHeaders() });
}

export async function DELETE() {
  return NextResponse.json({ ok: true }, { headers: clearAdminCookieHeaders() });
}
