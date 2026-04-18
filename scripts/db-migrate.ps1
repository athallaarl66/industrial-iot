param (
    [Parameter(Mandatory=$true)]
    [string]$Name
)

Write-Host "🏗️ Orchestrating new database migration: $Name..." -ForegroundColor Cyan

# Ensure we are at the root
$rootPath = Resolve-Path "$PSScriptRoot/.."
Set-Location $rootPath

dotnet ef migrations add $Name --project server/IndustrialIot.Infrastructure --startup-project server/IndustrialIot.Api

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Migration '$Name' added successfully." -ForegroundColor Green
    Write-Host "👉 Run './scripts/db-update.ps1' to apply changes to the live database." -ForegroundColor Yellow
} else {
    Write-Host "❌ Failed to create migration. Ensure the C# code builds correctly." -ForegroundColor Red
}
