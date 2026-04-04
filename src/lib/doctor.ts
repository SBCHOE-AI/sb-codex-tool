import { existsSync } from 'node:fs';
import path from 'node:path';

import { readCurrentIndex } from './current-state.ts';
import { readJsonIfPresent, readTextIfPresent } from './fs.ts';
import { STATE_ROOT_NAME } from './paths.ts';
import { readLifecycleRunRecord } from './run-records.ts';
import {
  REQUIRED_DIRECTORIES,
  REQUIRED_FILES,
  REQUIRED_WORKFLOW_FILES,
  resolveProjectRoot,
} from './paths.ts';
import { collectStateCoherenceIssues } from './state-coherence.ts';

export interface CheckResult {
  level: 'ok' | 'warn' | 'fail';
  label: string;
  detail: string;
}

export interface DoctorReport {
  root: string;
  results: CheckResult[];
}

interface PlaceholderArtifactCheck {
  label: string;
  relativePath: string | null;
  placeholders: string[];
}

const PLAN_PLACEHOLDERS = [
  'Replace with the concrete objective for this work cycle.',
  'Replace with the acceptance criteria that define completion.',
  'Replace with in-scope and out-of-scope notes.',
  'fill-in-file-scope',
  'describe the concrete implementation task',
  'describe how this task will be checked',
];

const GUIDE_PLACEHOLDERS = [
  'Replace with the concrete goal for this cycle.',
  'Replace with the files or modules that should be touched.',
  'Replace with the checks and verdict expectations for this cycle.',
];

const EXECUTION_SUMMARY_PLACEHOLDERS = [
  'Replace with the actual implementation scope.',
  'not started yet',
  'none yet',
  'Update this section as implementation progresses.',
  'Update this section after refactor.',
  'Add deferred issues if they exist.',
];

const HANDOFF_PLACEHOLDERS = [
  'Replace with the current implementation status.',
  'Replace with the checks relevant to this work cycle.',
  'Replace with the current blocker or risk list.',
];

const CONSISTENCY_REVIEW_PLACEHOLDERS = [
  'Add findings here in severity order.',
  'Add follow-up recommendations here.',
  `Record whether ${STATE_ROOT_NAME}/guides/code-consistency.md needs an update.`,
];

function findPlaceholderMatches(text: string, placeholders: readonly string[]): string[] {
  return placeholders.filter((placeholder) => text.includes(placeholder));
}

function validatePlaceholderArtifact(
  root: string,
  check: PlaceholderArtifactCheck,
): CheckResult | null {
  if (check.relativePath === null) {
    return null;
  }

  const text = readTextIfPresent(path.join(root, check.relativePath));
  if (text === null) {
    return {
      level: 'fail',
      label: check.label,
      detail: `missing artifact: ${check.relativePath}`,
    };
  }

  const matches = findPlaceholderMatches(text, check.placeholders);
  if (matches.length === 0) {
    return {
      level: 'ok',
      label: check.label,
      detail: 'no scaffold placeholders detected',
    };
  }

  return {
    level: 'fail',
    label: check.label,
    detail: `contains placeholder content: ${matches.join('; ')}`,
  };
}

function pushExistenceChecks(
  root: string,
  items: readonly string[],
  labelPrefix: string,
  results: CheckResult[],
): void {
  for (const item of items) {
    results.push(
      existsSync(path.join(root, item))
        ? {
            level: 'ok',
            label: `${labelPrefix}: ${item}`,
            detail: 'present',
          }
        : {
            level: 'fail',
            label: `${labelPrefix}: ${item}`,
            detail: 'missing',
          },
    );
  }
}

function validateAgents(root: string): CheckResult[] {
  const file = path.join(root, 'AGENTS.md');
  const text = readTextIfPresent(file);
  if (text === null) {
    return [
      {
        level: 'fail',
        label: 'AGENTS.md',
        detail: 'missing',
      },
    ];
  }

  const snippets = [
    'fresh agent',
    'Korean',
    'code-consistency.md',
    'work journal',
    'refactor',
  ];
  const missing = snippets.filter((snippet) => !text.includes(snippet));

  if (missing.length === 0) {
    return [
      {
        level: 'ok',
        label: 'AGENTS.md',
        detail: 'contains required operational guidance',
      },
    ];
  }

  return [
    {
      level: 'warn',
      label: 'AGENTS.md',
      detail: `missing guidance snippets: ${missing.join(', ')}`,
    },
  ];
}

