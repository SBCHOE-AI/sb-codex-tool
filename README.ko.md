# sb-codex-tool

`sb-codex-tool`은 일반 소프트웨어 프로젝트를 위한 가벼운 `Codex`
workflow/runtime scaffold입니다.

프로젝트 상태, hot path 가이드, fresh-agent verification, 사람이 읽는
작업일지를 한눈에 확인 가능한 구조로 유지하면서도 코드베이스 전체를
덮어쓰지 않도록 설계되어 있습니다.

영문 README: [README.md](./README.md)

## 왜 필요한가

`sb-codex-tool`은 agent 기반 작업을 더 엄격하게 운영하고 싶지만, 무거운
플랫폼을 도입하고 싶지 않은 프로젝트를 위해 만들어졌습니다.

이 도구가 해결하려는 핵심 문제는 다음과 같습니다.

- 현재 작업 상태를 fresh agent도 바로 이해할 수 있게 유지하기
- non-trivial 작업을 `plan -> execute -> refactor -> verify`로 강제하기
- 최종 verification을 항상 fresh agent가 수행하게 만들기
- agent용 상태와 사람용 작업일지를 분리해 두기
- onboarding과 verification을 짧은 hot path로 고정하기

목표는 Codex를 대체하는 것이 아니라, 일반적인 repository 안에서 Codex
작업을 더 반복 가능하고 검증 가능하게 만드는 것입니다.

## 핵심 원칙

- 최종 closure에는 fresh verification이 필수입니다.
- 상태는 세션이 바뀌어도 유지되어야 합니다.
- main agent의 사용자 진행 보고는 짧고 한국어로 유지합니다.
- subagent는 범위를 좁게 잡고, 완료 후 clear 또는 replace합니다.
- 코드는 재사용 가능하고, 짧고, 읽기 쉽고, 복잡하지 않게 유지합니다.
- 사람용 작업 로그와 agent continuity state는 분리합니다.

## 요구 사항

- Node.js 25 이상
- Codex가 working tree를 읽고 쓸 수 있는 프로젝트
- 기본 launch wrapper를 쓸 경우 `codex` 바이너리
- 명시적 상태, handoff, verification artifact가 필요한 작업 방식

## 설치

프로젝트에 로컬로 추가할 때:

```bash
npm install --save-dev sb-codex-tool
```

한 번만 실행할 때:

```bash
npx sb-codex-tool setup
```

## 빠른 시작

repository에 scaffold를 초기화합니다.

```bash
sb-codex-tool setup
```

현재 scaffold와 운영 상태를 점검합니다.

```bash
sb-codex-tool doctor
sb-codex-tool status
```

bounded work cycle을 시작합니다.

```bash
sb-codex-tool begin add-status-panel "Add Status Panel"
```

현재 cycle을 fresh verification 준비 상태로 올립니다.

```bash
sb-codex-tool prepare-verify
```

fresh verification agent가 verdict를 남긴 뒤 cycle을 닫습니다.

```bash
sb-codex-tool close
```

## `setup`이 만드는 것

`setup`은 `.sb-codex-tool/` 상태 루트와 repo 운영 문서를 만듭니다.

```text
.sb-codex-tool/
  guides/
  handoffs/
  ignore/
  index/
  logs/work-journal/
  plans/
  reviews/
  runs/
  summaries/
  workflows/
AGENTS.md
.ignore
.rgignore
```

이 구조는 bounded work cycle, hot-path onboarding, fresh verification,
사람이 읽는 work journal을 운영하는 데 필요한 최소 세트입니다.

## 명령어

| 명령 | 목적 |
| --- | --- |
| `sb-codex-tool setup` | scaffold, workflow 자산, 가이드, ignore 파일을 생성합니다. |
| `sb-codex-tool doctor` | scaffold 무결성, 현재 cycle 준비도, semantic coherence를 검사합니다. |
| `sb-codex-tool status` | 현재 stage, next action, hot path, 최신 run, semantic issue를 보여줍니다. |
| `sb-codex-tool begin <slug> [title words]` | plan/summary/handoff/review artifact를 갖는 새 cycle을 엽니다. |
| `sb-codex-tool prepare-verify` | 현재 cycle을 verify-ready 상태로 옮기고 handoff를 다시 씁니다. |
| `sb-codex-tool close` | fresh verification verdict를 읽어 cycle을 최종 종료합니다. |
| `sb-codex-tool assign <agent-name> <slug> [title words]` | subagent용 bounded assignment guide를 생성합니다. |
| `sb-codex-tool complete-assignment <agent-name> <close\|clear\|replace> ...` | 완료된 subagent assignment의 lifecycle 처리를 기록합니다. |
| `sb-codex-tool review-consistency <agent-name> [title words]` | active cycle에 대한 consistency review artifact를 생성합니다. |
| `sb-codex-tool [codex args]` | 명시적 명령이 없으면 wrapper를 통해 Codex를 실행합니다. |

## 워크플로 모델

`sb-codex-tool`은 다섯 단계 루프를 사용합니다.

1. `clarify`
2. `plan`
3. `execute`
4. `refactor`
5. `verify`

최종 verification은 항상 fresh agent가 수행합니다. non-trivial 작업은
일반적으로 `prepare-verify`를 거친 뒤 fresh verification을 수행하고, 마지막에
`close`로 닫습니다.

### 일반적인 cycle

