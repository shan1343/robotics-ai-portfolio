# Humanoid Challenge · 공개한 기술 설명

[프로젝트와 날짜별 작업](../../projects/robotics-integration.md) · [환경·시험 근거](ENVIRONMENT_AND_TEST_EVIDENCE.md)

이 폴더는 팀 원본 코드를 복사한 실행 패키지가 아닙니다. 개인 변경 커밋과 개발일지에 근거해 충돌 환경, 그리퍼 상태, ROS 2 인터페이스, IK·TF 문제를 설명합니다.

| 원본 근거 | 공개 내용 |
|---|---|
| 2026-05-22 테스트·데모 파일 변경 | 닫힌 상태의 attach 누락, 요청 중복 방지와 초기 joint-state 처리 |
| 05-25 `environment.py` 작업본 | Zone 객체 등록·제거와 publisher 경로 |
| 06-02 개발일지 | TRAC-IK 로드 오류와 mock 작업공간 시험 |
| 06-03 개발일지 | 토픽·노드·MoveItClient와 책상 설정의 인터페이스 |
| 06-25 `planning_scene.py` 작업본 | base_link에서 odom 기준 배치로 바꾸려던 수정 |

직접 맡은 수정·검토·통합 과정과 팀 실물 시험을 함께 기록했습니다. 기반 프레임워크와 구현에 팀·AI 기여가 있습니다. 팀 원본은 비공개에 보존하고, 공개 설명의 의사코드는 실행 가능한 팀 소스로 표시하지 않습니다.