function validateIndex(root: string): CheckResult {
  const file = path.join(root, '.sb-codex-tool/index/current.json');
  const current = readJsonIfPresent<Record<string, unknown>>(file);

  if (current === null) {
    return {
      level: 'fail',
      label: 'index/current.json',
      detail: 'missing or unreadable',
    };
  }

  const requiredKeys = [
    'currentStage',
    'nextAction',
    'hotPath',
    'activeAgents',
  ];
  const missing = requiredKeys.filter((key) => !(key in current));
  if (missing.length > 0) {
    return {
      level: 'warn',
      label: 'index/current.json',
      detail: `missing keys: ${missing.join(', ')}`,
    };
  }

  return {
    level: 'ok',
    label: 'index/current.json',
    detail: 'structured current state is present',
  };
}

function validateConsistencyGuide(root: string): CheckResult {
  const file = path.join(root, '.sb-codex-tool/guides/code-consistency.md');
  const text = readTextIfPresent(file);
  if (text === null) {
    return {
      level: 'fail',
      label: 'code-consistency.md',
      detail: 'missing',
    };
  }

  const requiredSections = [
    'Naming Rules',
    'Module Boundary Rules',
    'Reuse Rules',
    'Readability Rules',
    'Anti-Patterns',
  ];
  const missing = requiredSections.filter((section) => !text.includes(section));

  if (missing.length === 0) {
    return {
      level: 'ok',
      label: 'code-consistency.md',
      detail: 'contains the expected guidance sections',
    };
  }

  return {
    level: 'warn',
    label: 'code-consistency.md',
    detail: `missing sections: ${missing.join(', ')}`,
  };
}

function validateIgnoreStrategy(root: string): CheckResult {
  const files = ['.ignore', '.rgignore'];
  const requiredPattern = '.sb-codex-tool/logs/work-journal/';
  const missing = files.filter((file) => {
    const text = readTextIfPresent(path.join(root, file));
    return text === null || !text.includes(requiredPattern);
  });

  if (missing.length === 0) {
    return {
      level: 'ok',
      label: 'ignore strategy',
      detail: 'default search hot path excludes work-journal noise',
    };
  }

  return {
    level: 'warn',
    label: 'ignore strategy',
    detail: `missing work-journal exclusion in: ${missing.join(', ')}`,
  };
}

function validateCurrentReferences(root: string): CheckResult[] {
  const current = readCurrentIndex(root);
  if (current === null) {
    return [];
  }

  const referencedPaths = [
    current.latestApprovedPlan,
    current.latestRelevantSummary,
    current.latestRun,
    current.latestConsistencyReview,
    current.currentGuide,
    current.currentHandoff,
    current.currentReview,
    ...current.hotPath,
  ].filter((value): value is string => value !== null);

  const uniquePaths = referencedPaths.filter(
    (value, index, array) => array.indexOf(value) === index,
  );

  return uniquePaths.map((relativePath) =>
    existsSync(path.join(root, relativePath))
      ? {
          level: 'ok' as const,
          label: `current reference: ${relativePath}`,
          detail: 'present',
        }
      : {
          level: 'fail' as const,
          label: `current reference: ${relativePath}`,
          detail: 'missing',
        },
  );
}

