// WhatsApp integration — INACTIVE pending WhatsApp Business API subscription.
// To activate: remove the early return below and uncomment the import.
// Then configure Phone Number ID + API Token in Admin → WhatsApp settings.

// import { getWhatsAppSettings } from './config-store';

export async function sendWhatsAppText(
  _to: string,
  _body: string,
): Promise<{ ok: boolean; error?: string }> {
  // TEMPORARILY INACTIVE — return immediately so deployments are unaffected.
  return { ok: true };

  /* ── Activate when WhatsApp Business API is ready ──────────────────────────
  const settings = await getWhatsAppSettings();

  if (!settings.enabled) return { ok: true }; // silently skip if disabled
  if (!settings.apiToken || !settings.phoneNumberId) {
    return { ok: false, error: 'WhatsApp API not configured' };
  }

  // Normalize phone: strip all non-digit characters
  const phone = to.replace(/\D/g, '');
  if (!phone) return { ok: false, error: 'Invalid phone number' };

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${settings.phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${settings.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phone,
          type: 'text',
          text: { body },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return { ok: false, error: err };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
  ─────────────────────────────────────────────────────────────────────────── */
}
