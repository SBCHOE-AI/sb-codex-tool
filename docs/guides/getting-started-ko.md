# sb-codex-tool 처음 사용자 사용 설명서

## 이 문서의 대상

이 문서는 아래에 해당하는 사람을 위한 설명서입니다.

- `Codex`를 처음 사용한다
- `sb-codex-tool`이 왜 필요한지 아직 감이 없다
- 어떤 순서로 명령을 실행해야 하는지 헷갈린다
- `fresh verification`이나 `work journal` 개념이 익숙하지 않다

이 문서를 다 읽고 나면 최소한 아래를 혼자 할 수 있어야 합니다.

1. scaffold 초기화
2. 현재 상태 점검
3. 새 work cycle 시작
4. plan과 scope 채우기
5. 구현 후 verification 준비
6. fresh verification 거치기
7. cycle 종료

## 먼저 이해해야 할 핵심 개념

### `sb-codex-tool`이 하는 일

`sb-codex-tool`은 코드를 대신 써 주는 도구가 아니라, `Codex`가 일관된 방식으로
작업하게 만드는 운영 scaffold입니다.

이 도구는 특히 다음을 도와줍니다.

- 현재 작업 상태를 파일로 남기기
- 새 agent가 어디부터 읽어야 하는지 고정하기
- non-trivial 작업을 `clarify -> plan -> execute -> refactor -> verify`로 운영하기
- 마지막 검증을 fresh agent에게 맡기기
- 사람이 읽는 작업일지를 따로 남기기

### 꼭 기억할 규칙

- 큰 작업은 plan 없이 시작하지 않습니다.
- 구현한 agent가 자기 결과를 최종 승인하지 않습니다.
- 최종 verification은 fresh agent가 해야 합니다.
- 작업이 끝나면 work journal이 갱신됩니다.

## 시작 전에 준비할 것

### 필수 준비물

- Node.js 25 이상
- `codex` 바이너리
- git repository
- `sb-codex-tool` 설치

설치 예시:

```bash
npm install --save-dev sb-codex-tool
```

또는:

```bash
npx sb-codex-tool setup
```

## 처음 한 번만 하는 초기화

repository 루트에서 아래를 실행합니다.

```bash
sb-codex-tool setup
```

이 명령은 다음을 만듭니다.

- `.sb-codex-tool/` 상태 디렉터리
- `AGENTS.md`
- `.ignore`
- `.rgignore`
- workflow 문서
- guide 문서

초기화 직후에는 아래 두 명령으로 상태를 확인합니다.

```bash
sb-codex-tool doctor
sb-codex-tool status
```

### 이 시점에 확인할 것

- `doctor`가 scaffold 누락 없이 통과하는가
- `status`가 현재 stage와 next action을 보여주는가
- `.sb-codex-tool/project.md`, `.sb-codex-tool/state.md`가 만들어졌는가

## 처음 작업할 때 권장 순서

실제 작업은 항상 아래 순서를 권장합니다.

1. `status`로 현재 상태 확인
2. `begin`으로 새 cycle 시작
3. plan과 scope guide 채우기
4. 구현
5. execution summary 갱신
6. refactor
7. `prepare-verify`
8. fresh verification
9. `close`

이 순서를 건너뛰면 나중에 fresh verification이나 handoff에서 막힙니다.

## 명령 순서 예시

### 1. 현재 상태 확인

```bash
sb-codex-tool status
```

여기서 봐야 하는 것은 다음입니다.

- `Current stage`
- `Next action`
- `Hot path`
- `Latest run details`

아직 시작 전이면 보통 `clarify` 단계일 것입니다.

### 2. 새 작업 열기

예를 들어 “상태 패널 추가” 작업을 시작한다고 가정하면:

```bash
sb-codex-tool begin add-status-panel "Add Status Panel"
```

그러면 다음 artifact가 만들어집니다.

- approved plan
- execution summary
- handoff
- fresh verification review
- scope guide
- run record

### 3. plan과 scope 채우기

`begin` 직후에는 placeholder가 있으므로 바로 구현하면 안 됩니다.

먼저 아래 파일을 채워야 합니다.

- `.sb-codex-tool/plans/...-approved.md`
- `.sb-codex-tool/guides/...-scope.md`

여기에는 최소한 아래가 들어가야 합니다.

- objective
- acceptance criteria
- boundaries
- task별 `files / action / verify / done`
- verification expectations

### 4. 구현하기

이제 실제 코드 작업을 합니다.

작업 중에는 가능하면 아래 원칙을 지킵니다.

- 함수와 파일은 짧게 유지
- 기존 코드 재사용 우선
- 복잡한 추상화보다 단순한 흐름 우선
- 필요한 파일만 읽고 전체 repo를 불필요하게 훑지 않기

### 5. execution summary 갱신하기

구현이 진행되면 execution summary를 실제 내용으로 바꿉니다.

특히 다음 섹션을 placeholder 없이 채워야 합니다.

- `Scope`
- `Implemented Surface`
- `Checks Run`
- `Plan vs Actual`
- `Refactor Notes`
- `Deferred Issues`
- `Next-Agent Guidance`

### 6. refactor 하기

