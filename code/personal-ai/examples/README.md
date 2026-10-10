# Personal AI · 실제 Codex Runner 보조 함수 발췌

[전체 AI 개발 경험](../../../projects/agentic-development.md) · [실사용·합성 테스트 구분](../README.md)

이 폴더에는 비공개 개인 저장소의 **실제 PowerShell 소스 파일**에서, 개인 정보와 무인 실행·Provider 쓰기 로직을 제외한 *작은 함수 다섯 개*를 보존했습니다. Codex 등 AI 지원 구현의 기록으로, 사람이 이를 모두 수동 작성했다는 뜻은 아닙니다.

| 파일 | 무엇을 검증할 수 있는가 |
|---|---|
| [verified-cli-helpers.ps1](verified-cli-helpers.ps1) | 외부 프로그램 exit code 판독, 작업 지시 헤더·TASK·DONE_WHEN 읽기, 허용된 저장소 경로만 찾기 |
| [test-verified-cli-helpers.ps1](test-verified-cli-helpers.ps1) | 실제 제공된 함수로 외부 API 없이 **8개 조건** 검사 |

## 재현하기

Windows PowerShell 5.1 이상에서 폴더 안에서 실행합니다.

~~~powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\test-verified-cli-helpers.ps1
~~~

코드의 \`Get-RepoPath\`는 Config의 \`Repositories\`에 없는 이름을 \`$null\`로 거절합니다. 이는 **허용된 저장소 목록을 검증하는 작은 방어 코드**이며, Issue 전체를 승인하거나 작업 실행을 허용하는 완성된 보안 체계는 아닙니다.

## 원본·기여·재사용 범위

- 원문은 개인 **비공개** \`scripts/pai-codex-runner.ps1\`; 이 발췌의 소스 blob SHA는 파일 머리에 남겼습니다.
- 실제 당시 설계는 GitHub Issue 작업 계약 → 승인된 repo allowlist → 분리된 worktree → Codex CLI → 테스트 → Draft PR 및 provider readback입니다. **지속 운영과 무인 복구를 증명한 적은 없습니다.**
- 실제로 원본이 있고 실행 가능한 몇 개 함수를 공개하는 것이 목적이며, API·메일·학생 데이터·팀 코드는 들어 있지 않습니다.

[실제 Runner 및 Skill 실험의 출처/범위](../CLI_AND_SKILLS_EVIDENCE.md)
