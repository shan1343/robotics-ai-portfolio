# portfolio

서울대학교 기계공학부

로봇 제작과 시험에서 시작해 G1 실물 조작·보행 학습, Humanoid Challenge의 ROS 2·MoveIt 2 통합 작업을 경험했습니다. 예상대로 움직이지 않을 때는 코드와 실행환경을 함께 살피며 원인을 찾아왔습니다. 최근에는 Codex로 Personal AI를 구현·검증하고, SHAPE의 로봇 교육과 행사 준비도 맡고 있습니다.

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
| **G1 · 2026.03–04 / 10월** | 실물 조작과 보행 학습, 보상 조정·재학습, 팀 모션 파이프라인 통합, 공개 정책 행사 실행기·명령 가드·SIM 검증 | [이전 학습 기록](projects/g1.md) · [행사 실행기](projects/g1-event-runtime.md) |
| **Humanoid Challenge · 2026.05–06** | 충돌 환경, 그리퍼 상태, ROS 2 인터페이스, IK·TF 오류 분석과 팀 실물 시험 | [환경 구성과 통합 작업](projects/robotics-integration.md) |
| **RoboCon · 2022.11** | 팀 로봇의 설계·제작·시험, 바퀴·팔·버킷·전달 구조 수정 | [날짜별 제작 과정](projects/robocon.md) |
| **IDC RoboCon · 2023** | 온라인 로봇 설계·조작 참여, 팀 발표자료 제작 | [설계와 온라인 참가](projects/idc2023.md) |

G1 학습에서는 발을 과하게 드는 동작을 보고 보상 설정을 수정했습니다. Humanoid Challenge에서는 화면의 물체와 경로계획의 충돌 객체가 서로 다르게 취급되는 문제를 다뤘습니다. 더 이른 RoboCon 제작에서는 20 mm 단차, 500 g 물체를 드는 팔, 두 로봇 사이의 물체 전달 문제를 여러 차례 시험하며 구조를 바꿨습니다. 각 사례에서 확인된 결과와 아직 확인하지 못한 부분은 상세 문서에 구분했습니다.

## Personal AI와 에이전트 코딩

대화가 바뀔 때마다 이전 학습·개발 기록을 다시 설명하지 않으려고 Personal AI를 만들기 시작했습니다. Notion·Drive·Wiki의 원자료는 각 서비스에 두고, 필요한 내용을 다시 찾는 기능과 학업·조사용 Skills를 개발했습니다. 한 달여 동안 Codex가 작성한 코드를 직접 실행하고 오류를 확인하면서, 대화 도구와 로컬 개발환경을 어떤 작업에 나눠 쓸지도 정했습니다.

- **[Personal AI 개발과 사용](projects/personal-ai.md):** 전체 구조, 기존 푸리에 학습 기록을 다시 찾은 사례, Academic Loop·Discovery Dam 개발.
- **[Codex로 개발한 과정](projects/agentic-development.md):** 요구와 수정 범위 지정, Windows 실행 오류, Skill 비교 시험, 구현·검토·재시험.
- **[Academic Loop 패키지](code/personal-ai/academic-loop/README.md):** 네 개의 Skill, 공통 참조 문서와 플러그인 설정.

구현과 초안 작성에는 AI 도구를 적극 사용했습니다. 직접 맡은 일은 요구사항과 수정 범위를 정하고, 생성된 파일을 실행·검토해 실제 결과가 기대와 맞는지 판단하는 것이었습니다.

## 교육과 SHAPE

수학 교육 경험도 있습니다. 2022년 S.O.S에서 학습관리와 질의응답을 보조했고, 2024년에는 3개월 동안 고2 학생 10명의 수업을 맡았습니다. SAM 활동에서는 학생 4명의 수학을 지도했습니다.

SHAPE에서는 SO-101 두 세트와 모터 24개를 조립·점검했습니다. 학생용 WSL 환경의 연결 문제를 확인하고, 조립 순서와 모터 ID를 정리한 4쪽 보조자료도 만들었습니다. 행사팀장으로서는 시연할 동작뿐 아니라 장비·담당 인원·리허설·안전 대응을 함께 준비하고 있습니다.

[SO-101 장비·WSL·교육 준비](projects/so101.md) · [교육·SHAPE와 시간순 활동 기록](experience.md)

---

## 공개 코드와 자료

| 폴더 | 확인할 수 있는 내용 |
|---|---|
| [`projects/`](https://github.com/shan1343/robotics-ai-portfolio/tree/main/projects) | 경험별 역할, 기술 구조, 시행착오와 결과 |
| [`code/personal-ai/`](https://github.com/shan1343/robotics-ai-portfolio/tree/main/code/personal-ai) | 실제 Skill 패키지, 조사 후보 정리 코드, PowerShell 원본 함수와 JS 판정기 |
| [`code/robotics/`](https://github.com/shan1343/robotics-ai-portfolio/tree/main/code/robotics) | Humanoid 환경·인터페이스·IK·TF 작업의 기술 설명 |
| [`evidence/`](https://github.com/shan1343/robotics-ai-portfolio/tree/main/evidence) | G1 설정 발췌, 개인정보를 뺀 학업 기록 조회·검증 자료 |
| [`scripts/`](https://github.com/shan1343/robotics-ai-portfolio/tree/main/scripts) | 공개 예제의 회귀 검사와 문서 링크 검사 |

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

사진·영상·성적·상장은 지정 수신자에게 공유하는 Notion 포트폴리오에 따로 정리했습니다. 공개 코드의 출처, 재현 범위와 시험 조건은 [출처 안내](docs/SOURCE_AND_SCOPE.md)에서 확인할 수 있습니다.

[GitHub @shan1343](https://github.com/shan1343)
