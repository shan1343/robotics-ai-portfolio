# Humanoid Challenge 환경과 시험 기록

[프로젝트](../../projects/robotics-integration.md) · [공개 범위](README.md)

## 충돌 환경

2026년 5월 25일 `environment.py` 작업본에는 Zone A–D의 작업대·다리·부품 상자·트레이를 CollisionObject로 등록하는 경로가 있습니다. `setup_zone_a/b/c/d`와 `remove_zone_a/b/c/d`로 구역별 등록·제거를 나누고, 오른팔·왼팔의 갱신 순서 충돌을 줄이려 환경 등록을 한 publisher로 모았습니다.

6월 3일에는 작업본의 `client.moveit2_r`와 실제 `MoveItClient._moveit_r` 노출 방식의 차이도 기록됐습니다. 해당 버전 조합의 정상 실행은 확인되지 않았습니다.

## ROS 2와 초기화

| 항목 | 변경 기록 |
|---|---|
| 활성 작업 | `/active_zone` → `/active_mission` |
| 노드 | `competition_manager` → `manipulator_state` |
| ROS 객체 | `MoveItClient(node)` 인자와 수명주기 점검 |
| 작업대 | `config/desk.yaml`과 setup/remove 경로 |

5월 22일 데모 수정은 그리퍼 명령 전에 초기 joint-state callback을 최대 20회 처리합니다. 닫힌 그리퍼의 접근 후 attach 조건과 중복 명령 검사도 같은 커밋에 있습니다.

## TF 좌표계

6월 25일 작업본은 `base_link`에 붙어 로봇과 함께 움직이는 환경을 `odom`에 두려는 수정입니다. TF로 위치·회전을 변환하되, 변환 조회가 실패하면 고정된 책상 배치를 보장할 수 없습니다. 당시 작업본의 팀 반영과 이동 후 실물 결과는 확인되지 않았습니다.

## mock 계획 시험

| 2026-06-02 기록 | 결과 | 범위 |
|---|---:|---|
| `test_moveit_client` | 12/12 | 연결·FK·입력 |
| `test_arm_motion` | 0/47 → 42/47 | TRAC-IK 설치·프로세스 재시작 전후 |
| `test_workspace_d` | 35/53, 53/84 | 위치·pitch 조합을 확장한 경계 시험 |

설정에 TRAC-IK가 있어도 컨테이너에서 `failed to load`가 발생했습니다. 실행 로그와 실제 solver 로드를 확인한 뒤 계획 결과가 바뀌었습니다.

## 실물 경험과 자료

팀원들과 실물에서 물체를 집고 너트를 옮기는 시험에 참여했으며, 최종 placement는 완료하지 못했습니다. 당시 RViz/MoveIt 녹화는 프로그램 실행 화면으로, 실물 너트 운반을 촬영한 영상은 아닙니다.

팀 코드와 원본 영상은 비공개입니다.
