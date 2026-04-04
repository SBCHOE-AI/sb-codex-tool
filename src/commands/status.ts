import { getStatus } from '../lib/status.ts';

export function runStatus(): number {
  const status = getStatus();

  console.log(`Project root: ${status.root}`);
  console.log(`Current stage: ${status.stage}`);
  console.log(`Next action: ${status.nextAction}`);
  console.log(`Latest approved plan: ${status.latestPlan ?? 'none'}`);
  console.log(`Latest summary: ${status.latestSummary ?? 'none'}`);
  console.log(`Latest run: ${status.latestRun ?? 'none'}`);
  console.log(`Latest consistency review: ${status.latestConsistencyReview ?? 'none'}`);
  console.log(`Latest assignment lifecycle: ${status.latestAssignmentLifecycle ?? 'none'}`);
  console.log(`Current guide: ${status.currentGuide ?? 'none'}`);
  console.log(`Current handoff: ${status.currentHandoff ?? 'none'}`);
  console.log(`Current review: ${status.currentReview ?? 'none'}`);

  if (status.latestRunRecord !== null) {
    console.log('');
    console.log('Latest run details:');
    console.log(`- Title: ${status.latestRunRecord.title}`);
    console.log(`- Phase: ${status.latestRunRecord.phase}`);
    console.log(`- Stage: ${status.latestRunRecord.stage}`);
    console.log(`- Verdict: ${status.latestRunRecord.verdict}`);

    console.log('Run-linked artifacts:');
    console.log(`- Plan: ${status.latestRunRecord.paths.planPath}`);
    console.log(`- Execution summary: ${status.latestRunRecord.paths.executionSummaryPath}`);
    console.log(`- Guide: ${status.latestRunRecord.paths.guidePath ?? 'none'}`);
    console.log(`- Handoff: ${status.latestRunRecord.paths.handoffPath ?? 'none'}`);
    console.log(`- Review: ${status.latestRunRecord.paths.reviewPath ?? 'none'}`);
    console.log(
      `- Verification summary: ${status.latestRunRecord.paths.verificationSummaryPath ?? 'none'}`,
    );
    console.log(`- Work journal: ${status.latestRunRecord.paths.journalPath ?? 'none'}`);

    console.log('Recorded run git context:');
    if (status.latestRunRecord.git.available) {
      console.log(`- Branch: ${status.latestRunRecord.git.branch ?? 'detached'}`);
      console.log(`- Dirty: ${status.latestRunRecord.git.dirty ? 'yes' : 'no'}`);
      console.log('- Changed files:');
      if (status.latestRunRecord.git.changedFiles.length === 0) {
        console.log('  - none');
      } else {
        for (const file of status.latestRunRecord.git.changedFiles) {
          console.log(`  - ${file}`);
        }
      }
    } else {
      console.log('- Branch: unavailable');
      console.log('- Dirty: unavailable');
      console.log('- Changed files: unavailable');
    }
  }

  console.log('');
  console.log('Hot path:');
  for (const file of status.hotPath) {
    console.log(`- ${file}`);
  }

  console.log('');
  console.log('Active agents:');
  console.log(`- Main: ${status.agents?.main ?? 'unassigned'}`);
  console.log(
    `- Subagents: ${
      status.agents?.subagents && status.agents.subagents.length > 0
        ? status.agents.subagents.join(', ')
        : 'none'
    }`,
  );
  console.log(`- Verification: ${status.agents?.verification ?? 'none'}`);
  console.log(`- Consistency: ${status.agents?.consistency ?? 'none'}`);

  console.log('');
  console.log('Assignment guides:');
  const assignmentEntries = Object.entries(status.assignmentGuides);
  if (assignmentEntries.length === 0) {
    console.log('- none');
  } else {
    for (const [agent, guidePath] of assignmentEntries.sort(([left], [right]) => left.localeCompare(right))) {
      console.log(`- ${agent}: ${guidePath}`);
    }
  }

  console.log('');
  console.log('Semantic issues:');
  if (status.coherenceIssues.length === 0) {
    console.log('- none');
  } else {
    for (const issue of status.coherenceIssues) {
      console.log(`- [${issue.level}] ${issue.label}: ${issue.detail}`);
    }
  }

  console.log('');
  if (status.git.available) {
    console.log(`Git branch: ${status.git.branch ?? 'detached'}`);
    console.log(`Git dirty: ${status.git.dirty ? 'yes' : 'no'}`);
    console.log('Changed files:');
    if (status.git.changedFiles.length === 0) {
      console.log('- none');
    } else {
      for (const file of status.git.changedFiles) {
        console.log(`- ${file}`);
      }
    }
  } else {
    console.log('Git branch: unavailable');
    console.log('Git dirty: unavailable');
  }

  return 0;
}
