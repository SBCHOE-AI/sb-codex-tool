import { existsSync } from 'node:fs';
import path from 'node:path';

function findExecutableInPath(binaryName: string, searchPath: string): string | null {
  for (const entry of searchPath.split(path.delimiter)) {
    if (entry.trim().length === 0) {
      continue;
    }

    const candidate = path.join(entry, binaryName);
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

export function resolveCodexBinary(
  root = process.cwd(),
  searchPath = process.env.PATH ?? '',
): string | null {
  const localBinary = path.join(root, 'node_modules', '.bin', 'codex');
  if (existsSync(localBinary)) {
    return localBinary;
  }

  return findExecutableInPath('codex', searchPath);
}
