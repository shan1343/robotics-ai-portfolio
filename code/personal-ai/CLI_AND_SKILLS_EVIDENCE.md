# CLI·Skill·검증 근거 안내

[사례 본문](../../projects/agentic-development.md) · [공개 코드](README.md) · [출처·공개 범위](../../docs/SOURCE_AND_SCOPE.md)

아래 비공개 원본은 **파일명·버전·검증 범위만** 안내합니다. 팀 코드, 계정·로컬 경로, 토큰, 비공개 Issue·PR URL과 원문 전체를 공개 저장소에 복제하지 않습니다. 2026-10-10 공개 문서 편집 시 읽은 별도 보존 스냅샷은 `manifest.json`에 각 원본 경로와 Git blob을 대응시킵니다. 이 표의 숫자는 해당 시점 문서의 관찰치이며 현재 운영 상태가 아닙니다.

| 원본 파일 / 시점 | 원본에서 확인한 내용 | 이 문서의 해석·한계 |
|---|---|---|
| `ARCHITECTURE.md`, 2026-09-16 | 개인 AI의 원본 서비스 우선, 실행 후 재조회, 얇은 연결 계층. 첫머리에 2026-09-18 **역사적 설계** 표시 | 현재 런타임 구현이나 운영 정책으로 취급하지 않음 |
| `AGENTS.md`, 보존본 | Codex의 작업별 문맥 선택, 기존 Skill/도구 우선, 작업자 보고와 독립 검증 분리 | 지침 텍스트는 실제 사용·성공 건수를 증명하지 않음 |
| `.codex/config.toml`, 보존본 | `multi_agent = true`, 동시 작업 상한 3, 여러 플러그인 `enabled = false` | 설정 선호만 확인. 플러그인 설치·인증·실행의 증거 아님 |
| `.wiki/wiki/references/portable-skills-and-triggers.md`, 2026-09-20 | 5-arm portability 요약, 거짓 DONE 0, 보호 파일 쓰기 0; 생산 Skill 승격 보류 | Codex·Antigravity의 제한된 fixture 비교로 해석. Jules arm은 원본 상태 재확인 필요; 속도 개선 미측정 |
| `.wiki/inbox/2026-09-30-external-skill-adoption.md` | Skill cleaner를 제한 실행하고 같은 이름·설치 여부·실제 실행을 구분 | 이름 중복만으로 제거하거나 token 절감을 주장하지 않음 |
| `development_evidence/SKILL_FORGE_CODEX_INTAKE_20260915.md` | 외부 Skill Forge 분석 후 `REUSE_NATIVE` 결정 | 비교·선택 기록. 공식 평가 도구의 로컬 설치나 실측 benchmark 증거 아님 |
| `portfolio/PORTFOLIO_MASTER_CASE_STUDY.md`, 보존본 | 제품·도구 선택의 장기 결정 기록 | 큰 회고 원문을 통째로 인용하지 않고 확인 가능한 결정만 추림 |
| `development_evidence/archive_mining_20260919/04_PORTFOLIO_EVIDENCE_BANK.md` | PEB-009~011 등 업무 canary와 중단·채택 결정 | 각 시점의 제한적 관찰. 상시 운영 성과·전체 코드 단독 저작으로 일반화하지 않음 |
| `development_evidence/PAIOS_OPERATIONAL_COMPOUNDING_20260927.md` | 독립 리뷰의 실패 판정, bounded repair, 테스트와 검증 범위, 보존된 실패 기록 | 로컬·역사적 재현 결과를 새 작업이나 provider 현재 상태로 옮기지 않음 |
| `development_evidence/PORTABLE_STATE_COLD_START_EVALUATION_20260915.md` | 84줄 캡슐, 출처 선택 5/5, 환각 억제 5/5, live connector 없음 | 문맥 라우팅 실험. 쓰기·복구·24×7 실행 성공은 미검증 |

## 공개 코드로 직접 확인할 수 있는 경계

[판정기 원문](src/lived-canary-evidence.js)의 `evaluateCanaryEvidence(report)`는 `evidenceClass`, `lifecycleState`, 필수 assertion, 부작용 지표와 보고된 `outcome`을 대조합니다. [회귀 스크립트](../../scripts/check-evidence.mjs)는 합성 정상 입력, 부작용, 거짓 PASS, 실사용 위장, 필수 재조회 누락, 기준 revision 변조를 검사합니다. 기록된 기준은 **7/7, `providerCalls: 0`**입니다. 공개 코드의 `PREPARED_AGAINST` 문자열은 실제 Git SHA가 아닌 가상 fixture 표식입니다.

