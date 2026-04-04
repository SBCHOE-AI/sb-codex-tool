import { STATE_ROOT_NAME } from '../paths.ts';
import type { TemplateContext } from './context.ts';
import { buildDocumentFiles } from './documents.ts';
import { buildBaseIgnoreTemplate } from './ignore.ts';
import type { GeneratedFile } from './types.ts';
import { buildWorkflowFiles } from './workflows.ts';

export function buildGeneratedFiles(
  context: TemplateContext,
): GeneratedFile[] {
  return [
    ...buildDocumentFiles(context),
    ...buildWorkflowFiles(),
    {
      path: `${STATE_ROOT_NAME}/ignore/base.ignore`,
      content: buildBaseIgnoreTemplate(),
    },
  ];
}
