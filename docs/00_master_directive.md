**Project:** Axis Premier Care Webapp v1.0
**Status:** ACTIVE - "Glass Cockpit" & "Industrial Luxury"
**Effective Date:** Jan 2026

## ⚠️ CRITICAL INSTRUCTION FOR AI/DEV
This document serves as the **Single Source of Truth**.
**IMPORTANT:** Any previous instruction referencing Firebase, Patient Logins, or Soft/Medical Aesthetics is **DEPRECATED**.
**STRICT CONSTRAINT:** Do not suggest or implement features that contradict this file.

---

## 1. The Core Philosophy: "The Axis OS"
We are building a **Marketing Engine** and an **Executive Command Center**.
* **The Vibe:** "Human Performance Engineering." We are not a standard clinic; we are a high-tech movement.
* **The UX Goal:** "Glass Cockpit." The dashboard aggregates data from external tools (Jane App) to look like a unified OS, but relies on deep links for actual heavy lifting.
* **The "Not Like Us" Factor:** We reject the status quo of "soft, blue, sterile" medical design. We embrace "dark, precision, industrial" design.

---

## 2. Technical Architecture (The "Lean" Stack)
* **Frontend:** Next.js (App Router) via Antigravity Boilerplate.
* **Database:** Supabase (PostgreSQL).
    * *Usage:* Stores 'Leads' (Waitlist) and 'Sentiment Logs' only.
    * *Constraint:* **NO PHI (Protected Health Information)** is to be stored in Supabase.
* **Auth:** Supabase Auth.
    * *Scope:* **ADMIN ONLY** (Doctor/Staff). Patients do **NOT** log into this app.
* **Integrations:**
    * **Jane App API:** Used strictly for **Read-Only Data Fetching** (e.g., "Get Revenue Today"). We do not write data back to Jane via API.
    * **OpenPhone:** Deep links or manual usage only. No API integration for v1.0.

---

## 3. The "Glass Cockpit" Dashboard Spec
**Route:** `/admin` (Protected)
The dashboard must act as the "Morning Routine" screen for the Doctor.

### Section A: The Live Pulse (Jane App API)
* **Visual:** High-visibility data cards.
* **Data Point 1:** "Appointments Today" (Fetch from Jane).
* **Data Point 2:** "Revenue MTD" (Fetch from Jane).
* **Fallback:** If API fails, show "Jane System Active" with a link, rather than a crash.

### Section B: The Waiting Room (Supabase)
* **Visual:** A data table of the `leads` table.
* **Actions:** Status badges ("New", "Contacted"). Simple "Mark as Contacted" button.

### Section C: The Vibe Check (Supabase)
* **Visual:** A minimal input form for the Doctor to log a weekly subjective score (1-10) and journal entry.

---

## 4. Design Directive: "The Breaker"
**Reference:** See `03_design_system.md` for full hex codes.
* **Aesthetic:** **Brutalist / Industrial Luxury.**
* **Color Mode:** **DARK MODE ONLY.**
    * Background: Carbon Black (`#09090B`).
    * Accent: Electric Hazard Yellow (`#FACC15`).
* **Geometry:**
    * **0px Radius** on all cards and buttons. Sharp corners.
    * **Monospace Fonts** (`Geist Mono` / `JetBrains Mono`) for headers and data.
* **Motion:** Instant. Snappy. No soft fades.

---

## 5. Negative Constraints (The "Don'ts")
1.  **NO Firebase:** Do not install `firebase-admin` or related packages. Use Supabase.
2.  **NO Patient Portal:** Do not build a "My Profile" for patients. Link them to the Jane Portal.
3.  **NO Scheduling Logic:** Do not build a calendar booking system. Link the "Book Now" button to the Jane Booking URL.
4.  **NO Soft Design:** Do not use blues, teals, or rounded buttons. If it looks like a standard SaaS, it is wrong.

---

## 6. Definition of Done (v1.0)
The project is ready for launch when:
1.  **Public Site:** A visitor can read the "Manifesto" and join the Waitlist (saving to Supabase).
2.  **Admin Site:** The Doctor can log in, see the Jane App stats (via API), manage the Waitlist, and log a Sentiment entry.
3.  **Design:** The app perfectly matches the "Breaker" Dark Mode aesthetic.
