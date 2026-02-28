import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, buildContactEmail } from '@/lib/send-email';

export async function POST(request: NextRequest) {
  const data = await request.json();
  const emailOpts = buildContactEmail(data);
  const result = await sendEmail(emailOpts);
  if (!result.ok && result.error) {
    console.error('[contact] Email send failed:', result.error);
  }
  return NextResponse.json({ ok: true });
}
