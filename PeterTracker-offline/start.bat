@echo off
REM Abre o Peter Tracker diretamente no navegador padrão (100% offline, sem Node.js e sem Expo Go).
setlocal
start "" "%~dp0peter-tracker.html"
