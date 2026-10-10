# 2026 Humanoid Challenge | 로봇이 보는 작업환경과 실제 조작을 맞추는 일

**2026.05–06 · ROS 2 Jazzy · MoveIt 2 · RViz · Python · Docker · TF · TRAC-IK**

[기여·공개 범위와 상태 처리 설명](../code/robotics/README.md) · [환경·TF·시험 근거](../code/robotics/ENVIRONMENT_AND_TEST_EVIDENCE.md) · [코드 출처](../code/robotics/README.md)

Humanoid Challenge의 조작 과제에서는 팔이 목표 자세에 도달하는 것만으로 작업이 끝나지 않습니다. 작업대와 부품이 경로계획의 충돌 장면에 있어야 하고, 그리퍼가 닫힌 상태와 물체가 로봇에 붙은 상태가 일치해야 하며, 로봇이 이동해도 책상은 제자리에 남아야 합니다. 저는 ROBOTIS AI Worker 기반 **팀 시스템**에서 이 경계들을 연결하고 실패 원인을 추적했습니다.

## 내가 한 일과 확인 수준

| 날짜 | 작업과 개인 기여 | 확인된 결과 |
|---|---|---|
| 05.22 | 개인 커밋 `8fc3c96f12d41f6593e6cf514de36c2852e58dd3`에서 그리퍼 판정값, 접근 후 부착 요청, 데모 초기 관절 상태 수신을 수정 | 원본 커밋 diff 확인. 수정 파일은 `tests/` 아래의 노드·데모 파일 |
| 05.25 작업본 | Zone A–D 물체를 MoveIt CollisionObject로 구성하고 등록·제거 경로와 공유 Planning Scene의 단일 publisher 사용을 검토 | 개인 Ubuntu에서 복구한 `environment.py` snapshot |
| 06.02 | `move_group` 로그에서 TRAC-IK 누락을 찾아 실행 환경을 복구하고 작업공간 경계 포즈를 시험 | mock hardware 시험: `0/47 → 42/47`, `35/53`, `53/84` |
| 06.03 | System 팀의 토픽·노드 계약 변경에 맞추고 `MoveItClient(node)` 초기화 및 책상 장면 설정을 점검 | 개발일지의 코드 수정 기록 |
| 06.25 작업본 | 이동하는 로봇에 따라 환경 객체가 움직이는 `base_link` 문제를 `odom` 고정 변환으로 수정 시도 | 미커밋 `planning_scene.py`와 개발일지 확인. 이동 후 실물 검증 미확인 |

### 그리퍼가 이미 닫혀 있을 때의 상태 누락

기존 테스트 노드는 그리퍼의 **열림 → 닫힘** 변화로 자동 attach를 요청했습니다. 닫힌 그리퍼를 유지한 채 팔을 물체로 가져가면 새로운 닫힘 이벤트가 없어 물체가 Planning Scene에서 팔에 붙지 않을 수 있었습니다. 5월 22일 개인 커밋은 `_republish_cb()`에서 최근접 물체를 갱신한 뒤 `hovered` 후보와 현재 닫힘 상태를 함께 확인하도록 바꿨습니다. 대기열의 동일 명령도 검사해 attach 요청이 계속 쌓이는 일을 막았습니다.

~~~python
# 공개 설명을 위해 새로 쓴 의사코드 (팀 소스 원문 아님)
if nearby_object and gripper_closed:
    if not attach_request_pending:
        enqueue_attach_request()
~~~

시뮬레이션 그리퍼 관측값에 맞춰 닫힘 임계값은 `0.50 → 0.35`, 열림 임계값은 `0.40 → 0.25`로 조정했습니다. Zone A/C의 부착 후보 탐색 거리는 각각 `0.08 → 0.15 m`, `0.12 → 0.15 m`로 바꿨습니다. 커밋 메시지는 시뮬레이션 그리퍼 최고값 약 `0.41`, 관측된 EEF–부품 거리 약 `0.10 m`를 근거로 적고 있습니다. 이 값은 그 장면의 상태 판정용이며 실물 파지 허용오차나 안전 거리의 일반값은 아닙니다.

같은 커밋에서 `demo_0519.py`와 `demo_grasp.py`는 그리퍼 명령 전 `rclpy.spin_once(..., timeout_sec=0.05)`를 최대 20회 호출해 초기 joint-state callback을 처리하도록 했습니다. 중복 시각화 노드와 entry point도 제거됐지만, 로컬 patch는 세 수정 파일만 발췌합니다. 변경 위치는 원본 저장소의 **`tests/competition_manager_node.py` 및 데모 파일**입니다. attach 명령 조건의 수정이 production 배포나 물리적 파지 성공의 증거는 아닙니다.

### 장면에 보이는 물체와 경로계획이 고려하는 물체

RViz marker는 화면 표현이고 MoveIt CollisionObject는 경로계획에 쓰이는 장면 데이터입니다. 복구된 5월 25일 `environment.py`에는 Zone A–D별 작업대, 다리, 상자, 부품 등을 box/cylinder로 등록하고 제거하는 함수가 있습니다. `_add_box()`는 물체 ID, 크기, 위치와 단위 quaternion을 `add_collision_box()`에 전달합니다. `setup_zone_a/b/c/d`와 대응하는 `remove_zone_a/b/c/d`는 구역 전환 시 어떤 물체가 장면에 남는지 관리합니다. 물체를 집어 올리고 놓는 단계에는 `attach_collision_object()`와 `detach_collision_object()` 호출 경로도 있습니다.

