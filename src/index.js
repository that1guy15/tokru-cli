import path from 'node:path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { confirm, select } from '@inquirer/prompts';
import { showWelcome } from './welcome.js';
import { promptIdentity } from './prompts/identity.js';
import { promptContact } from './prompts/contact.js';
import { promptCapabilities } from './prompts/capabilities.js';
import { promptAvailability } from './prompts/availability.js';
import { promptPricing } from './prompts/pricing.js';
import { promptPortfolio } from './prompts/portfolio.js';
import { buildProfile } from './generators/profile.js';
import { buildAgentCard } from './generators/agent-card.js';
import { buildTokruMd } from './generators/tokru-md.js';
import { promptDeploy, registerWithRegistry } from './deploy.js';

export async function run(opts = {}) {
  const outputDir = process.cwd();
  const profilePath = path.join(outputDir, 'capability-profile.json');

  // Load existing profile for update mode
  let existing = null;
  const isUpdate = opts.update || process.argv.includes('--update');
  if (isUpdate && await fs.pathExists(profilePath)) {
    existing = await fs.readJson(profilePath);
  }

  // 1. Welcome
  showWelcome();

  // 2. Identity
  const identity = await promptIdentity(existing ? {
    name: existing.identity?.name,
    handle: existing.identity?.handle,
    bio: existing.identity?.bio,
    website: existing.contact?.website,
    github: existing.contact?.github,
    linkedin: existing.contact?.linkedin,
    city: existing.identity?.location?.city,
    timezone: existing.identity?.location?.timezone,
  } : {});

  console.log(chalk.dim('─'.repeat(60)) + '\n');

  // 3. Contact (email + calendar only — social links now in identity)
  const contact = await promptContact(existing?.contact || {});
  console.log(chalk.dim('─'.repeat(60)) + '\n');

  // 4. Capabilities
  const capabilities = await promptCapabilities(isUpdate ? (existing?.capabilities || []) : []);
  console.log(chalk.dim('─'.repeat(60)) + '\n');

  // 5. Availability
  const availability = await promptAvailability(existing?.availability || {});
  console.log(chalk.dim('─'.repeat(60)) + '\n');

  // 6. Pricing
  const pricing = await promptPricing(existing?.pricing || {});
  console.log(chalk.dim('─'.repeat(60)) + '\n');

  // 7. Portfolio
  const portfolio = await promptPortfolio(isUpdate ? (existing?.work?.portfolio || []) : []);
  console.log(chalk.dim('─'.repeat(60)) + '\n');

  // Build the profile
  const profile = buildProfile({ identity, contact, capabilities, availability, pricing, portfolio });
  const agentCard = buildAgentCard(profile);

  // 8. Summary
  console.log(chalk.cyan.bold('STEP 7 — Review\n'));
  console.log(chalk.dim(JSON.stringify(profile, null, 2)));
  console.log('');

  let confirmed = false;
  while (!confirmed) {
    const action = await select({
      message: chalk.cyan('Does this look right?'),
      choices: [
        { name: 'Yes — save and continue', value: 'yes' },
        { name: 'Edit — start over', value: 'edit' },
        { name: 'Quit', value: 'quit' },
      ],
    });

    if (action === 'quit') {
      console.log(chalk.yellow('\n  Exiting without saving.\n'));
      return;
    }

    if (action === 'edit') {
      console.log(chalk.yellow('\n  Starting over...\n'));
      return run(opts);
    }

    confirmed = true;
  }

  // 9. Write files
  console.log('');
  await fs.writeJson(path.join(outputDir, 'capability-profile.json'), profile, { spaces: 2 });
  console.log(chalk.green('  ✓ capability-profile.json'));

  await fs.writeJson(path.join(outputDir, 'agent-card.json'), agentCard, { spaces: 2 });
  console.log(chalk.green('  ✓ agent-card.json'));
  console.log('');

  console.log(chalk.dim('─'.repeat(60)) + '\n');

  // 10. Deploy
  const deployedUrl = await promptDeploy(profile, agentCard, outputDir);

  // If profile was updated with endpoint info, re-write it
  if (deployedUrl) {
    await fs.writeJson(path.join(outputDir, 'capability-profile.json'), profile, { spaces: 2 });
    await fs.writeJson(path.join(outputDir, 'agent-card.json'), buildAgentCard(profile), { spaces: 2 });
  }

  console.log(chalk.dim('─'.repeat(60)) + '\n');

  // 11. Registry
  await registerWithRegistry(profile);
  console.log('');

  // 12. TOKRU.md
  const tokruMd = buildTokruMd(profile, deployedUrl);
  await fs.writeFile(path.join(outputDir, 'TOKRU.md'), tokruMd);
  console.log(chalk.green('  ✓ TOKRU.md'));
  console.log('');

  console.log(chalk.dim('─'.repeat(60)) + '\n');

  // 13. Finish
  const handleUrl = deployedUrl || `https://tokru.ai/profile/${identity.handle}`;
  console.log(chalk.green.bold('  ✓ Done! Your Tokru profile is ready.\n'));
  console.log(`  ${chalk.bold('Profile:')}  ${handleUrl}`);
  console.log(`  ${chalk.bold('Handle:')}   ${identity.handle}`);
  console.log(`  ${chalk.bold('Registry:')} https://tokru.ai/profile/${identity.handle}`);
  console.log(`  ${chalk.bold('Files:')}    capability-profile.json, agent-card.json, TOKRU.md`);
  console.log('');
  console.log(chalk.dim('  Next steps:'));
  console.log(chalk.dim('  • Connect your AI assistant: tokru connect-ai'));
  console.log(chalk.dim('  • Update your profile:       tokru update'));
  console.log('');
}
