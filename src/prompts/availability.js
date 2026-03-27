import { select, checkbox, confirm, input } from '@inquirer/prompts';
import chalk from 'chalk';

export async function promptAvailability(defaults = {}) {
  console.log(chalk.cyan.bold('STEP 4 — Availability\n'));

  const status = await select({
    message: chalk.cyan('Current status:'),
    choices: [
      { name: 'available', value: 'available' },
      { name: 'busy', value: 'busy' },
      { name: 'on-leave', value: 'on-leave' },
    ],
    default: defaults.status,
  });

  const availableFrom = await input({
    message: chalk.cyan('Available from date (YYYY-MM-DD, optional):'),
    default: defaults.availableFrom || '',
  });

  const engagementLength = await checkbox({
    message: chalk.cyan('Engagement length (select all that apply):'),
    choices: [
      { name: '1-4 weeks', value: '1-4 weeks', checked: defaults.engagementLength?.includes('1-4 weeks') },
      { name: '1-3 months', value: '1-3 months', checked: defaults.engagementLength?.includes('1-3 months') },
      { name: '3-6 months', value: '3-6 months', checked: defaults.engagementLength?.includes('3-6 months') },
      { name: '6+ months', value: '6+ months', checked: defaults.engagementLength?.includes('6+ months') },
    ],
  });

  const remote = await confirm({
    message: chalk.cyan('Remote?'),
    default: defaults.remote ?? true,
  });

  const onsite = await select({
    message: chalk.cyan('Onsite availability:'),
    choices: [
      { name: 'no', value: 'no' },
      { name: 'flexible', value: 'flexible' },
      { name: 'preferred', value: 'preferred' },
    ],
    default: defaults.onsite,
  });

  let onsiteNote = null;
  if (onsite !== 'no') {
    const note = await input({
      message: chalk.cyan('Onsite note (optional):'),
      default: defaults.onsiteNote || '',
    });
    onsiteNote = note.trim() || null;
  }

  console.log('');
  return {
    status,
    availableFrom: availableFrom.trim() || null,
    engagementLength,
    remote,
    onsite,
    onsiteNote,
    updatedAt: new Date().toISOString(),
  };
}