function validateReadThisFirst(root: string): CheckResult {
  const current = readCurrentIndex(root);
  const text = readTextIfPresent(path.join(root, '.sb-codex-tool/guides/read-this-first.md'));

  if (current === null || text === null) {
    return {
      level: 'fail',
      label: 'read-this-first hot path',
      detail: 'missing current index or read-this-first guide',
    };
  }

  const hotPathSection = text.match(
    /## Hot Path\s+Read in this order before implementation or verification:\s+([\s\S]*?)\n## Additional Repo Docs/,
  );
  if (hotPathSection === null) {
    return {
      level: 'fail',
      label: 'read-this-first hot path',
      detail: 'missing hot-path section structure',
    };
  }

  const actualHotPath = hotPathSection[1]
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^\d+\.\s+/.test(line))
    .map((line) => line.replace(/^\d+\.\s+/, ''));

  const missing = current.hotPath.filter((relativePath) => !text.includes(relativePath));
  if (missing.length === 0) {
    const orderMatches =
      actualHotPath.length === current.hotPath.length &&
      actualHotPath.every((value, index) => value === current.hotPath[index]);

    if (!orderMatches) {
      return {
        level: 'fail',
        label: 'read-this-first hot path',
        detail: 'hot-path order does not match current state',
      };
    }

    const mismatches: string[] = [];
    const cycleChecks: Array<[string, string]> = [
      [`Current stage: ${current.currentStage}`, 'current stage'],
      [
        `Latest approved plan: ${current.latestApprovedPlan ?? 'none yet'}`,
        'latest approved plan',
      ],
      [
        `Latest relevant summary: ${current.latestRelevantSummary ?? 'none yet'}`,
        'latest relevant summary',
      ],
      [
        `Latest lifecycle run: ${current.latestRun ?? 'none yet'}`,
        'latest lifecycle run',
      ],
      [
        `Current task guide: ${current.currentGuide ?? 'none yet'}`,
        'current task guide',
      ],
      [
        `Current handoff: ${current.currentHandoff ?? 'none yet'}`,
        'current handoff',
      ],
      [
        `Current review: ${current.currentReview ?? 'none yet'}`,
        'current review',
      ],
    ];

    for (const [expected, label] of cycleChecks) {
      if (!text.includes(expected)) {
        mismatches.push(label);
      }
    }

    if (mismatches.length === 0) {
      return {
        level: 'ok',
        label: 'read-this-first hot path',
        detail: 'matches the current hot-path references and cycle metadata',
      };
    }

    return {
      level: 'fail',
      label: 'read-this-first hot path',
      detail: `stale current-cycle metadata: ${mismatches.join(', ')}`,
    };
  }

  return {
    level: 'fail',
    label: 'read-this-first hot path',
    detail: `missing current hot-path references: ${missing.join(', ')}`,
  };
}

function validateCurrentArtifactSemantics(root: string): CheckResult[] {
  const current = readCurrentIndex(root);
  if (current === null) {
    return [];
  }

  const checks: PlaceholderArtifactCheck[] = [
    {
      label: 'approved plan readiness',
      relativePath: current.latestApprovedPlan,
      placeholders: PLAN_PLACEHOLDERS,
    },
    {
      label: 'current task guide readiness',
      relativePath: current.currentGuide,
      placeholders: GUIDE_PLACEHOLDERS,
    },
    {
      label: 'current handoff readiness',
      relativePath: current.currentHandoff,
      placeholders: HANDOFF_PLACEHOLDERS,
    },
    {
      label: 'latest consistency review readiness',
      relativePath: current.latestConsistencyReview,
      placeholders: CONSISTENCY_REVIEW_PLACEHOLDERS,
    },
  ];

  if (
    current.latestRelevantSummary !== null &&
    current.latestRelevantSummary.endsWith('-execution-summary.md')
  ) {
    checks.push({
      label: 'execution summary readiness',
      relativePath: current.latestRelevantSummary,
      placeholders: EXECUTION_SUMMARY_PLACEHOLDERS,
    });
  }

  return checks
    .map((check) => validatePlaceholderArtifact(root, check))
    .filter((result): result is CheckResult => result !== null);
}

export function runDoctor(start = process.cwd()): DoctorReport {
  const root = resolveProjectRoot(start);
  const results: CheckResult[] = [];
  const current = readCurrentIndex(root);
  const latestRunRecord = readLifecycleRunRecord(root, current?.latestRun ?? null);

  pushExistenceChecks(root, REQUIRED_DIRECTORIES, 'directory', results);
  pushExistenceChecks(root, REQUIRED_FILES, 'file', results);
  pushExistenceChecks(root, REQUIRED_WORKFLOW_FILES, 'workflow', results);

  results.push(...validateAgents(root));
  results.push(validateIndex(root));
  results.push(validateConsistencyGuide(root));
  results.push(validateIgnoreStrategy(root));
  results.push(...validateCurrentReferences(root));
  results.push(validateReadThisFirst(root));
  results.push(...validateCurrentArtifactSemantics(root));
  results.push(...collectStateCoherenceIssues(root, current, latestRunRecord));

  return { root, results };
}
