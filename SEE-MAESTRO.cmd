@echo off
title Maestro - see what it builds on its own
cd /d "%~dp0"
echo Building projects with the builder that ships inside the app...
echo A browser tab will open when they are ready.
echo.
echo Close this window when you are done looking.
echo.
node scripts/maestro-demo.mjs --open
pause
