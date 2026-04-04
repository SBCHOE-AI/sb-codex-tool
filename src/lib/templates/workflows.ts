import { STATE_ROOT_NAME } from '../paths.ts';
import { workflowTemplate } from './shared.ts';
import type { GeneratedFile } from './types.ts';

function buildWorkflowFile(
  name: string,
  purpose: string,
  outputs: string[],
): GeneratedFile {
  return {
    path: `${STATE_ROOT_NAME}/workflows/${name}.md`,
    content: workflowTemplate(name, purpose, outputs.join('\n')),
  };
}

export function buildWorkflowFiles(): GeneratedFile[] {
  return [
    buildWorkflowFile(
      'clarify',
      'Turn an ambiguous request into a compact brief with clear acceptance criteria and boundaries.',
      [
        '- compact brief',
        '- acceptance criteria',
        '- boundaries',
        '- assumptions',
        '- non-goals',
      ],
    ),
    buildWorkflowFile(
      'plan',
      'Create a decision-complete plan with executable tasks and explicit verification criteria.',
      [
        '- objective',
        '- acceptance criteria',
        '- boundaries',
        '- task list with files/action/verify/done',
      ],
    ),
    buildWorkflowFile(
      'execute',
      'Advance work task by task while keeping scope, blockers, and status explicit.',
      [
        '- task progression',
        '- status updates',
        '- blocker notes',
        '- changed-file scope',
      ],
    ),
    buildWorkflowFile(
      'refactor',
      'Reduce complexity and improve reuse, readability, and maintainability before closure.',
      [
        '- simplification notes',
        '- reuse decisions',
        '- readability improvements',
        '- complexity reductions',
      ],
    ),
    buildWorkflowFile(
      'verify',
      'Perform fresh-agent closure after refactor with evidence, reconciliation, and next-agent checks.',
      [
        '- fresh-agent verification result',
        '- plan-vs-actual reconciliation',
        '- deferred issues',
        '- next-agent guidance check',
        '- work journal precondition',
      ],
    ),
  ];
}
