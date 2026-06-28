/**
 * VirtualSMS Provider Adapter
 * Wraps the VirtualSMS REST API for use in Next.js API routes.
 * Docs: https://virtualsms.io/docs
 */

const BASE_URL = 'https://virtualsms.io/api/v1'

function getApiKey(): string {
  const key = process.env.VIRTUALSMS_API_KEY
  if (!key) throw new Error('VIRTUALSMS_API_KEY is not set')
  return key
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`
  const API_KEY = getApiKey()
  const res = await fetch(url, {
    ...options,
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!res.ok) {
    const bodyText = await res.text()
    console.error(`[VirtualSMS] Error ${res.status} on ${options?.method ?? 'GET'} ${path}:`, bodyText)
    let message = `VirtualSMS API error: ${res.status}`
    try { message = JSON.parse(bodyText)?.message || message } catch {}
    throw new Error(message)
  }

  return res.json()
}

// ── Discovery ────────────────────────────────────────────────────────────────

export interface VsmsService {
  slug: string
  name: string
  icon_url?: string
}

export interface VsmsCountry {
  code: string
  name: string
  flag?: string
}

export interface VsmsPrice {
  price_usd: number
  available: boolean
}

type ServiceRaw = { service_id: string; service_name: string; icon?: string }
type CountryRaw = { country_id: string; country_name: string; flag?: string }
type PriceRaw = { price?: number; price_usd?: number; available?: boolean }

export async function listServices(): Promise<VsmsService[]> {
  const data = await request<{ services: ServiceRaw[] }>('/customer/services')
  return data.services.map(s => ({
    slug: s.service_id,
    name: s.service_name,
    icon_url: s.icon
  }))
}

export async function listCountries(
  service?: string
): Promise<{ countries: VsmsCountry[]; available: boolean }> {
  try {
    const qs = service ? `?service=${service}` : ''
    const data = await request<{ countries: CountryRaw[] }>(`/customer/countries${qs}`)
    return {
      countries: (data.countries ?? []).map(c => ({
        code: c.country_id,
        name: c.country_name,
        flag: c.flag,
      })),
      available: true,
    }
  } catch (err) {
    if (service) {
      // Provider does not recognise this slug — degrade gracefully, not a 500
      console.warn(
        `[VirtualSMS] Service "${service}" unavailable:`,
        err instanceof Error ? err.message : String(err)
      )
      return { countries: [], available: false }
    }
    throw err
  }
}

export async function getPrice(service: string, country: string): Promise<VsmsPrice> {
  try {
    const data = await request<PriceRaw>(`/price?service=${service}&country=${country}`)
    return {
      price_usd: Number(data.price ?? data.price_usd ?? 0),
      available: data.available !== undefined ? Boolean(data.available) : true,
    }
  } catch (err) {
    console.warn(
      `[VirtualSMS] Price unavailable for ${service}/${country}:`,
      err instanceof Error ? err.message : String(err)
    )
    return { price_usd: 0, available: false }
  }
}

// ── Orders ────────────────────────────────────────────────────────────────────

export interface VsmsOrder {
  id: string
  phone: string
  service: string
  country: string
  status: 'active' | 'completed' | 'cancelled' | 'expired'
  created_at: string
  expires_at: string
  price: number
}

export interface VsmsSms {
  id: string
  order_id: string
  text: string
  code?: string
  sender?: string
  received_at: string
}

type OrderRaw = {
  order_id?: string; id?: string
  phone_number?: string
  service_id?: string; service?: string
  country_id?: string; country?: string
  status?: string
  created_at?: string
  expires_at?: string
  price_charged?: number; price?: number
  sms_code?: string; sms_text?: string
}

export async function createOrder(service: string, country: string): Promise<VsmsOrder> {
  const data = await request<{ order?: OrderRaw } & OrderRaw>('/customer/purchase', {
    method: 'POST',
    body: JSON.stringify({ service, country }),
  })
  const o: OrderRaw = data.order ?? data
  return {
    id: String(o.order_id ?? o.id ?? ''),
    phone: String(o.phone_number ?? ''),
    service: String(o.service_id ?? o.service ?? ''),
    country: String(o.country_id ?? o.country ?? ''),
    status: (o.status ?? 'active') as VsmsOrder['status'],
    created_at: o.created_at ?? new Date().toISOString(),
    expires_at: o.expires_at ?? new Date(Date.now() + 15 * 60000).toISOString(),
    price: Number(o.price_charged ?? o.price ?? 0)
  }
}

export async function getOrder(orderId: string): Promise<VsmsOrder & { sms_code?: string, sms_text?: string }> {
  const data = await request<{ order?: OrderRaw } & OrderRaw>(`/customer/order/${orderId}`)
  const o: OrderRaw = data.order ?? data
  return {
    id: String(o.order_id ?? o.id ?? ''),
    phone: String(o.phone_number ?? ''),
    service: String(o.service_id ?? o.service ?? ''),
    country: String(o.country_id ?? o.country ?? ''),
    status: (o.status ?? 'active') as VsmsOrder['status'],
    created_at: o.created_at ?? new Date().toISOString(),
    expires_at: o.expires_at ?? new Date(Date.now() + 15 * 60000).toISOString(),
    price: Number(o.price_charged ?? o.price ?? 0),
    sms_code: o.sms_code,
    sms_text: o.sms_text
  }
}

export async function getMessages(orderId: string): Promise<VsmsSms[]> {
  const order = await getOrder(orderId)
  if (order.sms_text || order.sms_code) {
    return [{
      id: order.id,
      order_id: order.id,
      text: order.sms_text || `Your code is ${order.sms_code}`,
      code: order.sms_code,
      received_at: new Date().toISOString()
    }]
  }
  return []
}

export async function cancelOrder(orderId: string): Promise<void> {
  await request(`/customer/cancel/${orderId}`, { method: 'POST' })
}

export async function getBalance(): Promise<number> {
  const data = await request<{ balance: number }>('/customer/balance')
  return data.balance
}
