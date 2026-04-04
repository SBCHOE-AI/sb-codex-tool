import { createAssignmentGuide } from '../lib/assignment.ts';

export function runAssign(args: string[]): number {
  const [agentName, slug, ...titleParts] = args;
  if (agentName === undefined || slug === undefined) {
    console.error('Usage: sb-codex-tool assign <agent-name> <slug> [title words]');
    return 1;
  }

  const title = titleParts.length > 0 ? titleParts.join(' ') : undefined;
  const result = createAssignmentGuide(process.cwd(), agentName, slug, title);

  console.log(`Project root: ${result.root}`);
  console.log(`Assigned agent: ${result.agentName}`);
  console.log(`Assignment: ${result.title}`);
  console.log('');
  console.log('Artifacts:');
  console.log(`- assignment guide: ${result.assignmentPath}`);

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
