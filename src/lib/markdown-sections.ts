function readSectionBody(content: string, heading: string): string | null {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const section = content.match(
    new RegExp(`## ${escapedHeading}\\s+([\\s\\S]*?)(?=\\n## |$)`),
  );

  return section?.[1] ?? null;
}

function collectBulletItems(sectionBody: string): string[] {
  const items: string[] = [];
  let currentItem: string[] = [];

  const flushCurrentItem = (): void => {
    if (currentItem.length === 0) {
      return;
    }

    items.push(currentItem.join('\n'));
    currentItem = [];
  };

  const lines = sectionBody
    .trim()
    .split('\n')
    .map((line) => line.replace(/\s+$/u, ''));

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.length === 0) {
      continue;
    }

    if (trimmed.startsWith('- ')) {
      flushCurrentItem();
      currentItem = [trimmed];
      continue;
    }

    if (currentItem.length > 0) {
      currentItem.push(`  ${trimmed}`);
    }
  }

  flushCurrentItem();
  return items;
}

export function extractSectionLines(content: string, heading: string): string[] {
  const sectionBody = readSectionBody(content, heading);
  if (sectionBody === null) {
    return [];
  }

  return collectBulletItems(sectionBody);
}

export function stripBulletPrefix(lines: string[]): string[] {
  return lines.map((line) =>
    line
      .split('\n')
      .map((segment, index) =>
        index === 0
          ? segment.replace(/^- /u, '')
          : segment.replace(/^\s+/u, ''),
      )
      .join('\n'),
  );
}
