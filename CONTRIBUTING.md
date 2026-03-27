# Contributing to create-tokru-profile

Thanks for your interest in contributing. This project is early — your input matters more now than it ever will again.

---

## What We're Looking For

The highest-value contributions right now:

1. **Platform adapters** — deploy Tokru profiles to Vercel, Netlify, Deno Deploy, GitHub Pages, etc.
2. **Bug reports** — especially from the CLI wizard UX (steps that are confusing, prompts that are unclear)
3. **Schema feedback** — missing fields? wrong structure? open an issue.
4. **Translations** — the wizard runs in English only today

---

## Platform Adapters

This is the biggest opportunity. Cloudflare Workers is the reference implementation — but not everyone uses Cloudflare. We need adapters for other platforms.

### Adapter Interface

A platform adapter exports a default object with these methods:

```js
export default {
  // Unique identifier (used as --platform flag value)
  name: 'vercel',

  // Human-readable name shown in wizard
  label: 'Vercel',

  // Validate that the user has the right credentials/config
  // Returns { valid: boolean, errors: string[] }
  validateConfig(config) {},

  // Build deployable artifact from profile data
  // Returns { files: { [filename]: content } }
  build(profile, agentCard) {},

  // Deploy the artifact, return the live URL
  // Returns { url: string, success: boolean, error?: string }
  async deploy(files, config) {},

  // (Optional) Add a custom domain to the deployed site
  // Returns { success: boolean }
  async addCustomDomain(handle, domain, config) {},

  // (Optional) Update an existing deployment with new profile data
  // Returns { success: boolean }
  async update(handle, profile, agentCard, config) {},
}
```

### What the Deployed Site Must Serve

Whatever platform you target, the deployed site must serve these endpoints:

| Path | Content-Type | What |
|---|---|---|
| `/` | `text/html` | Human-readable portfolio page |
| `/.well-known/tokru.json` | `application/json` | Full capability profile |
| `/.well-known/agent-card.json` | `application/json` | A2A agent card |

The Cloudflare adapter (`src/deploy.js` + `src/generators/worker.js`) is the reference — copy its output structure for any new platform.

### Submitting an Adapter

1. Fork the repo
2. Create `src/adapters/your-platform.js`
3. Add it to the platform select in `src/prompts/deploy-platform.js` (or open a PR and we'll wire it in)
4. Add a test profile deployment to your PR description so we can verify it works
5. Open the PR — include which platform, what credentials it needs, and any limitations

---

## Development Setup

```bash
git clone https://github.com/that1guy15/tokru-cli.git
cd tokru-cli
npm install

# Run the wizard locally
node bin/create-tokru-profile.js

# Test a specific command
node bin/tokru.js connect-ai
node bin/tokru.js update
```

No build step — it's plain ESM Node.js.

---

## Bug Reports

Open an issue with:
- Which step in the wizard you were on
- What you expected vs. what happened
- Your Node.js version (`node --version`)
- OS (macOS / Linux / Windows)

For UX feedback (confusing prompts, awkward flow): these are especially welcome. The wizard should feel natural to non-technical users. If something tripped you up, it'll trip others up too.

---

## Schema Feedback

The capability profile schema is at `https://tokru.ai/schemas/capability-profile/v1`.

If you have feedback on the schema — missing fields, wrong types, better structure — open an issue tagged `schema`. We're still in v0.1 and making changes is easy right now.

---

## Code Style

- ESM modules (`.js` with `import`/`export`)
- No TypeScript (intentional — keeps the barrier low for contributors)
- No build step
- `@inquirer/prompts` for all interactive prompts
- `chalk` for all terminal color/formatting
- `ora` for spinners

Keep dependencies minimal. This tool runs via `npx` — every dependency adds install time for every user.

---

## Questions?

Open an issue or find us at [tokru.ai](https://tokru.ai).
