@echo off
title Masterpiece Coder - build for iPhone
cd /d "%~dp0"

echo.
echo   ================================================
echo      MASTERPIECE CODER - iPhone build
echo   ================================================
echo.
echo   This builds the iOS app on Expo's servers and sends
echo   it to TestFlight. It takes about 20 minutes.
echo.
echo   The first run will ask you to sign in to Expo, and to
echo   Apple so it can create the signing certificate. Type
echo   your passwords into those prompts - nothing is stored
echo   in this project.
echo.
pause

where node >nul 2>nul
if errorlevel 1 (
  echo   Node.js is not installed. Get it from https://nodejs.org
  pause
  exit /b 1
)

if not exist "node_modules\expo" (
  echo   Installing. This takes a few minutes, once.
  call npm install
  if errorlevel 1 ( echo   Install failed. & pause & exit /b 1 )
)

if not exist "assets\icon.png" call node make-assets.mjs

echo.
echo   [1/2] Building on Expo's servers...
call npx eas build --platform ios --profile production
if errorlevel 1 (
  echo.
  echo   Build failed. The message above says why.
  pause
  exit /b 1
)

echo.
echo   [2/2] Sending the build to TestFlight...
call npx eas submit --platform ios --profile production --latest
if errorlevel 1 (
  echo.
  echo   Submit failed. The build itself worked - you can also
  echo   upload it by hand from https://expo.dev
  pause
  exit /b 1
)

echo.
echo   Done. It shows up in TestFlight after Apple finishes
echo   processing, usually 10-30 minutes.
echo.
pause
