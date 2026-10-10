# Humanoid Challenge · 개인 기여와 공개 근거

[상세 프로젝트](../../projects/robotics-integration.md) · [환경·IK·TF 분석](ENVIRONMENT_AND_TEST_EVIDENCE.md) · [첫 화면](../../README.md)

**원본 보존:** 2026년 5월 22일의 실제 변경은 ROBOTIS AI Worker 기반 팀 프로젝트의 `tests/` 하위 테스트·데모 파일 3개에 대한 수정입니다. 개인 커밋과 개발일지는 비공개 저장소에 그대로 보존했습니다. 팀 소유 patch와 원본 Python 코드를 공개할 권한이 확인되지 않아 여기에는 원문을 복사하지 않았습니다.

**직접 다룬 범위:** 환경 CollisionObject·Planning Scene 상태, 닫힌 그리퍼의 attach 누락/중복 요청, ROS 2와 MoveIt 2 인터페이스, TRAC-IK/TF 오류 분석과 mock 작업공간 시험, 실물 AI Worker의 팀 공동 시험.

**AI·팀 구분:** 기존 프레임워크와 일부 AI 코딩 지원을 바탕으로 본인이 문제를 정의하고 수정·검토·통합했습니다. 테스트 경로의 변경을 production 실물 배포나 물리적 grasp 성공으로 주장하지 않습니다.

[기술적 문제와 당시 수치의 해설](ENVIRONMENT_AND_TEST_EVIDENCE.md)에서 상세하게 읽을 수 있습니다.
