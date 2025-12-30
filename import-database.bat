@echo off
chcp 65001 >nul
echo ========================================
echo    IMPORT DATABASE HOTEL BOOKING
echo ========================================
echo.

set /p password="Nhập mật khẩu MySQL root: "

echo.
echo Đang import database...
echo.

"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p%password% < "E:\KHACHSAN\backend\database.sql"

if %errorlevel% equ 0 (
    echo.
    echo ✅ Import database thành công!
    echo.
) else (
    echo.
    echo ❌ Có lỗi xảy ra! Kiểm tra lại mật khẩu.
    echo.
)

pause
