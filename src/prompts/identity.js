import { input, select } from '@inquirer/prompts';
import chalk from 'chalk';

const TIMEZONES = [
  { name: 'Eastern   (New York, Miami, Toronto)',    value: 'America/New_York' },
  { name: 'Central   (Chicago, Dallas, Houston)',    value: 'America/Chicago' },
  { name: 'Mountain  (Denver, Phoenix, Calgary)',    value: 'America/Denver' },
  { name: 'Pacific   (Los Angeles, Seattle, SF)',    value: 'America/Los_Angeles' },
  { name: 'Alaska',                                  value: 'America/Anchorage' },
  { name: 'Hawaii',                                  value: 'Pacific/Honolulu' },
  { name: 'London / Dublin / Lisbon',                value: 'Europe/London' },
  { name: 'Paris / Berlin / Amsterdam / Rome',       value: 'Europe/Paris' },
  { name: 'Helsinki / Kyiv / Cairo',                 value: 'Europe/Helsinki' },
  { name: 'Dubai / Riyadh / Tbilisi',                value: 'Asia/Dubai' },
  { name: 'Mumbai / Kolkata / Chennai',              value: 'Asia/Kolkata' },
  { name: 'Bangkok / Jakarta / Ho Chi Minh',         value: 'Asia/Bangkok' },
  { name: 'Singapore / Hong Kong / Beijing',         value: 'Asia/Singapore' },
  { name: 'Tokyo / Seoul',                           value: 'Asia/Tokyo' },
  { name: 'Sydney / Melbourne / Brisbane',           value: 'Australia/Sydney' },
  { name: 'Auckland',                                value: 'Pacific/Auckland' },
  { name: 'UTC / GMT',                               value: 'UTC' },
];

function detectTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return null;
  }
}

export async function promptIdentity(defaults = {}) {
  console.log(chalk.cyan.bold('STEP 1 — Identity & Links\n'));

  const name = await input({
    message: chalk.cyan('Your full name:'),
    default: defaults.name,
    validate: (v) => v.trim() ? true : 'Name is required.',
  });

  const handle = await input({
    message: chalk.cyan('Handle (becomes tokru.ai/<handle>):'),
    default: defaults.handle,
    validate: (v) => {
      const s = v.trim().toLowerCase();
      if (!s) return 'Handle is required.';
      if (!/^[a-z0-9][a-z0-9-]*$/.test(s)) return 'Lowercase letters, numbers, and hyphens only. Must start with a letter or number.';
      return true;
    },
    transformer: (v) => v.toLowerCase(),
  });

  const bio = await input({
    message: chalk.cyan('Bio (one-liner or short paragraph):'),
    default: defaults.bio,
    validate: (v) => v.trim() ? true : 'Bio is required.',
  });

  console.log(chalk.dim('\n  Social & web links — how people (and agents) reach you:\n'));

  const website = await input({
    message: chalk.cyan('  Portfolio / website URL (optional):'),
    default: defaults.website || '',
  });

  const avatar = await input({
    message: chalk.cyan('  Avatar image URL (optional, e.g. GitHub profile pic):'),
    default: defaults.avatar_url || '',
  });

  const github = await input({
    message: chalk.cyan('  GitHub URL (optional):'),
    default: defaults.github || '',
  });

  const linkedin = await input({
    message: chalk.cyan('  LinkedIn URL (optional):'),
    default: defaults.linkedin || '',
  });

  console.log('');

  const city = await input({
    message: chalk.cyan('City:'),
    default: defaults.city,
    validate: (v) => v.trim() ? true : 'City is required.',
  });

  // Auto-detect timezone and find matching option
  const detected = detectTimezone();
  const detectedOption = TIMEZONES.find((tz) => tz.value === detected);

  const timezoneChoices = TIMEZONES.map((tz) => ({
    ...tz,
    name: tz.value === detected ? `${tz.name}  ← detected` : tz.name,
  }));

  const defaultTz = detectedOption ? detected : (defaults.timezone || 'America/Chicago');

  const timezone = await select({
    message: chalk.cyan('Timezone:'),
    choices: timezoneChoices,
    default: defaultTz,
  });

  console.log('');
  return {
    name: name.trim(),
    handle: handle.trim().toLowerCase(),
    bio: bio.trim(),
    website: website.trim() || null,
    avatar_url: avatar.trim() || null,
    github: github.trim() || null,
    linkedin: linkedin.trim() || null,
    city: city.trim(),
    timezone,
  };
}
