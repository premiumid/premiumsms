import { getBalance } from './src/lib/providers/virtualsms.js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

async function check() {
  try {
    const balance = await getBalance()
    console.log(`VirtualSMS Balance: $${balance.toFixed(2)}`)
  } catch (err) {
    console.error('Failed to check balance:', err)
    process.exit(1)
  }
}

check()