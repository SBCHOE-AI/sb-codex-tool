export type { TemplateContext } from './templates/context.ts';
export type { GeneratedFile } from './templates/types.ts';

export { buildTemplateContext } from './templates/context.ts';
export { buildGeneratedFiles } from './templates/generated-files.ts';
export {
  getGitIgnoreLines,
  getSearchIgnoreLines,
} from './templates/ignore.ts';
