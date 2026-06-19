import { createClient } from '@supabase/supabase-js'

/**
 * Supabase Admin client (service role).
 * Bypasses all RLS policies — only use in trusted server-side code.
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
}

/**
 * Provision a profile + wallet for a user.
 * Safe to call multiple times — uses upsert.
 */
export async function provisionUser(userId: string, email: string) {
  const admin = createAdminClient()
  await admin.from('profiles').upsert(
    { id: userId, email, display_name: email.split('@')[0] },
    { onConflict: 'id' }
  )
  await admin.from('wallets').upsert(
    { user_id: userId, balance: 0 },
    { onConflict: 'user_id' }
  )
}

/**
 * Deduct an amount from a user's wallet and log a debit transaction.
 * Runs on the server side using the admin client to bypass RLS.
 */
export async function deductWalletBalance(userId: string, amount: number, description: string) {
  const admin = createAdminClient()

  // Get current wallet details
  const { data: wallet, error: walletError } = await admin
    .from('wallets')
    .select('id, balance')
    .eq('user_id', userId)
    .single()

  if (walletError || !wallet) {
    throw new Error('Wallet not found for user')
  }

  const currentBalance = Number(wallet.balance)
  if (currentBalance < amount) {
    throw new Error(
      `Insufficient balance. Required: $${amount.toFixed(2)}, Available: $${currentBalance.toFixed(2)}`
    )
  }

  const newBalance = currentBalance - amount

  // Atomic update with optimistic lock on balance
  // If a concurrent request modified the balance, this update matches 0 rows
  const { data: updated } = await admin
    .from('wallets')
    .update({ balance: newBalance })
    .eq('id', wallet.id)
    .eq('balance', currentBalance)
    .select()

  if (!updated || updated.length === 0) {
    throw new Error('Concurrent balance change detected. Please retry.')
  }

  // Insert wallet transaction
  const { error: txError } = await admin
    .from('wallet_transactions')
    .insert({
      wallet_id: wallet.id,
      type: 'debit',
      amount: amount,
      balance_after: newBalance,
      description: description,
    })

  if (txError) throw txError

  return newBalance
}

/**
 * Refund an amount to a user's wallet and log a refund transaction.
 * Runs on the server side using the admin client to bypass RLS.
 */
export async function refundWalletBalance(userId: string, amount: number, description: string) {
  const admin = createAdminClient()

  // Get current wallet details
  const { data: wallet, error: walletError } = await admin
    .from('wallets')
    .select('id, balance')
    .eq('user_id', userId)
    .single()

  if (walletError || !wallet) {
    throw new Error('Wallet not found for user')
  }

  const currentBalance = Number(wallet.balance)
  const newBalance = currentBalance + amount

  // Atomic update with optimistic lock
  const { data: updated } = await admin
    .from('wallets')
    .update({ balance: newBalance })
    .eq('id', wallet.id)
    .eq('balance', currentBalance)
    .select()

  if (!updated || updated.length === 0) {
    throw new Error('Concurrent balance change detected. Please retry.')
  }

  // Insert wallet transaction
  const { error: txError } = await admin
    .from('wallet_transactions')
    .insert({
      wallet_id: wallet.id,
      type: 'refund',
      amount: amount,
      balance_after: newBalance,
      description: description,
    })

  if (txError) throw txError

  return newBalance
}

/**
 * Credit an amount to a user's wallet (e.g., top-up or admin credit).
 * Runs on the server side using the admin client to bypass RLS.
 */
export async function creditWalletBalance(
  userId: string,
  amount: number,
  description: string,
  type: 'topup' | 'admin_credit' = 'topup'
) {
  const admin = createAdminClient()

  // Get current wallet details
  const { data: wallet, error: walletError } = await admin
    .from('wallets')
    .select('id, balance')
    .eq('user_id', userId)
    .single()

  if (walletError || !wallet) {
    throw new Error('Wallet not found for user')
  }

  const currentBalance = Number(wallet.balance)
  const newBalance = currentBalance + amount

  // Atomic update with optimistic lock
  const { data: updated } = await admin
    .from('wallets')
    .update({ balance: newBalance })
    .eq('id', wallet.id)
    .eq('balance', currentBalance)
    .select()

  if (!updated || updated.length === 0) {
    throw new Error('Concurrent balance change detected. Please retry.')
  }

  // Insert wallet transaction
  const { error: txError } = await admin
    .from('wallet_transactions')
    .insert({
      wallet_id: wallet.id,
      type: type,
      amount: amount,
      balance_after: newBalance,
      description: description,
    })

  if (txError) throw txError

  return newBalance
}

/**
 * Delete a user account and all associated data.
 * Uses the admin client (service role) to bypass RLS.
 * Cascading deletes handle wallet, transactions, rentals, SMS, and API keys.
 */
export async function deleteUserAccount(userId: string) {
  const admin = createAdminClient()

  // Delete crypto payments (FK references auth.users directly, so do this first)
  await admin.from('crypto_payments').delete().eq('user_id', userId)

  // Delete profile — cascades to wallet, wallet_transactions, rentals, sms_messages, api_keys
  await admin.from('profiles').delete().eq('id', userId)

  // Delete the auth user itself
  const { error } = await admin.auth.admin.deleteUser(userId)
  if (error) throw new Error(error.message)
}

/**
 * Check if a user has any balance in their wallet.
 */
export async function getWalletBalance(userId: string): Promise<number> {
  const admin = createAdminClient()
  const { data } = await admin
    .from('wallets')
    .select('balance')
    .eq('user_id', userId)
    .single()
  return Number(data?.balance ?? 0)
}
