# Personal AI · 파일별 개발 근거

[프로젝트](../../projects/personal-ai.md) · [Codex 경험](../../projects/agentic-development.md) · [공개 파일](README.md)

2026년 9–10월의 개발 원본과 보존된 실행 기록을 대조했습니다. 아래의 원본 파일명은 출처를 구분하기 위한 것으로, 비공개 계정 URL이나 내부 전체 기록은 공개하지 않습니다.

| 원본 | 확인한 개발 내용 | 공개 자료 |
|---|---|---|
| `scripts/pai-codex-runner.ps1` | 작업 계약 파싱, 저장소 allowlist, 외부 명령의 종료 코드와 상태 복원 | [원본 함수 다섯 개](examples/verified-cli-helpers.ps1) · [로컬 검사](examples/test-verified-cli-helpers.ps1) |
| `operations/PAI_CODEX_RUNNER_V1.md` | 승인한 작업 → 분리된 worktree → Codex → 테스트·변경 검토 → 결과 재조회의 당시 설계 | [실제 함수의 맥락](examples/README.md) |
| `skills/automation-factory-execution/SKILL.md` | 목표, 범위, 원본, 보호 파일, 완료 조건, 검증과 승인 경계 | [작업 지시 경험](../../projects/agentic-development.md) |
| `PORTABLE_STATE_COLD_START_EVALUATION_20260915.md` | 84줄 문맥으로 5개 질문 시험. 연결 도구가 없으면 최신 상태를 확정하지 않음 | [개발 과정](../../projects/personal-ai.md) |
| `SKILL_FORGE_CODEX_INTAKE_20260915.md` | Skill 발견 조건·절차 분리와 기존 평가 방식의 선택 | [Skill 개발](../../projects/agentic-development.md) |
| `portable-skills-and-triggers.md` 및 canary 원본 | 직접 지시와 native Skill의 제한된 control/treatment 비교 | Codex·Antigravity 네 경로 확인. 일반 속도 개선은 미측정 |
| `windows-codex-llm-wiki-hook-debugging.md` | Windows JSON·Python·CP949 오류, 로컬 Wiki 범위와 새 프로세스 시험 | [오류와 확인 방법](../../projects/agentic-development.md) |
| `PAIOS_OPERATIONAL_COMPOUNDING_20260927.md` | 변경 없는 결과·잘못된 조회·충돌한 완료 보고의 실패 기록과 후속 재시험 | 과거 replay 기록. 실제 Provider 상시 운영과 구분 |
| Academic Loop 개발 원본 0.1.3 | 네 Skill, 참조 문서와 패키지 설정 | [원본 패키지 사본](academic-loop/README.md) |
| 2026-10-04 Academic Loop 검증 기록 | 0.1.1 설치본 파일 대조, 구조 검사, 기존 Wiki 조회 | [정제한 실행 발췌](../../evidence/personal-ai/academic-reuse.json) |
| Discovery Dam 개발 원본 0.1.2 | 조사 Skill·참조 문서·URL 정규화·후보 병합·피드백 처리 | [기능과 구조 설명](../../projects/personal-ai.md) |

## 검사 범위

PowerShell의 공개 함수는 실제 원본 blob `565f30912ac777976649c852839d2e9aa48cc155`에서 선별했습니다. 원본 함수의 동작을 유지하고 개인 경로와 서비스 쓰기 코드를 제외했습니다. 공개 테스트는 문자열 처리·허용 목록·외부 명령의 정상/오류 종료와 실패 후 상태 복원을 다룹니다.

JavaScript 판정기는 가상의 참조 문자열과 합성 입력을 사용합니다. 테스트 통과를 실제 일정 변경·메일 발송·권한 설정의 성공으로 해석하지 않습니다. Academic Loop의 설치·구조 검사 역시 실제 수업 전체 처리나 학습 성과와 별개입니다.

사용자는 요구·경로·완료 기준을 정하고 AI 작업물을 검토·통합했습니다. 구현과 문서 초안에는 AI 지원을 받았습니다. 소스 파일의 존재, 로컬 실행, 실제 원본 사용은 각 자료의 확인 범위에 따라 설명합니다.
