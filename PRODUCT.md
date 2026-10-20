# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JS (user choice, October 2026). No framework or dependencies; a small Node script assembles the shared header and footer into each page. Output is uploaded as-is to Hostinger `public_html/` (index.html at the root), behind Cloudflare on efo.com.bo.

## Users

All audiences carry equal weight (user decision):
- Companies and industries: industries, construction, transport and logistics companies, agroindustry, shopping centers, hotels, service stations, fleet owners and large energy consumers. They come to request a quote for fuel supply, energy infrastructure or charging infrastructure.
- Institutions: public companies, organizations and infrastructure projects.
- Transport sector: business fleets, public and heavy transport, buses, commercial vehicles.
- Vehicle owners: home charging, conversion to electric, residential charging infrastructure.

A large share of visitors arrive on phones.

## Product Purpose

Corporate website of E.F.O. Ltda. – Energía y Fuerza del Oriente Ltda. It must answer in about five seconds "what is E.F.O.?" (a Bolivian energy company working with fuels, energy, infrastructure and electromobility) and turn visitors into inquiries, quotes, meetings and projects. Success is a request through "Cotizar ahora", WhatsApp or the contact form.

## Positioning

A Bolivian energy company, born in Santa Cruz (the Oriente) with a national scope, that integrates four areas under one brand: fuels (import and commercialization), energy solutions, industry, and electromobility (charging stations, AC/DC chargers, home/business/fleet charging, conversion of combustion vehicles to electric). It is not an EV-only or charger-only company. Tagline: «ENERGÍA QUE MUEVE BOLIVIA».

## Operating Context

- Contact: WhatsApp +591 69540072 (prefilled message), gerencia@efo.com.bo, Av. Montecristo No. 205, Santa Cruz de la Sierra, Bolivia.
- Form fields: name, company, phone, email, inquiry type (Combustibles, Importación, Soluciones energéticas, Electromovilidad, Electrolineras, Cargadores, Conversión de vehículos, Proyectos, Otro), message. No backend: the form hands off to WhatsApp (or email).
- Domain efo.com.bo on Cloudflare (A → 2.57.91.91, www CNAME). Hostinger mail records (MX, SPF, DKIM, DMARC, autodiscover, autoconfig) must never be touched. Canonical host: https://efo.com.bo.
- Required pages: Inicio, Empresa, Combustibles, Soluciones Energéticas, Electromovilidad, Proyectos, Contacto.

## Capabilities and Constraints

- Never publish unconfirmed facts: supplier countries, volumes, capacities, licenses, certifications, clients, contracts, executed projects, number of stations, installed power, regulatory claims.
- Projects: the user says some projects are real but has not said which. Until confirmed, every project is labeled «Proyecto conceptual» or «Solución propuesta». The Toyota Coaster 2005 (30 passengers) conversion is a concept example.
- Mission and vision texts are given verbatim in the brief.
- Social networks: not enabled yet.

## Brand Commitments

- Name: E.F.O. Ltda. / Energía y Fuerza del Oriente Ltda. Tagline «ENERGÍA QUE MUEVE BOLIVIA».
- Colors (binding): #063B66 corporate blue, #031F36 deep blue, #00AEEF electric cyan, #39A935 energy green, #D5A928 Bolivian gold (sparingly), #FFFFFF.
- Typeface (binding): Manrope for everything.
- Personality: corporate, technological, industrial, energetic, serious, premium. Not juvenile, not startup-like, not generic tech, not eco-only, not touristic, not overly minimal, not text-heavy.
- Santa Cruz identity through industry, agroindustry, logistics and growth, never tourism.

## Evidence on Hand

- Logo: `assets/logo-efo.png` (1560×397, raster, white background) and isotype `favicon.png` from the previous build (EFO_WEB_Fase7.zip on the desktop).
- AI-generated marketing images (WebP, 800–1600 px wide) for hero, fuel logistics, electromobility, industry, transport, agroindustry, commerce, construction and four project themes. Many contain baked-in text and garbled "E.F.O." lettering; they are marketing visuals, not documentary photos. The generated world map wrongly highlights Brazil as Bolivia and must not be used.
- No testimonials, client logos, certifications, figures or real project photos are available. Do not fabricate them.

## Product Principles

1. One energy company, four areas: every page reinforces the integrated whole, never disconnected businesses.
2. Truth before persuasion: concept work is labeled as such; nothing unverified reads as a fact.
3. Always one step from a quote: «Cotizar ahora», WhatsApp and the form are reachable from every page.
4. From the Oriente to all of Bolivia: Santa Cruz as an industrial and logistics hub serving the whole country.
