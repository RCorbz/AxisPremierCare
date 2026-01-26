# Axis Premier Care Webapp - Blueprint

## Overview
**Axis Premier Care (v1.0)** is a high-performance "Marketing Engine" and "Executive Command Center" for a mobile chiropractic service.
*   **Philosophy:** "The Axis OS" - A "Glass Cockpit" for the Doctor.
*   **Aesthetic:** "Industrial Luxury" / "The Breaker" (Brutalist, Dark Mode, Electric Yellow).
*   **Core Goal:** A unified dashboard that aggregates data but relies on deep links for heavy lifting available at `/admin`.

## Architecture ("The Lean Stack")
*   **Frontend:** Next.js 14.2 (App Router) *Downgraded due to Node 20.7 constraint*.
*   **Database:** Supabase (PostgreSQL) for `leads` and `sentiment`. **NO PHI**.
*   **Auth:** Supabase Auth (Admin/Doctor Only).
*   **Integrations:** Jane App API (Read-Only), OpenPhone (Deep Links).

## Design System ("The Breaker")
*   **Colors:**
    *   Canvas: Carbon Black `#09090B`
    *   Surface: Zinc 900 `#18181B`
    *   Accent: Electric Hazard Yellow `#FACC15`
    *   Text: Pure White `#FFFFFF`
*   **Typography:** `Geist Mono` or `JetBrains Mono` (Headers), `Inter` (Body).
*   **UI Rules:** 0px Border Radius (Sharp), 1px Borders, Instant Motion.

## Components & Routes
1.  **Public Site (Marketing)**
    *   **Waitlist Form:** Saves to Supabase `leads`.
    *   **Manifesto:** "Human Performance Engineering" copy.
2.  **Admin Dashboard (`/admin`)**
    *   **Live Pulse:** "Appointments Today", "Revenue MTD" (via Jane API).
    *   **Waiting Room:** `leads` table with "New/Contacted" status text.
    *   **Vibe Check:** Weekly sentiment log form.

## Data Model (Supabase)
### `leads`
*   `id`: UUID
*   `created_at`: Component
*   `full_name`, `email`, `phone`: Text
*   `interest_level`: Check ('High', 'Medium', 'Low')
*   `status`: Check ('New', 'Contacted', 'Converted', 'Archived')
*   `notes`: Text
    *   *RLS:* Public Insert, Admin View/Update.

## Security Constraints
*   **NO PHI** in Supabase.
*   **NO Patient Login**.
*   **NO Firebase** (Supabase Only).

## Compliance & Departures
*   **Next.js Version:** Running v14.2.14 instead of latest v15/16.
    *   *Justification:* Local environment runs Node 20.7.0; newer Next.js requires >=20.9.0.
*   **ESLint/PostCSS:** Versions pinned to match Next.js 14 compatibility.