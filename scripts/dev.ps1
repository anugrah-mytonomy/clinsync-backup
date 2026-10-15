# ClinSync UI + backend (Docker). Run from repo root: .\scripts\dev.ps1
$ErrorActionPreference = "Stop"
$BackendRoot = "C:\Users\anugr\Downloads\ClinSync-Backend\ClinSync-Backend"
$FrontendRoot = Split-Path $PSScriptRoot -Parent

Write-Host "==> Starting ClinSync backend (Docker: db + api on :8001)..." -ForegroundColor Cyan
Push-Location $BackendRoot
docker compose up -d --build
if ($LASTEXITCODE -ne 0) { Pop-Location; exit $LASTEXITCODE }
Pop-Location

Write-Host "==> Starting frontend (Vite on :5188)..." -ForegroundColor Cyan
Write-Host ""
Write-Host "  Frontend:  http://localhost:5188" -ForegroundColor Green
Write-Host "  API docs:  http://localhost:8001/api/v1/docs" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop Vite (Docker keeps running; use 'docker compose down' in backend folder to stop API/DB)." -ForegroundColor Yellow

Set-Location $FrontendRoot
npm run dev
