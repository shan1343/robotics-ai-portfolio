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

Write-Output "PASS: 8 checks, provider calls 0"
