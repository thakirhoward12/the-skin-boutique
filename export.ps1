$outputFile = "CODEBASE_EXPORT.md"
$content = "# Skincare Store Codebase Export`n`n"
$content += "This document contains the core source code for the Skincare Store application. It is formatted specifically to be easily read by LLMs like Claude.`n`n"

$files = Get-ChildItem -Path ".\src" -Recurse -File | Where-Object { $_.Extension -match "\.tsx?$" -or $_.Extension -match "\.css$" }

foreach ($file in $files) {
    # Relativize path for the header
    $relativePath = $file.FullName.Substring((Get-Location).Path.Length + 1).Replace('\', '/')
    $extension = if ($file.Extension -eq ".css") { "css" } else { "tsx" }
    
    $content += "## $relativePath`n"
    $content += "````$extension`n"
    $content += [System.IO.File]::ReadAllText($file.FullName)
    $content += "`n`````n`n"
}

$content += "## package.json`n"
$content += "````json`n"
$content += [System.IO.File]::ReadAllText(".\package.json")
$content += "`n`````n`n"

[System.IO.File]::WriteAllText($outputFile, $content)
Write-Host "Export complete"
