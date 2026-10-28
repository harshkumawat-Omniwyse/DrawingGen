# Re-apply Home chart fixes after Code On Time regenerate/restart.
# Run:  powershell -File .\fix-home-charts.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

$files = @(
    "app\controllers\VwDashboardQuote.xml",
    "app\controllers\VwDashboardOrder.xml"
)

foreach ($rel in $files) {
    $path = Join-Path $root $rel
    $text = Get-Content $path -Raw
    $updated = $text -replace '(<view id="chartCompany"[^>]*?type=")Chart(")', '$1Grid$2'
    if ($updated -notmatch '<view id="chartCompany"[^>]*commandId=') {
        $updated = $updated -replace '(<view id="chartCompany")', '$1 commandId="command1"'
    }
    if ($updated -ne $text) {
        Set-Content -Path $path -Value $updated -NoNewline
        Write-Host "FIXED view attributes (type=Grid, commandId=command1): $rel"
    } else {
        Write-Host "OK already Grid with commandId: $rel"
    }
}

$homePath = Join-Path $root "app\pages\Home.html"
$homeContent = Get-Content $homePath -Raw
if ($homeContent -notmatch 'charts-fix\.js') {
    $homeContent = $homeContent -replace '</body>', "    <script src=`"/js/charts-fix.js`"></script>`r`n  </body>"
    Set-Content -Path $homePath -Value $homeContent -NoNewline
    Write-Host "FIXED added charts-fix.js to Home.html"
} else {
    Write-Host "OK Home.html already references charts-fix.js"
}

Write-Host ""
Write-Host "Done. Hard-refresh Home (Ctrl+F5)."
Write-Host "Permanent fix: In Code On Time Designer, open VwDashboardQuote/Order -> chartCompany view -> set Type to Grid and Command Id to command1, then Generate once."
