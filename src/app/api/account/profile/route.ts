import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({
      email: user.email,
      created_at: user.created_at,
    })
  } catch (err) {
    console.error('[Profile] Error:', err)
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 })
  }
}
