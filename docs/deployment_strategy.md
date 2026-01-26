# Vercel Deployment Strategy

## 1. Core Considerations
Since we are using **Next.js 15 (App Router)** and **Supabase**, Vercel is the optimal hosting choice. 

### Critical Configuration
*   **Framework Preset:** Vercel will automatically detect `Next.js`.
*   **Build Command:** `next build` (Standard).
*   **Output Directory:** `.next` (Standard).
*   **Node Version:** Ensure Vercel Project Settings -> Node.js Version matches our local environment (Node 20.x or 22.x).

### Supabase & Serverless Implications
*   **Connection Pooling:** Next.js Server Actions run in a serverless environment. 
    *   *Risk:* Exhausting database connections.
    *   *Solution:* Since we use the `supabase-js` HTTP client (`@supabase/ssr`), connection pooling is handled via the HTTP API layer automatically. We do **not** need to configure PgBouncer manually unless we switch to direct Prisma/Drizzle connections in the future.
*   **Environment Variables:**
    *   Secrets must be added to Vercel **Project Settings > Environment Variables**.
    *   `NEXT_PUBLIC_...` variables are baked into the build at deploy time.

## 2. Implementation Checklist

### Phase 1: Preparation (Local)
- [ ] **Lint Check:** Run `npm run lint` to ensure no build-blocking errors.
- [ ] **Type Check:** Run `npm run build` locally to verify TypeScript compilation.
- [ ] **Env Sync:** List all keys in `.env` that need to move to Vercel.
    -   `NEXT_PUBLIC_SUPABASE_URL`
    -   `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Phase 2: Vercel Setup
- [ ] **Import Project:** Connect GitHub repository to Vercel.
- [ ] **Configure Vars:** usage: Copy/Paste local `.env` values into Vercel UI.
- [ ] **Deploy Branch:** Push to `main` to trigger the first deployment.

### Phase 3: Post-Launch Verification
- [ ] **Edge Function Check:** Test the `submitLead` action on the live URL. Verify it talks to Supabase correctly.
- [ ] **Custom Domain:** Configure `www.axispremiercare.com` (or similar) + SSL.

## 3. Future-Proofing
*   **Analytics:** Enable "Vercel Analytics" (Web Vitals) for performance tracking (Privacy-friendly).
*   **Speed Insights:** Monitor actual user load times (LCP/FID).
