---
name: E.F.O. Ltda.
description: Energía y Fuerza del Oriente. The night forecourt where fuel and electricity meet; «ENERGÍA QUE MUEVE BOLIVIA».
colors:
  forecourt-night: "#031F36"
  forecourt-night-2: "#04284A"
  forecourt-night-3: "#0A3459"
  footer-night: "#021829"
  canopy-blue: "#063B66"
  canopy-blue-top: "#074272"
  light-line-cyan: "#00AEEF"
  stamp-cyan-text: "#7FD6F7"
  energy-green: "#39A935"
  energy-green-deep: "#23781F"
  bolivia-gold: "#D5A928"
  signage-white: "#FFFFFF"
  shop-day: "#F1F5F9"
  shop-day-2: "#E3EBF2"
  ink: "#031F36"
  ink-2: "#33536E"
  mist: "#A9C2D6"
  mist-2: "#7F9DB5"
  hero-lead: "#D4E3EF"
  field-border: "#C5D3DF"
  field-bg: "#FBFDFE"
  error-red: "#B42318"
  success-bg: "#E6F6E5"
  success-ink: "#14501A"
typography:
  display:
    fontFamily: "Manrope, Segoe UI, system-ui, -apple-system, Arial, sans-serif"
    fontSize: "clamp(2.6rem, 6.6vw, 5.6rem)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Manrope, Segoe UI, system-ui, -apple-system, Arial, sans-serif"
    fontSize: "clamp(2rem, 4.6vw, 3.7rem)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Manrope, Segoe UI, system-ui, -apple-system, Arial, sans-serif"
    fontSize: "clamp(1.35rem, 2.2vw, 1.75rem)"
    fontWeight: 800
    lineHeight: 1.12
    letterSpacing: "-0.01em"
  lead:
    fontFamily: "Manrope, Segoe UI, system-ui, -apple-system, Arial, sans-serif"
    fontSize: "clamp(1.08rem, 1.5vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Manrope, Segoe UI, system-ui, -apple-system, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Manrope, Segoe UI, system-ui, -apple-system, Arial, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.06em"
  label-micro:
    fontFamily: "Manrope, Segoe UI, system-ui, -apple-system, Arial, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 800
    letterSpacing: "0.14em"
rounded:
  stamp: "4px"
  cell: "6px"
  control: "8px"
  card: "10px"
  pylon: "12px"
  full: "50%"
spacing:
  gutter-mobile: "20px"
  gutter: "36px"
  max-width: "1240px"
  header: "76px"
  section: "clamp(72px, 10vw, 128px)"
  section-tight: "clamp(56px, 7vw, 88px)"
  head-gap: "clamp(36px, 5vw, 56px)"
  row-gap: "8px"
components:
  button-cyan:
    backgroundColor: "{colors.light-line-cyan}"
    textColor: "{colors.forecourt-night}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 24px"
    height: "52px"
  button-cyan-hover:
    backgroundColor: "#33C1F3"
  button-whatsapp:
    backgroundColor: "{colors.energy-green}"
    textColor: "{colors.forecourt-night}"
    rounded: "{rounded.control}"
    padding: "0 24px"
    height: "52px"
  button-whatsapp-hover:
    backgroundColor: "#4CC248"
  button-line:
    backgroundColor: "rgba(3, 31, 54, 0.3)"
    textColor: "{colors.signage-white}"
    rounded: "{rounded.control}"
    padding: "0 24px"
    height: "52px"
  button-lg:
    padding: "0 30px"
    height: "58px"
  canopy:
    backgroundColor: "{colors.canopy-blue}"
    height: "{spacing.header}"
  pylon:
    backgroundColor: "{colors.forecourt-night-2}"
    rounded: "{rounded.pylon}"
    padding: "14px"
  pylon-row:
    backgroundColor: "rgba(0, 0, 0, 0.32)"
    textColor: "{colors.signage-white}"
    rounded: "{rounded.cell}"
    height: "66px"
  stamp-concept:
    backgroundColor: "rgba(0, 174, 239, 0.08)"
    textColor: "{colors.stamp-cyan-text}"
    typography: "{typography.label-micro}"
    rounded: "{rounded.stamp}"
    padding: "5px 10px"
  stamp-executed:
    backgroundColor: "rgba(57, 169, 53, 0.1)"
    textColor: "{colors.energy-green}"
    typography: "{typography.label-micro}"
    rounded: "{rounded.stamp}"
    padding: "5px 10px"
  project-card:
    backgroundColor: "{colors.forecourt-night-2}"
    textColor: "{colors.signage-white}"
    rounded: "{rounded.card}"
  sign-plate:
    backgroundColor: "{colors.canopy-blue}"
    textColor: "{colors.signage-white}"
    rounded: "{rounded.control}"
    padding: "22px 22px 24px"
  input:
    backgroundColor: "{colors.field-bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px 14px"
    height: "52px"
  form-panel:
    backgroundColor: "{colors.signage-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "clamp(20px, 3vw, 32px)"
  whatsapp-float:
    backgroundColor: "{colors.energy-green}"
    textColor: "{colors.forecourt-night}"
    rounded: "{rounded.full}"
    size: "60px"
