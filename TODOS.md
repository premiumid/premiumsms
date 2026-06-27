# TODOS

## Security / Defense-in-depth

- [ ] **Add explicit `.eq('user_id', user.id)` filter to `wallet_transactions` query in `page.tsx:42`**
  - **What:** Add `.eq('user_id', user.id)` to the Supabase query, matching the existing `rentals` query pattern.
  - **Why:** Defense-in-depth. RLS currently handles this, but an explicit filter means a future RLS misconfiguration can't leak cross-user transaction data silently.
  - **Pros:** Removes reliance on RLS as the sole access control for this query.
  - **Cons:** One extra condition in the query (negligible cost).
  - **Context:** Flagged by outside voice during eng review (2026-06-28) while reviewing T5 (page.tsx changes). The `rentals` query on line 46 already has the filter; `wallet_transactions` on line 42 does not.
  - **Depends on / blocked by:** None. Safe to add any time.

## Accessibility

- [ ] **Add `aria-live` region for price change announcements**
  - **What:** Wrap the price display in an `aria-live="polite"` region so screen readers announce when the price updates after country selection.
  - **Why:** Currently, when a user selects a country and the price loads, screen reader users get no feedback.
  - **Pros:** WCAG 4.1.3 (status messages). Makes the price UX accessible.
  - **Cons:** Minor JSX change; need to avoid overly chatty announcements.
  - **Context:** Deferred from design review a11y pass (2026-06-27). Tracked separately from T8 focus management.
  - **Depends on / blocked by:** T8 (focus management) should ship first.

## Design System

- [ ] **Create DESIGN.md — design system documentation**
  - **What:** Document design tokens, CSS utility patterns, component conventions, and AI slop rules for the PremiumID design system.
  - **Why:** The hand-rolled CSS system (no Tailwind, ~4500 lines) has undocumented conventions that cause the `bg-danger/10`-style pitfalls.
  - **Pros:** Prevents future undefined-class bugs; speeds up UI development.
  - **Cons:** Significant one-time investment (~2h human).
  - **Context:** Deferred from design review (2026-06-27). Flag for `/design-consultation`.
  - **Depends on / blocked by:** None.
