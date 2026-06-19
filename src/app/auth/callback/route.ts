import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { provisionUser } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.user) {
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/update-password`)
      }
      await provisionUser(data.user.id, data.user.email ?? '')
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`)
}
