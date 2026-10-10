# Personal AI 소스

[개발·사용 경험](../../projects/personal-ai.md) · [Codex 개발 과정](../../projects/agentic-development.md)

개인 개발 저장소에서 선별한 Skill 패키지와 실행 코드입니다. 개인 일정과 계정 설정, 학생 자료와 외부 서비스 쓰기 코드는 제외했습니다.

| 위치 | 내용 |
|---|---|
| [academic-loop/](academic-loop/README.md) | 0.1.3 원본의 네 Skill, 공통 참조, 플러그인과 agent 설정 |
| [discovery-dam/](discovery-dam/README.md) | 조사 플러그인의 실제 후보 정리 코드와 기존 테스트 |
| [examples/](examples/README.md) | 실제 Codex Runner의 PowerShell 함수 다섯 개와 로컬 검사 |
| [src/lived-canary-evidence.js](src/lived-canary-evidence.js) | 합성 결과 보고서의 조건·부작용·보고값 판정 |
| [scripts/validate-lived-canary-evidence.mjs](scripts/validate-lived-canary-evidence.mjs) | JSON 입력을 검사하는 CLI |
| [fixtures/](fixtures/) | 공개 실행용 합성 입력 |
| [CLI_AND_SKILLS_EVIDENCE.md](CLI_AND_SKILLS_EVIDENCE.md) | 원본 파일·시점·확인 범위 |

## 판정기 실행

이 폴더에서 실행합니다. 추가 npm 패키지는 필요하지 않습니다.

```sh
npm run validate
```

정상 합성 입력은 `schemaValid: true`, `verdict: PASS`를 출력합니다. 종료 코드는 PASS 0, 구조 오류 1, 유효하지만 PASS가 아닌 결과 2입니다. 실제 Provider에 접속하거나 입력 내용의 진실성을 외부에서 확인하는 기능은 없습니다. `LIVED_SANITIZED`로 표시한 입력은 이 공개 버전에서 `INVALID`로 거절합니다.

저장소 루트의 [회귀 검사](../../scripts/check-evidence.mjs)는 정상 입력, 부작용, 거짓 PASS, 실사용 위장, 필수 조건 누락과 기준 변조를 확인합니다. [검사 기록](../../evidence/personal-ai/local-regression.json)의 수치는 로컬 합성 시험입니다.
