# Design System Strategy: The Elevated Nautical Editorial

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Maritime Curator."** 

This is not a standard "beachy" restaurant website. It is a high-end digital flagship that mirrors the experience of being aboard a luxury vessel. We reject the rigid, boxy constraints of standard web grids in favor of an **Editorial Fluidity**. By using intentional asymmetry, overlapping high-fidelity imagery, and dramatic typographic scales, we create an experience that feels curated rather than templated. This system moves away from "functional utility" toward "sensory atmosphere."

## 2. Color Palette & Atmospheric Depth
Our palette is rooted in the deep sea and the sun-drenched deck. We use color not just for branding, but to define the physical architecture of the interface.

### The Palette
*   **Primary (Deep Royal Blue):** `#002451` / `#1A3A6B`. Used for deep immersion and grounding the user.
*   **Secondary (Nautical Gold):** `#795900` / `#D4A843`. Reserved for high-intent actions and "Signature" details.
*   **Surface/Neutral (Sand & Cream):** `#fef9f1` to `#F5F0E8`. The canvas that provides warmth and breathability.

### The "No-Line" Rule
To maintain a premium feel, **1px solid borders are strictly prohibited for sectioning.** Structural boundaries must be defined solely through:
1.  **Tonal Shifts:** Transitioning from `surface` to `surface-container-low` (`#f8f3eb`).
2.  **Wave Dividers:** Use the custom SVG "Soft Wave" dividers to transition between high-contrast sections (e.g., transitioning from a Deep Blue hero to a Sand-colored menu).

### Surface Hierarchy & Nesting
Treat the UI as a series of floating decks. Instead of flat layouts, use the Surface scale to create organic depth:
*   **Base:** `surface` (`#fef9f1`) for the main page background.
*   **Elevated Containers:** Use `surface-container-low` (`#f8f3eb`) for secondary content blocks.
*   **Signature Cards:** Use `surface-container-lowest` (`#ffffff`) to create a "lifted" paper effect against darker backgrounds.

### Signature Textures: The Ocean Gradient
For primary CTAs and major section backgrounds, avoid flat color. Use a subtle linear gradient: `primary` (`#1A3A6B`) to `primary-container` (`#002451`) at a 135-degree angle. This mimics the shifting depth of deep water.

## 3. Typography
The typographic system is a dialogue between three distinct voices: Heritage, Art Deco Sophistication, and Modern Clarity.

*   **Display & Headlines (Playfair Display):** Our "Voice of Luxury." Use `display-lg` (3.5rem) with wide tracking for titles. This font should never be crowded; give it significant `16` or `20` spacing scale breathing room.
*   **Subtitles (Josefin Sans):** The "Art Deco Geometric" accent. Use this for category headers or short, punchy descriptors. It provides the architectural structure of the nautical theme.
*   **Body (Inter):** The "Invisible Functionalist." All functional information, descriptions, and UI labels must use Inter to ensure maximum legibility against complex nautical illustrations.

## 4. Elevation & Depth
In this design system, we do not use shadows to create "pop." We use layering to create "presence."

*   **Tonal Layering:** Depth is achieved by "stacking." A `surface-container-lowest` card placed on a `surface-dim` background creates a natural, soft-touch lift.
*   **Glassmorphism (The Frosted Lens):** For navigation bars and floating reservation widgets, use the "Glass" rule: `background: rgba(255, 255, 255, 0.4)`, `backdrop-blur: 20px`, and a **Ghost Border** (a `0.5px` border using `outline-variant` at 20% opacity). This simulates a view through a luxury porthole or high-end glassware.
*   **Ambient Shadows:** If a card must float (e.g., a "Book a Table" modal), use an ultra-diffused shadow: `box-shadow: 0 20px 50px rgba(29, 28, 23, 0.05)`. It should be felt, not seen.

## 5. Component Guidelines

### Buttons (The Signature CTA)
*   **Primary:** Deep Royal Blue background with Nautical Gold text. Shape: `md` (0.375rem) roundedness. 
*   **Secondary:** Ghost style. Transparent background with a `secondary` (`#D4A843`) border at 30% opacity.
*   **Interaction:** On hover, the Nautical Gold should subtly "glow" (increase opacity/saturation), never change color entirely.

### Cards (The Menu & Experience Cards)
*   **Constraint:** No borders, no hard dividers.
*   **Structure:** Use vertical spacing (`spacing-8` or `spacing-10`) to separate the title from the body. 
*   **Illustration Integration:** Thin gold line illustrations (octopus, lobster) should "break the frame" of the card, partially overlapping the edge to create an artisanal, non-digital feel.

### Input Fields
*   **Style:** Minimalist underline or soft-tinted background (`surface-container-high`).
*   **Focus State:** Transition the underline to Nautical Gold. Avoid the default blue focus rings.

### Navigation
*   **The Floating Bar:** Always use the Glassmorphism effect. The nav should feel like it is floating above the "waves" of the content.

## 6. Do’s and Don’ts

### Do:
*   **Embrace White Space:** Use the large end of the spacing scale (`20`, `24`) to separate major story-telling sections.
*   **Use Intentional Asymmetry:** Offset an image of a dish to the left, while the Playfair Display headline sits slightly lower to the right.
*   **Layer Illustrations:** Place thin gold nautical illustrations behind text elements at 15% opacity to add "soul" to the background.

### Don't:
*   **Don't use "Generic" Dividers:** Never use a horizontal grey line to separate content. Use a `surface` color shift or a `soft wave` divider.
*   **Don't Overuse Gold:** Gold is the jewelry of the site. If everything is gold, nothing is premium. Use it only for icons, CTAs, and thin illustrations.
*   **Don't use "Hard" Corners:** Avoid `none` roundedness. Use `sm` or `md` to mimic the smoothed surfaces of a ship's deck.