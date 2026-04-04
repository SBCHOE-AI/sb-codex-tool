import { createConsistencyReview } from '../lib/consistency-review.ts';

export function runReviewConsistency(args: string[]): number {
  const [agentName, ...titleParts] = args;
  if (agentName === undefined) {
    console.error('Usage: sb-codex-tool review-consistency <agent-name> [title words]');
    return 1;
  }

  const title = titleParts.length > 0 ? titleParts.join(' ') : undefined;
  const result = createConsistencyReview(process.cwd(), agentName, title);

  console.log(`Project root: ${result.root}`);
  console.log(`Consistency agent: ${result.agentName}`);
  console.log(`Review: ${result.title}`);
  console.log('');
  console.log('Artifacts:');
  console.log(`- consistency review: ${result.reviewPath}`);

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
