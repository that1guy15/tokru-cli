import chalk from 'chalk';

const ASCII_ART = `
 ████████╗ ██████╗  ██╗  ██╗ ██████╗  ██╗   ██╗
 ╚══██╔══╝██╔═══██╗ ██║ ██╔╝ ██╔══██╗ ██║   ██║
    ██║   ██║   ██║ █████╔╝  ██████╔╝ ██║   ██║
    ██║   ██║   ██║ ██╔═██╗  ██╔══██╗ ██║   ██║
    ██║   ╚██████╔╝ ██║  ██╗ ██║  ██║ ╚██████╔╝
    ╚═╝    ╚═════╝  ╚═╝  ╚═╝ ╚═╝  ╚═╝  ╚═════╝
`;

export function showWelcome() {
  console.log(chalk.cyan(ASCII_ART));
  console.log(chalk.bold('  Your capability profile for the AI era.\n'));
  console.log(chalk.dim('  Publish a machine-readable profile discoverable by AI agents.'));
  console.log(chalk.dim('  Takes about 10-15 minutes.\n'));
  console.log(chalk.dim('─'.repeat(60)) + '\n');
}
