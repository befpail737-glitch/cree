# Cree Website HTML Optimization Script
# Optimizes Google Fonts loading and adds ARIA labels to navigation

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

Write-Host "Starting HTML optimization..." -ForegroundColor Green

foreach ($file in $files) {
    $filePath = Join-Path $rootPath $file

    if (-not (Test-Path $filePath)) {
        Write-Host "File not found: $file" -ForegroundColor Yellow
        continue
    }

    Write-Host "Processing: $file" -ForegroundColor Cyan

    $content = Get-Content $filePath -Raw -Encoding UTF8

    # 1. Replace Google Fonts loading (async optimization)
    $oldFonts = @'
    <!-- Optimized Google Fonts Loading -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
'@

    $newFonts = @'
    <!-- Optimized Google Fonts Loading -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
      rel="stylesheet"
      media="print"
      onload="this.media='all'">
    <noscript>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    </noscript>
'@

    $content = $content -replace [regex]::Escape($oldFonts.Trim()), $newFonts.Trim()

    # 2. Add ARIA to main navigation
    $content = $content -replace '<nav class="main-nav">', '<nav class="main-nav" aria-label="Main navigation">'
    $content = $content -replace '<ul class="nav-menu">', '<ul class="nav-menu" role="menubar">'

    # 3. Add ARIA to nav items
    $content = $content -replace '<li class="nav-item">', '<li class="nav-item" role="none">'
    $content = $content -replace '<li class="nav-item dropdown">', '<li class="nav-item dropdown" role="none">'

    # 4. Add role="menuitem" to nav links
    $content = $content -replace '(<a href="[^"]*" class="nav-link[^"]*")(>)', '$1 role="menuitem"$2'

    # 5. Add ARIA to dropdown links
    $content = $content -replace '(<a href="#" class="nav-link"[^>]*)(>)(\s*Products\s*<span)', '$1 aria-haspopup="true" aria-expanded="false"$2$3'
    $content = $content -replace '(<a href="#" class="nav-link"[^>]*)(>)(\s*Solutions\s*<span)', '$1 aria-haspopup="true" aria-expanded="false"$2$3'

    # 6. Add aria-hidden to dropdown arrows
    $content = $content -replace '<span class="dropdown-arrow">▼</span>', '<span class="dropdown-arrow" aria-hidden="true">▼</span>'

    # 7. Add role and aria-label to dropdown menus
    $content = $content -replace '<ul class="dropdown-menu">', '<ul class="dropdown-menu" role="menu">'

    # 8. Add role to dropdown items
    $content = $content -replace '<li class="dropdown-item">', '<li class="dropdown-item" role="none">'
    $content = $content -replace 'class="dropdown-link"', 'class="dropdown-link" role="menuitem"'

    # 9. Convert mobile menu toggle to button
    $oldMobileToggle = @'
                <div class="mobile-menu-toggle">
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                </div>
'@

    $newMobileToggle = @'
                <button
                  class="mobile-menu-toggle"
                  aria-label="Toggle navigation menu"
                  aria-expanded="false"
                  aria-controls="mobile-nav">
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                </button>
'@

    $content = $content -replace [regex]::Escape($oldMobileToggle.Trim()), $newMobileToggle.Trim()

    # Save the modified content
    Set-Content -Path $filePath -Value $content -Encoding UTF8 -NoNewline

    Write-Host "  ✓ Completed: $file" -ForegroundColor Green
}

Write-Host "`nOptimization complete!" -ForegroundColor Green
Write-Host "Modified $($files.Count) files." -ForegroundColor Cyan
