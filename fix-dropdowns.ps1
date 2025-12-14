# Fix broken dropdown links

$files = @(
    "products\cree-led.html",
    "products\cree-led\xlamp-xp-g3.html",
    "products\wolfspeed-power.html",
    "products\wolfspeed-power\c3m0060065k.html",
    "contact.html",
    "about\index.html",
    "support\index.html",
    "news\index.html",
    "solutions\outdoor-lighting.html"
)

$rootPath = "C:\Users\ymlt\Desktop\cree"

Write-Host "Fixing dropdown links..." -ForegroundColor Green

foreach ($file in $files) {
    $filePath = Join-Path $rootPath $file

    if (-not (Test-Path $filePath)) {
        Write-Host "File not found: $file" -ForegroundColor Yellow
        continue
    }

    Write-Host "Processing: $file" -ForegroundColor Cyan

    $content = Get-Content $filePath -Raw -Encoding UTF8

    # Fix the broken nested anchor tags
    $content = $content -replace '<a href="<a href="([^"]*)" class="dropdown-link" role="menuitem">" role="menuitem">', '<a href="$1" class="dropdown-link" role="menuitem">'

    # Fix broken Products link
    $content = $content -replace '<a href="#" class="nav-link active" role="menuitem">Products aria-haspopup="true" aria-expanded="false">', '<a href="#" class="nav-link active" role="menuitem" aria-haspopup="true" aria-expanded="false">Products'

    # Ensure all dropdown arrows have aria-hidden
    $content = $content -replace '<span class="dropdown-arrow">▼</span>', '<span class="dropdown-arrow" aria-hidden="true">▼</span>'

    # Save the modified content
    Set-Content -Path $filePath -Value $content -Encoding UTF8 -NoNewline

    Write-Host "  ✓ Completed: $file" -ForegroundColor Green
}

Write-Host "`nFix complete!" -ForegroundColor Green
