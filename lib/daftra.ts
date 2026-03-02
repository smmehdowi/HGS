import { DaftraSettings } from './admin-types';
import { getDaftraProductMap, saveDaftraProductMap } from './config-store';

// ── HTTP helpers ────────────────────────────────────────────────────────────

function makeAbortSignal(ms: number): AbortSignal {
  // AbortController is universally supported; avoids AbortSignal.timeout() compatibility edge cases
  const ctrl = new AbortController();
  setTimeout(() => ctrl.abort(), ms);
  return ctrl.signal;
}

function networkErrMsg(url: string, err: unknown): string {
  if (err instanceof Error) {
    // Include the underlying cause (e.g. ENOTFOUND, ECONNREFUSED, CERT_ERR)
    const cause = (err as Error & { cause?: unknown }).cause;
    const causeStr = cause instanceof Error ? ` (${cause.message})` : cause ? ` (${String(cause)})` : '';
    return `Network error reaching ${url}: ${err.message}${causeStr}`;
  }
  return `Network error reaching ${url}: ${String(err)}`;
}

async function daftraGet(subdomain: string, apiKey: string, path: string): Promise<unknown> {
  const url = `https://${subdomain}.daftra.com/api2/${path}`;
  console.log(`[daftra] GET ${url}`);
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { apikey: apiKey },
      signal: makeAbortSignal(15_000),
    });
  } catch (err) {
    throw new Error(networkErrMsg(url, err));
  }
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Daftra GET ${path} → HTTP ${res.status}: ${body}`);
  }
  return res.json();
}

async function daftraPost(subdomain: string, apiKey: string, path: string, body: unknown): Promise<Record<string, unknown>> {
  const url = `https://${subdomain}.daftra.com/api2/${path}`;
  console.log(`[daftra] POST ${url}`);
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { apikey: apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: makeAbortSignal(15_000),
    });
  } catch (err) {
    throw new Error(networkErrMsg(url, err));
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Daftra POST ${path} → HTTP ${res.status}: ${text}`);
  }
  const json = await res.json() as Record<string, unknown>;
  console.log(`[daftra] POST ${path} response:`, JSON.stringify(json));
  return json;
}

// ── ID extraction ─────────────────────────────────────────────────────────
// Daftra API v2 is inconsistent — the created record ID may appear at:
//   { id: 123 }                             (top-level)
//   { data: { id: 123 } }                   (nested in data)
//   { data: { Client: { id: 123 } } }       (nested in data.ModelName)
// Try all locations so the code works regardless of which one Daftra uses.
function extractId(res: Record<string, unknown>): number | undefined {
  const toNum = (v: unknown): number | undefined => {
    if (typeof v === 'number') return v || undefined;
    if (typeof v === 'string' && v) { const n = parseInt(v, 10); return isNaN(n) ? undefined : n; }
    return undefined;
  };
  const top = toNum(res.id);
  if (top) return top;
  const data = res.data as Record<string, unknown> | undefined;
  if (!data) return undefined;
  const d = toNum(data.id);
  if (d) return d;
  // look one level deeper inside data (e.g. data.Client.id, data.Product.id)
  for (const val of Object.values(data)) {
    if (val && typeof val === 'object') {
      const n = toNum((val as Record<string,unknown>).id);
      if (n) return n;
    }
  }
  return undefined;
}

// ── Client ──────────────────────────────────────────────────────────────────

async function createOrFindClient(
  subdomain: string,
  apiKey: string,
  customer: { name: string; email: string; phone: string; company: string },
): Promise<number> {
  // Search by email if provided — then verify the returned record actually matches,
  // because Daftra may ignore the conditions filter and return all clients.
  if (customer.email) {
    try {
      const search = await daftraGet(
        subdomain, apiKey,
        `clients.json?conditions[email]=${encodeURIComponent(customer.email)}&limit=1`,
      ) as { data?: Array<{ Client: { id: number; email?: string } }> };
      const found = search?.data?.[0]?.Client;
      console.log('[daftra] client search result:', JSON.stringify(found));
      if (found?.id && found.email === customer.email) return found.id;
    } catch { /* fall through to create */ }
  }

  // Split name into first/last (Daftra requires both)
  const parts = (customer.name || 'Customer').trim().split(/\s+/);
  const firstName = parts[0];
  const lastName  = parts.length > 1 ? parts.slice(1).join(' ') : parts[0];

  const res = await daftraPost(subdomain, apiKey, 'clients.json', {
    Client: {
      first_name:    firstName,
      last_name:     lastName,
      business_name: customer.company || customer.name || 'Customer',
      email:         customer.email   || undefined,
      phone:         customer.phone   || undefined,
      type:          customer.company ? 3 : 2, // 3=Business, 2=Individual
    },
  });

  const id = extractId(res);
  if (!id) throw new Error(`Daftra client creation returned no ID. Response: ${JSON.stringify(res)}`);
  return id;
}

// ── Products ────────────────────────────────────────────────────────────────

async function ensureProductId(
  subdomain: string,
  apiKey: string,
  productId: string,
  nameEn: string,
  pricePerM2?: number,
): Promise<number> {
  // Check local cache first
  const map = await getDaftraProductMap();
  if (map[productId]) return map[productId];

  // Search Daftra by name — then verify the returned record actually matches,
  // because Daftra may ignore the conditions filter and return all products.
  try {
    const search = await daftraGet(
      subdomain, apiKey,
      `products.json?conditions[name]=${encodeURIComponent(nameEn)}&limit=1`,
    ) as { data?: Array<{ Product: { id: number; name?: string } }> };
    const found = search?.data?.[0]?.Product;
    console.log('[daftra] product search result for', JSON.stringify(nameEn), ':', JSON.stringify(found));
    if (found?.id && found.name === nameEn) {
      map[productId] = found.id;
      await saveDaftraProductMap(map);
      return found.id;
    }
  } catch (e) {
    console.warn('[daftra] product search failed, will try create:', e);
  }

  // Create product in Daftra
  const res = await daftraPost(subdomain, apiKey, 'products.json', {
    Product: {
      name:          nameEn,
      selling_price: pricePerM2 ?? 0,
      type:          0, // 0 = product/goods
    },
  });

  const id = extractId(res);
  if (!id) throw new Error(`Daftra product creation failed for "${nameEn}". Response: ${JSON.stringify(res)}`);
  map[productId] = id;
  await saveDaftraProductMap(map);
  return id;
}

// ── Estimate ─────────────────────────────────────────────────────────────────

async function createEstimate(
  settings: DaftraSettings,
  clientId: number,
  clientEmail: string,
  items: Array<{ daftraProductId: number; quantity: number; unitPrice: number; description: string }>,
  notes: string,
): Promise<number> {
  const today = new Date().toISOString().slice(0, 10);

  const res = await daftraPost(settings.subdomain, settings.apiKey, 'estimates.json', {
    Estimate: {
      client_id:     clientId,
      client_email:  clientEmail || undefined, // required by Daftra when send_email is active
      store_id:      settings.storeId,
      currency_code: settings.currencyCode || 'SAR',
      date:          today,
      draft:         0,
      send_email:    0, // we send our own email with PDF; don't let Daftra send one
      notes,
      InvoiceItem: items.map(i => ({
        product_id:  i.daftraProductId,
        quantity:    i.quantity > 0 ? i.quantity : 1,
        unit_price:  i.unitPrice,
        description: i.description || undefined,
      })),
    },
  });

  const id = extractId(res);
  if (!id) throw new Error(`Daftra estimate creation returned no ID. Response: ${JSON.stringify(res)}`);
  return id;
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface DaftraQuoteProduct {
  id: string;         // our catalog product ID (used for caching)
  nameEn: string;
  quantity?: string;
  dimensions?: string;
  thickness?: string;
  finish?: string;
  pricePerM2?: number;
}

export async function submitQuoteToDaftra(
  settings: DaftraSettings,
  customer: { name: string; email: string; phone: string; company: string },
  project: { type: string; city: string; timeline: string },
  products: DaftraQuoteProduct[],
  quoteRef: string,
): Promise<{ ok: boolean; estimateId?: number; error?: string }> {
  try {
    // 1. Find or create client
    const clientId = await createOrFindClient(settings.subdomain, settings.apiKey, customer);

    // 2. Resolve Daftra product IDs for each item
    const lineItems = await Promise.all(
      products.map(async p => {
        const daftraProductId = await ensureProductId(
          settings.subdomain,
          settings.apiKey,
          p.id || p.nameEn,
          p.nameEn,
          p.pricePerM2,
        );
        const specParts = [p.dimensions, p.thickness, p.finish].filter(Boolean);
        return {
          daftraProductId,
          quantity:    parseFloat(p.quantity || '1') || 1,
          unitPrice:   p.pricePerM2 ?? 0,
          description: specParts.join(' · '),
        };
      }),
    );

    // 3. Build notes string (project details + our internal ref)
    const projectParts = [
      project.type     && `Project: ${project.type}`,
      project.city     && `City: ${project.city}`,
      project.timeline && `Timeline: ${project.timeline}`,
    ].filter(Boolean);
    const notes = [`Ref: ${quoteRef}`, ...projectParts].join('\n');

    // 4. Create estimate
    const estimateId = await createEstimate(settings, clientId, customer.email, lineItems, notes);

    return { ok: true, estimateId };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[daftra] submitQuoteToDaftra failed:', msg);
    return { ok: false, error: msg };
  }
}

// Test connection — just verifies credentials by fetching one client record
export async function testDaftraConnection(
  subdomain: string,
  apiKey: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await daftraGet(subdomain, apiKey, 'clients.json?limit=1');
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
