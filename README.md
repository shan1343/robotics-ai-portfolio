# 포트폴리오

서울대학교 기계공학부

팀원들과 로봇을 설계하고 제작했으며, G1 보행 학습과 Humanoid Challenge의 ROS 2 통합 작업에 참여했습니다. 최근에는 Codex로 Personal AI를 개발하고 있습니다. SHAPE에서는 로봇 교육을 준비하며 행사팀장을 맡고 있습니다.

## 목차

- [로봇 제작과 실험](#로봇-제작과-실험)
- [Personal AI와 에이전트 코딩](#personal-ai와-에이전트-코딩)
- [교육과 SHAPE](#교육과-shape)
- [활동 기록](experience.md)
- [공개 코드와 자료](#공개-코드와-자료)

---

## 로봇 제작과 실험

| 경험 | 맡은 일 | 상세 내용 |
|---|---|---|
| **G1 · 2026.03–04 / 10월** | 실물 조작과 보행 학습, 보상 조정·재학습, 팀 모션 파이프라인 개발·통합 | [보행 설정과 모션 실행 구조](projects/g1.md) |
| **Humanoid Challenge · 2026.05–06** | 충돌 환경, 그리퍼 상태, ROS 2 인터페이스, IK·TF 오류 분석과 팀 실물 시험 | [환경 구성과 통합 작업](projects/robotics-integration.md) |
| **RoboCon · 2022.11** | 팀 로봇의 설계·제작·시험, 바퀴·팔·버킷·전달 구조 수정 | [날짜별 제작 과정](projects/robocon.md) |
| **IDC RoboCon · 2023** | 온라인 로봇 설계·조작 참여, 팀 발표자료 제작 | [설계와 온라인 참가](projects/idc2023.md) |

G1에서는 발을 과도하게 드는 움직임을 줄이려 보상을 다시 조정했고, Humanoid Challenge에서는 화면에 보이는 물체와 경로계획이 고려하는 물체가 다른 문제를 다뤘습니다. RoboCon의 개인 보고서에는 20 mm 단차, 500 g 물체, 로봇 간 전달 문제를 시험하고 구조를 바꾼 과정이 기록돼 있습니다.

## Personal AI와 에이전트 코딩

학습 기록을 다시 찾아 쓰고, 대화가 바뀌어도 개발을 이어갈 수 있도록 Personal AI를 만들고 있습니다. 한 달여 동안 Codex로 구현한 코드를 실행하고 오류를 고치며, 세컨드 브레인과 학업·조사용 Skills·Plugins를 개발했습니다. 자료 정리와 GPT의 대화·연결 도구, Codex 개발 환경이 각각 어떤 일을 맡을지도 정했습니다.

- **[Personal AI 개발과 사용](projects/personal-ai.md):** 전체 구조, 기존 푸리에 학습 기록을 다시 찾은 사례, Academic Loop·Discovery Dam 개발.
- **[Codex로 개발한 과정](projects/agentic-development.md):** 요구와 수정 범위 지정, Windows 실행 오류, Skill 비교 시험, 구현·검토·재시험.
- **[Academic Loop 패키지](code/personal-ai/academic-loop/README.md):** 네 개의 Skill, 공통 참조 문서와 플러그인 설정.

구현과 문서 초안에는 AI의 도움을 받았습니다. 저는 필요한 기능과 수정 범위를 정하고, 작성된 파일을 읽고 실행하며 결과를 검토했습니다.

## 교육과 SHAPE

S.O.S에서 2022년 보조강사로 일했고, 2024년에는 3개월 동안 고2 학생 10명의 수업과 고1 질의응답을 맡았습니다. SAM에서는 학생 4명의 수학을 지도했습니다.

SHAPE 교육을 위해 SO-101 두 세트와 모터 24개를 조립·점검했습니다. 학생용 WSL 환경의 연결 오류를 추적하고, 4쪽 조립 보조자료를 만들어 실습 준비에 사용했습니다. 행사팀장으로는 시연 구성과 장비·인력·리허설을 조율하며 행사와 DemoDay를 준비하고 있습니다.

[SO-101 장비·WSL·교육 준비](projects/so101.md) · [교육·SHAPE와 시간순 활동 기록](experience.md)

---

## 공개 코드와 자료

| 폴더 | 확인할 수 있는 내용 |
|---|---|
| [`projects/`](projects/personal-ai.md) | 경험별 역할, 기술 구조, 시행착오와 결과 |
| [`code/personal-ai/`](code/personal-ai/README.md) | 실제 Skill 패키지, 조사 후보 정리 코드, PowerShell 원본 함수와 JS 판정기 |
| [`code/robotics/`](code/robotics/README.md) | Humanoid 환경·인터페이스·IK·TF 작업의 기술 설명 |
| [`evidence/`](docs/SOURCE_AND_SCOPE.md) | G1 설정 발췌, 개인정보를 뺀 학업 기록 조회·검증 자료 |
| [`scripts/`](scripts/check-links.mjs) | 공개 예제의 회귀 검사와 문서 링크 검사 |

저장소 루트에서 실행합니다. 외부 계정이나 추가 패키지 설치가 필요하지 않습니다.

```sh
node scripts/check-links.mjs
node scripts/check-evidence.mjs
node code/personal-ai/scripts/validate-lived-canary-evidence.mjs code/personal-ai/fixtures/github-pass.synthetic.json
```

PowerShell 원본 함수의 로컬 검사는 다음 명령으로 실행합니다.

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\code\personal-ai\examples\test-verified-cli-helpers.ps1
```

사진·영상·성적·상장은 Notion 포트폴리오에 있습니다. 이 저장소의 파일 출처와 시험 조건은 [출처 안내](docs/SOURCE_AND_SCOPE.md)에 정리했습니다.

[GitHub @shan1343](https://github.com/shan1343)
