import chalk from 'chalk';

export async function connectAi() {
  console.log('');
  console.log(chalk.cyan.bold('  Connect your Tokru profile to an AI assistant\n'));
  console.log(chalk.dim('─'.repeat(60)) + '\n');

  console.log(chalk.bold('  OpenClaw'));
  console.log('  Drop your TOKRU.md file into your OpenClaw workspace.');
  console.log('  Your AI assistant will discover and manage your profile automatically.\n');

  console.log(chalk.bold('  Claude Code'));
  console.log('  Add TOKRU.md to your project context:');
  console.log(chalk.dim('    cp TOKRU.md /path/to/your/claude-code-project/\n'));

  console.log(chalk.bold('  Any MCP-compatible agent'));
  console.log('  Point the agent at your A2A endpoint:');
  console.log(chalk.dim('    https://your-handle.workers.dev/.well-known/agent-card.json\n'));

  console.log(chalk.dim('─'.repeat(60)));
  console.log(chalk.dim('\n  Your AI assistant can update availability, add portfolio items,'));
  console.log(chalk.dim('  and manage your profile as your work evolves.\n'));
}
