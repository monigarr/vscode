#Requires -Version 5.1
<#
.SYNOPSIS
  Link-check HTTPS URLs listed in REFERENCES.md.

.DESCRIPTION
  Extracts http(s) URLs from REFERENCES.md and probes each with HEAD (falls back to GET).
  Exit 0 when all URLs return success (2xx/3xx). Exit 1 on failures.
  Run from the MoniGarr_Engineering_Standards root (or pass -Root).
  Record results under MDES_REVIEWS/ when used for a Material suite claim.

.EXAMPLE
  .\scripts\check-references-links.ps1
#>
[CmdletBinding()]
param(
  [Parameter()]
  [string]$Root,
  [Parameter()]
  [string]$OutFile
)

$ErrorActionPreference = "Stop"
if (-not $Root) {
  if ($PSScriptRoot) {
    $Root = Split-Path -Parent $PSScriptRoot
  } else {
    $Root = (Get-Location).Path
  }
}

$refsPath = Join-Path $Root "REFERENCES.md"
if (-not (Test-Path -LiteralPath $refsPath)) {
  Write-Host "FAIL: REFERENCES.md not found at $refsPath" -ForegroundColor Red
  exit 1
}

$text = [System.IO.File]::ReadAllText($refsPath, [System.Text.UTF8Encoding]::new($false))
$urlMatches = [regex]::Matches($text, 'https?://[^\s\)\]<>"]+')
$urls = @(
  $urlMatches |
    ForEach-Object { $_.Value.TrimEnd('.', ',', ';', ')', ']') } |
    Select-Object -Unique
)

if ($urls.Count -eq 0) {
  Write-Host "FAIL: no URLs found in REFERENCES.md" -ForegroundColor Red
  exit 1
}

$results = @()
$failures = 0

foreach ($url in $urls) {
  $status = $null
  $ok = $false
  $errorText = ""
  $headers = @{
    "User-Agent" = "Mozilla/5.0 (compatible; MES-REFERENCES-LinkCheck/1.1; +https://github.com/MoniGarr)"
    "Accept"     = "text/html,application/xhtml+xml,application/pdf,*/*"
  }
  try {
    $resp = Invoke-WebRequest -Uri $url -Method Head -Headers $headers -MaximumRedirection 5 -TimeoutSec 45 -UseBasicParsing
    $status = [int]$resp.StatusCode
    $ok = ($status -ge 200 -and $status -lt 400)
  } catch {
    try {
      $resp = Invoke-WebRequest -Uri $url -Method Get -Headers $headers -MaximumRedirection 5 -TimeoutSec 45 -UseBasicParsing
      $status = [int]$resp.StatusCode
      $ok = ($status -ge 200 -and $status -lt 400)
    } catch {
      $ok = $false
      $errorText = $_.Exception.Message
      if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
        $status = [int]$_.Exception.Response.StatusCode
      }
    }
  }

  $row = [pscustomobject]@{
    Url    = $url
    Status = $(if ($null -ne $status) { $status } else { "ERR" })
    Ok     = $ok
    Error  = $errorText
  }
  $results += $row
  if (-not $ok) {
    $failures++
    Write-Host ("FAIL {0} {1}" -f $row.Status, $url) -ForegroundColor Red
    if ($errorText) { Write-Host ("      {0}" -f $errorText) -ForegroundColor DarkRed }
  } else {
    Write-Host ("OK   {0} {1}" -f $row.Status, $url) -ForegroundColor Green
  }
}

$checkedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
$summary = @"
# REFERENCES link-check run

**Checked at (UTC):** $checkedAt
**Source:** ``REFERENCES.md``
**Script:** ``scripts/check-references-links.ps1``
**URLs probed:** $($urls.Count)
**Failures:** $failures

| URL | Status | Ok |
|-----|--------|----|
$($results | ForEach-Object { "| ``$($_.Url)`` | $($_.Status) | $($_.Ok) |" } | Out-String)
"@

if ($OutFile) {
  $outPath = if ([System.IO.Path]::IsPathRooted($OutFile)) { $OutFile } else { Join-Path $Root $OutFile }
  $dir = Split-Path -Parent $outPath
  if (-not (Test-Path -LiteralPath $dir)) {
    New-Item -ItemType Directory -Path $dir | Out-Null
  }
  [System.IO.File]::WriteAllText($outPath, $summary.TrimEnd() + "`n", [System.Text.UTF8Encoding]::new($false))
  Write-Host "Wrote evidence: $outPath"
}

if ($failures -gt 0) {
  Write-Host "FAIL: $failures broken or unreachable link(s)." -ForegroundColor Red
  exit 1
}

Write-Host "OK: all $($urls.Count) REFERENCES.md URLs reachable." -ForegroundColor Green
exit 0
