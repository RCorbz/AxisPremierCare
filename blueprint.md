# AXIS Performance Care - Blueprint

## Overview

This document outlines the design and implementation of the AXIS Performance Care website, a single-page application built with React and styled with Tailwind CSS. The application showcases the services of a mobile chiropractic business, emphasizing a "black card" aesthetic that is both modern and exclusive.

## Product Roadmap
> [!IMPORTANT]
> The strategic roadmap, including HIPAA compliance, integrations, and milestones, is maintained in [ROADMAP.md](./ROADMAP.md).

## Project Details

*   **Framework:** React (Vite)
*   **Language:** JavaScript/TypeScript
*   **Styling:** Tailwind CSS (Critical for Black Card hex codes)
*   **Icons:** `lucide-react`
*   **Requirements:** Mobile-first (iPhone 15 optimized), SPA architecture.

### Design and Style

The website's design is guided by a "black card" aesthetic, characterized by a dark color palette and a clean, minimalist layout. The following styles have been implemented:

*   **Color Palette ("Black Card" Theme):**
    *   `matte-black`: `#121212` (Background)
    *   `charcoal-grey`: `#1C1C1C` (Cards/Sections)
    *   `electric-volt`: `#CCFF00` (Accent - Buttons/Icons)
    *   `silver-text`: `#A3A3A3` (Body)
    *   *Note: Replaced old Blue/Cyan palette with strict Matte Black/Volt.*
*   **Typography:** The `Inter` font is used throughout the site to ensure a clean and readable experience.
*   **Layout:** The application is structured as a single-page layout with multiple sections, each designed to be visually distinct and informative.

### Brand Guardrails (CRITICAL)

*   **NO BEDROOM:** The environment must be clinical, professional, and elite. Avoid any imagery or layout that suggests a home bedroom setting.
*   **NO INSURANCE:** This is a cash-pay, premium service. Do not include insurance logos, "insurance accepted" badges, or typical medical insurance language.

### Implemented Features

*   **Hero Section:** A full-screen hero section with a background image and a prominent call-to-action button.
*   **Friction vs. Flow:** A section that contrasts the traditional chiropractic experience with the convenience of AXIS Performance Care.
*   **How It Works:** A step-by-step guide to the service, presented in a clear and concise manner.
*   **Membership Privileges:** A section that highlights the exclusive benefits of membership.
*   **Concierge Booking Flow (Membership Application):** A custom "Vetting Wizard" component that replaces standard contact forms.
    *   **Logic:** Includes "Corporate Access Code" validation (e.g., VIP/DELTA) to route to subsidized JaneApp URLs.
    *   **Stateless:** No PHI stored. Handoff is via Deep Link to JaneApp.
*   **Footer:** A footer with contact information and links to additional resources.

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