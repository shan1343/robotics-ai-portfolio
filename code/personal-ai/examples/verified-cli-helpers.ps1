# Actual sanitized helper functions extracted from a private Windows PowerShell
# Codex runner experiment, 2026. This is NOT the working runner or an
# automated production system. The original file had AI coding assistance.
#
# Provenance (PRIVATE source, no GitHub 404 link):
#   repository: personal-development evidence archive
#   path: scripts/pai-codex-runner.ps1
#   source blob: 565f30912ac777976649c852839d2e9aa48cc155
# Functions below preserve source behavior. No host-specific config, tokens,
# repository routes, user identity, polling or provider-write operations included.
# Do not execute unreviewed issue instructions as code.


function Invoke-ExternalText {
    param(
        [Parameter(Mandatory = $true)][string]$FilePath,
        [Parameter(Mandatory = $true)][string[]]$Arguments,
        [string]$WorkingDirectory
    )

    $pushed = $false
    if ($WorkingDirectory) {
        Push-Location $WorkingDirectory
        $pushed = $true
    }

    $previousErrorActionPreference = $ErrorActionPreference
    try {
        # Windows PowerShell 5.1 can surface a native program's stderr as a
        # terminating NativeCommandError when the script-wide preference is Stop,
        # even when the native process exits 0. git fetch commonly writes normal
        # progress such as "From https://..." to stderr. Capture that stream and
        # decide success strictly from the native exit code instead.
        $ErrorActionPreference = "Continue"
        $output = & $FilePath @Arguments 2>&1
        $exitCode = $LASTEXITCODE
        $text = ($output | Out-String).TrimEnd()
        if ($exitCode -ne 0) {
            throw ("{0} exited with code {1}. {2}" -f $FilePath, $exitCode, $text)
        }
        return $text
    }
    finally {
        $ErrorActionPreference = $previousErrorActionPreference
        if ($pushed) {
            Pop-Location
        }
    }
}

function Get-HeaderValue {
    param(
        [Parameter(Mandatory = $true)][string]$Body,
        [Parameter(Mandatory = $true)][string]$Name
    )
    $pattern = "(?im)^" + [regex]::Escape($Name) + ":\s*(.+?)\s*$"
    $match = [regex]::Match($Body, $pattern)
    if ($match.Success) {
        return $match.Groups[1].Value.Trim()
    }
    return $null
}

function Get-TaskSection {
    param([Parameter(Mandatory = $true)][string]$Body)
    $match = [regex]::Match($Body, "(?ms)^TASK:\s*\r?\n(?<value>.*?)(?=^\s*DONE_WHEN:\s*$|\z)")
    if ($match.Success) {
        return $match.Groups["value"].Value.Trim()
    }
    return $null
}

function Get-DoneWhenSection {
    param([Parameter(Mandatory = $true)][string]$Body)
    $match = [regex]::Match($Body, "(?ms)^DONE_WHEN:\s*\r?\n(?<value>.*)\z")
    if ($match.Success) {
        return $match.Groups["value"].Value.Trim()
    }
    return ""
}

function Get-RepoPath {
    param(
        [Parameter(Mandatory = $true)]$Config,
        [Parameter(Mandatory = $true)][string]$Repository
    )
    $property = $Config.Repositories.PSObject.Properties[$Repository]
    if ($null -eq $property) {
        return $null
    }
    return [string]$property.Value
}
