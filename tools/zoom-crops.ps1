# Zoom crops for reviewing a picture (art/refs/REVIEW_CHECKLIST.md).
# Usage: powershell -File tools/zoom-crops.ps1 <image> <prefix> [cols]
#   cols = 4 for a four-view sheet (default), 1 for a single picture.
# Writes 2x crops to %TEMP%\kcheck (a short path: GDI+ fails on the long scratchpad path, STYLE.md fix 7):
#   <prefix>-heads.png   top 30% across all views (faces, hair, marks on the head)
#   <prefix>-mid.png     30% to 62% across all views (arms, chest, forearm marks, hands at hip height)
#   <prefix>-low.png     62% to 100% across all views (legs, boots, tails)
#   <prefix>-vN.png      each view on its own, N = 1..cols (1 FRONT, 2 LEFT SIDE, 3 RIGHT SIDE, 4 BACK)
# Prints the image's pixel size first (checklist line 1).
param([Parameter(Mandatory=$true)][string]$Image, [Parameter(Mandatory=$true)][string]$Prefix, [int]$Cols = 4)
Add-Type -AssemblyName System.Drawing
$out = Join-Path $env:TEMP 'kcheck'
New-Item -ItemType Directory -Force $out | Out-Null
$src = [System.Drawing.Image]::FromFile((Resolve-Path $Image))
"size $($src.Width)x$($src.Height)"
function Save-Crop([int]$x, [int]$y, [int]$w, [int]$h, [string]$name, [double]$scale) {
  # PowerShell names ignore case, so the output size must not be called $W/$H.
  $outW = [int]($w * $scale); $outH = [int]($h * $scale)
  $b = New-Object System.Drawing.Bitmap $outW, $outH
  $g = [System.Drawing.Graphics]::FromImage($b)
  $g.InterpolationMode = 'HighQualityBicubic'
  $g.DrawImage($src, (New-Object System.Drawing.Rectangle 0, 0, $outW, $outH), (New-Object System.Drawing.Rectangle $x, $y, $w, $h), 'Pixel')
  $path = Join-Path $out "$name.png"
  $b.Save($path); $g.Dispose(); $b.Dispose()
  $path
}
$w = $src.Width; $h = $src.Height
Save-Crop 0 0 $w ([int]($h * 0.30)) "$Prefix-heads" 2
Save-Crop 0 ([int]($h * 0.30)) $w ([int]($h * 0.32)) "$Prefix-mid" 2
Save-Crop 0 ([int]($h * 0.62)) $w ([int]($h * 0.38)) "$Prefix-low" 2
if ($Cols -gt 1) {
  $cw = [int]($w / $Cols)
  for ($i = 0; $i -lt $Cols; $i++) { Save-Crop ($i * $cw) 0 $cw $h "$Prefix-v$($i + 1)" 1 }
}
$src.Dispose()
