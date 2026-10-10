# Humanoid Challenge 기술 자료

[프로젝트와 날짜별 작업](../../projects/robotics-integration.md) · [환경·시험 근거](ENVIRONMENT_AND_TEST_EVIDENCE.md)

충돌 환경과 그리퍼 상태, ROS 2 인터페이스와 IK·TF 오류에 관한 자료입니다. 개인 변경 커밋과 개발일지를 바탕으로 작성했으며, 팀 원본 실행 패키지는 포함하지 않았습니다.

| 원본 근거 | 공개 내용 |
|---|---|
| 2026-05-22 테스트·데모 파일 변경 | 닫힌 상태의 attach 누락, 요청 중복 방지와 초기 joint-state 처리 |
| 05-25 `environment.py` 작업본 | Zone 객체 등록·제거와 publisher 경로 |
| 06-02 개발일지 | TRAC-IK 로드 오류와 mock 작업공간 시험 |
| 06-03 개발일지 | 토픽·노드·MoveItClient와 책상 설정의 인터페이스 |
| 06-25 `planning_scene.py` 작업본 | base_link에서 odom 기준 배치로 바꾸려던 수정 |

기반 프레임워크는 팀 자산이며 구현에는 AI의 도움을 받았습니다. 팀 원본은 비공개입니다. 이 문서의 Python 예제는 동작 설명용 의사코드입니다.
