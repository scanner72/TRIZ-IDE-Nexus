@echo off
title TRIZ-IDE Nexus (v0.1.0-ALPHA)
echo ===================================================
echo   Starting TRIZ-IDE Nexus Orchestrator & IDE...
echo ===================================================

echo [1/2] Launching TRIZ MCP Server on http://127.0.0.1:8787 ...
start "TRIZ MCP Server" /min node "%~dp0triz-mcp-server\dist\src\index.js"

timeout /t 2 /nobreak >nul

echo [2/2] Launching TRIZ-IDE Nexus Workbench...
call "%~dp0void\scripts\code.bat" %*

echo Done!
