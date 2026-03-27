#!/usr/bin/env node

import { run } from '../src/index.js';
import { connectAi } from '../src/commands/connect-ai.js';
import { update } from '../src/commands/update.js';

const command = process.argv[2];

switch (command) {
  case 'connect-ai':
    connectAi().catch((err) => { console.error(err); process.exit(1); });
    break;
  case 'update':
    update().catch((err) => { console.error(err); process.exit(1); });
    break;
  default:
    run().catch((err) => { console.error(err); process.exit(1); });
    break;
}
