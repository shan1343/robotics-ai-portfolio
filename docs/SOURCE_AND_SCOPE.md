# 출처와 공개 범위

[첫 화면](../README.md)

비공개 개발 저장소, 개인 보고서와 팀 자료에서 가져온 파일의 출처입니다.

| 사례 | 확인한 원본 | 공개 내용과 범위 |
|---|---|---|
| G1 | Flat/Rough 설정, 실행 기록, 팀 파이프라인 | 보상 변경·환경 수치와 현재 구조·통합 작업. 과거 checkpoint와 영상의 대응·실물 정책 배포는 미확인 |
| Humanoid | 개인 변경 커밋, 5–6월 개발일지, 팀 실물 경험 | 환경·상태·인터페이스·IK·TF 작업과 mock 계획 시험 |
| RoboCon | 개인 최종보고서와 팀 제작 사진 | 팀 공동 설계·제작, 날짜별 시험과 구조 수정, 개인 보고서 작성 |
| IDC | 팀 발표와 설계 그림, 온라인 화면·안내·스크립트 | 설계·조작·발표 참여. MuJoCo 경험과 Gazebo 제공 자료 분리 |
| SO-101 | 장비 작업, 4쪽 보조자료, 교육 준비 기록 | 2세트·24모터, 학생용 WSL 연결과 자료 사용. 정책 학습은 계획 |
| Personal AI | 개발 원본, Wiki 글과 실행 기록, Skill 패키지 | 사용 경로·개발 과정, 원본 Skill·함수·JS 모듈, 학습 기록 재사용 |
| 교육·SHAPE | 경력·활동 원문과 사용자 최신 확인 | 2022 보조강사 / 2024 실제 강사, SAM, 행사팀장과 미래 활동 |

## 실제 파일과 검사

- [Academic Loop 0.1.3](../code/personal-ai/academic-loop/README.md): 개발 원본의 패키지 14파일과 검사·검토 자료 2파일. 공개 README와 해시 목록을 추가했습니다.
- [Discovery Dam 후보 정리 코드](../code/personal-ai/discovery-dam/README.md): 개발 원본의 Python 파일과 기존 일곱 테스트. 수집·모델·계정 호출 없음.
- [PowerShell 원본 함수](../code/personal-ai/examples/README.md): 개인 Runner의 함수 다섯 개. 로컬 문자열·프로세스 동작 검사는 실제 서비스 실행과 별개입니다.
- [JavaScript 판정기](../code/personal-ai/README.md): 합성 입력 7개를 검사하고 외부 호출은 하지 않습니다. 코드의 참조 문자열은 가상 fixture 표식입니다.
- [학업 기록 재사용](../evidence/personal-ai/academic-reuse.json): 2026-10-04 실제 Wiki 조회와 당시 0.1.1 설치·구조 검사. NotebookLM 실행이나 학습 효과 시험은 포함하지 않습니다.
- [G1 설정](../evidence/g1/flat-settings.yaml): 실행 조건 발췌. 모델·checkpoint 미포함.

## 공개하지 않는 자료

성적·상장, 사진·영상은 Notion에 있습니다. 이 저장소에는 학생·팀원 정보, 개인 일정·메일·자산 데이터, 계정·토큰·로컬 절대 경로와 내부 회의 기록을 넣지 않았습니다.

팀 코드·CAD·미디어 원본은 비공개입니다. Humanoid의 Python 예제는 동작 설명용 의사코드입니다. G1 설정 발췌는 Isaac Lab의 BSD-3-Clause 소스를 바탕으로 수정했습니다. IDC 제공 환경은 [공개 upstream](https://github.com/F-H-P/IDC-Simulation)에 연결합니다.

실행 기록의 날짜와 입력 조건은 각 자료에 표시돼 있습니다.
