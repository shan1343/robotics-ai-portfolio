# Academic Loop

[Personal AI](../../../projects/personal-ai.md) · [공개 파일 안내](../README.md)

수업 준비와 공부, 과제·시험에 사용하는 절차를 정리한 Academic Loop 0.1.3입니다. 개발 원본의 패키지 파일 14개와 검사·검토 자료 2개를 그대로 가져왔습니다. 이 README와 [파일 해시 목록](SOURCE_MANIFEST.json)을 추가했으며, 개인 학습 데이터와 계정 설정은 제외했습니다.

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

`SKILL.md`에는 적용 조건과 절차를, `agents/openai.yaml`에는 표시·호출 메타데이터를 담았습니다. 공통 규칙은 참조 파일에 모았습니다. MCP 연결과 권한·서버는 별도로 준비해야 합니다.

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

네 Skill의 구조·참조 경로·완료 기준과 민감 파일 포함 여부를 검사합니다. [행동 검토 사례](tests/source-coverage-cases.md)는 자료 누락·동명 파일·부분 열람에 대한 처리 기준입니다. 이 검사는 도구 호출이나 수업 처리를 실행하지 않습니다.

[실행 발췌](../../../evidence/personal-ai/academic-reuse.json)에는 당시 Wiki 조회와 0.1.1 설치 검사를 담았습니다. 현재 공개 사본은 0.1.3이며 설치 기록과 버전이 다릅니다.
