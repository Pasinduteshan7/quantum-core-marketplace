@echo off
title Quantum Core Marketplace - Stop Servers

color 0C

echo ========================================================================
echo             STOPPING QUANTUM CORE MARKETPLACE SERVERS
echo ========================================================================
echo.

echo [1/2] Stopping Backend on Port 8080...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080" ^| findstr "LISTENING"') do (
    echo   Terminating PID %%a...
    taskkill /F /PID %%a >nul 2>nul
)

echo [2/2] Stopping Frontend on Port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo   Terminating PID %%a...
    taskkill /F /PID %%a >nul 2>nul
)

echo.
echo ========================================================================
echo   ALL SERVERS STOPPED CLEANLY!
echo ========================================================================
echo.
timeout /t 3 >nul
