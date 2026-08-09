@echo off
setlocal enabledelayedexpansion
title Masterpiece Coder - build for iPhone
cd /d "%~dp0"

echo.
echo   ================================================
echo      MASTERPIECE CODER - iPhone build
echo   ================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo   Node.js is not installed. Get it from https://nodejs.org
  pause
  exit /b 1
)

REM ---------------------------------------------------------------
REM  Expo sign-in.
REM  Typing a password at the "eas login" prompt does not work for
REM  accounts with two-factor or SSO, which is why it kept refusing.
REM  An access token avoids the prompt completely.
REM ---------------------------------------------------------------
if not exist ".expotoken" (
  echo   ONE-TIME SETUP - Expo access token
  echo.
  echo   1. A browser window is opening at expo.dev/settings/access-tokens
  echo      ^(you are already signed in there^)
  echo   2. Click "Create token", name it "masterpiece", copy it
  echo   3. Paste it into the file that opens next, save, close Notepad
  echo.
  pause
  start "" "https://expo.dev/settings/access-tokens"
  timeout /t 3 >nul
  echo.> .expotoken
  notepad .expotoken
)

set /p EXPO_TOKEN=<.expotoken
set EXPO_TOKEN=%EXPO_TOKEN: =%
if "%EXPO_TOKEN%"=="" (
  echo   No token found in .expotoken - delete that file and run this again.
  pause
  exit /b 1
)

echo   Using the saved Expo token.
echo.

if not exist "node_modules\expo" (
  echo   Installing. A few minutes, once.
  call npm install
  if errorlevel 1 ( echo   Install failed. & pause & exit /b 1 )
)

if not exist "assets\icon.png" call node make-assets.mjs

echo   Checking the token works...
call npx eas whoami
if errorlevel 1 (
  echo.
  echo   Expo did not accept that token. Delete .expotoken and run this again.
  pause
  exit /b 1
)

echo.
echo   [1/2] Building on Expo's servers - about 20 minutes.
echo.
echo   Apple sign-in: the first build asks for your Apple ID so EAS can
echo   make the signing certificate. That prompt is Apple's, not this
echo   script's - type it there. It only happens once.
echo.
call npx eas build --platform ios --profile production
if errorlevel 1 (
  echo.
  echo   Build failed. The reason is printed above.
  pause
  exit /b 1
)

echo.
echo   [2/2] Sending to TestFlight...
call npx eas submit --platform ios --profile production --latest
if errorlevel 1 (
  echo.
  echo   Submit failed, but the BUILD worked - grab the .ipa from
  echo   https://expo.dev and upload it with Transporter if you prefer.
  pause
  exit /b 1
)

echo.
echo   Done. TestFlight shows it once Apple finishes processing,
echo   usually 10-30 minutes.
echo.
pause
