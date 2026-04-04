import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export type WriteResult = 'created' | 'kept' | 'updated' | 'unchanged';

export function ensureDir(directory: string): void {
  mkdirSync(directory, { recursive: true });
}

export function readTextIfPresent(filePath: string): string | null {
  if (!existsSync(filePath)) {
    return null;
  }

  return readFileSync(filePath, 'utf8');
}

export function readJsonIfPresent<T>(filePath: string): T | null {
  const text = readTextIfPresent(filePath);
  if (text === null) {
    return null;
  }

  return JSON.parse(text) as T;
}

export function writeFileIfMissing(filePath: string, content: string): WriteResult {
  ensureDir(path.dirname(filePath));

  if (existsSync(filePath)) {
    return 'kept';
  }

  writeFileSync(filePath, content, 'utf8');
  return 'created';
}

export function writeFileIfChanged(filePath: string, content: string): WriteResult {
  ensureDir(path.dirname(filePath));

  if (!existsSync(filePath)) {
    writeFileSync(filePath, content, 'utf8');
    return 'created';
  }

  const current = readFileSync(filePath, 'utf8');
  if (current === content) {
    return 'unchanged';
  }

  writeFileSync(filePath, content, 'utf8');
  return 'updated';
}

export function ensureLines(
  filePath: string,
  lines: string[],
  header: string,
): { created: boolean; added: string[] } {
  ensureDir(path.dirname(filePath));

  if (!existsSync(filePath)) {
    const content = `${header}\n\n${lines.join('\n')}\n`;
    writeFileSync(filePath, content, 'utf8');
    return { created: true, added: [...lines] };
  }

  const current = readFileSync(filePath, 'utf8');
  const missing = lines.filter((line) => !current.includes(line));
  if (missing.length === 0) {
    return { created: false, added: [] };
  }

  const next = current.includes(header)
    ? `${current.trimEnd()}\n${missing.join('\n')}\n`
    : `${current.trimEnd()}\n\n${header}\n\n${missing.join('\n')}\n`;

  writeFileSync(filePath, next, 'utf8');
  return { created: false, added: missing };
}
