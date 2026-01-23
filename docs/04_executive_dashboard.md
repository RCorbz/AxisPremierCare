# Executive Dashboard Architecture (Command Center)

## Overview
The **Command Center** is the central nervous system for Axis Premier Care's business operations. It provides a "God Mode" view of the business, balancing strategic oversight with tactical execution. It is designed for Executive Leadership (Doctors/Owners) to make data-driven decisions in seconds.

**Access Key:** `AXIS-CMD` (Hardcoded MVP via `sessionStorage`)

## Core Philosophy
*   **Mobile-First Executive View:** Tabbed interface for quick status checks on the go.
*   **Stoplight Health System:** Every major vertical (Strategy, Financials, Ops) has a Red/Yellow/Green status indicator for instant "Health Check".
*   **Franchise Scalability:** Built-in Location Selector allows pivoting data views between Global Ops and specific Markets (HQ vs. Expansion).

---

## Component Architecture

### 1. Global Header & Controls
*   **Location Selector:** Filters all downstream widgets.
    *   *Logic:* Filters Firestore dataset by Zip Code ranges (e.g., Park City >= 84060).
*   **System Status:** Live clock and system health indicator.
*   **Tools:**
    *   **Seed Data:** Injection tool for testing.
    *   **Lock:** Instant session termination.

### 2. Strategy Tab (Growth & Reach)
*   **Client Database (KPI):** Total unique profiles.
*   **In-Network (KPI):** Count of clients within primary service zones (low travel cost).
*   **Marketing Widget:**
    *   *Ad Spend:* Monthly burn rate.
    *   *CAC (Customer Acquisition Cost):* Efficiency metric.
    *   *Goal:* Monitor if growth is profitable.
*   **Regional Heatmap:**
    *   *Visual:* Top 5 Zip Codes by demand.
    *   *Logic:* Aggregates waitlist entries. Highlights "Prime" vs "Expansion" zones.

### 3. Financials Tab (Revenue & Value)
*   **Hard Booked Revenue:**
    *   *Metric:* 4-Week Rolling Average of confirmed appointments.
    *   *Sparkline:* Visualizes weekly trend velocity.
*   **Forecast Widget:**
    *   *MRR (Monthly Recurring Revenue):* `Retainer Clients * $500`.
    *   *Pipeline Value:* `(Acute * $2.5k) + (Retainer * $6k)`.
    *   *Conversion:* Lead-to-Member rate.
    *   *LTV:* Estimated Lifetime Value per asset.

### 4. Ops & Reputation Tab (Execution)
*   **Brand Reputation:**
    *   *Metric:* Aggregate Google Star Rating.
    *   *Recency Bias:* Visual bar chart of last 10 reviews. Critical for spotting sudden service degradations.
*   **Intake Stream:**
    *   *Feed:* Live, real-time list of incoming leads.
    *   *Tags:* `ACUTE` (Red) vs `RETAINER` (Blue).
    *   *Action:* Immediate status check on inflow.

---

## Data Architecture (Recreation Guide)
If the dashboard becomes corrupted, recreate using this logic:

**Firebase Collection:** `waitlist`
**Key Fields:**
*   `name` (string)
*   `goal` ("pain" | "maintenance")
*   `zip` (string)
*   `outOfArea` (boolean)
*   `timestamp` (serverTimestamp)

**Calculated Fields:**
*   **MRR:** `count(goal == "maintenance") * 500`
*   **Pipeline:** `count(pain) * 2500 + count(maintenance) * 6000`
*   **Recency Bias:** Requires integration with Google Places API (currently simulated in `ReputationWidget`).

## Future Roadmap (AI Integration)
*   **Patient Intelligence:** NLP analysis of "Chief Complaint" fields to determine market trends (e.g., "70% of Park City leads mention 'Ski Injury'").
*   **Efficiency Ratio:** `Avg Care Time / Avg Travel Time`. Requires integration with Scheduling API + Google Maps API.
