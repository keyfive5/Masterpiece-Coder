# Masterpiece Coder — working notes

Read this before touching anything. It is the accumulated context of the build,
including several things that cost real debugging time to learn.

**For where the project currently stands** — what is done, what is verified,
what is still open — read [`PROJECT-STATE.md`](PROJECT-STATE.md) first. This
file is the engineering companion to it: how the thing is put together and how
not to waste a day.

## What this is

Hasan's own Claude Code / Cursor. He loves both but **never uses their
terminals** — the GUI is the whole point. He also wants it *free*, because "an
API key is too much of a hurdle", and he wants ideas to become real fast:
type a sentence, watch it get built.

Live web app: **https://keyfive5.github.io/Masterpiece-Coder/**
Repo: `keyfive5/Masterpiece-Coder` (branch `main`)
Desktop: `release/Masterpiece Coder.exe` (portable, no install)
iPhone: `ios-app/` (Expo shell around the web app)

**He does not use a terminal.** Ship `.bat` files he can double-click, and do
the building/deploying for him. Default to solutions that cost nothing.

## Shape of the thing

One React + Monaco app runs on the web, on the desktop and inside the iOS
shell. The agent loop lives in `src/core` and is handed a `Workspace` and a
`Net`; it never knows which host it got.

```
src/
  core/                 the agent — identical everywhere
    agent.ts              the loop: stream, run tools, feed results back
    providers.ts          every provider, five wire formats
    local.ts              WebLLM (on-device model), lazy-imported
    maestro/              the native intelligence — see below
    tools.ts              ten tools, written against Workspace
    workspace.ts          the Workspace contract + path confinement
    checkpoints.ts        per-turn snapshots and rewind
    github.ts             pull/push via the GitHub REST API
    prompt.ts             the system prompt
  renderer/
    host/browser.ts       Workspace on OPFS, direct fetch, inlined preview
    host/desktop.ts       Workspace over IPC, fetch proxied through main
    components/           the UI
    actions.ts            everything the UI can do; wires events into the store
    sync.ts               project sync through the Puter account
  main/                 Electron: files, shell, network proxy, encrypted keys
  preload/              the only bridge between the two
ios-app/                Expo WebView shell
docs/                   the built web app, served by GitHub Pages
```

Desktop network calls are proxied through the main process (`src/main/net.ts`),
which means no CORS limits on any provider and API keys never reach the page.

## Maestro — `src/core/maestro/`

The native intelligence. It wraps whichever AI is doing the writing and can
also build entirely on its own. Everything in it is deterministic, offline and
free; nothing here calls a model.

```
maestro/
  types.ts        the shared vocabulary
  knowledge.ts    45 archetypes: requirements, named failure modes, TUNED NUMBERS
  spec.ts         the intent compiler — a sentence becomes a structured Spec
  design.ts       22 contrast-checked palettes, 9 system-font pairings
  plan.ts         Spec → milestones, each with the condition that ends it
  brief.ts        renders the ~7 KB specification injected into the system prompt
  critic.ts       ~45 rules, run against the files that actually landed
  repair.ts       the fixes that cannot be wrong, applied without asking
  synth/          the synthesiser: complete projects with no model at all
```

The order it runs in:

```
prompt → compileSpec → chooseDesign → buildPlan → brief ──▶ the AI writes code
                                                                   │
                              autoRepair → critic ─ blockers? ─────┘  (×2)
```

**The tuning numbers are the point.** "Give the player reaction time" is
advice; "spawn at y = −40 and travel 580 px to a hit line at y = 540 at
362 px/s, which is 1.6 s of warning" is a specification. The first produced a
dance game whose arrows appeared on the hit line. The second cannot.

Facts worth keeping:

- **`knowledge.ts` is the file to edit** when output quality is wrong. A new
  failure mode goes in as a `pitfall`; a rule that must be enforced goes in
  `checks` and gets a matching rule in `critic.ts`.
- **Critic rule ids are a contract** — `scripts/maestro-test.mjs` asserts each
  one still fires on a planted bug, so a rule cannot silently rot into a no-op.
- **Which game rules apply is decided by the archetype's `checks`.** A board
  game has no frame loop and must not be told it is missing one.
- The critic runs on `blankJs()` output — comments and string bodies blanked,
  length and newlines preserved — so a brace inside a string cannot break the
  balance count and line numbers still match.
- **The synthesiser never lies about what it built.** With no bespoke generator
  for an archetype it substitutes the nearest one and says so, in the summary
  and the README. A memory game presented as Tetris would be worse than no
  Tetris.
- `settings.maestro` turns the whole thing off. `review_project` is the tool
  that lets the model run the critic on itself mid-turn.
- After a turn ends, `agent.ts` runs repair → critic and pushes the report back
  as a user message when anything is a blocker or a major, up to
  `MAX_REVIEW_ROUNDS` (2). If the turn produced no files at all, it builds the
  project natively rather than leaving an empty folder.

## Providers — read this before changing `providers.ts`

Five wire formats: `anthropic`, `openai`, `puter`, `builtin`, `local`.

**Puter is a gateway, so the reply shape follows the upstream vendor, not
Puter.** This cost two rounds of debugging:

