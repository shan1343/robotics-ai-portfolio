# Self-contained PowerShell 5.1+ tests for the actual selected helper functions.
# No GitHub operations, API calls, or writes outside this directory.
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "verified-cli-helpers.ps1")

$body = @'
TARGET_REPO: demo/allowlisted
BASE_BRANCH: main
TASK:
Check one allowed source file and report its size.
DONE_WHEN:
- A real file check is reported.
'@
if ((Get-HeaderValue -Body $body -Name "TARGET_REPO") -ne "demo/allowlisted") { throw "HEADER_PARSE_FAIL" }
if ((Get-HeaderValue -Body $body -Name "BASE_BRANCH") -ne "main") { throw "BRANCH_PARSE_FAIL" }
if ((Get-HeaderValue -Body $body -Name "SECRET") -ne $null) { throw "UNEXPECTED_HEADER" }
if ((Get-TaskSection -Body $body) -ne "Check one allowed source file and report its size.") { throw "TASK_PARSE_FAIL" }
if ((Get-DoneWhenSection -Body $body) -notmatch "real file check") { throw "DONE_WHEN_PARSE_FAIL" }

$map = [pscustomobject]@{
    Repositories = [pscustomobject]@{
        "demo/allowlisted" = "C:\safe-worktree"
    }
}
if ((Get-RepoPath -Config $map -Repository "demo/allowlisted") -ne "C:\safe-worktree") { throw "ALLOWLIST_FAIL" }
if ($null -ne (Get-RepoPath -Config $map -Repository "demo/unselected")) { throw "UNSELECTED_REPO_ALLOWED" }

# Windows PowerShell native command handling: stderr may be populated
# even with a zero exit code. Check the exit code, not stderr alone.
$text = Invoke-ExternalText -FilePath "cmd.exe" -Arguments @("/d","/c","echo helper-ok")
if ($text -notmatch "helper-ok") { throw "NATIVE_COMMAND_FAIL" }

# stderr is not itself a failure: native programs can print progress there.
$nativeShell = (Get-Command powershell.exe -ErrorAction Stop).Source
$stderrText = Invoke-ExternalText -FilePath $nativeShell -Arguments @(
    "-NoProfile", "-Command", "[Console]::Error.WriteLine('progress-only'); exit 0"
)
if ($stderrText -notmatch "progress-only") { throw "STDERR_SUCCESS_FAIL" }

# A nonzero native exit must throw, and finally must restore caller state.
$beforeLocation = (Get-Location).Path
$beforePreference = $ErrorActionPreference
$failureMessage = $null
try {
    Invoke-ExternalText -FilePath $nativeShell -WorkingDirectory $PSScriptRoot -Arguments @(
        "-NoProfile", "-Command", "[Console]::Error.WriteLine('expected-failure'); exit 3"
    ) | Out-Null
}
catch {
    $failureMessage = $_.Exception.Message
}
if ($failureMessage -notmatch "exited with code 3" -or $failureMessage -notmatch "expected-failure") {
    throw "NATIVE_FAILURE_NOT_REJECTED"
}
if ((Get-Location).Path -ne $beforeLocation) { throw "LOCATION_NOT_RESTORED" }
if ($ErrorActionPreference -ne $beforePreference) { throw "ERROR_PREFERENCE_NOT_RESTORED" }

Write-Output "PASS: 12 checks, provider calls 0"
