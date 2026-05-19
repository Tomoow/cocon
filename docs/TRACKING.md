# Tracking inventory

All client-side analytics events fired on **kine-cocon.be** via **Umami
Analytics** (cookieless, GDPR-compliant). Keep this file in sync whenever
tracked elements are added, moved, or removed.

## Setup

| | |
|---|---|
| Provider | Umami Cloud — https://cloud.umami.is |
| Website ID | `db0345e1-ced4-4bf3-8607-6474b5cce507` |
| Script | `<script defer src="https://cloud.umami.is/script.js" data-website-id="…">` |
| Mounted in | `src/layouts/BaseLayout.astro` (every page loads it) |
| Cookies | None |
| Consent banner | Not required |
| Privacy policy mention | `src/pages/privacy.astro`, section 8 |

## Event naming convention

```
data-umami-event="<event-name>"
data-umami-event-source="<where>"
data-umami-event-network="<network>"  (only for cta-social)
```

Event names are kebab-case verbs/nouns prefixed by intent:

- `cta-*` — call-to-action click on the marketing site
- `form-*` — form lifecycle events
- (add new prefixes here as we add categories)

`source` is the **location** of the element on the page (e.g.
`header-desktop`, `hero`, `footer`). Same logical event can fire from
many sources; the `source` property lets us see which source converts
best in the Umami dashboard.

## All tracked elements

### Page views

Auto-tracked by Umami for every URL via the `<script>` tag — no manual
work needed. Covers `/`, `/contact/`, `/faq/`, `/over-ons/`,
`/tarieven/`, `/privacy/`, `/voorwaarden/`. Also tracks
`/afspraak/` redirects to `/` (one page view per redirect).

### Custom events

| Event | Source | Triggered from | File |
|---|---|---|---|
| `cta-afspraak` | `header-desktop` | "Afspraak maken" CTA in the desktop nav | `src/components/Header.astro` |
| `cta-afspraak` | `header-tablet` | "Afspraak maken" CTA in the tablet nav | `src/components/Header.astro` |
| `cta-afspraak` | `header-mobile` | "Afspraak maken" CTA in the mobile nav | `src/components/Header.astro` |
| `cta-afspraak` | `hero` | "Maak een afspraak" primary CTA in the hero | `src/components/Hero.astro` |
| `cta-afspraak` | `afspraak-band` | "Maak een afspraak" CTA in the AfspraakCta band on home | `src/components/AfspraakCta.astro` |
| `cta-afspraak` | `tarieven-card-algemeen` | "Online afspraak maken" button on the algemene-kinesitherapie pricing card | `src/pages/tarieven.astro` |
| `cta-afspraak` | `tarieven-card-bekkenbodem` | "Online afspraak maken" button on the bekkenbodem pricing card | `src/pages/tarieven.astro` |
| `cta-tarieven` | `hero` | "Bekijk onze tarieven" secondary CTA in the hero | `src/components/Hero.astro` |
| `cta-phone` | `footer` | Phone link in the Contact column of the footer | `src/components/Footer.astro` |
| `cta-phone` | `afspraak-band` | "Bel 0470 …" button next to "Maak een afspraak" in the AfspraakCta band | `src/components/AfspraakCta.astro` |
| `cta-phone` | `tarieven-card-huisbezoek` | "Bel 0470 62 68 48" button on the huisbezoek pricing card | `src/pages/tarieven.astro` |
| `cta-email` | `footer` | Email link in the Contact column of the footer | `src/components/Footer.astro` |
| `cta-social` (`network=instagram`) | `header-desktop` | Instagram icon in desktop nav | `src/components/Header.astro` |
| `cta-social` (`network=facebook`) | `header-desktop` | Facebook icon in desktop nav | `src/components/Header.astro` |
| `cta-social` (`network=instagram`) | `header-tablet` | Instagram icon in tablet nav | `src/components/Header.astro` |
| `cta-social` (`network=facebook`) | `header-tablet` | Facebook icon in tablet nav | `src/components/Header.astro` |
| `cta-social` (`network=instagram`) | `header-mobile-menu` | Instagram icon in mobile hamburger menu | `src/components/Header.astro` |
| `cta-social` (`network=facebook`) | `header-mobile-menu` | Facebook icon in mobile hamburger menu | `src/components/Header.astro` |
| `cta-social` (`network=instagram`) | `footer` | Instagram icon in footer | `src/components/Footer.astro` |
| `cta-social` (`network=facebook`) | `footer` | Facebook icon in footer | `src/components/Footer.astro` |
| `cta-contact` | `faq-cat-0` | "Ik heb nog een praktische vraag" CTA on FAQ category 0 | `src/pages/faq.astro` |
| `cta-contact` | `faq-cat-1` | "Ik heb nog een vraag over bekkenbodem" CTA on FAQ category 1 | `src/pages/faq.astro` |
| `cta-contact` | `faq-cat-2` | "Ik heb nog een vraag over zwangerschap" CTA on FAQ category 2 | `src/pages/faq.astro` |
| `cta-review-leave` | `review-section` | "Laat een recensie achter" CTA at bottom of home reviews section | `src/components/ReviewSection.astro` |
| `cta-directions` | `praktijk-google-maps` | "Via Google maps" button in the praktijk section on home | `src/components/PraktijkSection.astro` |
| `cta-directions` | `praktijk-waze` | "Via Waze" button in the praktijk section on home | `src/components/PraktijkSection.astro` |
| `form-contact-submit` | — | **Fires on successful** contact-form submission (not on validation/network failure) | `src/pages/contact.astro` |

## How to remove tracking when an element is removed

When you delete or move an element, also remove its tracking:

1. **For declarative tracking** (`data-umami-event-*` attributes or
   `umamiEvent`/`umamiEventSource`/`umamiEventNetwork` props on
   `<Button>` / `<IconButton>`) — just delete the element along with
   its attributes/props. No JS cleanup needed.

2. **For programmatic tracking** (`window.umami?.track?.('…')` calls) —
   search the codebase for the event name and remove the call too.
   Currently only `form-contact-submit` is programmatic.

3. **Update this file** — delete the row from the table above so the
   inventory stays accurate.

## How to add tracking to a new element

### `<Button>` or `<IconButton>` (the recommended path)

```astro
<Button
  href="/somewhere/"
  umamiEvent="cta-mytype"
  umamiEventSource="page-section-name"
>
  Label
</Button>
```

For `<IconButton>` you can also pass `umamiEventNetwork="instagram"` etc.

### Plain `<a>` or `<button>`

```astro
<a
  href="…"
  data-umami-event="cta-mytype"
  data-umami-event-source="page-section-name"
>
  …
</a>
```

### Programmatically from JS

```ts
// Optional chaining handles ad-blockers / blocked Umami script
(window as unknown as { umami?: { track: (name: string) => void } })
  .umami?.track?.('your-event-name');
```

Or with properties:

```ts
(window as unknown as { umami?: { track: (name: string, props?: Record<string, unknown>) => void } })
  .umami?.track?.('your-event-name', { source: 'where', custom: 'prop' });
```

Don't forget to **add a row to the inventory table** in this file when
you add a new event.

## Where to view the data

- Dashboard: https://cloud.umami.is
- Realtime view shows events as they arrive
- Custom event reports per event-name with source/network breakdowns
- Free tier covers up to 100k events/month — plenty of headroom

## Privacy note

This is documented in user-facing terms in
[`src/pages/privacy.astro`](../src/pages/privacy.astro), section 8.
If you change anything material about what we track (new categories,
new providers, switching off cookieless mode, etc.) make sure to
update that section too — it's the GDPR-compliant disclosure.
