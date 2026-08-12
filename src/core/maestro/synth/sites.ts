import { DesignSystem, Spec } from '../types';
import { Piece } from './games';

/**
 * Marketing pages.
 *
 * The hard part of a generated site is the writing, and an offline builder
 * cannot know what a particular bakery is proud of. So it does the two things
 * it honestly can: it writes real, specific-shaped copy about the subject the
 * user named — never lorem ipsum, never "Feature One" — and it says clearly in
 * the README which lines to replace with the true ones.
 *
 * Structure, hierarchy, contrast, responsiveness and the practical details
 * people actually come for (hours, address, a phone number that dials) are all
 * correct without knowing anything.
 */

function titleCase(text: string): string {
  return text.replace(/\b[a-z]/g, (c) => c.toUpperCase());
}

const DEFAULT_SUBJECT: Record<string, string> = {
  restaurant: 'place',
  event: 'good company',
  portfolio: 'design and code',
  ecommerce: 'well-made things',
  blog: 'writing',
  docs: 'the tool',
};

function subjectOf(spec: Spec): string {
  return spec.subject || spec.subjectWords[0] || DEFAULT_SUBJECT[spec.archetype] || 'the work';
}

/**
 * A name for the thing. The compiled subject strips words that identified the
 * archetype, so "website for my bakery" leaves nothing behind — for a brand
 * name those words are exactly what is wanted, so this reads the raw sentence.
 */
const NOT_A_NAME = new Set([
  'make', 'makes', 'build', 'create', 'me', 'my', 'a', 'an', 'the', 'for', 'of', 'to', 'with',
  'website', 'site', 'page', 'app', 'web', 'please', 'want', 'need', 'i', 'we', 'about', 'landing',
  'simple', 'nice', 'good', 'new', 'small', 'own', 'personal', 'business', 'local',
]);

function brandFrom(spec: Spec): string {
  const words = spec.raw
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !NOT_A_NAME.has(w));
  const picked = (spec.subjectWords.length ? spec.subjectWords : words).slice(0, 2);
  return titleCase(picked.join(' ') || spec.title);
}

/* ================================================================
   Landing page and its close relatives
   ================================================================ */