- GPT models → OpenAI form: `response.message.tool_calls`
- Claude models → **Anthropic** form: `response.message.content` is an array of
  blocks including `{type:'tool_use', name, input}`, and there is **no**
  `tool_calls` field at all

`extractToolCalls()` handles both. Do not "simplify" it.

**Never stream Puter when tools are in play.** Puter only reports tool calls on
a completed response, never on stream parts. Streaming silently dropped every
tool call made after the model wrote a sentence, so the agent did one thing and
stopped. This was the headline bug.

Other provider facts:
- Puter needs a signed-in user before any AI call, and `signIn()` opens a popup,
  so it must be triggered from a user gesture (the Send button).
- Weak models narrate instead of calling tools. The loop nudges twice
  (`MAX_NUDGES` in `agent.ts`) and the prompt leads with "you build by calling
  tools, not describing".
- The Anthropic adapter degrades feature-by-feature on a 400 (caching → effort →
  thinking) rather than failing.
- Model ids in the Puter list are a moving target; unavailable ones fall back
  down the list automatically.

## How to verify — you cannot test the free path without a session

- **`MC_PUTER_TEST=1 electron .`** runs a live probe of the free provider from
  the desktop renderer and prints the exact response shapes. Needs Hasan signed
  in — he is, on the desktop app. This is the only way to check that path.
- **`MC_SMOKE=1 electron .`** boots, opens the first file, cycles Code/Diff/Play,
  prints what rendered, exits.
- **A mock OpenAI-compatible SSE server** drives the real loop with no key. When
  writing one, count **assistant** turns, not `tool` messages — one turn emits
  several calls and each result comes back as its own message.
- **`npm run web`** plus the Browser pane is how the UI gets checked.
- The **offline builder** is fully testable with no network at all.

## Traps that will waste your time

- **PowerShell `Select-Object -First N` kills the upstream process.** Piping a
  build through it truncates the build itself. Always `| Out-String`.
- **`npx electron .` swallows stdout.** Use
  `Start-Process -RedirectStandardOutput` to see `[smoke]` output.
- **A smoke run that prints nothing usually means a stale instance** is holding
  the single-instance lock. Kill `Masterpiece Coder` processes and free port
  39217 first.
- **The Browser pane console buffer persists across reloads**, so old HMR errors
  look current. Confirm against a fresh production build before believing them.
- **Writing `\0` in a source file can emit a literal NUL byte.** It happened
  twice. If a string sentinel looks wrong, check the bytes.
- **Deleting `node_modules` on Windows:** `robocopy <empty-dir> <target> /MIR`
  then `rmdir`, or it takes forever.
- The app bundle is served over **http on fixed port 39217**, not `file://`:
  Monaco's workers need http, and browser storage — including the Puter session
  — is keyed by origin, so a random port signs the user out every launch.
- `signAndEditExecutable: false` in the win build config, because
  electron-builder's winCodeSign 7z cannot create symlinks without Developer
  Mode and the portable build aborts.
- The CSP deliberately allows `unsafe-inline`/`unsafe-eval` — the Play panel
  runs generated code and a `srcdoc` iframe inherits the parent policy. The real
  boundary is the iframe `sandbox` with no `allow-same-origin`.

## Commands

```bash
npm start                    # build once, launch the desktop app
npm run dev                  # Vite HMR + Electron auto-restart
npm run web                  # the app in a browser, localhost:5177
npm run web:build            # the GitHub Pages build, into docs/
npm run pack                 # portable .exe into release/
MC_SMOKE=1 npx electron .    # boot, render, report, exit
MC_PUTER_TEST=1 npx electron .   # live probe of the free provider
```

After changing anything in `src/renderer` or `src/core`, rebuild `docs/` and
push — that is the live site.

## State of play

Working and verified: prompt-first launcher; the agent loop end to end on both
a mock and the live free provider (it built a complete rhythm game across
several turns); offline builder; GitHub pull/push; project sync between
devices; phone layout and Add to Home Screen; Play button with auto-open after
a build; checkpoints and rewind.

Not verified: the on-device model actually generating (needs a multi-GB
download), and the TestFlight submission itself.

## Open items

1. **TestFlight.** `ios-app/BUILD-IPHONE.bat` is ready. Interactive `eas login`
   fails for his account (2FA/SSO), so the script now reads an Expo access
   token from `ios-app/.expotoken` — he creates it at
   expo.dev/settings/access-tokens. The first build still needs an interactive
   Apple sign-in for signing; EAS manages the certificate from then on.
   `credentials/asckey.p8` needs to be copied in for `eas submit`, and an App
   Store Connect record for `com.hasanzafar.masterpiececoder` must exist.
2. **Game quality.** He asked for a dance game and the arrows spawned on the hit
   line, making it unplayable. `prompt.ts` now has a section forcing the model
   to reason about the play loop before writing it. Worth checking whether that
   is enough.
3. The on-device model uses a text tool protocol rather than native function
   calling, because small models are unreliable at the latter. If it misbehaves,
   the parser in `local.ts` is the place to look.

## Working with Hasan

Give him the double-click path, not commands. Tell him plainly what is verified
and what is not — he tests by actually using the thing, and he will find it.
Commit and push often; he has asked for this explicitly.
