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
    $updated = $text -replace '(<view id="chartCompany" type=")Chart(")', '$1Grid$2'
    if ($updated -eq $text) {
        if ($text -match 'id="chartCompany" type="Grid"') {
            Write-Host "OK already Grid: $rel"
        } else {
            Write-Host "WARN chartCompany view not found: $rel"
        }
    } else {
        Set-Content -Path $path -Value $updated -NoNewline
        Write-Host "FIXED Chart -> Grid: $rel"
    }
}

$homePath = Join-Path $root "app\pages\Home.html"
$home = Get-Content $homePath -Raw
if ($home -notmatch 'charts-fix\.js') {
    $home = $home -replace '</body>', "    <script src=`"/js/charts-fix.js`"></script>`r`n  </body>"
    Set-Content -Path $homePath -Value $home -NoNewline
    Write-Host "FIXED added charts-fix.js to Home.html"
} else {
    Write-Host "OK Home.html already references charts-fix.js"
}

Write-Host ""
Write-Host "Done. Hard-refresh Home (Ctrl+F5)."
Write-Host "Permanent fix: In Code On Time Designer, open VwDashboardQuote/Order -> chartCompany view -> set Type to Grid, then Generate once."
