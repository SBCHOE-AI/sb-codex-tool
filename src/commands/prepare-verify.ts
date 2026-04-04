import { prepareVerify } from '../lib/prepare-verify.ts';

export function runPrepareVerify(args: string[]): number {
  if (args.length > 0) {
    console.error('Usage: sb-codex-tool prepare-verify');
    return 1;
  }

  const result = prepareVerify(process.cwd());

  console.log(`Project root: ${result.root}`);
  console.log(`Work cycle: ${result.title}`);
  console.log(`Updated run: ${result.runPath}`);
  console.log(`Updated handoff: ${result.handoffPath}`);

  console.log('');
  console.log(`Updated files: ${result.updatedFiles.length}`);
  for (const file of result.updatedFiles) {
    console.log(`- ${file}`);
  }

  return 0;
}
