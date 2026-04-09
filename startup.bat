@echo off
title Orbital Portfolio Launcher
echo ========================================
echo   LAUNCHING ORBITAL PORTFOLIO SYSTEM
echo ========================================

echo [1/2] Starting Frontend (Next.js)...
start cmd /k "echo Starting Frontend... && npm run dev"

echo [2/2] Starting Discord Backend (Bridge)...
cd discord-backend
start cmd /k "echo Starting Discord Backend... && npm run dev"

echo.
echo ========================================
echo   SYSTEMS ONLINE - CHECK NEW WINDOWS
echo ========================================
echo Port 3001: Portfolio UI
echo Port 8888: Discord API Bridge
echo ========================================
pause
