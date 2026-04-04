import { closeCurrentCycle } from '../lib/close-cycle.ts';

export function runClose(args: string[]): number {
  if (args.length > 0) {
    console.error('Usage: sb-codex-tool close');
    return 1;
  }

  const result = closeCurrentCycle(process.cwd());

  console.log(`Project root: ${result.root}`);
  console.log(`Work cycle: ${result.title}`);
  console.log(`Verdict: ${result.verdict}`);
  console.log('');
  console.log('Closure artifacts:');
  console.log(`- review: ${result.reviewPath}`);
  console.log(`- verification summary: ${result.verificationSummaryPath}`);
  console.log(`- run: ${result.runPath}`);
  console.log(`- work journal: ${result.journalPath ?? 'not updated for this verdict'}`);

  console.log('');
  console.log(`Created files: ${result.createdFiles.length}`);
  for (const file of result.createdFiles) {
    console.log(`- ${file}`);
  }

  if (result.updatedFiles.length > 0) {
    console.log('');
    console.log('Updated files:');
    for (const file of result.updatedFiles) {
      console.log(`- ${file}`);
    }
  }

  return 0;
}
