'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { provisionUser } from '@/lib/supabase/admin'

const AUTH_ERROR_MAP: Record<string, string> = {
  'Invalid login credentials': 'Invalid email or password.',
  'Email not confirmed': 'Please verify your email address before logging in.',
  'User already registered': 'An account with this email already exists.',
  'Password should be at least 6 characters': 'Password must be at least 6 characters.',
  'Email rate limit exceeded': 'Too many attempts. Please try again later.',
  'Invalid email': 'Please enter a valid email address.',
  'Signup requires a valid password': 'Password must be at least 6 characters.',
}

function mapAuthError(message: string): string {
  return AUTH_ERROR_MAP[message] || message
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: mapAuthError(error.message) }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: authData, error } = await supabase.auth.signUp(data)

  if (error) {
    return { error: mapAuthError(error.message) }
  }

  // Provision profile + wallet for new user
  if (authData.user) {
    await provisionUser(authData.user.id, authData.user.email ?? data.email)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard?welcome=true')
}

export async function resendVerification() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) {
    return { error: 'No authenticated user found.' }
  }

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: user.email,
  })

  if (error) return { error: mapAuthError(error.message) }
  return { success: true }
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/auth/callback?type=recovery`,
  })

  if (error) return { error: mapAuthError(error.message) }
  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({ password })

  if (error) return { error: mapAuthError(error.message) }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
