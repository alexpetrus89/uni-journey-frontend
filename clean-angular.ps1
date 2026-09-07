Write-Host "=== Angular Clean Script ==="

# Verifica directory corrente
$rootFiles = @("angular.json", "package.json", "tsconfig.json")
foreach ($file in $rootFiles) {
    if (-not (Test-Path $file)) {
        Write-Error "Esegui lo script dalla ROOT del progetto Angular."
        exit 1
    }
}

Write-Host "Directory corretta."

# Termina processi Node attivi
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Rimuove cache Angular
if (Test-Path .angular) {
    Write-Host "Rimuovo .angular"
    Remove-Item -Recurse -Force .angular
}

# Rimuove node_modules
if (Test-Path node_modules) {
    Write-Host "Rimuovo node_modules"
    Remove-Item -Recurse -Force node_modules
}

# Rimuove lock file
if (Test-Path package-lock.json) {
    Write-Host "Rimuovo package-lock.json"
    Remove-Item -Force package-lock.json
}

# Reinstalla dipendenze
Write-Host "Reinstallo dipendenze npm"
npm install

Write-Host "Pulizia completata."
