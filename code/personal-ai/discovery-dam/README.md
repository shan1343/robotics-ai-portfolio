# Discovery Dam 후보 정리 모듈

[Personal AI](../../../projects/personal-ai.md) · [Codex 개발 과정](../../../projects/agentic-development.md)

Discovery Dam 0.1.2에서 입력 후보를 정리하는 코드와 기존 테스트를 그대로 가져왔습니다. 원자료 수집은 원본 플러그인의 Skill과 연결 도구가 담당하며, 이 모듈에는 네트워크·모델·계정 호출이 없습니다. 전체 조사 플러그인의 설치본은 포함하지 않았습니다.

| 파일 | 실제 기능 |
|---|---|
| [dam.py](dam.py) | URL 정규화, 후보 병합, 중복·변경 구분, 선택 기준과 피드백 검사 |
| [test_dam.py](test_dam.py) | 기존 일곱 테스트: 재입력, 다양성, 피드백, URL, 퇴출, 시간·입력, 범위 검사 |
| [SOURCE_MANIFEST.json](SOURCE_MANIFEST.json) | 공개 사본의 원본 해시 |

## 코드 구조

- `canonical`: 추적 query를 제거하고 YouTube의 같은 영상 URL을 통일합니다. 검색 조건과 fragment는 구분하며 자격증명이 든 URL은 거절합니다.
- `feedback`: 명시한 사용자 피드백의 버전과 허용 필드를 검사하고 같은 이벤트를 중복 반영하지 않습니다.
- `merge`: 여러 출처의 후보를 합치고 차단·주제 선호·동일 계열 제한을 적용합니다. 새 후보·변경·중복과 미완료 출처를 구분합니다.
- `stamp`: 시간대가 있는 시각만 받아 내부 기준을 UTC로 맞춥니다.

설명과 후보 선택은 Skill에, URL·버전·중복 처리처럼 반복되는 파일 작업은 이 코드에 두었습니다.

## 검사

저장소 루트에서 Python 3으로 실행합니다. 추가 패키지가 필요하지 않습니다.

```sh
python -m unittest discover -s code/personal-ai/discovery-dam -p test_dam.py -v
```

테스트는 합성 URL과 후보를 입력하며, 외부 사이트에 접속하지 않습니다.
