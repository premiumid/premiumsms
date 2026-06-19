import { NextResponse } from 'next/server'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const ALPHA_HYPHEN_RE = /^[a-zA-Z][a-zA-Z0-9_-]*$/

export function isValidUUID(s: string): boolean {
  return UUID_RE.test(s)
}

export function isValidServiceSlug(s: string): boolean {
  return s.length >= 2 && s.length <= 40 && ALPHA_HYPHEN_RE.test(s)
}

export function isValidCountryCode(s: string): boolean {
  return /^[A-Z]{2}$/i.test(s)
}

export function sanitizeReason(s: string, maxLen = 200): string {
  return s.replace(/[<>]/g, '').slice(0, maxLen)
}

export function sanitizeKeyName(s: string, maxLen = 64): string {
  return s.replace(/[^\w\s-]/g, '').slice(0, maxLen)
}

export function requireEnv(key: string): string {
  const val = process.env[key]
  if (!val) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return val
}

export function errorResponse(status: number, message: string) {
  return NextResponse.json({ error: message }, { status })
}

export function handleApiError(err: unknown, context: string) {
  const message = err instanceof Error ? err.message : String(err)
  console.error(`[API Error] ${context}:`, message)
  return errorResponse(500, 'Internal server error')
}

export function cacheControl(maxAge: number): Record<string, string> {
  return {
    'Cache-Control': `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 2}`,
  }
}
