@echo off
title Masterpiece Coder - build installer
cd /d "%~dp0"

echo   Packaging a standalone Windows .exe.
echo   The first run downloads the Electron runtime, so give it a few minutes.
echo.

if not exist "node_modules\electron" call npm install
call npm run pack
if errorlevel 1 (
  echo.
  echo   Packaging failed.
  pause
  exit /b 1
)

echo.
echo   Done. Your app is in the "release" folder:
echo      release\Masterpiece Coder.exe
echo.
pause
