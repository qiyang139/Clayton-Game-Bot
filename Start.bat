@echo off
title Tool ClayTon @zepmoo

setlocal

:: Mở terminal tại thư mục hiện tại
cd /d %~dp0

:: In ra câu chào
echo Tool ClayTon @zepmoo

:: Kiểm tra phiên bản Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js chua duoc cai dat. Vui long cai dat Node.js truoc.
    exit /b 1
)

echo Dang chay Tool Tool ClayTon
node clayton.js

:: pause
pause

endlocal
