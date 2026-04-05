import { runAssign } from './commands/assign.ts';
import { runBegin } from './commands/begin.ts';
import { runClose } from './commands/close.ts';
import { runCompleteAssignment } from './commands/complete-assignment.ts';
import { runDoctorCommand } from './commands/doctor.ts';
import { runLaunch } from './commands/launch.ts';
import { runPrepareVerify } from './commands/prepare-verify.ts';
import { runReviewConsistency } from './commands/review-consistency.ts';
import { runSetup } from './commands/setup.ts';
import { runStatus } from './commands/status.ts';

function printHelp(): void {
  console.log('sb-codex-tool');
  console.log('');
  console.log('Usage:');
  console.log('  sb-codex-tool setup');
  console.log('  sb-codex-tool doctor');
  console.log('  sb-codex-tool status');
  console.log('  sb-codex-tool assign <agent-name> <slug> [title words]');
  console.log('  sb-codex-tool begin <slug> [title words]');
  console.log('  sb-codex-tool close');
  console.log('  sb-codex-tool complete-assignment <agent-name> <close|clear|replace> [replacement-agent] [replacement-slug] [title words]');
  console.log('  sb-codex-tool prepare-verify');
  console.log('  sb-codex-tool review-consistency <agent-name> [title words]');
  console.log('  sb-codex-tool [codex args]');
  console.log('');
  console.log('Default human workflow:');
  console.log('  setup   Create the sb-codex-tool scaffold in the current project.');
  console.log('  doctor  Validate the scaffold and required operational files.');
  console.log('  status  Show current stage, next action, hot path, and git context.');
  console.log('');
  console.log('Advanced/manual helpers:');
  console.log('  assign  Create a bounded assignment guide and update active subagents.');
  console.log('  begin   Create the next work-cycle artifacts and update current state.');
  console.log('  close   Finalize the current cycle from the recorded review verdict.');
  console.log('  complete-assignment  Record close/clear/replace lifecycle handling for a bounded subagent task.');
  console.log('  prepare-verify  Align handoff, run state, and current state for fresh verification.');
  console.log('  review-consistency  Create a consistency review artifact and update visible review state.');
  console.log('');
  console.log('Codex-first mode:');
  console.log('  Run setup, doctor, and status yourself.');
  console.log('  Then ask Codex to read the hot path, clarify the task, and update the plan/state/summaries for you.');
  console.log('  help    Show this message.');
  console.log('');
  console.log('When no command is provided, sb-codex-tool launches Codex through the wrapper.');
}

function main(argv: string[]): number {
  const [command, ...rest] = argv;

  if (command === undefined) {
    return runLaunch([]);
  }

  if (command === 'setup') {
    return runSetup();
  }

  if (command === 'begin') {
    return runBegin(rest);
  }

  if (command === 'assign') {
    return runAssign(rest);
  }

  if (command === 'close') {
    return runClose(rest);
  }

  if (command === 'complete-assignment') {
    return runCompleteAssignment(rest);
  }

  if (command === 'review-consistency') {
    return runReviewConsistency(rest);
  }

  if (command === 'prepare-verify') {
    return runPrepareVerify(rest);
  }

  if (command === 'doctor') {
    return runDoctorCommand();
  }

  if (command === 'status') {
    return runStatus();
  }

  if (command === 'help' || command === '--help' || command === '-h') {
    printHelp();
    return 0;
  }

  if (command.startsWith('-')) {
    return runLaunch(argv);
  }

  return runLaunch(argv);
}

process.exit(main(process.argv.slice(2)));
