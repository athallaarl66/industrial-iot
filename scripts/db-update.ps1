Write-Host "🚀 Applying industrial-grade database migrations..." -ForegroundColor Cyan

# Ensure we are at the root
$rootPath = Resolve-Path "$PSScriptRoot/.."
Set-Location $rootPath

dotnet ef database update --project server/IndustrialIot.Infrastructure --startup-project server/IndustrialIot.Api

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database infrastructure updated successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Database update failed. Check if Docker (Postgres) is running on port 5433." -ForegroundColor Red
}
