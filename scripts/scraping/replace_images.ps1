$file = "src/data/products.ts"
$content = Get-Content -Raw $file

$replacements = @{
    '"/images/first-care-activating-serum.jpg"' = '"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"'
    '"/images/cicapair-tiger-grass-color-correcting-treatment.jpg"' = '"https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80"'
    '"/images/skin-perfecting-2--bha-liquid-exfoliant.jpg"' = '"https://images.unsplash.com/photo-1556228720-1c2a46e1c26b?auto=format&fit=crop&w=800&q=80"'
    '"/images/niacinamide-10----zinc-1-.jpg"' = '"https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=800&q=80"'
    '"/images/cr-me-de-la-mer.jpg"' = '"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80"'
    '"/images/t-l-c--framboos-glycolic-night-serum.jpg"' = '"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"'
    '"/images/hyaluronic-acid-2----b5.jpg"' = '"https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80"'
    '"/images/concentrated-ginseng-renewing-cream.jpg"' = '"https://images.unsplash.com/photo-1571781926291-c477eb31f8da?auto=format&fit=crop&w=800&q=80"'
    '"/images/ceramidin-skin-barrier-moisturizing-cream.jpg"' = '"https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80"'
    '"/images/c15-super-booster.jpg"' = '"https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=800&q=80"'
    '"/images/the-treatment-lotion.jpg"' = '"https://images.unsplash.com/photo-1556228720-1c2a46e1c26b?auto=format&fit=crop&w=800&q=80"'
    '"/images/protini-polypeptide-cream.jpg"' = '"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80"'
    '"/images/cream-skin-toner---moisturizer.jpg"' = '"https://images.unsplash.com/photo-1556228720-1c2a46e1c26b?auto=format&fit=crop&w=800&q=80"'
    '"/images/radian-c-cream.jpg"' = '"https://images.unsplash.com/photo-1571781926291-c477eb31f8da?auto=format&fit=crop&w=800&q=80"'
    '"/images/gentle-cleansing-oil.jpg"' = '"https://images.unsplash.com/photo-1601049541289-9b1b7ce3ea84?auto=format&fit=crop&w=800&q=80"'
    '"/images/overnight-vitalizing-mask.jpg"' = '"https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80"'
    '"/images/vital-hydra-solution-biome-essence.jpg"' = '"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"'
    '"/images/every-sun-day-mineral-sunscreen.jpg"' = '"https://images.unsplash.com/photo-1615397323675-400921473456?auto=format&fit=crop&w=800&q=80"'
    '"/images/skin-recovery-enriched-calming-toner.jpg"' = '"https://images.unsplash.com/photo-1556228720-1c2a46e1c26b?auto=format&fit=crop&w=800&q=80"'
    '"/images/clinical-1--retinol-treatment.jpg"' = '"https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80"'
    '"/images/squalane-cleanser.jpg"' = '"https://images.unsplash.com/photo-1601049541289-9b1b7ce3ea84?auto=format&fit=crop&w=800&q=80"'
    '"/images/caffeine-solution-5----egcg.jpg"' = '"https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80"'
    '"/images/the-eye-concentrate.jpg"' = '"https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80"'
    '"/images/the-regenerating-serum.jpg"' = '"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"'
    '"/images/c-firma-fresh-day-serum.jpg"' = '"https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=800&q=80"'
    '"/images/beste-no--9-jelly-cleanser.jpg"' = '"https://images.unsplash.com/photo-1601049541289-9b1b7ce3ea84?auto=format&fit=crop&w=800&q=80"'
    '"/images/glycolic-acid-7-toning-solution.jpg"' = '"https://images.unsplash.com/photo-1556228720-1c2a46e1c26b?auto=format&fit=crop&w=800&q=80"'
    '"/images/niacinamide-10-zinc-1-.jpg"' = '"https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80"'
    '"/images/effaclar-mat-anti-shine-face-moisturizer.jpg"' = '"https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80"'
    '"/images/skin-perfecting-2-bha-liquid-exfoliant.jpg"' = '"https://images.unsplash.com/photo-1556228720-1c2a46e1c26b?auto=format&fit=crop&w=800&q=80"'
    '"/images/hydro-boost-water-gel.jpg"' = '"https://images.unsplash.com/photo-1571781926291-c477eb31f8da?auto=format&fit=crop&w=800&q=80"'
    '"/images/ultra-facial-cream.jpg"' = '"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80"'
    '"/images/effaclar-mat.jpg"' = '"https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80"'
    '"/images/good-genes-all-in-one-lactic-acid-treatment.jpg"' = '"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"'
}

foreach ($key in $replacements.Keys) {
    $content = $content.Replace($key, $replacements[$key])
}

Set-Content -Path $file -Value $content -Encoding UTF8
Write-Output "Successfully updated products.ts with categorized Unsplash image URLs."
