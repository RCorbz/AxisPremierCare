## Overview

This document outlines the design and implementation of the AXIS Premier Care website. It is not just a "website" but a high-performance **Concierge Interface** built with React and Tailwind CSS. The application serves as the exclusive "front door" for a mobile chiropractic service, designed to feel like a **"Black Card"** membership experience—frictionless, elite, and secure.

## Product Roadmap
> [!IMPORTANT]
> The strategic roadmap, including HIPAA compliance, integrations, and milestones, is maintained in [ROADMAP.md](./ROADMAP.md).

## Project Details

*   **Framework:** React (Vite)
*   **Language:** JavaScript/TypeScript
*   **Styling:** Tailwind CSS (Strict "Matte Black" & "Electric Volt" scheme)
*   **Icons:** `lucide-react`
*   **Requirements:** Mobile-first (iPhone 15 optimized), SPA architecture.

### Design and Style ("The Black Card Protocol")

The aesthetic is **Performance Luxury**. It is not "medical" (cold, sterile) nor "tactical" (aggressive, chaotic). It is **Precision**.

*   **Color Palette:**
    *   `matte-black`: `#121212` (Infinite Depth Background)
    *   `charcoal-grey`: `#1C1C1C` (Surface Layers)
    *   `electric-volt`: `#CCFF00` (The "Go" Signal - Buttons/Icons)
    *   `silver-text`: `#A3A3A3` (Secondary Information)
*   **Typography:** `Inter` (Clean, Modern, Universal).
*   **UX Philosophy:** **Progressive Disclosure.**
    *   The user is intelligent. Do not overwhelm them.
    *   Initial view is minimal: **Hero + Request Access**.
    *   Details ("Why?", "How?", "Perks") are hidden behind an optional "Explore Protocol" interaction.

### Communication & Tone Guardrails (CRITICAL)

*   **VOICE:** "Performance Concierge".
    *   *Do/Say:* "Request Access", "Reserve", "Protocol", "Optimization", "Unauthorized".
    *   *Don't/Say:* "Book Now", "Schedule Appointment", "Cracking", "Insurance", "Sorry".
*   **TONE:** Respectful, High-Status, Frictionless.
    *   *Example Error:* "Please confirm you have entered the code correctly." (Polite, firm).
    *   *Bad Error:* "Invalid Code." (Abrupt, robotic).
*   **NO BEDROOM:** The environment must be clinical, professional, and elite.
*   **NO INSURANCE:** This is a cash-pay, premium service. No insurance logos.

### Implemented Features

*   **Hero Section:** High-impact "Unlock Your 10x Potential" positioning. Contains "Progressive Disclosure" trigger.
*   **Progressive Disclosure Layer:**
    *   *Hidden by default:* Friction Flow (The "Why"), Workflow (The "How"), Performance Club (The "Perks").
    *   *Revealed on demand:* Maintains a clean, high-end initial impression.
*   **Concierge Booking Flow (Membership Application):**
    *   **Logic:** Multi-step wizard (Access -> Identity -> Goals -> Confirmation).
    *   **Access Control:** Validates "Corporate Access Codes" (e.g., DELTA, VIP) with polite error handling.
    *   **Handoff:** Deep links to JaneApp for final scheduling (no PHI storage).
*   **Client Portal (The Data Stronghold):**
    *   **Authentication:** Firebase Phone Auth (SMS) for secure, password-less login.
    *   **Dashboard:** Modular cards (`StatusCard`, `MissionFilesCard`, `IntelCard`).
    *   **Data Linkage:** `JaneService` (Mock) simulates appointment lookup.
*   **Footer:** Minimalist, polite, includes "Region" and "Contact" info.

## Development Plan

The following steps were taken to build and refine the application:

1.  **Initial Setup:** The project was initialized as a React application with Tailwind CSS.
2.  **Component Development:** The application was built out with a series of components, each corresponding to a specific section of the website.
3.  **Styling and Theming:** The "black card" aesthetic was implemented using a custom color palette and Tailwind CSS utility classes.
4.  **Troubleshooting and Refinement:** A series of issues were identified and resolved, including:
    *   Incorrect file references and conflicting `jsx`/`tsx` files.
    *   An outdated Node.js version, which was resolved by updating the `.idx/dev.nix` file.
    *   A blank white screen caused by an incorrect script reference in `index.html`.
5.  **Strategic Pivot (HIPAA & Roadmap):**
    *   Established "Stateless" architecture (No PHI storage).
    *   Created `ROADMAP.md` as the strategic source of truth.
    *   Separated "Individual" vs. "Corporate" onboarding flows to support different pricing tiers.
    *   Activated "Fallback Protocol" for JaneApp integration (Deep Linking vs. API Write).

After resolving these issues and implementing the strategic pivot, the application now serves as a secure, high-end "front door" to the JaneApp ecosystem.