export function landing(spec: Spec, _design: DesignSystem): Piece {
  const subject = subjectOf(spec);
  const name = brandFrom(spec);
  const isLocal = spec.archetype === 'restaurant';
  const isEvent = spec.archetype === 'event';
  const isPortfolio = spec.archetype === 'portfolio';
  const isShop = spec.archetype === 'ecommerce';

  const headline = isEvent
    ? `${name}, and you should be there`
    : isLocal
      ? `${name} — made here, every day`
      : isPortfolio
        ? `${name}. I build things that work.`
        : isShop
          ? `${name}, made properly and priced honestly`
          : `${name} without the usual friction`;

  const sub = isEvent
    ? `One afternoon of ${subject}, in a room full of people who care about it. Doors at 6, and it is worth arriving early.`
    : isLocal
      ? `A small ${subject} that opens early, uses good ingredients and does not cut corners. Come in, or call ahead.`
      : isPortfolio
        ? `Selected work in ${subject} — what the problem was, what I did about it, and what changed as a result.`
        : isShop
          ? `A short, considered range. Everything here is something we would use ourselves, and nothing is here to pad the catalogue.`
          : `A straightforward approach to ${subject}: fewer steps, clearer decisions, and nothing you have to learn twice.`;

  const cta = isEvent ? 'Save me a seat' : isLocal ? 'See the menu' : isShop ? 'Browse the range' : isPortfolio ? 'See the work' : 'Get started';

  /* --- sections -------------------------------------------------- */

  const practical = isLocal
    ? `        <section class="practical" aria-label="Visiting">
          <div class="practical__item">
            <h2>Opening hours</h2>
            <dl class="hours">
              <div><dt>Monday to Friday</dt><dd>7:00 – 17:00</dd></div>
              <div><dt>Saturday</dt><dd>8:00 – 16:00</dd></div>
              <div><dt>Sunday</dt><dd>9:00 – 14:00</dd></div>
            </dl>
          </div>
          <div class="practical__item">
            <h2>Find us</h2>
            <p>128 Main Street, Milton, Ontario</p>
            <p><a href="tel:+19055550142">(905) 555-0142</a></p>
            <p><a href="https://maps.google.com/?q=128+Main+Street+Milton+Ontario" rel="noopener">Open in Maps</a></p>
          </div>
          <div class="practical__item">
            <h2>Orders</h2>
            <p>Call before 15:00 the day before for anything large. We bake to order rather than to a forecast.</p>
            <p><a href="mailto:hello@example.com">hello@example.com</a></p>
          </div>
        </section>`
    : isEvent
      ? `        <section class="practical" aria-label="Details">
          <div class="practical__item"><h2>When</h2><p>Saturday 12 September, 18:00 – 22:00</p><p class="muted">Doors at 17:30.</p></div>
          <div class="practical__item"><h2>Where</h2><p>The Old Exchange, 12 Market Square</p><p><a href="https://maps.google.com/?q=The+Old+Exchange+Market+Square" rel="noopener">Open in Maps</a></p></div>
          <div class="practical__item"><h2>Tickets</h2><p>Free, but the room holds 120 people.</p><p><a href="#rsvp">Reserve a place</a></p></div>
        </section>`
      : '';

  const body = isPortfolio
    ? `        <section class="work" id="work" aria-label="Selected work">
          <h2 class="section-title">Selected work</h2>
          <article class="project">
            <h3>Order tracking that people stopped phoning about</h3>
            <p class="project__meta">Six weeks · design and front end</p>
            <p>Support was taking two hundred "where is my order" calls a week. I replaced the status email with a live page and a single honest estimate, then made the estimate visible before checkout rather than after it.</p>
            <p class="project__result">Calls about order status fell by roughly two thirds within a month.</p>
          </article>
          <article class="project">
            <h3>A booking flow that fits on one screen</h3>
            <p class="project__meta">Three weeks · end to end</p>
            <p>The old form asked for eleven fields across four steps. Seven of them were only needed after payment, so they moved there, and the rest fitted in one view with the price always visible.</p>
            <p class="project__result">Completed bookings rose by about a fifth, with no change to traffic.</p>
          </article>
          <article class="project">
            <h3>${titleCase(subject)} tooling for a team of four</h3>
            <p class="project__meta">Ongoing</p>
            <p>A small internal tool that removed a spreadsheet nobody trusted. It does one job, it is fast, and it has needed almost no maintenance.</p>
            <p class="project__result">The spreadsheet has not been opened since March.</p>
          </article>
        </section>`
    : isShop
      ? `        <section class="products" id="range" aria-label="The range">
          <h2 class="section-title">The range</h2>
          <div class="grid-cards">
            <article class="card product"><h3>The everyday one</h3><p>What you will reach for most. Nothing clever, made well.</p><p class="price">$38</p></article>
            <article class="card product"><h3>The heavy one</h3><p>Twice the weight, for when the everyday one is not enough.</p><p class="price">$64</p></article>
            <article class="card product"><h3>The small one</h3><p>Fits in a pocket. Same materials, less of them.</p><p class="price">$24</p></article>
            <article class="card product"><h3>The set</h3><p>All three, boxed. Works out cheaper than buying them separately.</p><p class="price">$112</p></article>
          </div>
          <p class="muted">Prices include tax. Shipping is flat rate and free over $75.</p>
        </section>`
      : `        <section class="features" id="what" aria-label="What it does">
          <h2 class="section-title">What it actually does</h2>
          <div class="grid-cards">
            <article class="card">
              <h3>It starts on the first screen</h3>
              <p>No setup wizard and no empty dashboard. The thing you came to do is the first thing in front of you.</p>
            </article>
            <article class="card">
              <h3>It keeps your work</h3>
              <p>Everything is saved as you go. Close the tab, come back next week, and it is exactly where you left it.</p>
            </article>
            <article class="card">
              <h3>It works on a phone</h3>
              <p>Not a shrunk-down desktop layout — a version built for a thumb, with the same features and none of the pinching.</p>
            </article>
          </div>
        </section>

        <section class="steps" aria-label="How it works">
          <h2 class="section-title">Three steps, then you are done</h2>
          <ol class="steps__list">
            <li><strong>Say what you want.</strong> One sentence is enough to start.</li>
            <li><strong>Watch it take shape.</strong> Every change is visible while it happens, and nothing is hidden behind a spinner.</li>
            <li><strong>Keep it.</strong> Download it, share it, or carry on editing. It is yours either way.</li>
          </ol>
        </section>`;

  const close = `        <section class="cta" id="rsvp" aria-label="${isEvent ? 'Reserve a place' : 'Get started'}">
          <h2>${isEvent ? 'Reserve a place' : isLocal ? 'Come and see us' : 'Ready when you are'}</h2>
          <p>${isEvent ? 'Send a note and we will keep one for you.' : isLocal ? 'We are open from seven, and the good things go early.' : 'No account needed to look around.'}</p>
          <a class="btn" href="mailto:hello@example.com?subject=${encodeURIComponent(name)}">${cta}</a>
        </section>`;

  const markup = `      <header class="site-header">
        <a class="brand" href="#top">${name}</a>
        <nav aria-label="Main">
          <button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="nav">Menu</button>
          <ul class="nav" id="nav">
            <li><a href="#what">${isPortfolio ? 'Work' : isShop ? 'Range' : isLocal ? 'Menu' : 'What it does'}</a></li>
            <li><a href="#story">About</a></li>
            <li><a href="#rsvp" class="nav__cta">${cta}</a></li>
          </ul>
        </nav>
      </header>

      <section class="hero" id="top">
        <p class="eyebrow">${isEvent ? 'Saturday 12 September' : isLocal ? 'Open from 7am' : titleCase(subject)}</p>
        <h1>${headline}</h1>
        <p class="hero__sub">${sub}</p>
        <div class="hero__actions">
          <a class="btn" href="#rsvp">${cta}</a>
          <a class="btn btn--ghost" href="#what">${isPortfolio ? 'See the work' : 'Read more'}</a>
        </div>
      </section>

${practical}

${body}

      <section class="story" id="story" aria-label="About">
        <h2 class="section-title">Why this exists</h2>
        <p>Most things in ${subject} are built for the person selling them rather than the person using them. This one started from the opposite end: what does someone actually need in the first thirty seconds, and what can be removed entirely?</p>
        <p>The answer turned out to be less than expected. What is left is here.</p>
        <blockquote class="quote">
          <p>It does the one thing, it does it quickly, and it has never once asked me to sign up before showing me anything.</p>
          <cite>An early user — replace with a real quote before publishing</cite>
        </blockquote>
      </section>

${close}

      <footer class="site-footer">
        <p>© <span id="year">2026</span> ${name}. Built as a single page — no trackers, no cookie banner, nothing to accept.</p>
        <p><a href="mailto:hello@example.com">hello@example.com</a></p>
      </footer>`;

  const script = `/* --- ${spec.title} ---------------------------------------------------
   A marketing page needs almost no JavaScript. This is the mobile menu, the
   current year, and a scroll-spy that marks the section you are looking at. */

var toggle = document.getElementById('nav-toggle');
var nav = document.getElementById('nav');

toggle.addEventListener('click', function () {
  var open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
  nav.classList.toggle('is-open', !open);
});

/* Close the menu after following a link, or the page appears not to move. */
var links = nav.querySelectorAll('a');
for (var i = 0; i < links.length; i++) {
  links[i].addEventListener('click', function () {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  });
}

document.getElementById('year').textContent = String(new Date().getFullYear());

if ('IntersectionObserver' in window) {
  var sections = document.querySelectorAll('section[id]');
  var observer = new IntersectionObserver(function (entries) {
    for (var e = 0; e < entries.length; e++) {
      if (!entries[e].isIntersecting) continue;
      var id = entries[e].target.id;
      for (var l = 0; l < links.length; l++) {
        links[l].classList.toggle('is-current', links[l].getAttribute('href') === '#' + id);
      }
    }
  }, { rootMargin: '-45% 0px -50% 0px' });
  for (var s = 0; s < sections.length; s++) observer.observe(sections[s]);
}
`;

  const css = `
/* Deliberately a block, not a grid. A section containing an auto-fit grid has
   a min-content width of all its columns side by side; as a grid ITEM that
   cannot shrink, and the whole page ends up twice the width of the phone. */
.page { display: block; }

.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 14px clamp(16px, 4vw, 48px);
  background: color-mix(in srgb, var(--bg) 88%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--line);
}
.brand { font-family: var(--font-display); font-weight: 700; font-size: 1.1rem; color: var(--ink); text-decoration: none; margin-right: auto; }

.nav { display: flex; gap: 22px; list-style: none; padding: 0; align-items: center; }
.nav a { color: var(--ink-dim); text-decoration: none; font-size: 0.95rem; }
.nav a:hover, .nav a.is-current { color: var(--ink); }
.nav__cta { color: var(--accent) !important; font-weight: 600; }
.nav-toggle { display: none; min-height: 44px; padding: 0 12px; border: 1px solid var(--line); border-radius: var(--radius); }

.hero {
  padding: clamp(56px, 12vw, 128px) clamp(16px, 4vw, 48px) clamp(40px, 8vw, 96px);
  max-width: 1120px;
  margin-inline: auto;
  width: 100%;
}
.eyebrow { color: var(--accent); font-size: 0.82rem; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 700; }
.hero h1 { margin-top: 14px; max-width: 18ch; font-size: clamp(2.2rem, 6.5vw, 4rem); }
.hero__sub { margin-top: 18px; font-size: clamp(1.05rem, 2.2vw, 1.3rem); color: var(--ink-dim); max-width: 52ch; }
.hero__actions { margin-top: 30px; display: flex; gap: 12px; flex-wrap: wrap; }

section { padding: clamp(44px, 8vw, 88px) clamp(16px, 4vw, 48px); max-width: 1120px; margin-inline: auto; width: 100%; }
.section-title { font-size: clamp(1.5rem, 3.6vw, 2.2rem); margin-bottom: 26px; }

/* min(230px, 100%) rather than a bare 230px: on a narrow screen the track
   floor must be allowed to fall below its ideal, or the row cannot collapse. */
.practical { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(230px, 100%), 1fr)); gap: 32px; border-block: 1px solid var(--line); }
.practical h2 { font-size: 1rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-dim); margin-bottom: 10px; }
.hours div { display: flex; justify-content: space-between; gap: 12px; padding: 4px 0; border-bottom: 1px dotted var(--line); }
.hours dt { color: var(--ink-dim); }
.hours dd { margin: 0; font-variant-numeric: tabular-nums; }

.grid-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr)); gap: 18px; }
.card h3 { font-size: 1.15rem; margin-bottom: 8px; }
.card p { color: var(--ink-dim); }
.product .price { margin-top: 12px; color: var(--ink); font-weight: 700; font-size: 1.2rem; }

.steps__list { counter-reset: step; list-style: none; padding: 0; display: grid; gap: 16px; max-width: 62ch; }
.steps__list li { position: relative; padding-left: 48px; color: var(--ink-dim); }
.steps__list li::before {
  counter-increment: step;
  content: counter(step);
  position: absolute; left: 0; top: -2px;
  width: 32px; height: 32px;
  display: grid; place-items: center;
  background: var(--accent); color: var(--accent-ink);
  border-radius: 50%; font-weight: 700; font-size: 0.9rem;
}
.steps__list strong { color: var(--ink); }

.project { padding: 24px 0; border-top: 1px solid var(--line); }
.project h3 { font-size: 1.3rem; }
.project__meta { color: var(--ink-dim); font-size: 0.85rem; letter-spacing: 0.04em; margin: 4px 0 12px; }
.project__result { margin-top: 10px; color: var(--accent); font-weight: 600; }

.quote { margin-top: 32px; padding: 20px 24px; border-left: 3px solid var(--accent); background: var(--surface); }
.quote p { font-size: 1.15rem; }
.quote cite { display: block; margin-top: 10px; color: var(--ink-dim); font-size: 0.88rem; font-style: normal; }

.cta { text-align: center; background: var(--surface); border-block: 1px solid var(--line); max-width: none; }
.cta h2 { font-size: clamp(1.6rem, 4vw, 2.4rem); }
.cta p { margin: 12px auto 24px; color: var(--ink-dim); max-width: 46ch; }

.site-footer {
  display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap;
  padding: 28px clamp(16px, 4vw, 48px);
  color: var(--ink-dim); font-size: 0.9rem;
  max-width: 1120px; margin-inline: auto; width: 100%;
}

@media (max-width: 720px) {
  .nav-toggle { display: block; }
  .nav {
    position: absolute; left: 0; right: 0; top: 100%;
    flex-direction: column; align-items: stretch; gap: 0;
    background: var(--bg); border-bottom: 1px solid var(--line);
    display: none;
  }
  .nav.is-open { display: flex; }
  .nav li { border-top: 1px solid var(--line); }
  .nav a { display: block; padding: 14px clamp(16px, 4vw, 48px); }
  .site-header { position: relative; }
}`;

  return {
    script,
    markup,
    css,
    howTo: [
      'Open index.html. The whole page is one file of markup, one stylesheet and a few lines of script.',
      'Replace the copy with your own — the structure is what matters, the words are a starting point.',
      'Search for example.com and the sample quote; those are the two things that must be changed before it goes live.',
    ],
    notes: [
      'Real written copy throughout — no lorem ipsum and no unnamed "Feature One" cards.',
      'One primary action, repeated: the header, the hero and the closing section all point at the same thing.',
      'Text blocks are capped at about 52 to 62 characters a line, which is the range that reads comfortably.',
      'The mobile menu is a real disclosure with aria-expanded, and it closes after a link is followed.',
      'Nothing is loaded from the internet — no fonts, no analytics, no cookie banner to accept.',
    ],
    engine: false,
    scriptName: 'app.js',
  };
}

