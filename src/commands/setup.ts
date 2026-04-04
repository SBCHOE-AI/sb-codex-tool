import { resolveCodexBinary } from '../lib/codex.ts';
import { scaffoldProject } from '../lib/scaffold.ts';

export function runSetup(): number {
  const summary = scaffoldProject();
  const codexBinary = resolveCodexBinary();

  console.log(`Project root: ${summary.root}`);
  console.log('');
  console.log(`Created directories: ${summary.createdDirectories.length}`);
  for (const directory of summary.createdDirectories) {
    console.log(`- ${directory}`);
  }

  console.log('');
  console.log(`Created files: ${summary.createdFiles.length}`);
  for (const file of summary.createdFiles) {
    console.log(`- ${file}`);
  }

  if (summary.updatedFiles.length > 0) {
    console.log('');
    console.log('Updated files:');
    for (const file of summary.updatedFiles) {
      console.log(`- ${file}`);
    }
  }

  console.log('');
  if (codexBinary === null) {
    console.log('Codex binary: missing');
    console.log('Remediation: install Codex or expose `codex` in PATH before using the launch wrapper.');
  } else {
    console.log(`Codex binary: ${codexBinary}`);
  }

  return 0;
}
