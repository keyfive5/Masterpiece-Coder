# Masterpiece Coder — iPhone

The iOS shell. It wraps the same web app the desktop and browser use, so a fix
pushed to the site reaches your phone immediately — only changes to this shell
need a new App Store build.

## Build and send to TestFlight

Double-click **`BUILD-IPHONE.bat`**. It installs, builds on Expo's servers, and
submits. About 20 minutes.

The first run asks you to sign in twice:

1. **Expo** — the account that runs the build (`keyfive`).
2. **Apple** — so EAS can create the signing certificate and provisioning
   profile for `com.hasanzafar.masterpiececoder`. It stores them on your Expo
   account, so this only happens once.

Nothing is saved into this folder. If you would rather reuse the local
certificate approach from `pam-def-ios`, drop the `.p12` and `.mobileprovision`
into `credentials/` and add a `credentials.json` — `eas.json` is already set to
`credentialsSource: "local"`.

## Before the first submit

`eas.json` has the App Store Connect API key details copied from your other
apps. Two things need to be true:

- **`credentials/asckey.p8`** must exist (the same key file your other apps
  use — copy it in).
- **An app record** for `com.hasanzafar.masterpiececoder` must exist in App
  Store Connect. `eas submit` offers to create one; if you make it by hand,
  put its numeric ID into `eas.json` as `ascAppId`.

## What it points at

`App.js` loads:

```
https://keyfive5.github.io/Masterpiece-Coder/
```

**That URL must be live before the app is any use** — GitHub Pages has to be
switched on for the repo (Settings → Pages → `main` / `/docs`). Until then the
app shows its "can't reach it" screen. To point at somewhere else, change
`APP_URL` at the top of `App.js`.

## Why a web view

The app is a code editor with a live preview — that is a browser workload, and
maintaining a second native implementation would mean every feature built
twice. The shell adds what the web cannot do on its own: a home-screen icon
that survives, a proper splash, full-screen with no Safari chrome, and a real
App Store listing.

`window.__MC_NATIVE__` is set before the page loads, so the web app can tell it
is running inside the shell.

## Testing without a build

`npx expo start --ios` runs it in the iOS simulator (needs a Mac). On Windows,
the fastest check is the web app itself at phone size — the layout, the bottom
tab bar and the preview are all the same code.
