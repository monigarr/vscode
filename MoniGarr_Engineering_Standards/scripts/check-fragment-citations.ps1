#Requires -Version 5.1
<#
.SYNOPSIS
  Quarantine guard: fail if published MES markdown cites Architecture/_part_* build fragments.

.DESCRIPTION
  Architecture/_part_*.md files are build fragments — not published source of truth.
  Canonical handbook is Architecture/ARCHITECTURE.md.
  Run from the MoniGarr_Engineering_Standards root (or pass -Root).

.EXAMPLE
  .\scripts\check-fragment-citations.ps1
#>
[CmdletBinding()]
param(
  [Parameter()]
  [string]$Root
)

$ErrorActionPreference = "Stop"
if (-not $Root) {
  if ($PSScriptRoot) {
    $Root = Split-Path -Parent $PSScriptRoot
  } else {
    $Root = (Get-Location).Path
  }
}
$pattern = '(?i)Architecture/_part_|_part_0\d\.md|_part_header\.md'
$excludeName = { param($n) $n -like '_part_*' -or $n -eq 'check-fragment-citations.ps1' }

$violations = @()
Get-ChildItem -Path $Root -Recurse -File -Include *.md |
  Where-Object { -not (& $excludeName $_.Name) } |
  ForEach-Object {
    $rel = $_.FullName.Substring($Root.Length).TrimStart('\', '/')
    $lines = Get-Content -LiteralPath $_.FullName
    for ($i = 0; $i -lt $lines.Count; $i++) {
      if ($lines[$i] -match $pattern) {
        # Allow README / SYSTEM_CONTEXT quarantine notices that name the pattern without linking as SoT
        if ($lines[$i] -match '(?i)BUILD FRAGMENT|not published|build fragments|quarantine') {
          continue
        }
        $violations += [pscustomobject]@{
          File = $rel
          Line = $i + 1
          Text = $lines[$i].Trim()
        }
      }
    }
  }

if ($violations.Count -gt 0) {
  Write-Host "FAIL: published docs cite Architecture/_part_* fragments (use ARCHITECTURE.md):" -ForegroundColor Red
  $violations | ForEach-Object { Write-Host ("  {0}:{1}: {2}" -f $_.File, $_.Line, $_.Text) }
  exit 1
}

Write-Host "OK: no published fragment citations." -ForegroundColor Green
exit 0
