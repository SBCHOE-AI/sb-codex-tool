import { runDoctor } from '../lib/doctor.ts';

function formatResult(level: 'ok' | 'warn' | 'fail'): string {
  if (level === 'ok') {
    return '[ok]';
  }

  if (level === 'warn') {
    return '[warn]';
  }

  return '[fail]';
}

export function runDoctorCommand(): number {
  const report = runDoctor();
  let hasFailure = false;

  console.log(`Project root: ${report.root}`);
  console.log('');

  for (const result of report.results) {
    console.log(`${formatResult(result.level)} ${result.label}: ${result.detail}`);
    if (result.level === 'fail') {
      hasFailure = true;
    }
  }

  return hasFailure ? 1 : 0;
}
