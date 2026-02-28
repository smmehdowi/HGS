import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, buildQuoteEmail } from '@/lib/send-email';

export async function POST(request: NextRequest) {
  const data = await request.json();
  const emailOpts = buildQuoteEmail(data);
  const result = await sendEmail(emailOpts);
  if (!result.ok && result.error) {
    console.error('[quote] Email send failed:', result.error);
  }
  // Always return success to the user — don't block submission on email failure
  return NextResponse.json({ ok: true });
}
