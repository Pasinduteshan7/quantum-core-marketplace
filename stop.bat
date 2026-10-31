@echo off
title Quantum Core Marketplace - Stop Servers

color 0C

echo ========================================================================
echo             STOPPING QUANTUM CORE MARKETPLACE SERVERS
echo ========================================================================
echo.

echo [1/3] Stopping Spring Boot Backend on Port 8080...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080" ^| findstr "LISTENING"') do (
    echo   Terminating PID %%a...
    taskkill /F /PID %%a >nul 2>nul
)

echo [2/4] Stopping Node.js Backend on Port 5000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000" ^| findstr "LISTENING"') do (
    echo   Terminating PID %%a...
    taskkill /F /PID %%a >nul 2>nul
)

echo [3/4] Stopping Go Gin Backend on Port 8081...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8081" ^| findstr "LISTENING"') do (
    echo   Terminating PID %%a...
    taskkill /F /PID %%a >nul 2>nul
)

echo [4/4] Stopping Next.js Frontend on Port 3000...
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
