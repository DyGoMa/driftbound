# Makes the pictures for the batch review page (see .claude/skills/driftbound-images/SKILL.md, step 5).
# Usage: powershell -NoProfile -ExecutionPolicy Bypass -File tools/review-images.ps1 <batch.json> <outDir>
# For every item in the batch file it writes, as JPEG into <outDir>/img/:
#   <id>.jpg            the whole picture, at most 1800 px wide
#   <id>-<n>.jpg        each zoom region, enlarged 2x (at most 2400 px wide)
# Regions are fractions of the picture: { "label": "...", "why": "...", "box": [x, y, w, h] }.
# Then run: node tools/review-page.js <batch.json> <outDir>
param([Parameter(Mandatory=$true)][string]$Batch, [Parameter(Mandatory=$true)][string]$OutDir)
Add-Type -AssemblyName System.Drawing
$repo = Split-Path -Parent $PSScriptRoot
$data = Get-Content -Raw -Encoding UTF8 $Batch | ConvertFrom-Json
$img = Join-Path $OutDir 'img'
New-Item -ItemType Directory -Force $img | Out-Null
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 86L

function Save-Jpeg($src, [int]$sx, [int]$sy, [int]$sw, [int]$sh, [double]$scale, [int]$maxW, [string]$path) {
  # Output size names avoid $w/$h: PowerShell variable names ignore case.
  $outW = [int]($sw * $scale); $outH = [int]($sh * $scale)
  if ($outW -gt $maxW) { $outH = [int]($outH * $maxW / $outW); $outW = $maxW }
  $b = New-Object System.Drawing.Bitmap $outW, $outH
  $g = [System.Drawing.Graphics]::FromImage($b)
  $g.InterpolationMode = 'HighQualityBicubic'; $g.PixelOffsetMode = 'HighQuality'
  $g.DrawImage($src, (New-Object System.Drawing.Rectangle 0, 0, $outW, $outH), (New-Object System.Drawing.Rectangle $sx, $sy, $sw, $sh), 'Pixel')
  $b.Save($path, $codec, $params); $g.Dispose(); $b.Dispose()
}

foreach ($item in $data.items) {
  $file = Join-Path $repo $item.file
  $src = [System.Drawing.Image]::FromFile($file)
  "$($item.id): $($src.Width)x$($src.Height)"
  Save-Jpeg $src 0 0 $src.Width $src.Height 1 1800 (Join-Path $img "$($item.id).jpg")
  $n = 0
  foreach ($r in $item.zooms) {
    $n++
    $sx = [int]($r.box[0] * $src.Width); $sy = [int]($r.box[1] * $src.Height)
    $sw = [int]($r.box[2] * $src.Width); $sh = [int]($r.box[3] * $src.Height)
    if ($sx + $sw -gt $src.Width) { $sw = $src.Width - $sx }
    if ($sy + $sh -gt $src.Height) { $sh = $src.Height - $sy }
    Save-Jpeg $src $sx $sy $sw $sh 2 2400 (Join-Path $img "$($item.id)-$n.jpg")
  }
  $src.Dispose()
}
