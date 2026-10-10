# Academic Loop · 실제 개발 패키지

[Personal AI](../../../projects/personal-ai.md) · [공개 파일 안내](../README.md)

공부와 자료 처리의 사용 방식에 맞춰 개발한 Academic Loop 0.1.3입니다. 개발 원본의 패키지 파일 14개와 검사·검토 자료 2개를 변경 없이 복사했습니다. 이 README와 [파일 해시 목록](SOURCE_MANIFEST.json)은 공개 안내를 위해 추가했습니다. 개인 학습 데이터와 계정 설정은 포함하지 않습니다.

## 구조

```text
.codex-plugin/plugin.json          플러그인 이름·버전·Skill 위치
skills/
  academic-class-operator/         수업 전 준비와 수업 후 자료 처리
  academic-study/                  직접 답변·힌트·풀이·대화식 복습
  academic-assignment/             실제 과제 명세와 산출물 확인
  academic-exam/                   시험 범위·자료·연습 준비
references/                       공통 운영·연속 학습·자료 범위·유지보수
tests/                            구조 검사와 행동 검토 사례
```

각 Skill의 `SKILL.md`가 적용 조건과 절차를 담고, `agents/openai.yaml`이 표시·호출 메타데이터를 담습니다. 긴 공통 규칙은 참조 파일로 나눴습니다. 이 패키지 자체가 MCP 연결·권한·서버를 제공하지는 않습니다.

## 네 가지 Skill

| Skill | 실제 지침 |
|---|---|
| [수업 준비·처리](skills/academic-class-operator/SKILL.md) | 수업 전 예습과 수업 후 자료 처리를 구분. 자료를 읽었다는 것과 학습을 완료했다는 것을 구분 |
| [공부](skills/academic-study/SKILL.md) | 질문에 맞춰 직접 답변·힌트·풀이·대화식 복습을 선택하고 실제 답변을 확인 |
| [과제](skills/academic-assignment/SKILL.md) | 공식 문제와 규칙을 읽고 산출물·계산·원본·제출 경계를 확인 |
| [시험](skills/academic-exam/SKILL.md) | 시험 범위와 기존 기록에서 필요한 내용을 찾고 문제 연습 지원 |

[운영 규칙](references/operating-contract.md), [학습·세컨드 브레인 연결](references/learning-and-continuity.md), [자료 범위](references/source-coverage.md), [기록된 화면 작업의 범위](references/recorded-workflows.md), [유지보수](references/maintenance.md)를 읽을 수 있습니다.

## 구조 검사

저장소 루트에서 Python 3으로 실행합니다. 추가 패키지와 외부 계정이 필요하지 않습니다.

```sh
python code/personal-ai/academic-loop/tests/check_contract.py code/personal-ai/academic-loop
```

네 Skill의 구조·참조 경로·완료 기준과 민감 파일 포함 여부를 검사합니다. [행동 검토 사례](tests/source-coverage-cases.md)는 자료 누락·동명 파일·부분 열람 등에서 어떤 판단을 해야 하는지 설명합니다. 구조 통과는 실제 도구 호출·수업 전체 처리·학습 효과의 증거가 아닙니다.

당시 실제 Wiki 조회와 0.1.1 설치 검사는 [별도 실행 발췌](../../../evidence/personal-ai/academic-reuse.json)에 있습니다. 공개 사본 0.1.3의 구조 검사와 이전 버전의 설치 기록을 구분합니다.
