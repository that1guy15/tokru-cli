import { input, confirm } from '@inquirer/prompts';
import { execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import { buildWorkerScript, buildWranglerToml } from './generators/worker.js';

export async function promptDeploy(profile, agentCard, outputDir) {
  console.log(chalk.cyan.bold('STEP 8 — Deploy\n'));

  const wantsDeploy = await confirm({
    message: chalk.cyan('Deploy to Cloudflare Workers? (requires Cloudflare account + API token)'),
    default: false,
  });

  if (!wantsDeploy) {
    console.log(chalk.yellow('\n  Skipping deployment. You can deploy manually later:'));
    console.log(chalk.dim('  1. Install wrangler: npm i -g wrangler'));
    console.log(chalk.dim('  2. Run: npx wrangler deploy'));
    console.log(chalk.dim('  3. Or host the JSON files on any static server\n'));
    return null;
  }

  const cfToken = await input({
    message: chalk.cyan('Cloudflare API token:'),
    validate: (v) => v.trim() ? true : 'API token is required.',
  });

  const cfAccountId = await input({
    message: chalk.cyan('Cloudflare account ID:'),
    validate: (v) => v.trim() ? true : 'Account ID is required.',
  });

  const handle = profile.identity.handle;

  // Write worker files
  const workerDir = path.join(outputDir, 'worker');
  await fs.ensureDir(workerDir);

  const workerScript = buildWorkerScript(profile, agentCard);
  const wranglerToml = buildWranglerToml(handle, cfAccountId.trim());

  await fs.writeFile(path.join(workerDir, 'worker.js'), workerScript);
  await fs.writeFile(path.join(workerDir, 'wrangler.toml'), wranglerToml);

  // Deploy
  const spinner = ora(chalk.cyan('Deploying to Cloudflare Workers...')).start();

  try {
    const result = execSync('npx wrangler@latest deploy', {
      cwd: workerDir,
      env: { ...process.env, CLOUDFLARE_API_TOKEN: cfToken.trim() },
      stdio: 'pipe',
      timeout: 120000,
    });

    const output = result.toString();
    spinner.succeed(chalk.green('Deployed to Cloudflare Workers!'));

    // Try to extract the URL from wrangler output
    const urlMatch = output.match(/https:\/\/[^\s]+\.workers\.dev/);
    const deployedUrl = urlMatch ? urlMatch[0] : `https://tokru-${handle}.workers.dev`;

    console.log(chalk.green(`\n  Your profile is live at: ${deployedUrl}`));
    console.log(chalk.dim(`  Agent Card: ${deployedUrl}/.well-known/agent-card.json`));
    console.log(chalk.dim(`  Full profile: ${deployedUrl}/.well-known/tokru.json\n`));

    // Update profile with endpoint info
    profile.agentCard.endpoint = `${deployedUrl}/.well-known/agent-card.json`;
    profile.agentCard.a2aCompatible = true;
    profile.agentCard.queryable = true;

    return deployedUrl;
  } catch (err) {
    spinner.fail(chalk.red('Deployment failed.'));
    console.log(chalk.yellow(`  Error: ${err.stderr?.toString() || err.message}`));
    console.log(chalk.yellow('  Worker files have been saved — you can deploy manually later.\n'));
    return null;
  }
}

export async function registerWithRegistry(profile) {
  const spinner = ora(chalk.cyan('Registering with Tokru registry...')).start();

  try {
    const res = await fetch('https://tokru.ai/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
      signal: AbortSignal.timeout(10000),
    });

    if (res.ok) {
      spinner.succeed(chalk.green('Registered with Tokru registry.'));
    } else {
      spinner.warn(chalk.yellow('Registry registration skipped (endpoint not available yet).'));
    }
  } catch {
    spinner.warn(chalk.yellow('Registry registration skipped (endpoint not available yet).'));
  }
}
