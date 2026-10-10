# Codex Runner 보조 함수

[전체 AI 개발 경험](../../../projects/agentic-development.md) · [실사용·합성 테스트 구분](../README.md)

개인 저장소의 PowerShell 소스에서 함수 다섯 개를 발췌했습니다. 개인 정보와 무인 실행·Provider 쓰기 로직은 제외했습니다. 원본 구현에는 Codex 등 AI의 도움을 받았습니다.

| 파일 | 내용 |
|---|---|
| [verified-cli-helpers.ps1](verified-cli-helpers.ps1) | 외부 프로그램 exit code 판독, 작업 지시 헤더·TASK·DONE_WHEN 읽기, 허용된 저장소 경로만 찾기 |
| [test-verified-cli-helpers.ps1](test-verified-cli-helpers.ps1) | 실제 제공된 함수로 외부 API 없이 **12개 조건** 검사 |

## 재현하기

Windows PowerShell 5.1 이상에서 폴더 안에서 실행합니다.

~~~powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\test-verified-cli-helpers.ps1
~~~

코드의 `Get-RepoPath`는 Config의 `Repositories`에 없는 이름에 `$null`을 반환합니다. 호출자가 이 반환값을 검사해 실행을 중단해야 합니다. 작업 승인은 호출하는 Runner에서 처리합니다.

## 작업 지시가 함수들을 통과하는 과정

테스트의 입력은 실제 계정 정보를 쓰지 않는 다음 예제입니다.

```text
TARGET_REPO: demo/allowlisted
BASE_BRANCH: main
TASK:
Check one allowed source file and report its size.
DONE_WHEN:
- A real file check is reported.
```

| 함수 | 처리 내용 |
|---|---|
| `Get-HeaderValue` | 행 시작의 `TARGET_REPO`, `BASE_BRANCH` 값을 찾음. 없는 헤더는 `$null` |
| `Get-TaskSection` | `TASK:`에서 `DONE_WHEN:` 전까지의 작업 본문 추출 |
| `Get-DoneWhenSection` | `DONE_WHEN:` 이후의 완료 조건 추출. 없으면 빈 문자열 |
| `Get-RepoPath` | 지정한 이름을 허용 목록에서 조회 |
| `Invoke-ExternalText` | 명령과 인자를 분리해 실행하고 native exit code 검사 |

파서는 문자열을 추출하고 허용 목록 조회는 경로 문자열을 반환합니다. Task 본문의 실행과 Runner의 승인·격리·원본 재조회는 별도 단계이며, 이 발췌에 포함되지 않습니다.

## Windows CLI에서 겪은 오류와 확인 방법

Windows PowerShell 5.1에서는 외부 프로그램이 stderr로 진행 상황을 출력해도 명령 자체는 정상 종료할 수 있습니다. 원본 `Invoke-ExternalText`는 실행 중 `$ErrorActionPreference`를 잠시 `Continue`로 바꾸고, `$LASTEXITCODE`가 0인지 확인합니다. `finally`에서는 호출자의 오류 처리 설정과 작업 디렉터리를 복원합니다.

공개 검사는 파싱·목록 조회·정상 명령에 더해 다음 오류·복원 조건을 포함합니다. 원본 함수의 동작은 유지했습니다.

- stderr에 `progress-only`를 출력하고 exit 0이면 정상 결과를 반환.
- stderr에 오류를 출력하고 exit 3이면 종료 코드와 출력을 포함한 예외 발생.
- 실패 후 호출자의 작업 디렉터리 복원.
- 실패 후 호출자의 `$ErrorActionPreference` 복원.

이 검사는 로컬 Windows PowerShell 프로세스만 실행하며 GitHub·메일·MCP를 호출하지 않습니다.

## 원본과 Runner 구조

- 원문은 개인 **비공개** `scripts/pai-codex-runner.ps1`; 이 발췌의 소스 blob SHA는 파일 머리에 남겼습니다.
- 실제 당시 설계는 GitHub Issue 작업 계약 → 승인된 repo allowlist → 분리된 worktree → Codex CLI → 테스트 → Draft PR 및 provider readback입니다. 당시 Runner 설계이며 지속 운영과 무인 복구는 검증되지 않았습니다.
- 발췌에는 API·메일·학생 데이터·팀 코드가 없습니다.

[실제 Runner 및 Skill 실험의 출처/범위](../CLI_AND_SKILLS_EVIDENCE.md)
