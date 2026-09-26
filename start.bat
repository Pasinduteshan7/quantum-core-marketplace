@echo off
setlocal enabledelayedexpansion

title Quantum Core Marketplace - Launcher

color 0B

echo ========================================================================
echo.
echo     ██████╗ ██╗   ██╗ █████╗ ███╗   ██╗████████╗██╗   ██╗███╗   ███╗
echo    ██╔═══██╗██║   ██║██╔══██╗████╗  ██║╚══██╔══╝██║   ██║████╗ ████║
echo    ██║   ██║██║   ██║███████║██╔██╗ ██║   ██║   ██║   ██║██╔████╔██║
echo    ██║▄▄ ██║██║   ██║██╔══██║██║╚██╗██║   ██║   ██║   ██║██║╚██╔╝██║
echo    ╚██████╔╝╚██████╔╝██║  ██║██║ ╚████║   ██║   ╚██████╔╝██║ ╚═╝ ██║
echo     ╚══▀▀═╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝ ╚═╝     ╚═╝
echo.
echo             QUANTUM CORE MARKETPLACE - ONE-CLICK LAUNCHER
echo ========================================================================
echo.

set "ROOT_DIR=%~dp0"
cd /d "%ROOT_DIR%"

echo [1/4] Checking Prerequisites...
echo ------------------------------------------------------------------------

:: 1. Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set "NODE_VER=%%i"
echo   [OK] Node.js detected: %NODE_VER%

:: 2. Check Java
where java >nul 2>nul
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] Java 21 is not installed or not in PATH!
    echo Please install Java 21 JDK and configure JAVA_HOME.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('java -version 2^>^&1') do (
    set "JAVA_VER=%%i"
    goto :java_done
)
:java_done
echo   [OK] Java detected: %JAVA_VER%

:: 3. PostgreSQL reminder
echo   [INFO] Ensure PostgreSQL is running on port 5433 with database 'quantumcore_db'

echo.
echo [2/4] Starting Spring Boot Backend (Port 8080)...
echo ------------------------------------------------------------------------
start "Quantum Core - Backend (Spring Boot:8080)" cmd.exe /k "cd /d "%ROOT_DIR%backend-springboot" && color 0A && echo Starting Spring Boot Backend on http://localhost:8080... && mvnw.cmd spring-boot:run"
echo   [OK] Backend process spawned in separate window.

echo.
echo [3/4] Starting Next.js Frontend (Port 3000)...
echo ------------------------------------------------------------------------
start "Quantum Core - Frontend (Next.js:3000)" cmd.exe /k "cd /d "%ROOT_DIR%frontend" && color 09 && echo Starting Next.js Frontend on http://localhost:3000... && npm run dev"
echo   [OK] Frontend process spawned in separate window.

echo.
echo [4/4] Opening Web Application...
echo ------------------------------------------------------------------------
echo   Waiting 5 seconds for dev servers to initialize...
timeout /t 5 /nobreak >nul

start http://localhost:3000

echo.
echo ========================================================================
echo   SYSTEM READY!
echo ========================================================================
echo   - Customer Store:     http://localhost:3000
echo   - Admin Console:      http://localhost:3000/admin
echo   - Live Inquiries:     http://localhost:3000/admin/inquiries
echo   - Spring Boot API:    http://localhost:8080/api
echo   - WebSocket Channel:  ws://localhost:8080/ws
echo.
echo   To stop the servers, simply close the two spawned terminal windows,
echo   or run 'stop.bat'.
echo ========================================================================
echo.
pause