---

# Design System: E.F.O. Ltda.

## Overview

**Creative North Star: "The Night Forecourt"**

The site is a service station at night. A blue canopy band runs across the top with a cyan light line along its lower edge; under it, photographs are graded like lit forecourt scenes; at the side stands the price pylon, a dark panel whose rows light up one after another. Fuel and electricity share the same forecourt: cyan is the station's light and fuel, green marks anything electric, and gold appears only where Bolivia and Santa Cruz are pinned on a map. Signage is white Manrope at heavy weight in capitals, and the jump from display to label size is large on purpose.

Night is the dominant ground. Light #F1F5F9 bands are the lit shop and office interior, used only where reading is dense (about-us, conversion specs, operations, legal) and for the contact form. A single energy line runs down the page from section to section, with a ring node at each major heading. Every list of areas becomes a row of fixed cells (icon cell, label, detail), the same grammar as the pylon. Concept work is stamped so it can't be mistaken for executed work.

The build rejects the category default of a sunset hero over four floating icon cards. Areas are never shown as a card grid; they are pylon rows, ruled spec rows or signage plates.

**Key Characteristics:**
- Deep-blue night ground with a canopy fascia and a cyan light line.
- Pylon rows: fixed icon cell, uppercase label, small detail line, arrow; they light with a cyan (or green for electric) glow.
- One continuous energy line with ring nodes at section headings.
- Status stamps: dashed cyan for concept, solid green for executed.
- One icon stroke weight (1.75) across every drawn icon.
- Manrope only; 800-weight uppercase display against small tracked labels.

## Colors

A night palette of three blues with two signal lights (cyan and green) and one rare marker (gold). Light surfaces are an interior, not an alternate theme.

### Primary
- **Forecourt Night** (forecourt-night): the page ground, the hero and inner-page overlays, the dark text color on cyan and green buttons, and `ink` for text on day bands.
- **Canopy Blue** (canopy-blue, with canopy-blue-top for the top of its gradient): the header fascia, signage plates, the Bolivia map fill, and the accent color for icons, links and highlighted words on day bands.

### Secondary
- **Light-Line Cyan** (light-line-cyan): the station light. The primary button, the canopy light line, the energy line, heading nodes, pylon row glow, highlighted words in display type on night grounds, focus rings, map routes. On day grounds it is only used as a fill or ring, never as text.
- **Stamp Cyan Text** (stamp-cyan-text): lighter cyan used only for concept-stamp lettering on dark grounds, where full cyan text would be too heavy at 0.7rem.

### Tertiary
- **Energy Green** (energy-green): electricity. The electromobility pylon row, EV icons, green heading nodes (`n-g`), highlighted words in electromobility headlines, the executed-project stamp, the WhatsApp button and float. **Energy Green Deep** (energy-green-deep) is the legible variant for green headings on white.
- **Bolivia Gold** (bolivia-gold): only the Bolivia shape on the world map, the Santa Cruz point and label on the national map, and the Bolivia icon in the flow list.

