import { input } from '@inquirer/prompts';
import chalk from 'chalk';

export async function promptContact(defaults = {}) {
  console.log(chalk.cyan.bold('STEP 2 — Contact\n'));

  const email = await input({
    message: chalk.cyan('Email:'),
    default: defaults.email,
    validate: (v) => {
      if (!v.trim()) return 'Email is required.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'Enter a valid email address.';
      return true;
    },
  });

  const calendar = await input({
    message: chalk.cyan('Booking / calendar URL (optional, e.g. cal.com/you):'),
    default: defaults.calendar || '',
  });

  console.log('');
  return {
    email: email.trim(),
    calendar: calendar.trim() || null,
  };
}
