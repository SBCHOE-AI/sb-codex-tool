import type { TemplateContext } from './context.ts';
import type { GeneratedFile } from './types.ts';
import { buildRepoDocumentFiles } from './repo-documents.ts';
import { buildStateDocumentFiles } from './state-documents.ts';

export function buildDocumentFiles(
  context: TemplateContext,
): GeneratedFile[] {
  return [
    ...buildRepoDocumentFiles(context),
    ...buildStateDocumentFiles(context),
  ];
}
