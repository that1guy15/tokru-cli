import { input, select, confirm } from '@inquirer/prompts';
import chalk from 'chalk';

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function promptOneCapability(index) {
  console.log(chalk.dim(`  Capability ${index + 1}:`));

  const label = await input({
    message: chalk.cyan('  Label:'),
    validate: (v) => v.trim() ? true : 'Label is required.',
  });

  const description = await input({
    message: chalk.cyan('  Description:'),
    validate: (v) => v.trim() ? true : 'Description is required.',
  });

  const level = await select({
    message: chalk.cyan('  Level:'),
    choices: [
      { name: 'learner', value: 'learner' },
      { name: 'practitioner', value: 'practitioner' },
      { name: 'expert', value: 'expert' },
      { name: 'pioneer', value: 'pioneer' },
    ],
  });

  const tagsRaw = await input({
    message: chalk.cyan('  Tags (comma-separated):'),
    default: '',
  });

  const tags = tagsRaw.split(',').map((t) => t.trim()).filter(Boolean);
  const id = slugify(label);

  return { id, label: label.trim(), description: description.trim(), level, tags };
}

export async function promptCapabilities(defaults = []) {
  console.log(chalk.cyan.bold('STEP 3 — Capabilities\n'));
  console.log(chalk.dim('  Add your top capabilities. These are what agents will match against.\n'));

  const capabilities = [];

  // Pre-fill defaults for edit flow
  if (defaults.length > 0) {
    console.log(chalk.dim(`  (You have ${defaults.length} existing capabilities. Adding new ones.)\n`));
  }

  let addMore = true;
  while (addMore) {
    const cap = await promptOneCapability(capabilities.length);
    capabilities.push(cap);
    console.log(chalk.green(`  ✓ Added: ${cap.label} (${cap.level})\n`));

    addMore = await confirm({
      message: chalk.cyan('  Add another capability?'),
      default: false,
    });
  }

  if (capabilities.length === 0) {
    console.log(chalk.yellow('  At least one capability is required.'));
    const cap = await promptOneCapability(0);
    capabilities.push(cap);
  }

  console.log('');
  return [...defaults, ...capabilities];
}
