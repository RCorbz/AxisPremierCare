# Product Roadmap: AXIS Premier Care Ecosystem

## Strategic Philosophy: "The Invisible Interface"
The goal is to create a "Black Card" experience where the technology feels magical and invisible. We will use a **"Stateless & Headless"** architecture to minimize HIPAA liability while maximizing brand control.

---

## ⚔️ The Separation of Powers (Responsibility Matrix)
*Guideline: Use JaneApp for the heavy lifting (Truth). Use Custom Webapp for the experience (Vibe).*

| Feature Area | **Custom Webapp (The Face)** | **JaneApp (The Brain)** | **Why?** |
| :--- | :--- | :--- | :--- |
| **Scheduling** | **Availability UI:** Displays highly curated "Mission Slots". | **Booking Engine:** manages calendar logic, conflicting appointments, and staff availability. | Jane's logic is robust; we just need to make it look cool. |
| **Intake Forms** | **Data Collection:** "Black Card" styled forms. No medical jargon. Progressive disclosure. | **Storage:** The secure vault where the PDF/Data lives forever. | Jane's forms look generic. Ours feel like a vetting process. |
| **Payments** | **None.** (Data is passed through). | **Processor:** Takes the credit card, stores the token, handles Stripe compliance. | Avoids PCI liability. Jane is better at handling refunds/insurance. |
| **Medical Records** | **None.** | **System of Record:** SOAP notes, charts, history. | The Webapp should never be the "source of truth" for health data. |
| **Patient Portal** | **"The Hub":** Educational content, "After-Action" reports, loyalty perks. | **"The File Cabinet":** Raw receipt downloads, raw document access. | Jane's portal is boring. Ours keeps them engaged with the brand. |
| **Messaging** | **Notifications:** "Mission" reminders via SMS/Email (Branded). | **Compliance:** Secure detailed clinical messaging if needed. | Our messages are about *brand relationship*; Jane's are about *logistics*. |

---

## 🏗️ Phase 1: Brand & "Concierge" Booking (MVP)
**Goal:** Launch the "Black Card" marketing site with a seamless handoff to booking.
**Status:** In Progress

### Milestones
- [x] **Brand Identity:** "High-End / Rebel" logo and aesthetic deployed.
- [ ] **Concierge Booking Flow:** 
    - Instead of a generic "Book Now" button, implement a "Membership Application" style flow.
    - **Integration:** "Soft" Integration with JaneApp.
        - *Mechanism:* Custom React forms for pre-qualification -> Deep link to JaneApp specific treatment URL with pre-filled parameters.
- [ ] **Mobile Optimization:** "Command Center" Navbar implemented.

### 🧱 Technical Foundation
- **SPA Architecture:** React + Vite (Fast, responsive).
- **Hosting:** Vercel (Native Next.js support, Edge Network).
- **Analytics:** Privacy-first analytics (no cookies/tracking of health data).

### 🚦 Exit Triggers (to move to Phase 2)
1.  **UX Signature:** Users report the site feels "exclusive" (CX Testing).
2.  **Conversion:** >5% of visitors click "Deploy" (Booking).
3.  **Speed:** Site loads in <1.5s on 4G.

### 3. Payment & Ledger ("The Vault")
- **Strategy:** Leverage JaneApp's native Stripe/Payfirma implementation to avoid PCI compliance scope on our end.
- **Implementation:** 
    - **Booking Deposit:** Required "Skin in the game" deposit taken via JaneApp widget during booking.
    - **Final Settlement:** Card-on-file processed by Dr. Hanson via JaneApp at the end of the visit.
- **Why:** Keeps financial data out of our custom webapp, reducing liability.

---

## 🔒 Phase 2: Communications Automation (OpenPhone)
**Goal:** Establish direct, high-value communication channels without a complex portal.

### 1. The "Hotline" (Client Experience)
- **Objective:** Direct line to the "Command Center" via OpenPhone.
- **Features:**
    - **"Concierge Access":** Members get a dedicated VIP number.
    - **Protocol Updates:** automated texts for appointment reminders (via Jane) or manual follow-ups.

### 2. Best Practices & Architecture (Intake)
1.  **The "Hot Potato" Pattern:** 
    - We collect data in the browser (React).
    - We toss it immediately to a secure middleware (Supabase Edge Functions).
    - Middleware pushes it to JaneApp (via API or Secure Email parsing).
    - **CRITICAL:** We immediately *delete* the data from our middleware.

---

## 🧠 Phase 3: Clinical Ops & Automation (SOAP & Follow-Up)
**Goal:** Automate the clinical workflow and post-care loop.