`sb-codex-tool`에서 refactor는 선택이 아니라 중요한 품질 단계입니다.

refactor에서 목표로 하는 것은 다음입니다.

- 중복 줄이기
- naming 정리
- module boundary 정리
- 새 agent가 읽기 쉽게 만들기
- “영리해 보이는 코드”를 줄이고 단순하게 만들기

## fresh verification 준비하기

구현과 refactor가 끝났으면 다음을 실행합니다.

```bash
sb-codex-tool prepare-verify
```

이 명령은 보통 다음을 갱신합니다.

- current state
- read-this-first
- handoff
- latest run

이제 stage는 `verify`가 되어야 합니다.

확인:

```bash
sb-codex-tool status
```

## fresh verification은 왜 필요한가

직접 구현한 agent는 자기 코드에 익숙해져 있어서 문제를 놓치기 쉽습니다.

그래서 `sb-codex-tool`은 최종 verification을 반드시 fresh agent가 하게 합니다.

fresh verification agent는 보통 다음을 봅니다.

1. `project.md`
2. `state.md`
3. `read-this-first.md`
4. `code-consistency.md`
5. latest summary
6. latest plan
7. current scope guide
8. current handoff

그리고 아래를 판단합니다.

- plan대로 끝났는가
- 필요한 검증 명령이 실제로 돌았는가
- next-agent guidance가 충분한가
- 문서와 상태가 서로 맞는가
- closure해도 되는가

## verification 이후 종료하기

fresh verification agent가 review 파일에 verdict를 남기면:

```bash
sb-codex-tool close
```

이 명령은 보통 아래를 만듭니다.

- verification summary
- work journal entry
- updated run record
- updated current state

정상적으로 끝나면 stage는 다시 `clarify`로 돌아갑니다.

## 가장 간단한 end-to-end 예시

아래는 처음 사용하는 사람이 따라 하기 쉬운 최소 예시입니다.

### 1. 초기화

```bash
sb-codex-tool setup
sb-codex-tool doctor
sb-codex-tool status
```

### 2. 작업 시작

```bash
sb-codex-tool begin add-help-text "Add Help Text"
```

### 3. plan과 scope 작성

다음 파일을 채웁니다.

- `.sb-codex-tool/plans/...-approved.md`
- `.sb-codex-tool/guides/...-scope.md`

예를 들어 plan task는 이렇게 쓸 수 있습니다.

```text
- files: `src/ui/help.ts`, `tests/help.test.ts`
- action: add concise help text rendering and update tests
- verify: run `node --experimental-strip-types --test tests/help.test.ts`
- done: no
```

### 4. 구현과 요약

- 코드 수정
- 테스트 실행
- execution summary 업데이트

### 5. verification 준비

```bash
sb-codex-tool prepare-verify
sb-codex-tool status
```

### 6. fresh verification

새 agent가 review 파일에 verdict를 남깁니다.

### 7. 종료

```bash
sb-codex-tool close
sb-codex-tool status
```

## subagent는 언제 쓰는가

처음에는 subagent 없이 main agent 하나로 시작해도 충분합니다.

subagent는 이런 경우에만 쓰는 것이 좋습니다.

- 파일 범위가 명확히 나뉜다
- 한 작업을 병렬로 쪼개면 실제로 시간이 줄어든다
- 탐색과 구현을 분리하고 싶다

예시:

```bash
sb-codex-tool assign euclid docs-cleanup "Docs Cleanup"
```

작업이 끝나면 lifecycle도 정리합니다.

```bash
sb-codex-tool complete-assignment euclid close
```

## 자주 하는 실수

### 1. `begin` 직후 바로 구현함

문제:

- plan과 scope에 placeholder가 남음
- `doctor`와 `prepare-verify`에서 막힘

해결:

- approved plan과 scope guide를 먼저 실제 내용으로 채웁니다.

### 2. execution summary를 나중으로 미룸

문제:

- fresh verification agent가 무엇이 구현됐는지 파악하기 어려움

해결:

- 구현 직후 바로 `Implemented Surface`와 `Checks Run`부터 채웁니다.

### 3. 구현한 agent가 직접 closure하려고 함

문제:

- self-confirmation bias 발생

해결:

- 반드시 fresh verification agent가 review를 남긴 뒤 `close`합니다.

### 4. work journal을 상태 파일처럼 쓰려 함

문제:

- 사람용 기록과 agent continuity가 섞임

해결:

- 작업 상태는 `.sb-codex-tool/`의 state/summary/handoff에 남기고
- work journal은 사람이 읽는 일지로만 씁니다.

## 처음 쓰는 사람에게 추천하는 습관

- 매번 `status`부터 본다
- 큰 작업은 `begin`으로 cycle을 열고 시작한다
- summary와 handoff를 미루지 않는다
- verification 전에 `doctor`를 돌린다
- fresh verification을 생략하지 않는다

## 다음에 읽으면 좋은 문서

- [Implementation Menu](../menu/implementation.md)
- [영문 README](../../README.md)
- [한글 README](../../README.ko.md)

이 문서를 먼저 따라 해 보고 나서 implementation contract 문서를 보면,
왜 이런 구조로 운영하는지 훨씬 쉽게 이해할 수 있습니다.
