<!-- BEGIN:nextjs-agent-rules -->
# Next.js 16.2.9 Rules
This repository uses Next.js 16.2.9 (App Router) + React 19 + TypeScript 5.
APIs, conventions, and file structure may differ from standard training data.
Read the guide in `node_modules/next/dist/docs/` before writing code. Heed all deprecation notices.
<!-- END:nextjs-agent-rules -->

# PremiumID Architecture & Workflows

## Commands & Toolchain
- **Dev Server:** `npm run dev` (Runs on **http://localhost:3001**, not 3000. See `.env.local`)
- **Linting:** `npm run lint` (ESLint 9, strict config)
- **Typechecking:** There is NO `npm run typecheck`. Run `npx tsc --noEmit` directly.
- **Testing:** There is no test framework configured; do not attempt to run tests.
- **Standalone Scripts:** `check_balance.ts` is excluded from tsconfig. Run it via `npx tsx check_balance.ts`. It uses `.js` ESM import extensions.

## Supabase & Database
- **Migrations:** Located in `supabase/migrations/`. Note: **Migration 002 intentionally does not exist** (gap between 001 and 003). All tables have RLS enabled.
- **Client Architecture:** (`src/lib/supabase/`)
  - `client.ts`: Browser client for `"use client"` components.
  - `server.ts`: Server client with `cookies()` for RSCs.
  - `middleware.ts`: `updateSession()` for `src/middleware.ts`.
  - `admin.ts`: **Admin client (`SUPABASE_SERVICE_ROLE_KEY`). Bypasses RLS.**

## Security & Wallet Mutations
- **NEVER** perform wallet mutations from the browser client.
- **ALWAYS** use `admin.ts` for operations like `provisionUser`, `deductWalletBalance`, `refundWalletBalance`, `creditWalletBalance`.
- **Atomic Pattern:** Read balance -> check funds -> update balance -> insert ledger transaction.

## Project Structure
- **API Routes:** `src/app/api/`. Most require auth via `supabase.auth.getUser()`.
- **Route Groups:** 
  - `(auth)`: Login/register pages and server actions (`actions.ts`). `signup` auto-provisions profile + wallet via `provisionUser()`.
  - `(dashboard)`: Protected layout checking session and wallet balance.
- **Provider Adapters:** `src/lib/providers/virtualsms.ts` wraps the VirtualSMS REST API.

## Design System
- Dark theme using CSS custom properties in `globals.css` (~2300 lines). 
- Fonts: Inter + Outfit via `next/font/google`. 
- Images: Configured for `flagcdn.com` and a custom Cloudflare R2 domain in `next.config.ts`.
