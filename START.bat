@echo off
title Masterpiece Coder
cd /d "%~dp0"

echo.
echo   ==========================================
echo      MASTERPIECE CODER
echo      Type an idea. Watch it become code.
echo   ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo   Node.js is not installed.
  echo   Get it from https://nodejs.org  then run this file again.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\electron" (
  echo   First run - installing. This takes a few minutes, once.
  echo.
  call npm install
  if errorlevel 1 (
    echo.
    echo   Install failed. Check your internet connection and try again.
    pause
    exit /b 1
  )
  echo.
)

if not exist "dist\main\index.js" (
  echo   Building...
  call npm run build
  if errorlevel 1 (
    echo.
    echo   Build failed.
    pause
    exit /b 1
  )
  echo.
)

echo   Starting...
call npx electron .
