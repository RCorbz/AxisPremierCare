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
- **Hosting:** Firebase Hosting (scalable, secure headers).
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

## 🔒 Phase 2: The Data Stronghold (HIPAA, Intake & Portal)
**Goal:** Collect intake data securely and provide a "Member" home base.

### 1. The "Black Card" Portal (Client Experience)
- **Objective:** A dedicated "Member Area" accessed via OTP (One-Time Password/Phone).
- **Features:**
    - **"Intel" Library:** Exclusive protocols/videos unlocked after the first visit.
    - **Upcoming Missions:** Appointment reminders and "Pre-Game" prep checklists.
    - **Payment History:** Read-only view of past invoices (pulled via JaneApp API).

### 2. Best Practices & Architecture (Intake)
1.  **The "Hot Potato" Pattern:** 
    - We collect data in the browser (React).
    - We toss it immediately to a secure middleware (Firebase Cloud Functions).
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

### 1. The "Identity Gap" (Blindspot)
*Risk:* A user logs into our "Black Card" portal with their phone number (Firebase Auth). JaneApp knows them as `Patient ID: 12345`. How do we link these two without storing PHI?
*   **Mitigation:** Create a "Linkage Table" in Firestore that *only* stores `{ firebase_uid: "abc", jane_patient_id: "123" }`. This is non-PHI data but allows us to fetch their specific records from JaneApp API on demand.

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

## 🚀 Pre-Launch Polish (The "Go Live" Checklist)
-   [ ] **Configuration:** Swap all JaneApp placeholder Deep Links with Dr. Hanson's real live URLs.
-   [ ] **Analytics:** Implement privacy-first analytics to track the "5% Conversion" metric.
-   [ ] **Domain:** Connect custom domain and SSL.
