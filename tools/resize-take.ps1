# Resizes a take that came out at the wrong size (checklist line 1) to 2048x1024 as the next version.
# Usage: powershell -NoProfile -ExecutionPolicy Bypass -File tools/resize-take.ps1 <name-vN> <name-vM>
#   e.g. tools/resize-take.ps1 skarn-head-v1 skarn-head-v2   (files in art/refs/; never overwrites)
# Saves through %TEMP%\kcheck (GDI+ fails on long paths, STYLE.md fix 7) and writes the prompt note.
param([Parameter(Mandatory=$true)][string]$From, [Parameter(Mandatory=$true)][string]$To)
Add-Type -AssemblyName System.Drawing
$repo = Split-Path -Parent $PSScriptRoot
$src = Join-Path $repo "art\refs\$From.png"; $dst = Join-Path $repo "art\refs\$To.png"
if (Test-Path $dst) { "$To exists, kept"; exit 1 }
$tmp = Join-Path $env:TEMP 'kcheck'; New-Item -ItemType Directory -Force $tmp | Out-Null
$s = [System.Drawing.Image]::FromFile($src); $w = $s.Width; $h = $s.Height
$b = New-Object System.Drawing.Bitmap 2048, 1024
$g = [System.Drawing.Graphics]::FromImage($b); $g.InterpolationMode = 'HighQualityBicubic'; $g.PixelOffsetMode = 'HighQuality'
$g.DrawImage($s, 0, 0, 2048, 1024)
$b.Save((Join-Path $tmp "$To.png"), [System.Drawing.Imaging.ImageFormat]::Png); $g.Dispose(); $b.Dispose(); $s.Dispose()
Copy-Item (Join-Path $tmp "$To.png") $dst
"No prompt: take $From.png (${w}x$h) resized on this PC to 2048x1024 (checklist line 1). No new drawing." |
  Out-File -Encoding ascii (Join-Path $repo "art\refs\prompts\$To.txt")
"$To 2048x1024 (from ${w}x$h)"
