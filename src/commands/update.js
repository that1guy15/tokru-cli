import path from 'node:path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { run } from '../index.js';

export async function update() {
  const profilePath = path.join(process.cwd(), 'capability-profile.json');

  if (await fs.pathExists(profilePath)) {
    console.log(chalk.cyan('\n  Found existing capability-profile.json — loading as defaults.\n'));
  } else {
    console.log(chalk.yellow('\n  No existing profile found. Starting fresh.\n'));
  }

  // Run the main flow with --update flag
  await run({ update: true });
}
