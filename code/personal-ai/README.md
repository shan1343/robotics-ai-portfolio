# Agent evidence validator
[프로젝트 설명](../../projects/personal-ai.md) · [첫 화면](../../README.md)

Personal AI 개발 기록에서 추출한 JavaScript 검사 모듈입니다. 원본의 판정 로직과 CLI를 유지하고, 개인정보 없는 합성 GitHub 입력 예제만 포함했습니다. AI 지원 개발 산출물이며 요구 정의·결과 통합·사용 평가에 참여했습니다.

## 확인할 코드
- [판정 모듈](src/lived-canary-evidence.js)
- [CLI](scripts/validate-lived-canary-evidence.mjs)
- [합성 예제](fixtures/github-pass.synthetic.json)

## 실행
Node.js의 ES module을 사용하며 외부 패키지 설치가 필요하지 않습니다.

```sh
cd code/personal-ai
npm run validate
```

예상 결과는 schemaValid=true, verdict=PASS입니다. 합성 예제의 crossScopeSideEffects를 1로 바꾸고 outcome을 FAIL로 바꾸면 METRIC_crossScopeSideEffects로 실패 판정하도록 구현되어 있습니다.

이번 편집에서 CLI를 실제 재실행해 schemaValid=true, verdict=PASS를 확인했습니다. [7개 조건의 회귀 검사](../../scripts/check-evidence.mjs)와 [실제 출력](../../evidence/personal-ai/local-regression.json)도 제공합니다. 합성 입력 검사이며 외부 provider에는 접속하지 않았습니다.

## 범위
정확한 필드 집합·assertion 순서·가상 fixture 기준값·부작용 지표를 검사합니다. 공개 버전에서는 실제 provider 근거가 없는 `LIVED_SANITIZED` 입력을 거부해 합성 결과를 실사용 성공으로 승격하지 않습니다. PASS 보고서를 그대로 믿는 대신 계산한 판정과 보고 outcome의 일치를 요구합니다.

실제 provider에 접속하지 않습니다. 제출된 report가 진실인지 확인하는 수집·재조회 계층은 별도이며, 이 코드만으로 에이전트의 작업 완료가 입증되는 것은 아닙니다. 포함된 참조 문자열은 개인정보와 내부 Git SHA를 제거한 **가상 fixture 값**이며 실제 과거 Git revision이 아닙니다.
