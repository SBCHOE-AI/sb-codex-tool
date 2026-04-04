# Work Journal Contract

## Purpose

This document defines the human-readable work journal required after verified
work is completed.

The work journal is for people. It is not a substitute for execution state,
plans, summaries, or handoffs.

## Required Location

The journal must live under:

- `.sb-codex-tool/logs/work-journal/`

Recommended filename pattern:

- `YYYY-MM-DD.md`

If multiple entries are needed on one day, either append to the same file or
use an ordered suffix.

## Ownership

The main agent owns the final work-journal write.

Reason:

- it has the best whole-run context
- it can merge execution, verification, and deferred work into one human log

## Write Timing

The work journal must be written after:

1. execution
2. refactor
3. fresh-agent verification
4. final summary or reconciliation

The journal must not be treated as an execution scratchpad.

## Required Sections

Each work-journal entry must contain:

- `Date`
- `Summary`
- `Completed`
- `Changed Areas`
- `Verification`
- `Open Issues`
- `Next`

## Content Rules

The journal should:

- be concise and human-readable
- describe what changed and why
- mention the main verification result
- mention important remaining issues
- suggest the next recommended work

The journal should not:

- duplicate full internal state
- replace plan artifacts
- replace verification summaries
- become a dump of raw command output

## Agent Hot-Path Rule

The work journal is excluded from the default agent hot path.

New agents should not need to read it to understand the current work state.

It may be useful for humans, but it must not become mandatory agent context.

## Git and Ignore Rule

The work journal may be git-tracked.

Recommended behavior:

- keep it out of default agent search hot paths
- do not require it for ordinary state continuity

This is an agent-ignore concern, not necessarily a git-ignore concern.

## Failure Conditions

The implementation fails this contract if:

- verified work does not produce a journal entry
- the journal is not stored in the dedicated folder
- the journal replaces summary or state artifacts
- the journal is part of the required default agent reading order
