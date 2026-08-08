@echo off
title Masterpiece Coder - rebuild
cd /d "%~dp0"

echo   Reinstalling dependencies and rebuilding from scratch...
echo.
call npm install
call npm run build
echo.
echo   Done. Use START.bat to launch.
pause
