# Masterpiece Coder — project state

**Last updated: 9 August 2026** · 11 commits · 41 source files

Read this first for *where things stand*. Read [`CLAUDE.md`](CLAUDE.md) for
*how to work on it* — architecture, provider traps, verification recipes, and
the Windows/Electron gotchas that cost real debugging time.

---

## 1. What it is and who it's for

Hasan's own Claude Code / Cursor. He loves both but **never uses their
terminals** — the GUI is the entire point. He wants it **free**, because "an
API key is too much of a hurdle", and he wants ideas to become real fast: type
a sentence, watch it get built in front of you.

It's also a portfolio piece — he wants to "be a guy who creates AI Agents".

**How to work with him:** he does not use a terminal. Ship `.bat` files he can
double-click; do the building and deploying for him. Default to $0 solutions.
He tests by actually using the thing, and he *will* find what's broken — so say
plainly what is verified and what is not. Commit and push often (he asked for
this explicitly, so long sessions don't lose work).

## 2. Where everything lives

| | |
|---|---|
| Repo | `keyfive5/Masterpiece-Coder`, branch `main` |
| Source | `D:\Masterpiece-Coder` |
| Live web app | **https://keyfive5.github.io/Masterpiece-Coder/** (Pages → `main` `/docs`) |
| Desktop app | `release\Masterpiece Coder.exe` — portable, 75 MB, no install, no Node needed |
| iPhone shell | `ios-app/` (Expo WebView) |
| Launchers | `START.bat`, `REBUILD.bat`, `MAKE-EXE.bat`, `ios-app\BUILD-IPHONE.bat` |

One React + Monaco app runs on the web, on the desktop, and inside the iOS
shell. The agent loop lives in `src/core` and is injected with a `Workspace`
and a `Net`, so it never knows which host it got.

## 3. What it does

**Prompt first.** The opening screen is one box. Type "make me a snake game",
press enter, and it creates the project (named from your sentence) and starts
building. No folder picker, no key wall.

**Providers** — five wire formats behind one interface:

| Provider | Free | Key | Notes |
|---|---|---|---|
| **Free (Puter)** | yes | no | One-click sign-in. Also syncs projects across devices. **Default.** |
| **Built in** | yes | no | Not an LLM — a blueprint builder. No network, no download, instant. |
| **On this machine** | yes | no | WebLLM on your own GPU. 1–3 GB download once, then fully offline. |
| Google Gemini | free tier | yes | |
| OpenRouter | free models | yes | |
| Ollama | yes | no | Desktop only — a web page can't reach localhost |
| Anthropic | no | yes | Claude, the strongest coding models |
| OpenAI | no | yes | |
| Custom endpoint | — | optional | LM Studio, vLLM, a gateway at work |

**The rest:** nine tools (read/write/edit/delete/list/glob/grep/run/plan);
per-turn checkpoints with rewind; live diff with per-file undo; Monaco editor;
Play button that runs the project; GitHub pull/push/create; cross-device
project sync; phone layout with Add to Home Screen; cost meter; autopilot or
ask-first permissions.

## 4. Status of every feature

### Working and verified

- **The agent loop end to end.** Verified twice: against a mock OpenAI SSE
  server, and against the **live free provider** — it built a complete
  "Dance Revolution" rhythm game (7.7 KB of real game logic) across several
  turns in Hasan's own desktop app.
- **Offline builder** — "make a maze game" writes 3 files, completes a 4-step
  plan, assembles the preview, zero console errors on the production build.
- **Web app on GitHub Pages** — live, 200, zero failed assets; the live entry
  chunk matches the local `docs/` build.
- **Desktop app** — smoke test passes; Monaco mounts with syntax highlighting;
  three panes; preview server serves the project.
- **Play button** — appears whenever the project has an HTML file, and the
  preview auto-opens when a turn changed files.
- **Activity strip** — measured present in 100% of frames while the agent runs,
  with the current action, an elapsed timer and a Stop button.
- **Phone layout** — at 375×812 exactly one pane shows, tabs switch correctly,
  Monaco mounts, no horizontal overflow; manifest + icons present.
- **On-device model is lazily loaded** — its 6 MB chunk is *not* fetched on
  startup, only when selected.
- **iOS shell bundles** — `expo export --platform ios` bundles 597 modules with
  no errors, so it will build on EAS.
- `tsc --noEmit` clean throughout.

### Built but NOT verified

- **The on-device model actually generating.** Verified it loads lazily and
  fails cleanly without WebGPU; never ran a real generation, because that needs
  a multi-GB download on Hasan's machine.
- **GitHub push/pull against a real repo.** The panel and the REST calls are
  written; never exercised with a real token.
- **TestFlight submission.** See open items.

## 5. History — what was asked, what happened

1. **"Make my own Claude Code / Cursor."** Electron + React + Monaco app with a
   real agent loop, nine tools, checkpoints, diff view, preview.
2. **"Make it free, prompt first, more AIs, GitHub Pages, login."** Rebuilt
   around a prompt-first launcher; agent loop moved out of the Electron main
   process into `src/core` so the same code runs in a browser; OPFS workspace
   for the web; multi-provider layer; Puter for free AI + cross-device sync.
3. **"The exe stopped after one thing. Also it should look like it's working."**
   Two bugs. (a) Puter only reports tool calls on a *completed* response, so
   streaming silently dropped every tool call made after the model wrote a
   sentence. (b) Puter is a gateway — Claude models reply in **Anthropic** form
   (`content` array of `tool_use` blocks) while GPT models reply in OpenAI form;
   the extractor only understood one. Both fixed; plus the activity strip, a
   nudge when a model narrates instead of building, and a migration off the
   too-weak `gpt-5-nano` default.
4. **"Own built-in AI as a fallback."** Both options, as chosen: the offline
   blueprint builder (always works) and an opt-in WebLLM model.
5. **"Save to GitHub."** Pull/push/create via the REST API, so it works in the
   browser too — one clean commit per save (blobs → tree → commit → ref).
6. **"iPhone app + TestFlight."** Expo WebView shell built and bundling.
7. **"Play button; the dance game was unplayable."** Play button + auto-open
   preview; prompt now forces the model to reason about the play loop first.

## 6. Open items

1. **TestFlight — the one thing not finished.**
   `ios-app\BUILD-IPHONE.bat` is ready. Interactive `eas login` cannot work for
   his account (2FA/SSO) — that's why it "didn't accept my expo credentials".
   The script now reads an Expo **access token** from `ios-app\.expotoken`,
   which he creates at expo.dev/settings/access-tokens, and checks it with
   `eas whoami` before building. Still needed:
   - one interactive **Apple sign-in** on the first build, so EAS can create the
     signing certificate (it manages it from then on)
   - `credentials/asckey.p8` copied in, for `eas submit`
   - an App Store Connect record for `com.hasanzafar.masterpiececoder`
   *Do not mint credentials through his browser session even if offered* — a
   token he pastes into a file keeps the secret out of the transcript.

2. **Game quality.** His dance game spawned arrows already at the hit line, so
   it was unplayable. `src/core/prompt.ts` now has a section forcing the model
   to work out what the player does second to second before writing code, and
   naming the usual failures (no reaction time, wrong hit test, unplayable
   starting difficulty, no lose state, keyboard-only controls). **Unproven —
   check whether it's enough.**

3. **On-device model, first real run.** The text tool protocol in
   `src/core/local.ts` is the place to look if it misbehaves.

4. **GitHub round trip** with a real token.

## 7. If you change anything

```bash
npm start                        # desktop app
npm run web                      # browser, localhost:5177
npm run web:build                # rebuild docs/ — this is the live site
npm run pack                     # rebuild release/Masterpiece Coder.exe
MC_SMOKE=1 npx electron .        # boot, render, report, exit
MC_PUTER_TEST=1 npx electron .   # live probe of the free provider
```

Changing `src/renderer` or `src/core` means rebuilding `docs/` **and** the exe,
then pushing — otherwise the live site and his desktop app drift apart.

**Update this file at the end of a session.** It is the handoff.
