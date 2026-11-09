# Puts several pictures in one grid for a quick side-by-side review (skill driftbound-images, step 4).
# Usage: powershell -NoProfile -ExecutionPolicy Bypass -File tools/montage.ps1 <out.png> <cols> <cellWidth> <img1> <img2> ...
# Each picture is scaled to cellWidth wide, keeping its shape; rows are as tall as the tallest cell.
param([Parameter(Mandatory=$true)][string]$Out, [int]$Cols = 3, [int]$CellW = 900, [Parameter(ValueFromRemainingArguments=$true)][string[]]$Images)
Add-Type -AssemblyName System.Drawing
$imgs = $Images | ForEach-Object { [System.Drawing.Image]::FromFile((Resolve-Path $_)) }
$cellH = ($imgs | ForEach-Object { [int]($_.Height * $CellW / $_.Width) } | Measure-Object -Maximum).Maximum
$rows = [math]::Ceiling($imgs.Count / $Cols)
$b = New-Object System.Drawing.Bitmap ($Cols * $CellW), ($rows * $cellH)
$g = [System.Drawing.Graphics]::FromImage($b)
$g.Clear([System.Drawing.Color]::FromArgb(40, 40, 40)); $g.InterpolationMode = 'HighQualityBicubic'
for ($i = 0; $i -lt $imgs.Count; $i++) {
  $h = [int]($imgs[$i].Height * $CellW / $imgs[$i].Width)
  $g.DrawImage($imgs[$i], ($i % $Cols) * $CellW, [math]::Floor($i / $Cols) * $cellH, $CellW, $h)
}
$b.Save($Out); $g.Dispose(); $b.Dispose(); $imgs | ForEach-Object { $_.Dispose() }
"montage $Out"