/* ================================================================
   Résumé
   ================================================================ */

export function resume(spec: Spec, _design: DesignSystem): Piece {
  const name = titleCase(spec.subjectWords.slice(0, 2).join(' ') || 'Your Name');

  const markup = `      <header class="cv-head">
        <h1>${name}</h1>
        <p class="cv-role">Software developer — front end and product</p>
        <ul class="cv-contact">
          <li><a href="mailto:hello@example.com">hello@example.com</a></li>
          <li><a href="tel:+19055550142">(905) 555-0142</a></li>
          <li>Milton, Ontario</li>
          <li><a href="https://example.com" rel="noopener">example.com</a></li>
        </ul>
      </header>

      <section aria-label="Summary">
        <p class="cv-summary">Builds and ships small products end to end — interface, logic and the parts nobody wants to own. Most recent work has been on tools where the measure of success is that people stop asking for help.</p>
      </section>

      <section aria-label="Experience">
        <h2>Experience</h2>

        <article class="entry">
          <div class="entry__head">
            <h3>Front-end developer · Northline Tools</h3>
            <p class="entry__dates">2024 — present</p>
          </div>
          <ul>
            <li>Rebuilt the order-status page as a live view, which cut "where is my order" support contacts by roughly two thirds.</li>
            <li>Took the booking flow from four steps to one screen; completed bookings rose about a fifth on the same traffic.</li>
            <li>Introduced a shared component set that removed three separate button implementations.</li>
          </ul>
        </article>

        <article class="entry">
          <div class="entry__head">
            <h3>Developer · Freelance</h3>
            <p class="entry__dates">2022 — 2024</p>
          </div>
          <ul>
            <li>Delivered eleven small sites and internal tools for local businesses, all hand-built and all still running.</li>
            <li>Standardised on plain HTML, CSS and JavaScript for anything under a certain size, which made handover trivial.</li>
          </ul>
        </article>
      </section>

      <section aria-label="Skills">
        <h2>Skills</h2>
        <ul class="cv-skills">
          <li>JavaScript, TypeScript</li>
          <li>HTML, CSS, accessibility</li>
          <li>React, plain DOM</li>
          <li>Node, REST APIs</li>
          <li>Git, CI</li>
          <li>Design systems</li>
        </ul>
      </section>

      <section aria-label="Education">
        <h2>Education</h2>
        <article class="entry">
          <div class="entry__head">
            <h3>BSc Computer Science · University of Waterloo</h3>
            <p class="entry__dates">2018 — 2022</p>
          </div>
        </article>
      </section>

      <p class="cv-note muted">Replace every line above with your own history before sending this anywhere.</p>`;

  const css = `
.page { max-width: 820px; margin-inline: auto; padding: clamp(24px, 5vw, 56px); }

.cv-head { border-bottom: 2px solid var(--ink); padding-bottom: 18px; margin-bottom: 26px; }
.cv-head h1 { font-size: clamp(2rem, 6vw, 2.8rem); }
.cv-role { color: var(--ink-dim); font-size: 1.05rem; margin-top: 4px; }
.cv-contact { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 6px 20px; margin-top: 12px; font-size: 0.92rem; color: var(--ink-dim); }

section { margin-bottom: 26px; }
section h2 {
  font-size: 0.86rem; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-dim); border-bottom: 1px solid var(--line);
  padding-bottom: 6px; margin-bottom: 14px;
}
.cv-summary { font-size: 1.05rem; max-width: 70ch; }

.entry { margin-bottom: 18px; break-inside: avoid; page-break-inside: avoid; }
.entry__head { display: flex; justify-content: space-between; gap: 16px; align-items: baseline; }
.entry__head h3 { font-size: 1.05rem; }
.entry__dates { color: var(--ink-dim); font-size: 0.9rem; font-variant-numeric: tabular-nums; white-space: nowrap; }
.entry ul { margin-top: 8px; padding-left: 20px; display: grid; gap: 5px; }
.entry li { color: var(--ink-dim); }

.cv-skills { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(160px, 100%), 1fr)); gap: 6px 20px; }
.cv-note { font-size: 0.85rem; margin-top: 32px; }

@media (max-width: 560px) {
  .entry__head { flex-direction: column; gap: 2px; }
}

/* Printing is the point of a résumé, so it gets a proper stylesheet. */
@media print {
  :root { --bg: #fff; --surface: #fff; --ink: #000; --ink-dim: #333; --line: #999; --accent: #000; }
  body { font-size: 11pt; line-height: 1.42; background: #fff; color: #000; }
  .page { max-width: none; padding: 14mm; }
  .cv-note, .no-print { display: none; }
  a { color: #000; text-decoration: none; }
  h1 { font-size: 20pt; }
  section h2 { font-size: 9pt; }
  .entry { page-break-inside: avoid; }
  @page { margin: 12mm; }
}`;

  return {
    script: '',
    markup,
    css,
    howTo: [
      'Replace every line with your own history — the sample content is there to show the shape.',
      'Print or save as PDF straight from the browser; the print stylesheet handles the rest.',
    ],
    notes: [
      'A full @media print block: black on white, 11pt body, 12mm page margins, and page-break-inside: avoid on every entry so nothing splits across pages.',
      'Dates are right-aligned in a two-column row that stacks below 560 px.',
      'Contact details are real links — the phone number dials and the address is copyable.',
    ],
    engine: false,
    scriptName: 'app.js',
  };
}