1. `begin`으로 새 cycle을 엽니다.
2. approved plan과 scope guide를 실제 작업 내용으로 채웁니다.
3. 구현을 진행하고 execution summary를 갱신합니다.
4. 단순성, 재사용성, 가독성을 기준으로 refactor합니다.
5. `prepare-verify`를 실행해 handoff, state, verification 입력을 정렬합니다.
6. fresh verification agent가 contract, hot path, 코드, 검증 명령을 독립적으로 확인합니다.
7. fresh verifier가 verdict를 남긴 뒤 `close`를 실행합니다.

## 상태 구조

`setup`은 아래와 같은 `.sb-codex-tool/` 상태 루트를 만듭니다.

- `project.md`
- `state.md`
- `plans/`
- `runs/`
- `summaries/`
- `handoffs/`
- `guides/`
- `reviews/`
- `logs/work-journal/`

hot-path onboarding은 다음 순서로 시작합니다.

1. `.sb-codex-tool/project.md`
2. `.sb-codex-tool/state.md`
3. `.sb-codex-tool/guides/read-this-first.md`
4. `.sb-codex-tool/guides/code-consistency.md`

### 디렉터리별 책임

- `project.md`: 장기적인 프로젝트 설명과 아키텍처 진입점
- `state.md`: 현재 stage, next action, active reference, agent map
- `plans/`: approved plan과 draft plan
- `runs/`: lifecycle run과 launch metadata
- `summaries/`: execution summary와 verification summary
- `handoffs/`: 다음 agent가 바로 이어받기 위한 guidance
- `guides/`: code consistency, read-this-first, task-specific guide
- `reviews/`: consistency review와 fresh verification artifact
- `logs/work-journal/`: 사람이 읽는 일일 작업 기록

## Agent 모델

### Main Agent

- orchestration을 소유합니다.
- 사용자 진행 상황을 한국어로 보고합니다.
- subagent에 bounded task를 배정합니다.
- 최종 통합과 closure를 담당합니다.

### Subagent

- 하나의 좁은 task 범위만 맡아야 합니다.
- unrelated context를 계속 쌓지 않아야 합니다.
- 완료 후 clear 또는 replace가 기본값입니다.

### Verification Agent

- 항상 fresh agent여야 합니다.
- 실행한 agent와 같으면 안 됩니다.
- 문서화된 hot path와 verification contract를 기준으로 판정합니다.

### Consistency Agent

- 구조, naming, module boundary, 재사용성/가독성 drift를 점검합니다.
- `code-consistency.md`를 기준 문서로 사용합니다.

## Verification 모델

`verify`는 단순히 테스트 통과를 의미하지 않습니다.

fresh verification에서는 최소한 다음을 확인해야 합니다.

- plan vs actual
- next-agent guidance 품질
- readability와 code consistency 정렬 상태
- active artifact completeness
- state와 latest run metadata 사이의 semantic coherence

이 조건이 맞지 않으면 closure를 하면 안 됩니다.

## Work Journal

검증이 끝난 뒤 main agent는 사람이 읽는 작업일지를 다음 위치에 남깁니다.

```text
.sb-codex-tool/logs/work-journal/YYYY-MM-DD.md
```

이 문서는 agent continuity state와 의도적으로 분리되어 있습니다. 내부 run
artifact를 읽지 않고도 “오늘 무엇을 했는지”를 사람이 빠르게 확인할 수 있게
만드는 용도입니다.

## Git 및 Repository Context

`sb-codex-tool`은 git을 destructive automation 표면이 아니라 context 지원
도구로 사용합니다.

현재 활용 범위는 다음과 같습니다.

- branch와 dirty state 확인
- changed-file scope를 run artifact에 기록
- launch/closure evidence와 git context 연결

core에서는 의도적으로 destructive git automation을 하지 않습니다.

## 패키징 점검

배포 전에 다음 명령을 실행합니다.

```bash
npm run test
npm run pack:check
```

`pack:check`는 tarball이 로컬 상태 파일, tests, 내부 연구 문서를 싣지 않고,
CLI runtime surface 중심으로 유지되는지 확인합니다. 다만 `README.md`,
`README.ko.md` 같은 루트 README 문서는 npm 동작에 따라 함께 포함될 수
있습니다.

좀 더 큰 로컬 release check가 필요하면:

```bash
npm run release:check
```

## 개발 메모

- 현재 패키지는 Node의 `--experimental-strip-types`를 통해 TypeScript를 직접 실행합니다.
- 배포 surface는 `package.json#files`로 제한합니다.
- published tarball은 runtime 파일과 npm이 자동 포함하는 루트 README 문서
  (`README.md`, `README.ko.md`) 중심으로 유지됩니다.
- 내부 `.sb-codex-tool/` 상태는 repository 안에서는 유용하지만 package payload에는 포함되지 않습니다.

## 현재 상태

현재 repository에는 다음 기능이 포함되어 있습니다.

- scaffold 생성 및 검증
- bounded work-cycle automation
- launch wrapper hardening
- assignment lifecycle handling
- consistency review flow
- `doctor`와 `status`의 semantic coherence 검사
- npm distribution readiness checks

## 라이선스

현재 package metadata는 `UNLICENSED`로 설정되어 있습니다. 공개 오픈소스로
배포할 경우에는 원하는 배포 모델에 맞게 조정해야 합니다.
