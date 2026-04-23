$filePath = "src/data/products.ts"
$content = Get-Content -Raw $filePath

# Regex to find each product block and capture brand and name
$pattern = '(?s)brand:\s*"([^"]+)",\s*name:\s*"([^"]+)",.*?image:\s*"([^"]+)"'
$matches = [regex]::Matches($content, $pattern)

Write-Host "Found $($matches.Count) products to process."

foreach ($match in $matches) {
    if ($match.Success) {
        $brand = $match.Groups[1].Value
        $name = $match.Groups[2].Value
        $currentImage = $match.Groups[3].Value
        $fullMatch = $match.Groups[0].Value
        
        # Skip if it is already a legitimate brand image (heuristic: not unsplash or placeholder)
        if ($currentImage -notmatch "unsplash") {
            if ($currentImage -match "cosrx.com" -or $currentImage -match "laneige.com" -or $currentImage -match "beautyofjoseon.com" -or $currentImage -match "apglobal.com") {
                Write-Host "Skipping $brand $name - already has legitimate image"
                continue
            }
        }

        $query = [uri]::EscapeDataString("$brand $name skincare product")
        Write-Host "Searching for: $brand $name"

        try {
            # Get VQD token
            $htmlParams = @{
                Uri = "https://duckduckgo.com/?q=$query&iax=images&ia=images"
                Headers = @{
                    "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                }
            }
            $html = Invoke-WebRequest @htmlParams -ErrorAction Stop
            
            $vqd = ""
            if ($html.Content -match 'vqd="([^"]+)"') {
                $vqd = $matches[1]
            } elseif ($html.Content -match "vqd=([a-zA-Z0-9-]+)") {
                $vqd = $matches[1]
            }

            if (-not $vqd) {
                Write-Host "Failed to get VQD for $query"
                continue
            }

            # Search API
            $apiParams = @{
                Uri = "https://duckduckgo.com/i.js?l=us-en&o=json&q=$query&vqd=$vqd&f=,,,,"
                Headers = @{
                    "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                    "Accept" = "application/json"
                }
            }
            $apiResponse = Invoke-WebRequest @apiParams -ErrorAction Stop
            $json = $apiResponse.Content | ConvertFrom-Json

            if ($json.results -and $json.results.Count -gt 0) {
                $imageUrl = $json.results[0].image
                Write-Host "Found: $imageUrl"
                
                # Create replacement string
                $replacement = $fullMatch -replace [regex]::Escape($currentImage), $imageUrl
                $content = $content.Replace($fullMatch, $replacement)
                
                # Update file immediately so we save progress
                Set-Content -Path $filePath -Value $content -Encoding UTF8
            } else {
                Write-Host "No images found for $query"
            }
        } catch {
            Write-Host "Error fetching image for $query : $($_.Exception.Message)"
        }
        
        Start-Sleep -Seconds 1 # Polite delay
    }
}

Write-Host "Finished updating images."
