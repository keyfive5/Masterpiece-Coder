<div align="center">

# Masterpiece Coder

**Type an idea. Watch it become code.**

An autonomous AI coding agent with a real desktop interface — the Claude Code way of working,
the Cursor way of seeing your files, and not a terminal in sight.

</div>

---

## What it is

You open a folder, describe what you want in plain English, and the agent goes to work:
it reads your project, writes a plan, creates and edits files, runs commands, checks its own
output, and tells you what it did. You watch the whole thing happen — the reasoning, every
tool call, every line that changed — and you can rewind any of it.

It runs on your machine, against your own Anthropic API key. Nothing is proxied through a
server, and there is no subscription.

## What's in the window

```
┌──────────────────────────────────────────────────────────────────────┐
│  Masterpiece Coder    my-project ▾      Opus 5 ▾   New  History  ⚙   │
├─────────────┬──────────────────────────────┬─────────────────────────┤
│  EXPLORER   │  index.html  app.js          │  AGENT                  │
│             │  ─────────────────────────   │                         │
│  ▸ src      │  [ Code | Diff | Preview ]   │  ▸ Thought process      │
│    app.js   │                              │  ✓ Write index.html     │
│  index.html │      Monaco editor with      │  ✓ Edit  style.css      │
│  README.md  │      full syntax colour      │  ⏳ Run  npm test        │
│             │                              │                         │
│  CHANGED    │                              │  Plan            2/3    │
│  index.html │  ─────────────────────────   │  ☑ Scaffold the page    │
│    +17 −0   │  Output: npm test            │  ☑ Style the keys       │
│             │  ✓ 14 passing                │  ☐ Wire up the audio    │
│             │                              │  ┌───────────────────┐  │
│             │                              │  │ what should we... │  │
│             │                              │  └───────────────────┘  │
└─────────────┴──────────────────────────────┴─────────────────────────┘
```

**Left — Explorer.** Your project tree, with a dot on every file the agent has touched, and a
running list of this session's changes with `+`/`−` counts.

**Middle — Code, Diff, Preview.** A real Monaco editor (the one VS Code is built on) with a
custom theme. Flip to **Diff** to see exactly what changed, line by line, with a one-click
undo per file. Flip to **Preview** and the app serves your project over http and renders it
live, so a web page you just described is running seconds later.

**Right — Agent.** The stream: collapsible thought process, a card per tool call that expands
to show its output, the live plan, and permission prompts when the agent wants to write or run
something. Below it, the composer — `@` to pin specific files into your prompt.

## Features

| | |
|---|---|
| **Real agentic loop** | Streams from the Messages API with adaptive thinking, tools, and prompt caching. Runs until the job is done, not one reply and out. |
| **Nine tools** | read · write · edit · delete · list · glob-find · regex-search · run command · update plan |
| **Checkpoints** | Every message you send snapshots the files the agent then touches. **History → Rewind** puts them all back. Nothing outside your project folder is ever affected. |
| **Permissions** | *Ask first* pauses before each write or command. *Autopilot* lets it run. Approve once, or always for that kind of action. |
| **Live diffs** | Every write produces a proper diff view, plus per-file undo. |
| **Live preview** | A local static server with an entry-page finder and a reload button. |
| **Cost meter** | Token counts and running spend in the status bar, so there are never surprises. |
| **Sandboxed** | Every path the agent touches is resolved and confined to your project folder. `..` cannot escape it. |
| **Your key, encrypted** | Stored with the OS keychain via Electron `safeStorage`, and sent only to Anthropic. |

## Running it

**The easy way** — double-click **`START.bat`**. First run installs and builds (a few minutes,
once), then the app opens. Every run after that is instant.

**A standalone app** — double-click **`MAKE-EXE.bat`** to package a portable
`release/Masterpiece Coder.exe` you can put on your desktop or a USB stick. No install, no
Node.js needed on the machine that runs it.

You need [Node.js](https://nodejs.org) to build, and an
[Anthropic API key](https://console.anthropic.com/settings/keys) to use it — the app asks for
the key on first launch and stores it encrypted.

<details>
<summary>Command line, if you prefer</summary>

```bash
npm install
npm start          # build once, then launch
npm run dev        # Vite HMR + Electron auto-restart
npm run web        # the interface in a browser, scripted demo, no key needed
npm run pack       # portable .exe into release/
MC_SMOKE=1 npx electron .   # boot, render, report, exit — build smoke test
```

</details>

## How it works

```
src/
  main/          Electron main process — the privileged half
    agent.ts       the streaming agent loop, tool dispatch, graceful API degradation
    tools.ts       the nine tools, their schemas and their executors
    workspace.ts   path confinement, tree walking, globbing
    checkpoints.ts per-turn file snapshots and rewind
    runner.ts      shell execution with output capping and timeouts
    prompt.ts      the system prompt
    static-server.ts  serves the app bundle and the Preview panel
  preload/       the only bridge between the two — a typed, explicit API surface
  renderer/      React + Monaco UI
  shared/        types, line diffing, language detection
```

The renderer has no Node access at all. It cannot touch the filesystem, the network, or your
API key — it can only call the handful of methods the preload script exposes. Everything
privileged happens in `main`, behind path checks.

The agent loop asks for adaptive thinking with a configurable effort level, prompt caching, and
server-side model fallback. If an API key's account doesn't support one of those, the loop
notices the rejection, switches that single feature off, tells you, and carries on — rather than
failing the request.

## The demo build

`npm run web` runs the interface in an ordinary browser against an in-memory project and a
scripted agent run. No key, no filesystem, no cost — useful for seeing the interface, or for
publishing a live demo.

---

Built with Electron, React, Monaco and the Anthropic TypeScript SDK.
