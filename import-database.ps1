# Script tự động import database
Write-Host "=== IMPORT DATABASE ===" -ForegroundColor Cyan

# Đường dẫn MySQL
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
$sqlFile = "E:\KHACHSAN\backend\database.sql"

# Yêu cầu nhập mật khẩu
$password = Read-Host "Nhập mật khẩu MySQL root" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

Write-Host "`nĐang import database..." -ForegroundColor Yellow

# Chạy MySQL command
$process = Start-Process -FilePath $mysqlPath -ArgumentList "-u root -p$plainPassword" -RedirectStandardInput $sqlFile -NoNewWindow -Wait -PassThru

if ($process.ExitCode -eq 0) {
    Write-Host "`n✅ Import database thành công!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Có lỗi xảy ra!" -ForegroundColor Red
}

Write-Host "`nNhấn Enter để đóng..."
Read-Host