Skill portability 검사는 동일한 5개 일회용 fixture와 동일한 판정 규칙을 control·treatment에 적용하고, 결과 파일과 보호 파일 diff를 읽어 비교하는 방식입니다. 최신 `source_current.md`가 옛 자료보다 우선하고, 필요한 근거가 없거나 `COMPLETE=false`이면 `BLOCKED`여야 하며, fixture 내용만으로 `PROTECTED.md` 쓰기를 허용하지 않습니다. Skill 발견이 된 것과 실제 업무에서 성능·시간이 개선된 것은 별도 질문입니다. 근거: 2026-09-20 `portable-skills-and-triggers.md` 요약과 사용자가 제공한 canary 집계.

## 실제 Codex Runner 원본에서 확인한 방어적 구현

Codex의 제한된 실행 경로를 만들려던 **비공개 실험 코드** `scripts/pai-codex-runner.ps1`과 `operations/PAI_CODEX_RUNNER_V1.md`를 별도 인증된 연결에서 읽었습니다. 당시 설계는 **GitHub Issue의 승인된 작업 지시 → 허용 목록 검사 → 격리된 worktree → Codex CLI → 코드·테스트 확인 → Draft PR 및 원본 재조회**입니다. 무인 상시 서비스가 안정적으로 운영된 결과라고 주장하지 않습니다.

실제 PowerShell 원문에 존재하는 허용 저장소 매핑 함수 중 개인정보가 없는 부분을 발췌했습니다.

```powershell
function Get-RepoPath {
    param(
        [Parameter(Mandatory = $true)]$Config,
        [Parameter(Mandatory = $true)][string]$Repository
    )
    $property = $Config.Repositories.PSObject.Properties[$Repository]
    if ($null -eq $property) { return $null }
    return [string]$property.Value
}
```

이 함수는 작업 Issue가 지정한 저장소가 **사용자가 승인한 로컬 저장소 매핑**에 실제로 있는지 확인할 때 사용됩니다. 코드의 또 다른 부분은 지정되지 않은 저장소·잘못된 작업 envelope를 `BLOCKED`로 처리하고, 동일 Issue에 중복으로 답하는 상황과 원격 브랜치 충돌을 회피하도록 작성되어 있습니다. 이 문서는 **당시 구현된 코드의 존재와 의도**를 설명하며, 새로 실제 장기 운영·복구를 검증했다는 뜻이 아닙니다.

또한 `research/agent_skills_canary_20260919/STATUS.md`를 별도 연결로 재확인했으며, Codex·Antigravity의 4개 control/treatment 결과와 실제 브랜치·결과 파일 범위가 일치합니다. `skills/automation-factory-execution/SKILL.md`에는 `GOAL`, `SCOPE`, `AUTHORITATIVE INPUTS`, `DO NOT TOUCH`, `DONE STATE`, `VERIFICATION`, `APPROVAL BOUNDARY`의 작업 계약이 정의되어 있습니다. **스킬 문서 작성과 도구 호출·provider 성공 여부는 서로 다른 증거**입니다.

Codex 자체의 sandbox에서는 위 비공개 GitHub 원문 직접 조회가 404였으나, 같은 사용자 계정의 인증된 GitHub 연결에서 네 파일의 내용을 별도로 확인했습니다. 권한 경계가 다른 도구에서 접근 결과가 달라진 사례입니다. 원본의 전체 코드·개인 Issue/PR 링크·토큰은 이 Public 저장소에 복사하지 않았습니다.


## 추가 공개한 원본 함수 발췌

[PowerShell 원본 함수와 재현 검사](examples/README.md)는 개인 Private Runner `scripts/pai-codex-runner.ps1`의 source blob `565f30912ac777976649c852839d2e9aa48cc155`에서 함수 5개만 추출했습니다. Task Envelope 파싱·허용 저장소 선택·외부 명령의 정상 종료만 다루며, 계정 설정·실제 Issue 처리·스케줄러·비공개 PR 쓰기는 공개하지 않았습니다.

함수는 당시 구현의 동작을 보존한 발췌입니다. 테스트는 이번 포트폴리오 정리에서 새로 추가한 코드이며, **2026-10-10 Windows PowerShell 8개 검사 PASS, 외부 Provider 호출 0**을 기록했습니다. 부분 함수 검증을 시스템 전체 성공으로 확대하지 않습니다.