### 1. SOAP Notes (ScribeAI Integration)
- **Workflow:** 
    - ScribeAI listens and drafts the note.
    - **Integration:** The draft note is pushed to the "Drafts" folder in JaneApp for Dr. Hanson's final sign-off.
    - **Our App's Role:** Provide the "Start Encounter" button that triggers ScribeAI and pre-fills patient context.

### 2. Follow-Up Automation ("The After-Action Report")
- **Trigger:** Appointment marked "Complete" in JaneApp.
- **Action:** 
    - Our middleware detects the status change.
    - Sends a branded "After-Action Report" email/SMS to the patient.
    - Content: Summary of treatment, specific rehab videos (dynamically selected based on SOAP tags), and "Re-Deploy" booking link.

### 🚦 Exit Triggers
1.  **Security Audit:** Third-party or internal review confirms no PHI retention.
2.  **Integration Success:** 100% of test intakes appear correctly in JaneApp.

---

## 🧠 Phase 3: The Clinical Co-Pilot (ScribeAI Integration)
**Goal:** Automate the "drudgery" of documentation for the provider.

### Integration Strategy
Since ScribeAI handles the "listening," our app focus is **Workflow Orchestration**.
1.  **The "Pre-Flight" Brief:** Before the patient arrives, our app pulls the "Intake Summary" from Phase 2 and presents a 3-bullet summary to the doctor.
2.  **Scribe Link:** Universal "Start Note" button that deep-links into the ScribeAI app context.

### Milestones
- [ ] **Provider Dashboard:** A specialized view for Dr. Hanson.
- [ ] **JaneApp Read-Access:** Verify we can pull *upcoming appointments* from JaneApp API to populate the dashboard.

### 🚦 Exit Triggers
1.  **Time Savings:** Proven reduction of 3+ minutes per patient interaction during beta testing.

---


---

## 🌩️ Critical Blindspots & Mitigations (Risk Assessment)

### 1. Communication Silos (Blindspot)
*Risk:* OpenPhone and JaneApp don't talk to each other automatically.
*   **Mitigation:** Use the Admin Dashboard to surface JaneApp data and provide "Click-to-Dial" deep links into OpenPhone, acting as the bridge.

### 2. The "API Wall" (Technical Risk)
*Risk:* JaneApp's API might be "Read-Only" for certain critical functions (e.g., specific Intake Form fields or "Draft Note" creation).
*   **Mitigation (Fallback Protocol):** 
    *   **Intake:** Generate a PDF in the middleware and email it to the clinic's secure "Ingest" address (JaneApp often supports email-to-chart).
    *   **Notes:** If we can't push a draft note, we build a Chrome Extension for Dr. Hanson that "Teleports" (copy-pastes) the generated text into the JaneApp text box with one click.

### 3. ScribeAI Integration Variance (Operational Risk)
*Risk:* ScribeAI is a third-party tool. If they change their API or deep-link structure, the "Start Note" button breaks.
*   **Mitigation:** Do not build deep dependency. Keep the integration "loosely coupled" (just a link launch) initially until their API is proven stable.

## 🛠️ Immediate "Next Actions" (The Sprint)
1.  **JaneApp Recon:** ✅ **COMPLETE:** Confirmed NO Public API. (Fallback Protocol Active).
2.  **Concierge Booking Flow:** Design the "Membership Application" logic.
    -   *Goal:* Create the pre-qualification wizard that leads to the JaneApp Deep Link.
    -   *Tech:* React State Machine for "Application" steps.

### Deferred / Polish
-   **Navbar Finalization:** "Command Center" concept moved to UI Polish phase.

- [ ] **Phase 2: Communications (OpenPhone)**
    -   **Goal:** Direct line established.
    -   **Setup:** OpenPhone workspace configured with "Concierge" numbers.
    -   **Integration:** "Click-to-Dial" links added to Admin Dashboard.

## 🚀 Phase 3: Pre-Launch Polish (The "Go Live" Checklist)
-   [ ] **Codebase Audit:** Review for modularity, unused code, and hardcoded strings.
-   [ ] **CX Refinement:** Ensure all loading states and error messages are "Premium".
-   [ ] **Configuration:** Swap JaneApp placeholders with real URLs.
-   [ ] **Analytics:** Implement privacy-first analytics.
-   [ ] **Deployment (Vercel):**
    -   [ ] **Project Setup:** Import repository to Vercel.
    -   [ ] **Environment:** Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
    -   [ ] **Domain:** Configure custom domain & SSL.
