@echo off
title ShortsBuddy Creator Hub
echo ========================================================
echo        ⚡ ShortsBuddy Creator Hub - Local Server
echo ========================================================
echo.
echo Starting local web server on port 8000...
echo Opening your browser at: http://localhost:8000
echo.
echo (Press Ctrl+C in this terminal window anytime to stop)
echo ========================================================
echo.

start http://localhost:8000
python -m http.server 8000

pause
