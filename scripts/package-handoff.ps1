param([string]$OutputName = 'sandbee-vercel-handoff.zip', [switch]$CleanRelease)
$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
if ([IO.Path]::GetFileName($OutputName) -ne $OutputName -or -not $OutputName.EndsWith('.zip')) {
  throw 'OutputName must be a ZIP filename without directories.'
}
$outputDirectory = Join-Path $projectRoot 'handoff'
[IO.Directory]::CreateDirectory($outputDirectory) | Out-Null
$archivePath = Join-Path $outputDirectory $OutputName
if (Test-Path -LiteralPath $archivePath) { throw "Archive already exists: $archivePath. Choose a new OutputName." }

# Project history is intentionally included. Machine state, secrets and generated builds are not.
$excludedDirs = @('node_modules', '.next', '.git', '.vercel', 'out', 'dist', 'coverage',
  '.lighthouseci', '.playwright-mcp', 'playwright-report', 'test-results', 'handoff',
  '.idea', '.vscode', '.ssh', 'agent-memory-local', 'worktrees', '__pycache__')
if ($CleanRelease) { $excludedDirs += @('.claude', '.memory', 'plan', 'reference') }
function Get-HandoffFiles([string]$directory) {
  foreach ($entry in Get-ChildItem -LiteralPath $directory -Force) {
    if ($entry.Attributes -band [IO.FileAttributes]::ReparsePoint) { throw "Symlink/reparse point must be reviewed: $($entry.FullName)" }
    if ($entry.PSIsContainer) {
      if ($excludedDirs -notcontains $entry.Name) { Get-HandoffFiles $entry.FullName }
      continue
    }
    $name = $entry.Name
    if ($CleanRelease -and $name -in @('CLAUDE.md', '01_CLAUDE_CODE_PROJECT_SYSTEM_PROMPT.md', '02_CLAUDE_CODE_AUTONOMOUS_WORKFLOW.md', '03_SANDBEE_WEBSITE_MASTER_SPEC.md', 'UI-REBUILD-PLAN.md')) { continue }
    if (($name -like '.env*' -and $name -ne '.env.example') -or
        $name -match '\.(log|zip|sha256|tsbuildinfo|pem|key|pfx|p12|pyc)$' -or
        $name -match '\.tmp\.' -or $name -like '.handoff-*' -or
        $name -in @('settings.local.json', 'CLAUDE.local.md', 'next-env.d.ts',
          'session.json', '.session-marker', '.DS_Store', 'Thumbs.db', '.npmrc', '.netrc')) { continue }
    $entry
  }
}

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$files = @(Get-HandoffFiles $projectRoot | Sort-Object FullName)
$manifest = [Collections.Generic.List[object]]::new()
$archive = [IO.Compression.ZipFile]::Open($archivePath, [IO.Compression.ZipArchiveMode]::Create)
try {
  foreach ($file in $files) {
    $relative = $file.FullName.Substring($projectRoot.Length + 1).Replace('\', '/')
    [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $file.FullName,
      "sandbee-website/$relative", [IO.Compression.CompressionLevel]::Optimal) | Out-Null
    $manifest.Add([pscustomobject]@{ path=$relative; bytes=$file.Length; sha256=(Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash.ToLowerInvariant() })
  }
  $entry = $archive.CreateEntry('sandbee-website/HANDOFF-MANIFEST.json')
  $writer = [IO.StreamWriter]::new($entry.Open(), [Text.UTF8Encoding]::new($false))
  try { $writer.Write(($manifest | ConvertTo-Json -Depth 3)) } finally { $writer.Dispose() }
} finally { $archive.Dispose() }

$readback = [IO.Compression.ZipFile]::OpenRead($archivePath)
try {
  $requiredFiles = @('.gitignore', '.env.example', 'package-lock.json', 'vercel.json', 'DEPLOYMENT.md', 'src/app/layout.tsx', 'Dockerfile', 'compose.production.yaml')
  if (-not $CleanRelease) { $requiredFiles += @('.claude/settings.json', '.memory/state/status.json') }
  foreach ($required in $requiredFiles) {
    if (-not $readback.GetEntry("sandbee-website/$required")) { throw "Required ZIP entry missing: $required" }
  }
  if ($readback.Entries.Count -ne $files.Count + 1) { throw 'ZIP entry count mismatch' }
  foreach ($record in $manifest) {
    $packed = $readback.GetEntry("sandbee-website/$($record.path)")
    if (-not $packed -or $packed.Length -ne $record.bytes) { throw "ZIP size mismatch: $($record.path)" }
    $stream = $packed.Open()
    $sha = [Security.Cryptography.SHA256]::Create()
    try {
      $actual = [BitConverter]::ToString($sha.ComputeHash($stream)).Replace('-', '').ToLowerInvariant()
      if ($actual -ne $record.sha256) { throw "ZIP checksum mismatch: $($record.path)" }
    } finally { $stream.Dispose(); $sha.Dispose() }
  }
} finally { $readback.Dispose() }
$hash = (Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash.ToLowerInvariant()
[IO.File]::WriteAllText("$archivePath.sha256", "$hash  $OutputName`n", [Text.UTF8Encoding]::new($false))
Write-Output "ZIP verified: $archivePath"
Write-Output "Files: $($files.Count + 1); bytes: $((Get-Item -LiteralPath $archivePath).Length)"
Write-Output "SHA256: $hash"
