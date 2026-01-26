**Status:** ACTIVE
**Directive:** "Industrial Luxury" / "Precision Rebellion"

## 1. Visual Identity
**Philosophy:** "The Status Quo is Broken."
* **Aesthetic:** Brutalist minimalism. Large typography, absolute contrast, mathematical precision.
* **Vibe:** Think "Cyberpunk High-Fashion" or "High-End Architectural Firm."
* **UI Patterns:**
    * **Borders:** Thin, razor-sharp lines (1px). No soft shadows.
    * **Corners:** Square (0px radius) or slightly chamfered. No round bubbles.
    * **Motion:** Instant. No "fade ins." Things snap into place.

## 2. Color Palette (The "Black Ops" Standard)
**Concept:** A void of darkness with a laser of energy.
* **Primary (Canvas):** `#09090B` (Rich Carbon Black - The Void)
* **Secondary (Surface):** `#18181B` (Zinc 900 - The Structure)
* **Accent (The Disruptor):** `#FACC15` (Electric Yellow - Hazard/Industrial)
    * *Usage:* Use sparingly for primary actions (Buttons) and critical status dots.
* **Text:** `#FFFFFF` (Pure White - Uncompromising clarity)
* **Muted:** `#71717A` (Zinc 500 - For technical details)

## 3. Typography
* **Headings:** **Geist Mono** or **JetBrains Mono**. Uppercased & Wide tracking.
    * *Style:* `font-mono tracking-widest uppercase`
* **Body:** **Inter**. Clean, legible, high-contrast.

## 4. Logo Concept: "The Breaker"
**Symbolism:** Breaking the Status Quo.
* **Geometry:** A perfect, thin-line circle representing the "Industry Container."
* **The Axis:** A sharp, architectural letter "A" that originates inside but clearly **pierces and breaks** the perimeter of the circle at the top.
* **Trait:** The "A" is not messy; it is a precision instrument. It looks like a vector diagram or a schematic.

## 5. UI Components (Tailwind Specs)
* **Primary Button:** `bg-yellow-400 text-black font-bold uppercase tracking-wide hover:bg-yellow-500 rounded-none`
* **Card:** `bg-zinc-900 border border-zinc-800 rounded-sm`
* **Input Field:** `bg-black border border-zinc-700 focus:border-yellow-400 rounded-none text-white`
