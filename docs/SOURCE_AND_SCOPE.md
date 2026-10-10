# 출처·공개 범위·검증 방법

[첫 화면](../README.md)

이 공개 저장소는 학생의 경험 중 **외부 공개가 가능한 기술 서술과 실제 개인 AI 지원 개발 코드**로만 구성합니다. 팀 소유 사진·동영상·팀 코드 patch 원본, 개인 성적표와 연구 회의·의료 자료는 포함하지 않습니다.

| 프로젝트 | 확인한 원본의 종류 | 공개 범위 | 혼동하면 안 되는 것 |
|---|---|---|---|
| G1 | 개인 Flat/Rough 소스 변형, 실행 설정 발췌 | 보상 변경 비교, 기술 해설과 조건표 | 영상·checkpoint/run 귀속 미검증, 실물 RL 배포 미수행 |
| Humanoid Challenge | 5/22 테스트·데모 변경, 6월 개발일지 | 개인 기여와 문제 분석·mock 수치·설명 의사코드 | 원본 팀 source·patch 무단 공개 및 production 배포 주장 |
| Personal AI | 개발 코드, 제한된 업무 실험과 실패 기록 | 실제 JS 판정기·CLI·합성 fixture | Provider 호출 0인 합성 검사를 실사용 성공으로 승격 |
| AI 코딩 도구 활용 | 개인 저장소의 2026-09~10 보존 문서·작업 기록, 공개 JavaScript 판정기 | 기술 판단·검증 절차와 원본 파일명·시점 | AI 작업자의 구현을 개인 단독 저작으로 주장하거나 Skill·runner 설계를 운영 성과로 승격 |
| RoboCon | 실제 제작 사진과 2022 개인 최종보고서 | 날짜별 시험·기구 수정 과정 | 팀 제작물 전부를 개인 단독 개발로 주장 |
| IDC | Ubuntu/ROS 온라인 안내와 팀 발표 | 참가·조작 경험과 공개 upstream 링크 | 팀 현장 CAD와 온라인 제공 시스템 개인 저작 주장 |
| SO-101 | 장비·교안·교육안 | 준비한 TA 역할과 RL/IL 미래 목표 | 실제 모델 훈련·배포 완료라고 주장 |

## 공개된 실제 코드와 재현 방법

- [Personal AI JavaScript 판정기](../code/personal-ai/src/lived-canary-evidence.js)는 AI 지원 코딩과 사용자 요구 정의·검토를 거친 실제 모듈입니다.
- [AI 코딩 도구 사례](../projects/agentic-development.md)의 비공개 출처는 [파일별 근거 안내](../code/personal-ai/CLI_AND_SKILLS_EVIDENCE.md)에 원본 basename·시점·확인 한계로 표시했습니다. 문서에 쓴 숫자는 보존본의 역사적 관찰치이며, 현재 provider 상태나 재현 가능한 공개 데이터로 추정하지 않습니다. `gh api`로 지정한 비공개 원문 4개를 읽으려 했으나 이 편집 환경에서는 HTTP 404여서 원문 인용과 현재 상태 단정에서 제외했습니다.
- [회귀 시나리오](../scripts/check-evidence.mjs)는 합성 **7/7** 결과가 기준이며 `providerCalls=0`입니다. 실사용 결과로 표시한 입력은 외부 Provider 검증 없이 PASS할 수 없도록 거절합니다.
- [G1 Flat 실행 설정](../evidence/g1/flat-settings.yaml)은 원본 학습 환경의 수치 발췌입니다. `agent.yaml`·checkpoint 없이 완전한 재현 환경은 아닙니다.

## 공개 자료의 권한

- 개인이 작성했거나 공개를 허용받은 설명과 검증 코드를 선별했습니다.
- 비공개 저장소 문서의 짧은 식별자와 사실 요약만 옮겼습니다. 개인 정보·계정·로컬 절대 경로·비공개 전체 URL·팀 코드/이미지/영상은 복제하지 않았습니다. 사용자 제공 Claude Code CLI 2.1.137 설치·인증 확인은 사용 가능성만 뜻하며 과거 완료 프로젝트의 근거가 아닙니다.
- Isaac Lab 기반 환경 설정은 원 프로젝트의 BSD-3-Clause 저작권과 구분하여 **수치·변경 내역만 설명**합니다.
- ROBOTIS AI Worker 팀 변경 코드는 출처 확인과 별도로 팀의 배포 권한이 필요하므로 이번 공개에서 제외했습니다.
- IDC 제공 코드 전체를 올리지 않고 공개 [F-H-P/IDC-Simulation](https://github.com/F-H-P/IDC-Simulation)을 출처로 연결합니다.

교수·CTO 대상 실제 로봇 사진·영상·성적 증빙은 별도 제한 Notion에 보존했습니다. 그 페이지는 초대 기반이며 공개 GitHub가 로그인/권한 없는 링크에 의존하지 않도록 설계했습니다.
