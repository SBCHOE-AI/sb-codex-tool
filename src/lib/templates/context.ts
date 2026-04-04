import { existsSync } from 'node:fs';
import path from 'node:path';

export interface TemplateContext {
  root: string;
  projectName: string;
  createdAt: string;
  implementationMenuPath: string | null;
}

export function buildTemplateContext(root: string): TemplateContext {
  const implementationMenu = path.join(root, 'docs/menu/implementation.md');

  return {
    root,
    projectName: path.basename(root),
    createdAt: new Date().toISOString(),
    implementationMenuPath: existsSync(implementationMenu)
      ? 'docs/menu/implementation.md'
      : null,
  };
}
