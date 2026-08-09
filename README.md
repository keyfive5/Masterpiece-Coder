<div align="center">

# Masterpiece Coder

**Type an idea. Watch it become code.**

A free AI coding agent that runs in your browser *and* on your desktop.
No API key to start. No terminal anywhere.

**[▶ Try it in your browser](https://keyfive5.github.io/Masterpiece-Coder/)**

</div>

---

## The whole thing in one sentence

Open it, type *"make me a snake game"*, and watch an agent plan it, write the files, check its
own work, and hand you something you can play — with the code visible the entire time.

## Start in ten seconds

There is one box on the first screen. Type into it. That is the whole onboarding.

The first build asks you to sign in once — free, no card, no API key — and that same account
carries your projects between the web app and the desktop app.

If you would rather bring your own model, you can: **Anthropic**, **OpenAI**, **Google Gemini**
(free tier), **OpenRouter** (has free models), **Ollama** (local), or any **OpenAI-compatible
endpoint** you point it at.

| | Free | Needs a key | Notes |
|---|---|---|---|
| **Free (Puter)** | ✅ | — | One-click sign-in. Also syncs your projects. |
| **Built in** | ✅ | — | Ships with the app. No account, no network, no download — see below |
| **On this machine** | ✅ | — | A real model on your own GPU. ~1–3 GB download, once |
| Google Gemini | ✅ free tier | key | Takes about a minute to get one |
| OpenRouter | ✅ free models | key | One key, hundreds of models |
| Ollama | ✅ local | — | Desktop app only — a web page cannot reach your machine |
| Anthropic | — | key | Claude. The strongest coding models. |
| OpenAI | — | key | GPT |
| Custom endpoint | depends | optional | LM Studio, vLLM, a gateway at work |

### You are never stuck with nothing

Two of those need neither an account nor a connection:

**Built in** is not a language model. It reads your prompt, recognises what you
are after, and builds it from a blueprint — a maze game, snake, a to-do list, a
focus timer, a landing page, or a styled starter page for anything else. Each
one is a complete working app in plain HTML/CSS/JS. Instant, offline, every
time. It can only make what it knows, but it always makes *something*.

**On this machine** downloads a Qwen2.5-Coder model and runs it on your own GPU
through WebGPU. Slower and weaker than the hosted models, and it needs a few
gigabytes, but after the first download it works with no internet at all and
nothing you type leaves the computer.

## What's in the window

```
┌──────────────────────────────────────────────────────────────────────┐
│  Masterpiece Coder   snake-game ▾   ✦ Free   ☁ you   New chat   ⚙   │
├─────────────┬──────────────────────────────┬─────────────────────────┤
│  FILES      │  index.html   app.js         │  AGENT                  │
│             │  ─────────────────────────   │                         │
│  index.html │  [ Code | Diff | Preview ]   │  ▸ Thought process      │
│  style.css  │                              │  ✓ Write index.html     │
│  app.js     │      Monaco editor with      │  ✓ Write style.css      │
│             │      full syntax colour      │  ⏳ Read  app.js         │
│  CHANGED    │                              │                         │
│  app.js     │                              │  Plan            2/3    │
│    +38 −0   │  ─────────────────────────   │  ☑ Build the board      │
│             │  Output: npm test            │  ☑ Draw the snake       │
│             │  ✓ 14 passing                │  ☐ Handle collisions    │
│             │                              │  ┌───────────────────┐  │
│             │                              │  │ what next?        │  │
│             │                              │  └───────────────────┘  │
└─────────────┴──────────────────────────────┴─────────────────────────┘
```

**Files** — with a dot on everything the agent touched and a running change list.
**Code / Diff / Preview** — a real Monaco editor, a line-by-line diff with per-file undo, and a
live preview of the thing you just built.
**Agent** — collapsible reasoning, a card per tool call, the live plan, and permission prompts.

## Features

| | |
|---|---|
| **Prompt first** | No folder picker, no key wall. The first sentence you type creates the project and starts the build. |
| **Seven providers** | Free by default; bring your own key for Claude, GPT, Gemini, OpenRouter, Ollama, or any OpenAI-compatible URL. |
| **Runs anywhere** | The same app on the web (projects in browser storage) and on the desktop (real files, real shell). |
| **Sign in, switch devices** | Start something in the browser on your laptop, open the desktop app, keep going. |
| **Checkpoints** | Every message snapshots the files it then touches. History → Rewind puts them all back. |
| **Live preview** | Desktop serves the folder over http. The web build inlines your CSS, JS and images into a sandboxed frame — no server needed. |
| **Permissions** | Autopilot by default; switch to *Ask first* and every write and command waits for you. |
| **Cost meter** | Only ever non-zero when you are using a paid key of your own. |
| **Sandboxed** | Every path the agent touches is confined to the project. Previewed code runs in an iframe with no access to your account or storage. |

## On your phone

Open the site on your phone and **Add to Home Screen** — it installs with an
icon and opens full screen with no browser chrome. The three panes become one
with a bottom switcher, so you get the prompt, the code and the preview on a
small screen.

Had an idea while you were out? Type it on the phone, let it build, and when
you get home open **Projects → From your account → Open here** on the desktop.
The files land in your project folder.

There is also a native iOS shell in [`ios-app/`](ios-app/) — double-click
`BUILD-IPHONE.bat` to build it and send it to TestFlight.

## Saving to GitHub

The GitHub button in the title bar connects a personal access token, then:

- **Pull** any repo link into the current project
- **Save** the project back as a single clean commit
- **New repo from this project**

It goes through the GitHub REST API rather than a git binary, so it works in
the browser too.

## Running the desktop app

Double-click **`START.bat`** — first run installs and builds, after that it just opens.

Or double-click **`MAKE-EXE.bat`** to package **`release/Masterpiece Coder.exe`**, a portable
app you can drop anywhere. It needs no Node.js on the machine that runs it.

<details>
<summary>Command line, if you prefer</summary>

```bash
npm install
npm start                    # build once, then launch the desktop app
npm run dev                  # Vite HMR + Electron auto-restart
npm run web                  # the same app in a browser, at localhost:5177
npm run web:build            # the GitHub Pages build, into docs/
npm run pack                 # portable .exe into release/
MC_SMOKE=1 npx electron .    # boot, render, cycle views, report, exit
```

</details>

## How it works

```
src/
  core/           the agent — identical on the web and on the desktop
    agent.ts        the loop: stream, call tools, feed results back, repeat
    providers.ts    seven providers behind three wire formats
    tools.ts        nine tools, written against a Workspace interface
    workspace.ts    the Workspace contract + path confinement
    checkpoints.ts  per-turn snapshots and rewind
  renderer/
    host/
      browser.ts    Workspace on OPFS, direct fetch, inlined preview
      desktop.ts    Workspace over IPC, network proxied through main
    components/     React + Monaco UI
  main/           Electron: files, shell, network proxy, encrypted keys
  preload/        the only bridge between the two
```

The agent loop is written once and injected with a `Workspace` and a `Net`. On the desktop
those are real files and a main-process fetch proxy (so no provider is ever blocked by CORS,
and keys stay out of the page). In the browser they are OPFS and a direct `fetch`. Nothing in
`core/` knows which it got.

Providers collapse into three wire formats — Anthropic's, OpenAI's, and Puter's — so adding
another is a table entry, not a new code path. The Anthropic adapter also degrades feature by
feature: if an account rejects prompt caching or extended thinking, it turns that one thing off,
says so, and carries on.

## Two honest notes

**Free is genuinely free, but it is a shared service.** The free provider runs on your Puter
account, and quality and speed depend on what it has available. For serious work, a key of your
own — Gemini's free tier costs nothing, Claude costs money — will do better.

**Autopilot is the default.** It writes files without asking. Everything is rewindable from
History, and it can only touch the project folder, but if you would rather approve each step,
flip to *Ask first* in the composer.

## Picking this up again

- [`PROJECT-STATE.md`](PROJECT-STATE.md) — where the project stands: what works,
  what's verified, what's still open.
- [`CLAUDE.md`](CLAUDE.md) — how it's built and the traps worth knowing.

---

Built with Electron, React, Monaco, and whichever model you point it at.
