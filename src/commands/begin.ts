import { beginWorkCycle } from '../lib/work-cycle.ts';

export function runBegin(args: string[]): number {
  const [slug, ...titleParts] = args;
  if (slug === undefined) {
    console.error('Usage: sb-codex-tool begin <slug> [title words]');
    return 1;
  }

  const title = titleParts.length > 0 ? titleParts.join(' ') : undefined;
  const result = beginWorkCycle(process.cwd(), slug, title);

  console.log(`Project root: ${result.root}`);
  console.log(`Work cycle: ${result.title}`);
  console.log('');
  console.log('Artifacts:');
  console.log(`- plan: ${result.planPath}`);
  console.log(`- summary: ${result.summaryPath}`);
  console.log(`- run: ${result.runPath}`);
  console.log(`- handoff: ${result.handoffPath}`);
  console.log(`- review: ${result.reviewPath}`);
  console.log(`- guide: ${result.guidePath}`);

  console.log('');
  console.log(`Created files: ${result.createdFiles.length}`);
  for (const file of result.createdFiles) {
    console.log(`- ${file}`);
  }

  if (result.updatedFiles.length > 0) {
    console.log('');
    console.log('Updated state:');
    for (const file of result.updatedFiles) {
      console.log(`- ${file}`);
    }
  }

  return 0;
}
