Design Language: "The Executive Suite"
Vibe: Clean, sterile, premium medical. Whitespace, subtle shadows, "Inter" font.
Reference: Think "Tesla App" or "Oura Ring Dashboard," not "Spreadsheet."

Section A: The "Morning Snapshot" (API Powered)
Instead of static buttons, these are Live Data Cards.

Card 1: The Schedule Pulse
Data Source: Jane App API (GET /appointments?date=today).
Display: Large Typography. "8 Appointments Remaining."
Visual: A subtle progress ring showing % of day complete.
Action: Button "Open Schedule" (Deep link to Jane).

Card 2: The Revenue Dial
Data Source: Jane App API (GET /reports/sales?range=month).
Display: "$12,450" (Month to Date).
Subtext: "+15% vs Last Month" (Calculated locally).
Action: Button "Financials" (Deep link to Jane Billing).

Section B: The "Waiting Room" (Supabase Data)
Display: The "Leads" table we designed previously.
UX Upgrade: Add "Badges" for status.
New = Green Pulse Dot.
Contacted = Gray Badge.

Section C: The "Vibe Check" (The Journal)
Remains the same (Input form for sentiment).

Developer Implementation Note
API Strategy: Use Next.js "Server Actions" to fetch Jane data on page load. Cache the result for 5 minutes to prevent rate-limiting.
Error Handling: If Jane API fails, the card should gracefully show "Schedule Available in Jane" (do not show a 500 error).