### Neutral
- **Forecourt Night 2 / 3** (forecourt-night-2, forecourt-night-3): the bottom of `deep` section gradients, project card bodies, flow cells.
- **Footer Night** (footer-night): the footer ground, one step darker than the page.
- **Shop Day** (shop-day) and **Shop Day 2** (shop-day-2): day-band ground and the fills for use-chips and the map frame.
- **Ink 2** (ink-2): secondary text on day bands.
- **Mist** (mist) and **Mist 2** (mist-2): secondary and tertiary text on night (lead text, row details, captions, footer legal).
- **Hero Lead** (hero-lead): brighter secondary text over photography (hero lead, map labels, footer links).
- **Hairlines:** `rgba(169,194,214,0.16)` on night, `rgba(3,31,54,0.12)` on day. Ruled lists open with a 2px top rule in the text color.
- **Form states:** field-border, field-bg, error-red (message text; the invalid field border is #D92D20), success-bg with success-ink.

### Named Rules
**The Gold Marker Rule.** Gold marks Bolivia and Santa Cruz on maps and nothing else. It is never a button, a highlight word or a decorative fill.

**The Green Means Electric Rule.** Green belongs to electromobility, to executed work and to WhatsApp. Fuel, energy and industry rows stay cyan or blue.

**The Interior Light Rule.** Day bands (#F1F5F9) are the shop interior: only for dense reading and the form. Night stays the dominant ground on every page. On day bands, accents shift from cyan text to Canopy Blue text.

## Typography

**Display Font:** Manrope (with Segoe UI, system-ui, Arial)
**Body Font:** Manrope
**Label Font:** Manrope

**Character:** One family carries everything. Heavy uppercase Manrope works as illuminated station signage; regular-weight Manrope reads as calm corporate prose. Hierarchy comes from scale, weight and case, never from a second face.

### Hierarchy
- **Display** (800, clamp(2.6rem, 6.6vw, 5.6rem), 1.08, uppercase, -0.025em, balanced wrap): one per page, the hero or page-hero h1. A single phrase can be lit in cyan.
- **Headline** (800, clamp(2rem, 4.6vw, 3.7rem), 1.08, uppercase): section h2s, usually carrying an energy-line node. One phrase is lit: cyan on night, green in electric sections, Canopy Blue on day.
- **Title** (800, clamp(1.35rem, 2.2vw, 1.75rem), 1.12, uppercase): sub-blocks inside a section.
- **Answer** (700, clamp(1.3rem, 2.3vw, 1.75rem), 1.35, sentence case, 30ch): the one-sentence "what is E.F.O." statement on day bands, with the key phrase in Canopy Blue.
- **Lead** (400, clamp(1.08rem, 1.5vw, 1.25rem), 1.6, max 58ch, Mist on night, Ink 2 on day): the paragraph under a heading.
- **Body** (400, 1.0625rem, 1.65): running text. Legal text caps at 72ch.
- **Label** (800, 0.86–1.12rem, uppercase, 0.03–0.08em): row and card names (pylon rows, spec rows, ops, project titles, sign plates).
- **Micro label** (700–800, 0.7–0.78rem, uppercase, 0.12–0.16em): stamps, pylon cap, contact-data captions, footer column headings, nav links (0.78rem, 0.06em).

### Named Rules
**The Signage Contrast Rule.** Display runs up to 5.6rem; labels run down to 0.7rem. Keep that extreme jump: the sentence-case Answer statement is the only text that sits between them, and it appears once per page at most.

**The One Lit Phrase Rule.** A display or headline lights at most one phrase in an accent color. The rest stays white (night) or ink (day).

## Layout

Content sits in a 1240px container with a 20px gutter, widening to 36px at 768px. The fixed canopy is 76px tall, and anchor scrolling offsets for it. Sections pad by clamp(72px, 10vw, 128px), or clamp(56px, 7vw, 88px) when tight. A section head (max 760px, 18px gap) sits clamp(36px, 5vw, 56px) above its content. Split heads go to two columns (1.05fr / 0.95fr, aligned to the bottom) from 960px.

Two-column compositions (about, fuel, conversion, oriente, split, contact) switch on between 900 and 1000px with 56–72px gaps and slightly unequal fractions (1.1/0.9, 0.95/1.05). The home hero is bottom-aligned with the copy on the left and a 360px pylon column from 1024px. Below 1024px the hero photo becomes a top band and the copy and pylon stack on the night ground below it. Full nav appears from 1180px; below that, a burger opens a full-height drawer of 58px rows. Below 520px the header CTA is hidden behind the drawer.

The energy line is a 2px vertical rule (cyan into green) at the container's left edge from 1100px. It grows with scroll where scroll timelines are supported. Below 1100px it moves to 8px from the viewport edge at lower opacity, and nodes follow it.

Repeated lists use fixed-cell rows: a fixed icon column (34–64px) then text, ruled by hairlines. Image strips scroll horizontally with snap at 220px minimum per item.

## Elevation & Depth

Depth comes from light, not from paper. Surfaces are flat panels in steps of night blue. What lifts them is glow (cyan or green halos on lit rows), long soft dark drop shadows under the pylon and photos, and hairline rings (`0 0 0 1px`) instead of borders. Photographs always sit under a night gradient, so text never fights the image.

### Shadow Vocabulary
- **Lit cell, cyan** (`0 0 0 1px rgba(0,174,239,.55), 0 0 24px -4px rgba(0,174,239,.55)`): a lit, hovered or focused pylon row.
- **Lit cell, green** (`0 0 0 1px rgba(57,169,53,.6), 0 0 24px -4px rgba(57,169,53,.55)`): the same for electric rows.
- **Pylon stand** (`0 0 0 1px rgba(0,174,239,.3), 0 40px 80px -30px rgba(0,0,0,.9)`): the pylon panel (the green ring variant is used for electromobility row panels).
- **Forecourt drop** (`0 40px 80px -40px rgba(0,0,0,.9)`): photos and the concept case card.
- **Canopy** (`0 18px 40px -24px rgba(0,0,0,.8)`), plus a 3px light line with an 18px cyan glow.
- **Button lift** (`0 12px 26px -14px rgba(0,0,0,.75)`): filled buttons.
- **Hairline ring** (`0 0 0 1px` in the night or day hairline color): every card, strip tile and frame.

### Named Rules
**The Light Not Lift Rule.** State is shown by lighting a cell (glow and text-shadow), not by raising it. Only the WhatsApp float and image zooms move.

## Shapes

The geometry is engineered and gently rounded. Stamps and captions use 4px. Pylon cells, the logo plate and nav hovers use 6px. Buttons, inputs, sign plates and icon cells use 8px. Cards, photos and the form use 10px. The pylon uses 12px on top and 4px at its foot, so it reads as a standing panel on two posts. Circles are kept for heading nodes, map points and the WhatsApp float. The one recurring silhouette is the drawn chevron that joins the import-to-industry chain cells. Icons are custom 24px line drawings with a 1.75 stroke and round caps and joins. The only filled glyph is the WhatsApp mark.

## Components

### Buttons
Buttons read as solid, uppercase, signage-weight station controls.
- **Shape:** gently rounded (8px), 52px tall, 58px for large.
- **Primary (Cyan):** cyan fill, night text, 800 weight at 0.92rem, uppercase, 0.06em. Used for every «Cotizar ahora».
- **WhatsApp (Green):** green fill, night text, with the WhatsApp mark.
- **Line:** 1.5px border in white at 40% over a translucent night fill. On day bands it becomes a night-ink border at 35% and is transparent.
- **Hover / Focus / Active:** the fill brightens (#33C1F3 or #4CC248), the shadow deepens, the arrow icon slides 4px, the button presses to scale(.97). Focus is a 2px cyan outline with a 3px offset. The header button shrinks to 44px.

### Chips
- **Style:** «uses» chips are Shop Day 2 fills with ink 700-weight text at 0.84rem and a 6px radius. They are static descriptors, not filters.

### Cards / Containers
- **Corner Style:** 10px (the card radius). Sign plates use 8px.
- **Background:** project cards use Forecourt Night 2. Sign plates use the canopy gradient. Mission and vision panels are white on day. Activity cells are translucent night.
- **Shadow Strategy:** hairline ring at rest. Photos and the case card add the forecourt drop.
- **Internal Padding:** 20–28px.
- **Project card:** a 4:3 photo that zooms to 1.04 on hover, a status stamp pinned at the top left over a night chip, then an uppercase title, description and a ruled definition list (sector, location, type).

### Inputs / Fields
- **Style:** 52px minimum height, 1.5px #C5D3DF border, near-white fill, 8px radius, 1rem ink text, bold 0.86rem labels with optional parts in Ink 2.
- **Focus:** the border turns cyan and gets a 3px cyan ring at 22%.
- **Error:** a red border with a 0.82rem red message under the field. Success is a green-tinted status panel.
- The form sits on a white 10px panel and is two columns from 640px.

### Navigation
- **Canopy header:** fixed, 76px, a canopy-blue gradient with a 3px light line along the bottom that flows cyan to green over 9s. The logo sits on a white 6px plate. Nav links are 700-weight uppercase at 0.78rem in white at 86%. Hover adds a faint white wash; the current page gets a 2px cyan underline bar.
- **Mobile:** a 46px burger opens a night drawer of 800-weight uppercase rows at 1.15rem with arrows, with the current row in cyan, and full-width Cotizar and WhatsApp buttons at the bottom.
- **Footer:** Footer Night ground with a 3px cyan-to-green top rule, tracked uppercase column heads in Mist 2, and links that turn cyan on hover.

### Price Pylon (signature)
A dark gradient panel. Its cap shows «E.F.O.» on the left and «ÁREAS» on the right, above a cyan hairline. Below are four 66px rows, each with a 46px tinted icon cell, an uppercase label with a small sentence-case detail, and an arrow. On load the rows light one at a time every 520ms, then go dark; afterwards hover and focus light them. Electromobility rows are green. Two short posts stand under the panel on desktop. The same row grammar is reused, as a two-column panel with a green ring, for the electromobility offer list.

### Status Stamp (signature)
A 0.7rem, 800-weight, 0.14em uppercase stamp with a leading 7px dot. Concept: a dashed 1.5px cyan border with light-cyan text («Proyecto conceptual»). Executed: a solid green border with green text («Proyecto ejecutado»). On day bands a concept stamp becomes Canopy Blue, except inside a dark card, which keeps its night treatment.

### Energy Line and Nodes (signature)
A 2px cyan-to-green vertical line on the page's left edge. Headings marked as nodes carry a 12px ring (2px cyan, or green for electric sections) that sits on the line and is filled with the ground color of its band.

## Do's and Don'ts

### Do:
- **Do** list areas, services and specs as fixed-cell rows (icon cell + uppercase label + detail) separated by hairlines, starting with a 2px top rule.
- **Do** stamp every project with its status. Concept stays dashed cyan until the user confirms the project was executed.
- **Do** draw every icon as a 24px line icon with a 1.75 stroke and round caps; WhatsApp is the only filled mark.
- **Do** put every photograph under a night gradient and label generated images «Imagen ilustrativa».
- **Do** switch accent text to Canopy Blue on day bands. Cyan on white is for fills and rings only.
- **Do** give each new major section heading an energy-line node, green in electromobility contexts.
- **Do** keep «Cotizar ahora» (cyan) and WhatsApp (green) reachable from every page.

### Don't:
- **Don't** use a sunset hero with four floating icon cards; areas are pylon rows.
- **Don't** use gold for anything except Bolivia and Santa Cruz on maps.
- **Don't** introduce a second typeface or a new mid-size uppercase heading tier between Title and Label.
- **Don't** use day bands as the default ground; they are for dense reading and the form.
- **Don't** raise cards on hover; light them.
- **Don't** add small uppercase eyebrow labels above headings; headings carry a node, not a kicker.
