import { launchCodex } from '../lib/launch.ts';

export function runLaunch(args: string[]): number {
  try {
    const result = launchCodex(process.cwd(), args);
    console.log(`Launch metadata: ${result.launchFile}`);
    console.log(`Instruction surface file: ${result.instructionSurfaceFile}`);
    console.log('Instruction surface for this session:');
    for (const file of result.instructionSurface) {
      console.log(`- ${file}`);
    }
    return result.exitStatus;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return 1;
  }
}
