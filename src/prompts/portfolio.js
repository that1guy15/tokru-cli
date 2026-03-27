import { input, confirm } from '@inquirer/prompts';
import chalk from 'chalk';

async function promptOneItem(index) {
  console.log(chalk.dim(`  Portfolio item ${index + 1}:`));

  const title = await input({
    message: chalk.cyan('  Title:'),
    validate: (v) => v.trim() ? true : 'Title is required.',
  });

  const description = await input({
    message: chalk.cyan('  Description:'),
    validate: (v) => v.trim() ? true : 'Description is required.',
  });

  const url = await input({
    message: chalk.cyan('  URL (optional):'),
    default: '',
  });

  const tagsRaw = await input({
    message: chalk.cyan('  Tags (comma-separated):'),
    default: '',
  });

  const tags = tagsRaw.split(',').map((t) => t.trim()).filter(Boolean);

  return {
    title: title.trim(),
    description: description.trim(),
    url: url.trim() || null,
    tags,
  };
}

export async function promptPortfolio(defaults = []) {
  console.log(chalk.cyan.bold('STEP 6 — Portfolio (optional)\n'));
  console.log(chalk.dim('  Add portfolio items so agents can evaluate real work.\n'));

  const wantsPortfolio = await confirm({
    message: chalk.cyan('Add portfolio items?'),
    default: defaults.length > 0,
  });

  if (!wantsPortfolio) {
    console.log('');
    return defaults;
  }

  const items = [];
  let addMore = true;
  while (addMore) {
    const item = await promptOneItem(items.length);
    items.push(item);
    console.log(chalk.green(`  ✓ Added: ${item.title}\n`));

    addMore = await confirm({
      message: chalk.cyan('  Add another item?'),
      default: false,
    });
  }

  console.log('');
  return [...defaults, ...items];
}
