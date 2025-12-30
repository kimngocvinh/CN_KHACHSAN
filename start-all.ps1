# Script khởi động toàn bộ hệ thống
# Chạy: .\start-all.ps1

Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        KHỞI ĐỘNG HỆ THỐNG QUẢN LÝ KHÁCH SẠN              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Dừng tất cả process Node.js cũ
Write-Host "→ Dừng các process cũ..." -ForegroundColor Yellow
Stop-Process -Name node -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Khởi động Backend
Write-Host "`n→ Khởi động Backend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 5

# Khởi động Frontend
Write-Host "→ Khởi động Frontend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host "`n✅ Hệ thống đã khởi động!" -ForegroundColor Green
Write-Host "`n📍 Backend:  http://localhost:8080" -ForegroundColor Cyan
Write-Host "📍 Frontend: http://localhost:5173`n" -ForegroundColor Cyan

Write-Host "Nhấn Ctrl+C để dừng script này (Backend và Frontend vẫn chạy)" -ForegroundColor Yellow
Write-Host "Để dừng toàn bộ, đóng các cửa sổ terminal Backend và Frontend`n" -ForegroundColor Yellow

# Mở browser
Start-Sleep -Seconds 2
Write-Host "→ Mở trình duyệt..." -ForegroundColor Green
Start-Process "http://localhost:5173"

# Giữ script chạy
while ($true) {
    Start-Sleep -Seconds 1
}
