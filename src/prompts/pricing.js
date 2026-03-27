import { input, checkbox } from '@inquirer/prompts';
import chalk from 'chalk';

export async function promptPricing(defaults = {}) {
  console.log(chalk.cyan.bold('STEP 5 — Pricing\n'));

  const currency = await input({
    message: chalk.cyan('Currency:'),
    default: defaults.currency || 'USD',
  });

  const hourlyMin = await input({
    message: chalk.cyan('Hourly rate minimum (optional):'),
    default: defaults.hourlyRate?.min?.toString() || '',
  });

  const hourlyMax = await input({
    message: chalk.cyan('Hourly rate maximum (optional):'),
    default: defaults.hourlyRate?.max?.toString() || '',
  });

  const projectMin = await input({
    message: chalk.cyan('Project minimum (optional, e.g. 5000):'),
    default: defaults.projectMinimum?.toString() || '',
  });

  const projectMinParsed = projectMin.trim().replace(/[^0-9.]/g, '');

  const engagementTypes = await checkbox({
    message: chalk.cyan('Engagement types (select all that apply):'),
    choices: [
      { name: 'fixed-price', value: 'fixed-price', checked: defaults.engagementTypes?.includes('fixed-price') },
      { name: 'time-and-materials', value: 'time-and-materials', checked: defaults.engagementTypes?.includes('time-and-materials') },
      { name: 'advisory-retainer', value: 'advisory-retainer', checked: defaults.engagementTypes?.includes('advisory-retainer') },
      { name: 'other', value: 'other', checked: defaults.engagementTypes?.includes('other') },
    ],
  });

  const parseAmount = (v) => {
    const stripped = v.trim().replace(/[^0-9.]/g, '');
    return stripped ? Number(stripped) : null;
  };
  const min = parseAmount(hourlyMin);
  const max = parseAmount(hourlyMax);
  const hourlyRate = (min !== null || max !== null) ? { min, max } : null;

  console.log('');
  return {
    currency: currency.trim(),
    hourlyRate,
    projectMinimum: projectMinParsed ? Number(projectMinParsed) : null,
    engagementTypes,
  };
}
