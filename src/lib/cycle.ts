import path from 'node:path';

import { readTextIfPresent } from './fs.ts';

export interface CycleDescriptor {
  dateStamp: string;
  slug: string;
}

export function formatDateStamp(date = new Date()): string {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function normalizeSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function humanizeSlug(slug: string): string {
  return slug
    .split('-')
    .filter((part) => part.length > 0)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ');
}

export function parseCycleDescriptor(planPath: string): CycleDescriptor {
  const match = planPath.match(
    /^\.sb-codex-tool\/plans\/(\d{4}-\d{2}-\d{2})-(.+)-approved\.md$/,
  );
  if (match === null) {
    throw new Error(`Unable to derive cycle metadata from ${planPath}.`);
  }

  return {
    dateStamp: match[1],
    slug: match[2],
  };
}

export function readCycleTitle(root: string, planPath: string, fallbackSlug: string): string {
  const text = readTextIfPresent(path.join(root, planPath));
  const heading = text?.match(/^# Approved Plan: (.+)$/m)?.[1];
  if (heading !== undefined) {
    return heading.trim();
  }

  return humanizeSlug(fallbackSlug);
}
