import { DaftraSettings } from './admin-types';
import { getDaftraProductMap, saveDaftraProductMap } from './config-store';

// ── HTTP helpers ────────────────────────────────────────────────────────────

async function daftraGet(subdomain: string, apiKey: string, path: string): Promise<unknown> {
  const url = `https://${subdomain}.daftra.com/api2/${path}`;
  const res = await fetch(url, {
    headers: { apikey: apiKey, 'Content-Type': 'application/json' },
    // 10-second timeout via AbortController
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Daftra GET ${path} → ${res.status}`);
  return res.json();
}

async function daftraPost(subdomain: string, apiKey: string, path: string, body: unknown): Promise<{ code: number; result: string; id?: number }> {
  const url = `https://${subdomain}.daftra.com/api2/${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { apikey: apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Daftra POST ${path} → ${res.status}`);
  return res.json();
}

// ── Client ──────────────────────────────────────────────────────────────────

async function createOrFindClient(
  subdomain: string,
  apiKey: string,
  customer: { name: string; email: string; phone: string; company: string },
): Promise<number> {
  // Search by email if provided
  if (customer.email) {
    try {
      const search = await daftraGet(
        subdomain, apiKey,
        `clients.json?conditions[email]=${encodeURIComponent(customer.email)}&limit=1`,
      ) as { data?: Array<{ Client: { id: number } }> };
      const existing = search?.data?.[0]?.Client?.id;
      if (existing) return existing;
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

  if (!res.id) throw new Error('Daftra client creation returned no ID');
  return res.id;
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

  // Search Daftra by name
  try {
    const search = await daftraGet(
      subdomain, apiKey,
      `products.json?conditions[name]=${encodeURIComponent(nameEn)}&limit=1`,
    ) as { data?: Array<{ Product: { id: number } }> };
    const existing = search?.data?.[0]?.Product?.id;
    if (existing) {
      map[productId] = existing;
      await saveDaftraProductMap(map);
      return existing;
    }
  } catch { /* fall through to create */ }

  // Create product in Daftra
  const res = await daftraPost(subdomain, apiKey, 'products.json', {
    Product: {
      name:          nameEn,
      selling_price: pricePerM2 ?? 0,
      type:          0, // 0 = product/goods
    },
  });

  if (!res.id) throw new Error(`Daftra product creation failed for: ${nameEn}`);
  map[productId] = res.id;
  await saveDaftraProductMap(map);
  return res.id;
}

// ── Estimate ─────────────────────────────────────────────────────────────────

async function createEstimate(
  settings: DaftraSettings,
  clientId: number,
  items: Array<{ daftraProductId: number; quantity: number; unitPrice: number; description: string }>,
  notes: string,
): Promise<number> {
  const today = new Date().toISOString().slice(0, 10);

  const res = await daftraPost(settings.subdomain, settings.apiKey, 'estimates.json', {
    Estimate: {
      client_id:     clientId,
      store_id:      settings.storeId,
      currency_code: settings.currencyCode || 'SAR',
      date:          today,
      draft:         0,
      notes,
      InvoiceItem: items.map(i => ({
        product_id:  i.daftraProductId,
        quantity:    i.quantity > 0 ? i.quantity : 1,
        unit_price:  i.unitPrice,
        description: i.description || undefined,
      })),
    },
  });

  if (!res.id) throw new Error('Daftra estimate creation returned no ID');
  return res.id;
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
          p.id || p.nameEn, // use nameEn as fallback key if id is missing
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
    const estimateId = await createEstimate(settings, clientId, lineItems, notes);

    return { ok: true, estimateId };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
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