좌우 팔 인터페이스가 같은 전역 Planning Scene에 동시에 add/remove를 보내면 갱신 순서가 엇갈릴 수 있습니다. 복구 snapshot의 주석은 이 문제를 적고 환경 객체 등록을 오른팔 MoveIt publisher 한쪽으로 모았습니다. 다만 이 snapshot은 `client.moveit2_r`를 참조하고, 6월 3일 개발일지는 당시 `MoveItClient`가 `_moveit_r`만 노출해 `AttributeError`가 발생한다고 기록합니다. **등록 코드의 존재와 해당 버전 조합의 실행 성공은 다른 사실**입니다.

6월 3일에는 `/active_zone → /active_mission`, 노드명 `competition_manager → manipulator_state`, `MoveItClient(node)` 생성 방식, `config/desk.yaml`의 책상 치수 설정을 System 팀 계약에 맞춰 손봤습니다. 이는 팀 모듈 사이의 인터페이스 통합이며 인식·계획·제어 전체의 개인 단독 구현은 아닙니다.

### IK 실패를 기계적 한계로 오진하지 않기

6월 2일 개발일지의 첫 실행에서는 `test_arm_motion`이 `0/47`이었습니다. `kinematics.yaml`과 `/move_group` 파라미터에는 TRAC-IK가 지정됐지만, 실행 컨테이너의 로그에는 `trac_ik_kinematics_plugin failed to load`가 남았습니다. 해당 환경에 플러그인을 설치하고 계획 프로세스를 재시작한 뒤 같은 시험 기록은 `42/47`로 바뀌었습니다. T1이 완전히 올라오기 전에 T2를 시작해 `robot_description`을 찾지 못한 시작 순서 문제도 기록돼 있습니다. IK 실패를 관절 가동범위의 결론으로 받아들이기 전에 실제 solver 로드를 확인한 과정입니다.

| 06.02 개발일지의 mock 시험 | 기록 | 해석 |
|---|---:|---|
| `test_moveit_client` | 12/12 | 연결·FK·입력 검사 |
| `test_arm_motion`, 플러그인 누락 → 복구 | 0/47 → 42/47 | 계획 기능 회복. 남은 5개 실패 존재 |
| `test_workspace_d` 1차 → 확장 | 35/53 → 53/84 | x/y와 pitch 조합별 경계 탐색. 서로 다른 시험 집합 |

작업공간 시험에서 x, y, pitch를 바꾸며 `is_pose_safe()` 초안을 만들었습니다. 예를 들어 `x=0.150 m`에서 pitch 경계가 달라지는 기록은 **그 mock 설정의 결과**입니다. 분모가 다른 시험을 하나의 성공률 향상처럼 합치거나 실물 팔의 안전 작업공간으로 일반화하지 않습니다.

### 이동 후에도 책상을 고정하기 위한 좌표 변환

6월 25일 복구 작업본의 문제 정의는 분명합니다. 책상과 장애물을 `base_link` 기준으로 등록하면 로봇이 이동할 때 RViz marker와 collision object가 로봇을 따라 움직이는 것처럼 보일 수 있습니다. `planning_scene.py` 작업본은 구역을 설정하는 순간 `odom ← base_link` TF를 조회하고, 로봇 상대 좌표에 translation과 quaternion rotation을 적용한 뒤 `frame_id="odom"`으로 box/cylinder를 등록합니다. 목표는 로봇이 움직여도 환경 객체가 odom 위치에 남게 하는 것입니다.

이 코드는 **미커밋 복구 작업본**입니다. TF 조회 실패 시 2초 뒤 경고를 내고 변환하지 않은 좌표를 그대로 사용하는 경로가 있어, 그 경우 odom 위치의 정확성을 보장할 수 없습니다. 팀 기본 브랜치 반영 여부와 이동 후 실물 물체 위치의 검증 결과도 확인되지 않았습니다.

## 실물 시험과 화면 증거

팀원들과 실제 AI Worker에서 **너트를 집어 다른 위치까지 운반하는 과정**을 공동 시험했습니다. 최종 목표 위치에 내려놓는 placement까지 완료했다는 진술은 아닙니다. 이는 본인의 직접 관찰에 근거하지만, 현재 조건별 원시 로그나 해당 순간의 독립 영상은 연결돼 있지 않습니다.

별도로 private 작업 기록의 `evidence/media-review/video-index.json`에는 2026년 5월 22일 **96.148초 RViz/MoveIt 화면 녹화**가 색인돼 있습니다. SHA-256은 `7e4c353728307b22a4041832e39849419bef2be633814b395aa0d9b24699ddb6`이며 추출 프레임 시점은 9.61초·48.07초·86.53초입니다. 이는 화면 구성과 조작 시도에 대한 색인이지 실물 너트 운반 증거가 아닙니다. 원본은 Windows WSL이 아닌 **네이티브 Ubuntu**의 Screencasts 경로에 기록돼 있으며, 이번 작업에서 영상 자체를 회수하거나 재생하지 못했습니다.

## 역할과 배운 점

기반 로봇과 조작 프레임워크는 ROBOTIS 및 팀 작업물입니다. 제 기여는 개인 커밋으로 남은 그리퍼·초기화 수정, 개발일지와 복구 작업본에 남은 환경·인터페이스·IK·TF 통합 문제 해결 과정, 팀 공동 실물 시험입니다. 5월 22일 원본 커밋에는 **Claude Sonnet 4.6 공동 작성 표기**가 있어 AI 코딩 지원을 포함한 작업으로 소개합니다. 화면, Planning Scene, 그리퍼 상태, TF, IK 실행 환경이 서로 다른 결과를 보일 때 로그와 코드의 경계를 따라 원인을 좁힌 경험입니다.
